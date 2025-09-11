"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Play, Download, Settings, Loader2, Video, Music } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { VideoPreview } from './VideoPreview';
import { VideoSettings } from './VideoSettings';
import { cn } from '~/lib/utils';

export interface VideoConfig {
  framesPerImage: number;
  transitionFrames: number;
  transitionType: 'smooth_crossfade' | 'gradient_wipe' | 'luminance_fade' | 'enhanced_crossfade' | 'cinematic_dissolve' | 'crossfade' | 'pan_left' | 'pan_right' | 'fade';
  fps: number;
  quality: 'low' | 'medium' | 'high';
  intensity: number;
  useEnhancedEffects: boolean;
}

const DEFAULT_CONFIG: VideoConfig = {
  framesPerImage: 120, // 4 giây mỗi hình (120 frames ÷ 30 fps = 4s)
  transitionFrames: 30, // 1 giây transition (30 frames ÷ 30 fps = 1s)
  transitionType: 'smooth_crossfade',
  fps: 30,
  quality: 'medium',
  intensity: 0.8,
  useEnhancedEffects: true
};

export function VideoGenerator() {
  const [images, setImages] = useState<File[]>([]);
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wasmModule, setWasmModule] = useState<any>(null);

  // Load WASM module
  useEffect(() => {
    let isMounted = true;

    const loadWasm = async () => {
      try {
        const wasmModule = await import('~/wasm/vievlog_rust');
        
        if (isMounted) {
          setWasmModule(wasmModule);
          console.log('WASM module loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load WASM module:', error);
      }
    };

    loadWasm();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const convertFileToUint8Array = useCallback(async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const generateVideo = useCallback(async () => {
    if (!wasmModule || images.length < 2) {
      console.error('WASM module not loaded or insufficient images');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedFrames([]);

    try {
      console.log('🎬 === VIDEO GENERATION DEBUG TRACE ===');
      console.log('📸 Images count:', images.length);
      console.log('⚙️ Config:', config);
      console.log('🚀 WASM module loaded:', !!wasmModule);
      console.log('📋 Available WASM functions:', Object.keys(wasmModule).filter(key => key.startsWith('generate')));
      
      // Convert all images to Uint8Array and create JS Array for WASM
      console.log('🔄 Converting images to Uint8Array...');
      const jsArray = new Array();
      for (let i = 0; i < images.length; i++) {
        setProgress((i / images.length) * 30); // 30% for image processing
        console.log(`📁 Processing image ${i + 1}/${images.length} (${images[i].name}, ${images[i].size} bytes)`);
        const imageData = await convertFileToUint8Array(images[i]);
        console.log(`✅ Converted image ${i + 1} to Uint8Array (${imageData.length} bytes)`);
        jsArray.push(imageData);
      }
      
      setProgress(40); // 40% for starting WASM processing
      console.log('📦 Prepared JS Array with', jsArray.length, 'images for WASM');
      
      // Generate video frames using smooth video generation
      console.log('🎨 Smooth video generation enabled, quality:', config.quality);
      
      const frames = (() => {
        // First try the new smooth video generation
        if (wasmModule.generate_smooth_video_from_images) {
          console.log('✨ === USING SMOOTH VIDEO GENERATION ===');
          console.log('📊 Smooth video parameters:', {
            images: jsArray.length,
            framesPerImage: config.framesPerImage,
            transitionFrames: config.transitionFrames,
            quality: config.quality
          });
          console.log('🔮 Calling wasmModule.generate_smooth_video_from_images...');
          
          const startTime = Date.now();
          const result = wasmModule.generate_smooth_video_from_images(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.quality
          );
          const endTime = Date.now();
          
          console.log('⚡ Smooth generation completed in', endTime - startTime, 'ms');
          console.log('🎞️ Smooth result type:', typeof result);
          console.log('📊 Smooth result length:', result?.length || 0);
          
          return result;
        }
        
        // Fallback to enhanced effects if available
        else if (config.useEnhancedEffects && wasmModule.generate_enhanced_video_frames) {
          console.log('🎭 === FALLBACK TO ENHANCED EFFECTS ===');
          console.log('📊 Enhanced effects parameters:', {
            images: jsArray.length,
            framesPerImage: config.framesPerImage,
            transitionFrames: config.transitionFrames,
            transitionType: config.transitionType,
            intensity: config.intensity
          });
          
          const startTime = Date.now();
          const result = wasmModule.generate_enhanced_video_frames(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.transitionType,
            config.intensity
          );
          const endTime = Date.now();
          
          console.log('⚡ Enhanced generation completed in', endTime - startTime, 'ms');
          return result;
        }
        
        // Final fallback to standard generation
        else {
          console.log('🎭 === FALLBACK TO STANDARD EFFECTS ===');
          console.log('📊 Standard effects parameters:', {
            images: jsArray.length,
            framesPerImage: config.framesPerImage,
            transitionFrames: config.transitionFrames,
            transitionType: config.transitionType
          });
          
          const startTime = Date.now();
          const result = wasmModule.generate_video_from_images(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.transitionType
          );
          const endTime = Date.now();
          
          console.log('⚡ Standard generation completed in', endTime - startTime, 'ms');
          return result;
        }
      })();

      setProgress(90); // 90% for WASM processing complete
      
      console.log('🔄 Converting WASM result to frame array...');
      console.log('🔍 Frames result raw:', {
        type: typeof frames,
        isArray: Array.isArray(frames),
        hasLength: frames?.length !== undefined,
        length: frames?.length || 0
      });
      
      // frames is already a JavaScript Array, no need to convert
      const frameArray = Array.from(frames) as string[];
      console.log('✅ Converted to frameArray:', {
        length: frameArray.length,
        firstFrameType: typeof frameArray[0],
        firstFrameIsDataUrl: frameArray[0]?.startsWith('data:'),
        firstFrameLength: frameArray[0]?.length || 0,
        sampleFrame: frameArray[0]?.substring(0, 50) + '...'
      });
      
      setGeneratedFrames(frameArray);
      setProgress(100);
      
      console.log(`🎉 Generated ${frameArray.length} frames successfully`);
      console.log('📊 Final frame validation:', {
        totalFrames: frameArray.length,
        validDataUrls: frameArray.filter(frame => frame.startsWith('data:')).length,
        invalidFrames: frameArray.filter(frame => !frame.startsWith('data:')).length
      });
      
    } catch (error) {
      console.error('❌ Video generation failed:', error);
      console.error('📍 Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
      console.log('🏁 === VIDEO GENERATION DEBUG TRACE END ===');
    }
  }, [wasmModule, images, config, convertFileToUint8Array]);

  const generatePreview = useCallback(async () => {
    if (!wasmModule || images.length < 2) return;

    try {
      console.log('🎬 === PREVIEW GENERATION DEBUG TRACE ===');
      console.log('🖼️ Preview using first 3 images, enhanced effects:', config.useEnhancedEffects);
      
      const imageDataArray = new Array();
      for (const image of images.slice(0, 3)) { // Only use first 3 images for preview
        const imageData = await convertFileToUint8Array(image);
        console.log(`📁 Preview image converted: ${imageData.length} bytes`);
        imageDataArray.push(imageData);
      }

      // Use smooth video generation for preview
      const frames = (() => {
        // First try smooth video preview
        if (wasmModule.create_smooth_video_preview) {
          console.log('✨ Using create_smooth_video_preview');
          return wasmModule.create_smooth_video_preview(
            imageDataArray,
            5.0 // 5 second preview
          );
        }
        
        // Fallback to smooth video generation with fewer frames
        else if (wasmModule.generate_smooth_video_from_images) {
          console.log('✨ Using generate_smooth_video_from_images for preview');
          return wasmModule.generate_smooth_video_from_images(
            imageDataArray,
            15, // Fewer frames per image for preview
            10, // Fewer transition frames for preview
            "medium" // Medium quality for preview
          );
        }
        
        // Fallback to enhanced effects if available
        else if (config.useEnhancedEffects && wasmModule.generate_enhanced_video_frames) {
          console.log('🎭 Using enhanced effects for preview');
          return wasmModule.generate_enhanced_video_frames(
            imageDataArray,
            15,
            10,
            config.transitionType,
            config.intensity
          );
        }
        
        // Final fallback
        else {
          console.log('🎭 Using standard generation for preview');
          return wasmModule.generate_video_from_images(
            imageDataArray,
            15,
            10,
            config.transitionType
          );
        }
      })();

      // frames is already a JavaScript Array, no need to convert
      const frameArray = Array.from(frames) as string[];
      setGeneratedFrames(frameArray);
      console.log(`🎉 Generated ${frameArray.length} preview frames`);
      console.log('🏁 === PREVIEW GENERATION DEBUG TRACE END ===');
      
    } catch (error) {
      console.error('❌ Preview generation failed:', error);
      console.error('📍 Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    }
  }, [wasmModule, images, config.transitionType, convertFileToUint8Array]);

  const canGenerate = images.length >= 2 && !isGenerating && wasmModule;
  const videoDuration = images.length > 0 
    ? ((config.framesPerImage * images.length) + (config.transitionFrames * (images.length - 1))) / config.fps
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Video Generator</h1>
        <p className="text-muted-foreground">
          Upload 2-10 images to create a beautiful video with smooth transitions
        </p>
      </div>

      {/* Status */}
      {!wasmModule && (
        <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Loading video processing engine...</span>
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Upload Images</h2>
        <ImageUpload
          onImagesChange={setImages}
          maxImages={10}
          className="w-full"
        />
      </div>

      {/* Video Settings */}
      {images.length >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">2. Configure Video</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </Button>
          </div>

          {showSettings && (
            <VideoSettings
              config={config}
              onConfigChange={setConfig}
              videoDuration={videoDuration}
            />
          )}

          {/* Quick Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-4 text-sm">
              <span>
                <strong>Images:</strong> {images.length}
              </span>
              <span>
                <strong>Duration:</strong> ~{videoDuration.toFixed(1)}s
              </span>
              <span>
                <strong>Transition:</strong> {config.transitionType.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Generation Controls */}
      {images.length >= 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">3. Generate Video</h2>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={generatePreview}
                disabled={!canGenerate}
                variant="outline"
              >
                <Play className="w-4 h-4 mr-2" />
                Quick Preview
              </Button>
              
              <Button
                onClick={generateVideo}
                disabled={!canGenerate}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    Generate Video + MP3
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center text-emerald-700 dark:text-emerald-300 text-sm">
                <Music className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  <strong>Tự động ghép nhạc nền:</strong> Video sẽ được tạo dưới định dạng MP4 kèm với file music.mp3 và tự động tải xuống khi hoàn thành.
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Video Preview */}
      {generatedFrames.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">4. Preview & Download</h2>
          <VideoPreview
            frames={generatedFrames}
            fps={config.fps}
            quality={config.quality}
            autoCreateVideoWithAudio={true}
            onDownload={() => {
              console.log('Download requested');
            }}
          />
        </div>
      )}

      {/* Smooth Video Generation Status */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
        <h3 className="font-semibold text-sm mb-2 text-emerald-800 dark:text-emerald-300">🎬 Smooth Video Generation Active - Professional Quality:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-emerald-700 dark:text-emerald-300">
          <div>
            <strong>🚀 3D Flying Effects:</strong>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• Fly up 3D với perspective transform</li>
              <li>• Bounce fly 3D với physics motion</li>
              <li>• Spiral fly 3D với xoắn ốc bay lên</li>
              <li>• Perspective zoom 3D dramatic</li>
            </ul>
          </div>
          <div>
            <strong>🌪️ 3D Rotation Effects:</strong>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• Rotate circle 3D với orbit motion</li>
              <li>• Flip rotate 3D multi-axis</li>
              <li>• Orbit 3D quanh tâm perspective</li>
              <li>• Wave rotate 3D với sine motion</li>
            </ul>
          </div>
          <div>
            <strong>✨ Professional Quality:</strong>
            <ul className="ml-4 space-y-1 text-xs">
              <li>• 3D perspective transformations</li>
              <li>• Bilinear interpolation smooth</li>
              <li>• Professional easing curves</li>
              <li>• Automatic color grading</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded px-3 py-2">
          🎯 <strong>3D DYNAMIC FRAMES: Mỗi hình ảnh sẽ bay lên và quay vòng tròn với hiệu ứng 3D chuyên nghiệp!</strong>
        </div>
      </div>

      {/* Enhanced Effects Status - Optional fallback */}
      {config.useEnhancedEffects && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-sm mb-2 text-purple-800 dark:text-purple-300">🎭 Enhanced Effects Fallback Available:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-emerald-700 dark:text-emerald-300">
            <div>
              <strong>🎯 Cinematic Zoom:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Dramatic zoom in/out với smooth curves</li>
                <li>• Epic spiral zoom với rotation</li>
                <li>• Pulse zoom với heartbeat rhythm</li>
                <li>• Wave zoom với sine wave motion</li>
              </ul>
            </div>
            <div>
              <strong>📹 Advanced Pan:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Epic pan left/right với dramatic movement</li>
                <li>• Diagonal pan northeast/southwest</li>
                <li>• Circular pan với orbital motion</li>
                <li>• Figure-8 pan với complex curves</li>
              </ul>
            </div>
            <div>
              <strong>🎨 Artistic Effects:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Parallax zoom với depth simulation</li>
                <li>• Bokeh blur với depth of field</li>
                <li>• Tilt-shift với selective focus</li>
                <li>• Chromatic aberration realistic</li>
              </ul>
            </div>
            <div>
              <strong>📺 Vintage & Retro:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• VHS scan lines với color bleeding</li>
                <li>• Film grain vintage với authentic noise</li>
                <li>• Sepia dream với golden glow</li>
                <li>• Light leak golden với lens flare</li>
              </ul>
            </div>
            <div>
              <strong>🚀 Flying & Animation Effects:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Float up & disappear với smooth fade</li>
                <li>• Bounce fly away với physics motion</li>
                <li>• Rotate scale vanish với spin effects</li>
                <li>• Magic sparkle fly với brightness burst</li>
                <li>• Swoosh up fade với motion blur</li>
                <li>• Spinning tornado với lift motion</li>
                <li>• Random particle burst explosion</li>
                <li>• Elastic bounce với damped waves</li>
                <li>• Floating bubbles với drift motion</li>
              </ul>
            </div>
            <div>
              <strong>🦋 Nature & Creatures:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Butterflies flying với figure-8 patterns</li>
                <li>• Birds flock trong V-formation</li>
                <li>• Fireflies dancing với glow effects</li>
                <li>• Falling petals với wind drift</li>
                <li>• Swimming fish trong schools</li>
                <li>• Dancing dragonflies với quick darts</li>
                <li>• Cherry blossoms trong wind</li>
                <li>• Autumn leaves spiral motion</li>
                <li>• Snow falling gentle với rotation</li>
                <li>• Floating dandelion seeds</li>
                <li>• Swaying grass trong breeze</li>
                <li>• Floating leaves với spiral motion</li>
              </ul>
            </div>
            <div>
              <strong>✨ Smart Features:</strong>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Auto-randomization across 6 categories</li>
                <li>• Intensity control (10%-150%)</li>
                <li>• Professional easing curves</li>
                <li>• Physics-based animations</li>
                <li>• Alpha blending & transparency</li>
                <li>• Motion blur & particle systems</li>
                <li>• Creature AI movement patterns</li>
                <li>• Realistic nature simulations</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded px-3 py-2">
            🌈 <strong>OVERLAY ANIMATION SYSTEM: Mỗi hình ảnh có 2 tầng hiệu ứng - Main effect từ 6 categories + Overlay animation từ 20 kiểu khác nhau với màu sắc rực rỡ!</strong>
          </div>
          
          <div className="mt-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
            <h4 className="font-semibold text-xs mb-1 text-pink-800 dark:text-pink-300">🎨 20 Overlay Animations với HSV Color System:</h4>
            <div className="grid grid-cols-4 gap-1 text-xs text-pink-700 dark:text-pink-300">
              <div>🌈 Rainbow Butterflies</div>
              <div>🔶 Golden Birds</div>
              <div>✨ Magical Fireflies</div>
              <div>🌸 Sakura Petals</div>
              <div>🍂 Autumn Leaves Gold</div>
              <div>❄️ Crystal Snowflakes</div>
              <div>🐠 Tropical Fish</div>
              <div>🦋 Emerald Dragonflies</div>
              <div>⭐ Dancing Stars</div>
              <div>💖 Floating Hearts</div>
              <div>🔮 Glowing Orbs</div>
              <div>✨ Mystic Sparkles</div>
              <div>🧚 Fairy Dust</div>
              <div>🌌 Cosmic Particles</div>
              <div>🌺 Flower Shower</div>
              <div>🫧 Bubble Stream</div>
              <div>⚡ Lightning Bugs</div>
              <div>🔥 Phoenix Feathers</div>
              <div>💫 Dream Wisps</div>
              <div>🌈 Rainbow Trails</div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-sm mb-2 text-purple-800 dark:text-purple-300">📖 Usage Tips:</h3>
        <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-300">
          <li>• Upload 3-8 images for best results</li>
          <li>• Use high-quality images (1080p+ recommended)</li>
          <li>• Enable Enhanced Effects for professional quality</li>
          <li>• Adjust intensity to control effect strength</li>
          <li>• Try different transition types for various styles</li>
        </ul>
      </div>
    </div>
  );
}
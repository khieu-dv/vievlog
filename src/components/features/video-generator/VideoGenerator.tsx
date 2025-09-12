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
  transitionType: 'crossfade' | 'slide_left' | 'slide_right' | 'slide_up' | 'slide_down' | 'zoom_in' | 'zoom_out' | 'dissolve' | 'wipe' | 'iris' | 'enhanced_crossfade' | 'cinematic_dissolve' | 'pan_left' | 'pan_right' | 'fade';
  fps: number;
  quality: 'low' | 'medium' | 'high';
  intensity: number;
  useEnhancedEffects: boolean;
  smartEnhancement: {
    enabled: boolean;
    autoExposure: boolean;
    autoContrast: boolean;
    autoSaturation: boolean;
    noiseReduction: boolean;
    sharpening: 'none' | 'subtle' | 'medium' | 'strong';
    whiteBalance: 'auto' | 'manual';
    exposure: number;
    contrast: number;
    vibrance: number;
    saturation: number;
    temperature: number;
    tint: number;
    shadows: { hue: number; saturation: number; lightness: number };
    midtones: { hue: number; saturation: number; lightness: number };
    highlights: { hue: number; saturation: number; lightness: number };
    filmGrain: number;
    vignette: number;
    preset: 'auto' | 'cinematic' | 'vintage' | 'modern' | 'warm' | 'cool' | 'custom';
  };
}

const DEFAULT_CONFIG: VideoConfig = {
  framesPerImage: 120, // 4 giây mỗi hình (120 frames ÷ 30 fps = 4s)
  transitionFrames: 30, // 1 giây transition (30 frames ÷ 30 fps = 1s)
  transitionType: 'crossfade',
  fps: 30,
  quality: 'medium',
  intensity: 0.8,
  useEnhancedEffects: true,
  smartEnhancement: {
    enabled: true,
    autoExposure: true,
    autoContrast: true,
    autoSaturation: true,
    noiseReduction: false,
    sharpening: 'subtle',
    whiteBalance: 'auto',
    exposure: 0,
    contrast: 0,
    vibrance: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    shadows: { hue: 220, saturation: 15, lightness: 25 },
    midtones: { hue: 30, saturation: 20, lightness: 50 },
    highlights: { hue: 45, saturation: 10, lightness: 75 },
    filmGrain: 0,
    vignette: 0,
    preset: 'auto'
  }
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
        
        // Bundler target auto-initializes
        if (isMounted) {
          setWasmModule(wasmModule);
          console.log('WASM module loaded and initialized successfully');
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
    if (!wasmModule || images.length < 2) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedFrames([]);

    try {
      // Convert images to proper format for Bevy slideshow generation
      const imagesData = new Array();
      for (let i = 0; i < images.length; i++) {
        setProgress((i / images.length) * 20);
        let imageData = await convertFileToUint8Array(images[i]);
        
        // Apply smart enhancement using Bevy presets if enabled
        if (config.smartEnhancement.enabled && wasmModule.bevy_apply_cinematic_preset) {
          console.log(`🎯 Applying Bevy enhancement to image ${i + 1}...`);
          
          // Choose appropriate preset based on enhancement settings
          let presetName = 'cinematic_dark';
          if (config.smartEnhancement.preset !== 'auto') {
            switch (config.smartEnhancement.preset) {
              case 'cinematic': presetName = 'cinematic_dark'; break;
              case 'vintage': presetName = 'vintage_film'; break;
              case 'modern': presetName = 'cyberpunk'; break;
              case 'warm': presetName = 'golden_hour'; break;
              case 'cool': presetName = 'arctic_cold'; break;
              default: presetName = 'cinematic_dark';
            }
          }
          
          imageData = wasmModule.bevy_apply_cinematic_preset(
            imageData,
            presetName,
            config.intensity
          );
        }
        
        // Create image object with metadata for Bevy slideshow
        imagesData.push({
          data: imageData,
          width: 1920, // Default width - Bevy will handle resizing
          height: 1080 // Default height - Bevy will handle resizing
        });
      }
      
      setProgress(40);
      
      // Use new Bevy slideshow generation function
      console.log('🎬 Generating video with Bevy slideshow...');
      const frames = wasmModule.bevy_generate_slideshow(
        imagesData,
        config.framesPerImage,
        config.transitionFrames,
        config.transitionType
      );

      setProgress(90);
      const frameArray = Array.from(frames) as string[];
      setGeneratedFrames(frameArray);
      setProgress(100);
      
      console.log(`✅ Generated ${frameArray.length} frames successfully`);
      
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, [wasmModule, images, config, convertFileToUint8Array]);

  const generatePreview = useCallback(async () => {
    if (!wasmModule || images.length < 2) return;

    try {
      // Use first 3 images for quick preview
      const imagesData = new Array();
      for (const image of images.slice(0, 3)) {
        let imageData = await convertFileToUint8Array(image);
        
        // Apply Bevy preset if enhancement is enabled
        if (config.smartEnhancement.enabled && wasmModule.bevy_apply_cinematic_preset) {
          let presetName = 'cinematic_dark';
          if (config.smartEnhancement.preset !== 'auto') {
            switch (config.smartEnhancement.preset) {
              case 'cinematic': presetName = 'cinematic_dark'; break;
              case 'vintage': presetName = 'vintage_film'; break;
              case 'modern': presetName = 'cyberpunk'; break;
              case 'warm': presetName = 'golden_hour'; break;
              case 'cool': presetName = 'arctic_cold'; break;
              default: presetName = 'cinematic_dark';
            }
          }
          
          imageData = wasmModule.bevy_apply_cinematic_preset(
            imageData,
            presetName,
            config.intensity * 0.8 // Slightly less intense for preview
          );
        }
        
        imagesData.push({
          data: imageData,
          width: 1280, // Smaller size for preview
          height: 720
        });
      }

      // Generate quick preview with shorter frames
      console.log('🎬 Generating Bevy preview...');
      const frames = wasmModule.bevy_generate_slideshow(
        imagesData,
        15, // Shorter duration for preview
        10, // Shorter transition
        config.transitionType
      );

      const frameArray = Array.from(frames) as string[];
      setGeneratedFrames(frameArray);
      console.log(`✅ Generated ${frameArray.length} preview frames`);
      
    } catch (error) {
      console.error('Preview generation failed:', error);
    }
  }, [wasmModule, images, config.smartEnhancement, config.transitionType, config.intensity, convertFileToUint8Array]);

  const canGenerate = images.length >= 2 && !isGenerating && wasmModule;
  const videoDuration = images.length > 0 
    ? ((config.framesPerImage * images.length) + (config.transitionFrames * (images.length - 1))) / config.fps
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Video Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload 2-30 images to create a video with smooth transitions
        </p>
      </div>

      {!wasmModule && (
        <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Upload Images
        </h2>
        <ImageUpload
          onImagesChange={setImages}
          maxImages={30}
          className="w-full"
        />
      </div>

      {/* Main Editor Area */}
      {images.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Preview
                </h2>
                {isGenerating && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Generating... {Math.round(progress)}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-96">
                {generatedFrames.length > 0 ? (
                  <VideoPreview
                    frames={generatedFrames}
                    fps={config.fps}
                    quality={config.quality}
                    autoCreateVideoWithAudio={false}
                    onDownload={() => {
                      console.log('Download requested');
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Video className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Generated video will appear here
                    </p>
                  </div>
                )}
              </div>
              
              {/* Video Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Images</div>
                  <div className="text-gray-600 dark:text-gray-400">{images.length}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Duration</div>
                  <div className="text-gray-600 dark:text-gray-400">~{videoDuration.toFixed(1)}s</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Transition</div>
                  <div className="text-gray-600 dark:text-gray-400">{config.transitionType.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Video Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showSettings ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showSettings && (
                <VideoSettings
                  config={config}
                  onConfigChange={setConfig}
                  videoDuration={videoDuration}
                />
              )}
            </div>

            {/* Generation Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Generate
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={generatePreview}
                  disabled={!canGenerate}
                  variant="outline"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Quick Preview
                </Button>
                
                <Button
                  onClick={generateVideo}
                  disabled={!canGenerate}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {Math.round(progress)}%
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
                
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
                  <div className="flex items-center text-emerald-700 dark:text-emerald-300 text-sm">
                    <Music className="w-4 h-4 mr-2" />
                    <span>With background music</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            {isGenerating && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Progress
                </h3>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
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
    if (!wasmModule || images.length < 2) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedFrames([]);

    try {
      const jsArray = new Array();
      for (let i = 0; i < images.length; i++) {
        setProgress((i / images.length) * 30);
        const imageData = await convertFileToUint8Array(images[i]);
        jsArray.push(imageData);
      }
      
      setProgress(40);
      
      const frames = (() => {
        if (wasmModule.generate_smooth_video_from_images) {
          return wasmModule.generate_smooth_video_from_images(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.quality
          );
        }
        
        else if (config.useEnhancedEffects && wasmModule.generate_enhanced_video_frames) {
          return wasmModule.generate_enhanced_video_frames(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.transitionType,
            config.intensity
          );
        }
        
        else {
          return wasmModule.generate_video_from_images(
            jsArray,
            config.framesPerImage,
            config.transitionFrames,
            config.transitionType
          );
        }
      })();

      setProgress(90);
      const frameArray = Array.from(frames) as string[];
      setGeneratedFrames(frameArray);
      setProgress(100);
      
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
      const imageDataArray = new Array();
      for (const image of images.slice(0, 3)) {
        const imageData = await convertFileToUint8Array(image);
        imageDataArray.push(imageData);
      }

      const frames = (() => {
        if (wasmModule.create_smooth_video_preview) {
          return wasmModule.create_smooth_video_preview(imageDataArray, 5.0);
        }
        
        else if (wasmModule.generate_smooth_video_from_images) {
          return wasmModule.generate_smooth_video_from_images(imageDataArray, 15, 10, "medium");
        }
        
        else if (config.useEnhancedEffects && wasmModule.generate_enhanced_video_frames) {
          return wasmModule.generate_enhanced_video_frames(imageDataArray, 15, 10, config.transitionType, config.intensity);
        }
        
        else {
          return wasmModule.generate_video_from_images(imageDataArray, 15, 10, config.transitionType);
        }
      })();

      const frameArray = Array.from(frames) as string[];
      setGeneratedFrames(frameArray);
      
    } catch (error) {
      console.error('Preview generation failed:', error);
    }
  }, [wasmModule, images, config.transitionType, convertFileToUint8Array]);

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
                    autoCreateVideoWithAudio={true}
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
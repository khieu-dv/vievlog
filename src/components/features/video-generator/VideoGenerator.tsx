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
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Video Generator</h1>
        <p className="text-muted-foreground">
          Upload 2-10 images to create a beautiful video with smooth transitions
        </p>
      </div>

      {!wasmModule && (
        <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Loading...</span>
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
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3">
              <div className="flex items-center text-emerald-700 dark:text-emerald-300 text-sm">
                <Music className="w-4 h-4 mr-2" />
                <span>Video với nhạc nền sẽ tự động tải xuống</span>
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

    </div>
  );
}
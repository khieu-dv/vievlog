"use client";

import React from 'react';
import { Sliders, Clock, Zap, Image as ImageIcon } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { VideoConfig } from './VideoGenerator';
import { cn } from '~/lib/utils';

interface VideoSettingsProps {
  config: VideoConfig;
  onConfigChange: (config: VideoConfig) => void;
  videoDuration: number;
  className?: string;
}

const TRANSITION_TYPES = [
  { value: 'crossfade', label: 'Crossfade', description: 'Smooth blend between images' },
  { value: 'pan_left', label: 'Pan Left', description: 'Pan and zoom effect moving left' },
  { value: 'pan_right', label: 'Pan Right', description: 'Pan and zoom effect moving right' },
  { value: 'fade', label: 'Fade', description: 'Fade out and fade in effect' },
] as const;

const QUALITY_PRESETS = [
  { value: 'low', label: 'Low', fps: 24, description: 'Faster processing, smaller file' },
  { value: 'medium', label: 'Medium', fps: 30, description: 'Balanced quality and speed' },
  { value: 'high', label: 'High', fps: 60, description: 'Best quality, slower processing' },
] as const;

export function VideoSettings({ config, onConfigChange, videoDuration, className }: VideoSettingsProps) {
  const updateConfig = (updates: Partial<VideoConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className={cn("space-y-6 p-6 bg-muted/30 rounded-lg border", className)}>
      <div className="flex items-center space-x-2">
        <Sliders className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Video Settings</h3>
      </div>

      {/* Quality Preset */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <label className="text-sm font-medium">Quality Preset</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUALITY_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant={config.quality === preset.value ? "default" : "outline"}
              size="sm"
              className="h-auto p-3 text-left"
              onClick={() => updateConfig({ 
                quality: preset.value, 
                fps: preset.fps 
              })}
            >
              <div>
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs opacity-70">{preset.fps} FPS</div>
                <div className="text-xs opacity-70">{preset.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Transition Type */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4" />
          <label className="text-sm font-medium">Transition Effect</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRANSITION_TYPES.map((transition) => (
            <Button
              key={transition.value}
              variant={config.transitionType === transition.value ? "default" : "outline"}
              size="sm"
              className="h-auto p-3 text-left"
              onClick={() => updateConfig({ transitionType: transition.value })}
            >
              <div>
                <div className="font-medium">{transition.label}</div>
                <div className="text-xs opacity-70">{transition.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Timing Settings</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Frames per Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Image Duration: {(config.framesPerImage / config.fps).toFixed(1)}s
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="90"  
                max="210" 
                step="30" 
                value={config.framesPerImage}
                onChange={(e) => updateConfig({ framesPerImage: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3.0s</span>
                <span>{config.framesPerImage} frames</span>
                <span>7.0s</span>
              </div>
            </div>
          </div>

          {/* Transition Frames */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Transition Duration: {(config.transitionFrames / config.fps).toFixed(1)}s
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={config.transitionFrames}
                onChange={(e) => updateConfig({ transitionFrames: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5s</span>
                <span>{config.transitionFrames} frames</span>
                <span>3.0s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom FPS */}
        {config.quality === 'medium' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Frame Rate: {config.fps} FPS
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="24"
                max="60"
                step="6"
                value={config.fps}
                onChange={(e) => updateConfig({ fps: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>24 FPS</span>
                <span>30 FPS</span>
                <span>60 FPS</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-background/80 rounded-md p-3 space-y-2 border">
        <div className="text-sm font-medium">Estimated Output:</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 font-mono">{videoDuration.toFixed(1)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 font-mono">{config.fps} FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Frames:</span>
            <span className="ml-2 font-mono">
              ~{Math.ceil(videoDuration * config.fps)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Quality:</span>
            <span className="ml-2 capitalize">{config.quality}</span>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Quick Presets:</div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({
              framesPerImage: 120, // 4 giây
              transitionFrames: 30, // 1 giây
              transitionType: 'crossfade',
              quality: 'medium',
              fps: 30
            })}
          >
            Cinematic (4s per image)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({
              framesPerImage: 90, // 3 giây
              transitionFrames: 30, // 1 giây
              transitionType: 'pan_right',
              quality: 'high',
              fps: 30
            })}
          >
            Fast Paced (3s per image)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({
              framesPerImage: 150, // 5 giây
              transitionFrames: 45, // 1.5 giây
              transitionType: 'fade',
              quality: 'medium',
              fps: 30
            })}
          >
            Slow & Smooth (5s per image)
          </Button>
        </div>
      </div>
    </div>
  );
}
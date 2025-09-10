"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Maximize2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface VideoPreviewProps {
  frames: string[];
  fps: number;
  onDownload?: () => void;
  className?: string;
}

export function VideoPreview({ frames, fps, onDownload, className }: VideoPreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const frameInterval = 1000 / fps;

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, frameInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frames.length, frameInterval]);

  const handlePlay = () => {
    if (currentFrame >= frames.length - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen failed:', error);
    }
  };

  const downloadFramesAsGif = () => {
    // This would require additional GIF encoding library
    console.log('GIF download would be implemented here');
    if (onDownload) {
      onDownload();
    }
  };

  const downloadFramesAsZip = () => {
    // Create a zip file with all frames
    const link = document.createElement('a');
    frames.forEach((frame, index) => {
      const frameLink = document.createElement('a');
      frameLink.href = frame;
      frameLink.download = `frame_${String(index + 1).padStart(4, '0')}.png`;
      frameLink.click();
    });
  };

  const progress = frames.length > 0 ? (currentFrame / (frames.length - 1)) * 100 : 0;

  if (frames.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <img
            src={frames[currentFrame]}
            alt={`Frame ${currentFrame + 1}`}
            className="max-w-full max-h-full object-contain"
            style={{ 
              imageRendering: 'auto',
              filter: 'contrast(1.1) saturate(1.1)'
            }}
          />
        </div>

        {/* Fullscreen Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          onClick={handleFullscreen}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        {/* Frame Counter */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
          {currentFrame + 1} / {frames.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-muted rounded-full h-2 cursor-pointer overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max={frames.length - 1}
          value={currentFrame}
          onChange={(e) => {
            setCurrentFrame(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={handlePlay} size="sm">
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div className="text-sm text-muted-foreground ml-2">
            {Math.round((frames.length / fps) * 100) / 100}s • {fps} FPS
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={downloadFramesAsZip} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Frames
          </Button>
          
          {/* Future: GIF download */}
          <Button 
            onClick={downloadFramesAsGif} 
            variant="outline" 
            size="sm"
            disabled
            title="Coming soon"
          >
            <Download className="w-4 h-4 mr-1" />
            GIF
          </Button>
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold">Generated Video Preview</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-muted-foreground">Frames:</span>
            <span className="ml-2 font-mono">{frames.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 font-mono">{(frames.length / fps).toFixed(2)}s</span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 font-mono">{fps} FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Size:</span>
            <span className="ml-2 font-mono">Auto</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>Keyboard shortcuts:</div>
        <div className="flex flex-wrap gap-4">
          <span><kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> Play/Pause</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded">R</kbd> Reset</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded">F</kbd> Fullscreen</span>
          <span><kbd className="px-1 py-0.5 bg-muted rounded">←/→</kbd> Frame by frame</span>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Maximize2, Music, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

// Helper function to convert RGBA data URL to Canvas data URL
const convertRgbaToCanvasUrl = (rgbaUrl: string): string => {
  if (!rgbaUrl.startsWith('rgba:')) return rgbaUrl; // Already a valid data URL
  
  try {
    // Parse format: "rgba:WxH:base64data"
    const parts = rgbaUrl.split(':');
    if (parts.length !== 3) return rgbaUrl;
    
    const [, dimensions, base64Data] = parts;
    const [widthStr, heightStr] = dimensions.split('x');
    const width = parseInt(widthStr);
    const height = parseInt(heightStr);
    
    if (!width || !height) return rgbaUrl;
    
    // Decode base64 RGBA data
    const binaryString = atob(base64Data);
    const rgba = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      rgba[i] = binaryString.charCodeAt(i);
    }
    
    // Create canvas and put ImageData
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rgbaUrl;
    
    const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height);
    ctx.putImageData(imageData, 0, 0);
    
    // Return canvas data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to convert RGBA URL:', error);
    return rgbaUrl;
  }
};
import { 
  createVideoWithAudio, 
  createVideoFromFrames, 
  downloadBlob, 
  getAvailableAudioFiles,
  formatFileSize,
  estimateVideoSize,
  type VideoCreationProgress 
} from '~/utils/videoUtils';

interface VideoPreviewProps {
  frames: string[];
  fps: number;
  onDownload?: () => void;
  className?: string;
  quality?: 'low' | 'medium' | 'high';
  autoCreateVideoWithAudio?: boolean;
}

export function VideoPreview({ frames, fps, onDownload, className, quality = 'medium', autoCreateVideoWithAudio = true }: VideoPreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<VideoCreationProgress | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string>('/mp3/music.mp3');
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);
  const [hasAutoCreated, setHasAutoCreated] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const frameInterval = 1000 / fps;

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            // Stop audio when animation ends
            if (audioRef.current) {
              audioRef.current.pause();
            }
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
      // Pause audio when not playing
      if (audioRef.current && !isPlaying) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frames.length, frameInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (frames.length === 0) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlay();
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentFrame(prev => Math.max(0, prev - 1));
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentFrame(prev => Math.min(frames.length - 1, prev + 1));
          setIsPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [frames.length]);

  // Auto create video with audio when frames are ready
  useEffect(() => {
    if (autoCreateVideoWithAudio && frames.length > 0 && !isCreatingVideo && !hasAutoCreated) {
      // Auto generate video with audio after a short delay
      const timer = setTimeout(async () => {
        try {
          setIsCreatingVideo(true);
          setVideoProgress(null);
          setHasAutoCreated(true);
          
          const blob = await createVideoWithAudio({
            frames,
            audioUrl,
            fps,
            quality,
            format: 'mp4'
          }, setVideoProgress);
          
          const filename = `video-with-music-${Date.now()}.mp4`;
          downloadBlob(blob, filename);
          
          if (onDownload) {
            onDownload();
          }
        } catch (error) {
          console.error('Failed to auto-create video with audio:', error);
        } finally {
          setIsCreatingVideo(false);
          setVideoProgress(null);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [frames.length, autoCreateVideoWithAudio, isCreatingVideo, hasAutoCreated, audioUrl, fps, quality, onDownload]);

  // Reset hasAutoCreated when frames change
  useEffect(() => {
    setHasAutoCreated(false);
  }, [frames]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = () => {
    if (currentFrame >= frames.length - 1) {
      setCurrentFrame(0);
    }
    
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // Play or pause audio along with video frames
    if (audioRef.current) {
      if (newPlayingState) {
        // Calculate audio start time based on current frame
        const audioStartTime = (currentFrame / fps);
        if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
          audioRef.current.currentTime = audioStartTime % audioRef.current.duration;
        }
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    } else if (newPlayingState) {
      // Create and play audio if it doesn't exist
      audioRef.current = new Audio(audioUrl);
      
      // Wait for audio metadata to load before setting currentTime
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          const audioStartTime = (currentFrame / fps);
          if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
            audioRef.current.currentTime = audioStartTime % audioRef.current.duration;
          }
        }
      }, { once: true });
      
      audioRef.current.play().catch(console.error);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    
    // Reset audio as well
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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

  const handleAudioPreview = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    }
    
    if (isPreviewingAudio) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPreviewingAudio(false);
    } else {
      audioRef.current.play();
      setIsPreviewingAudio(true);
      
      // Auto stop after 10 seconds preview
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setIsPreviewingAudio(false);
      }, 10000);
    }
  };

  const downloadVideoWithAudio = async () => {
    if (frames.length === 0) return;
    
    setIsCreatingVideo(true);
    setVideoProgress(null);
    
    try {
      const blob = await createVideoWithAudio({
        frames,
        audioUrl,
        fps,
        quality,
        format: 'mp4'
      }, setVideoProgress);
      
      const filename = `video-with-music-${Date.now()}.mp4`;
      downloadBlob(blob, filename);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Failed to create video with audio:', error);
      alert('Không thể tạo video với âm thanh. Vui lòng thử lại.');
    } finally {
      setIsCreatingVideo(false);
      setVideoProgress(null);
    }
  };

  const downloadVideoOnly = async () => {
    if (frames.length === 0) return;
    
    setIsCreatingVideo(true);
    setVideoProgress(null);
    
    try {
      const blob = await createVideoFromFrames(frames, fps, quality, 'mp4', setVideoProgress);
      const filename = `video-${Date.now()}.mp4`;
      downloadBlob(blob, filename);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Failed to create video:', error);
      alert('Không thể tạo video. Vui lòng thử lại.');
    } finally {
      setIsCreatingVideo(false);
      setVideoProgress(null);
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
            src={convertRgbaToCanvasUrl(frames[currentFrame])}
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
            // Pause audio when scrubbing
            if (audioRef.current) {
              audioRef.current.pause();
            }
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
          {!autoCreateVideoWithAudio && (
            <Button 
              onClick={downloadVideoWithAudio}
              variant="default" 
              size="sm"
              disabled={isCreatingVideo}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isCreatingVideo ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              Tải Video
            </Button>
          )}
          
          {autoCreateVideoWithAudio && hasAutoCreated && (
            <Button 
              onClick={downloadVideoWithAudio}
              variant="default" 
              size="sm"
              disabled={isCreatingVideo}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Tải lại Video + MP3
            </Button>
          )}
        </div>
      </div>

      {/* Auto Video Creation Status */}
      {autoCreateVideoWithAudio && !hasAutoCreated && !isCreatingVideo && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center text-blue-700 dark:text-blue-300">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="font-medium">Đang tự động tạo video với nhạc nền...</span>
          </div>
          <div className="text-center text-sm text-blue-600 dark:text-blue-400 mt-2">
            Video sẽ được tải xuống tự động sau khi hoàn thành
          </div>
        </div>
      )}

      {/* Audio Preview Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center">
            <Music className="w-4 h-4 mr-2" />
            Background Music
          </h3>
          <Button
            onClick={handleAudioPreview}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300"
          >
            {isPreviewingAudio ? (
              <>
                <VolumeX className="w-4 h-4 mr-1" />
                Stop Preview
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-1" />
                Preview Audio
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-purple-600 dark:text-purple-400">Audio File:</span>
            <span className="ml-2 font-mono">music.mp3</span>
          </div>
          <div>
            <span className="text-purple-600 dark:text-purple-400">Video Format:</span>
            <span className="ml-2 font-mono">
              {MediaRecorder.isTypeSupported('video/mp4') || 
               MediaRecorder.isTypeSupported('video/mp4;codecs=h264') ||
               MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
               MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac') ? 'MP4' : 'WebM (fallback)'}
            </span>
          </div>
          <div>
            <span className="text-purple-600 dark:text-purple-400">Estimated Size:</span>
            <span className="ml-2 font-mono">
              {formatFileSize(estimateVideoSize(frames.length, fps, quality, true))}
            </span>
          </div>
        </div>
        
        {isPreviewingAudio && (
          <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded px-3 py-2">
            🎵 Playing 10-second preview of background music...
          </div>
        )}
        
        {!(MediaRecorder.isTypeSupported('video/mp4') || 
           MediaRecorder.isTypeSupported('video/mp4;codecs=h264') ||
           MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
           MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac')) && (
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded px-3 py-2">
            ⚠️ Browser không hỗ trợ MP4. Video sẽ được tạo dưới định dạng WebM.
          </div>
        )}
      </div>

      {/* Video Creation Progress */}
      {isCreatingVideo && videoProgress && (
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Video...
            </h3>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {Math.round(videoProgress.progress)}%
            </span>
          </div>
          
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${videoProgress.progress}%` }}
            />
          </div>
          
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <div className="font-medium">{videoProgress.stage.charAt(0).toUpperCase() + videoProgress.stage.slice(1)}</div>
            {videoProgress.message && (
              <div className="text-xs mt-1">{videoProgress.message}</div>
            )}
            {videoProgress.currentFrame && videoProgress.totalFrames && (
              <div className="text-xs mt-1">
                Frame {videoProgress.currentFrame} of {videoProgress.totalFrames}
              </div>
            )}
          </div>
        </div>
      )}

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
/**
 * Video utility functions for combining frames with audio
 */

export interface VideoCreationOptions {
  frames: string[];
  audioUrl: string;
  fps: number;
  quality: 'low' | 'medium' | 'high';
  format: 'webm' | 'mp4';
}

export interface VideoCreationProgress {
  stage: 'preparing' | 'encoding' | 'combining' | 'finalizing' | 'completed';
  progress: number;
  currentFrame?: number;
  totalFrames?: number;
  message?: string;
}

/**
 * Create a video from frames and audio using MediaRecorder API
 */
export async function createVideoWithAudio(
  options: VideoCreationOptions,
  onProgress?: (progress: VideoCreationProgress) => void
): Promise<Blob> {
  const { frames, audioUrl, fps, quality, format } = options;
  
  onProgress?.({
    stage: 'preparing',
    progress: 0,
    message: 'Preparing canvas and audio...'
  });

  // Create canvas for rendering frames
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Get dimensions from first frame
  const firstFrameImg = new Image();
  await new Promise((resolve, reject) => {
    firstFrameImg.onload = resolve;
    firstFrameImg.onerror = reject;
    firstFrameImg.src = frames[0];
  });
  
  canvas.width = firstFrameImg.width;
  canvas.height = firstFrameImg.height;
  
  // Load audio
  const audio = new Audio(audioUrl);
  await new Promise((resolve, reject) => {
    audio.oncanplaythrough = resolve;
    audio.onerror = reject;
    audio.load();
  });

  // Create MediaRecorder
  const stream = canvas.captureStream(fps);
  
  // Create audio context and connect audio
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaElementSource(audio);
  const audioDestination = audioContext.createMediaStreamDestination();
  audioSource.connect(audioDestination);
  audioSource.connect(audioContext.destination);
  
  // Combine video and audio streams
  const combinedStream = new MediaStream([
    ...stream.getVideoTracks(),
    ...audioDestination.stream.getAudioTracks()
  ]);

  // Try MP4 first, fallback to WebM if not supported
  let mimeType: string;
  let finalFormat: string;
  
  if (format === 'mp4' && (
    MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac') ||
    MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2') ||
    MediaRecorder.isTypeSupported('video/mp4;codecs=h264') ||
    MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
    MediaRecorder.isTypeSupported('video/mp4')
  )) {
    // Try different MP4 codec combinations
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac')) {
      mimeType = 'video/mp4;codecs=h264,aac';
    } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) {
      mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
    } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
      mimeType = 'video/mp4;codecs=h264';
    } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
      mimeType = 'video/mp4;codecs=avc1';
    } else {
      mimeType = 'video/mp4';
    }
    finalFormat = 'mp4';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
    mimeType = 'video/webm;codecs=vp9,opus';
    finalFormat = 'webm';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
    mimeType = 'video/webm;codecs=vp8,opus';
    finalFormat = 'webm';
  } else {
    mimeType = 'video/webm';
    finalFormat = 'webm';
  }
    
  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: getVideoBitrate(quality),
    audioBitsPerSecond: 128000
  });

  const recordedChunks: Blob[] = [];
  
  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { 
        type: finalFormat === 'mp4' ? 'video/mp4' : 'video/webm'
      });
      resolve(blob);
    };

    mediaRecorder.onerror = reject;

    // Start recording
    mediaRecorder.start();
    audio.play();

    onProgress?.({
      stage: 'encoding',
      progress: 10,
      message: 'Starting video encoding...'
    });

    // Render frames
    renderFramesSequentially(frames, canvas, ctx, fps, onProgress)
      .then(() => {
        onProgress?.({
          stage: 'finalizing',
          progress: 95,
          message: 'Finalizing video...'
        });
        
        // Stop recording after all frames are rendered
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          mediaRecorder.stop();
          audioContext.close();
          
          onProgress?.({
            stage: 'completed',
            progress: 100,
            message: 'Video created successfully!'
          });
        }, 500);
      })
      .catch(reject);
  });
}

/**
 * Render frames sequentially on canvas
 */
async function renderFramesSequentially(
  frames: string[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  fps: number,
  onProgress?: (progress: VideoCreationProgress) => void
): Promise<void> {
  const frameInterval = 1000 / fps;
  
  for (let i = 0; i < frames.length; i++) {
    const img = new Image();
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Clear canvas and draw frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        onProgress?.({
          stage: 'encoding',
          progress: 10 + (i / frames.length) * 80,
          currentFrame: i + 1,
          totalFrames: frames.length,
          message: `Rendering frame ${i + 1}/${frames.length}...`
        });
        
        // Wait for frame duration
        setTimeout(resolve, frameInterval);
      };
      
      img.onerror = reject;
      img.src = frames[i];
    });
  }
}

/**
 * Get video bitrate based on quality setting
 */
function getVideoBitrate(quality: 'low' | 'medium' | 'high'): number {
  switch (quality) {
    case 'low': return 1000000; // 1 Mbps
    case 'medium': return 2500000; // 2.5 Mbps
    case 'high': return 5000000; // 5 Mbps
    default: return 2500000;
  }
}

/**
 * Create a simple video from frames only (no audio)
 */
export async function createVideoFromFrames(
  frames: string[],
  fps: number,
  quality: 'low' | 'medium' | 'high' = 'medium',
  format: 'webm' | 'mp4' = 'mp4',
  onProgress?: (progress: VideoCreationProgress) => void
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Get dimensions from first frame
  const firstFrameImg = new Image();
  await new Promise((resolve, reject) => {
    firstFrameImg.onload = resolve;
    firstFrameImg.onerror = reject;
    firstFrameImg.src = frames[0];
  });
  
  canvas.width = firstFrameImg.width;
  canvas.height = firstFrameImg.height;
  
  const stream = canvas.captureStream(fps);
  
  // Try MP4 first, fallback to WebM
  let mimeType: string;
  let finalFormat: string;
  
  if (format === 'mp4' && (
    MediaRecorder.isTypeSupported('video/mp4;codecs=h264') ||
    MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
    MediaRecorder.isTypeSupported('video/mp4')
  )) {
    // Try different MP4 codec combinations for video-only
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
      mimeType = 'video/mp4;codecs=h264';
    } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
      mimeType = 'video/mp4;codecs=avc1';
    } else {
      mimeType = 'video/mp4';
    }
    finalFormat = 'mp4';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    mimeType = 'video/webm;codecs=vp9';
    finalFormat = 'webm';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    mimeType = 'video/webm;codecs=vp8';
    finalFormat = 'webm';
  } else {
    mimeType = 'video/webm';
    finalFormat = 'webm';
  }
  
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: getVideoBitrate(quality)
  });

  const recordedChunks: Blob[] = [];
  
  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { 
        type: finalFormat === 'mp4' ? 'video/mp4' : 'video/webm'
      });
      resolve(blob);
    };

    mediaRecorder.onerror = reject;
    mediaRecorder.start();

    renderFramesSequentially(frames, canvas, ctx, fps, onProgress)
      .then(() => {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 500);
      })
      .catch(reject);
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get available audio files in the public/mp3 directory
 */
export function getAvailableAudioFiles(): string[] {
  // In a real implementation, you might fetch this from an API
  // For now, we'll use the known audio file
  return ['/mp3/music.mp3'];
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Estimate final video file size
 */
export function estimateVideoSize(
  frames: number,
  fps: number,
  quality: 'low' | 'medium' | 'high',
  hasAudio: boolean = false
): number {
  const duration = frames / fps;
  const videoBitrate = getVideoBitrate(quality);
  const audioBitrate = hasAudio ? 128000 : 0;
  
  return Math.round((videoBitrate + audioBitrate) * duration / 8); // Convert bits to bytes
}
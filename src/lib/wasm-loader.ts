// WASM loader utility for Rust image processing functions
let wasmModule: any = null;

export interface ImageInfo {
  width: number;
  height: number;
  color: string;
  format: string;
}

export interface ImageProcessingResult {
  success: boolean;
  message: string;
  processing_time_ms: number;
}

export class RustWasm {
  private static instance: RustWasm;
  private initialized = false;

  public static getInstance(): RustWasm {
    if (!RustWasm.instance) {
      RustWasm.instance = new RustWasm();
    }
    return RustWasm.instance;
  }

  async init(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Import WASM module
      const wasmModule = await import('~/wasm/vievlog_rust');
      
      // The bundler target automatically initializes
      window.rustWasm = wasmModule;
      this.initialized = true;
      console.log('🦀 Rust WASM initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize Rust WASM:', error);
      throw error;
    }
  }

  private ensureInitialized() {
    if (!this.initialized || !window.rustWasm) {
      throw new Error('Rust WASM not initialized. Call init() first.');
    }
    
    // Additional check to make sure the module is fully loaded
    if (!window.rustWasm.bevy_process_image) {
      throw new Error('WASM module not fully loaded. Please wait for initialization.');
    }
    
    return window.rustWasm;
  }


  // New Bevy-powered image processing functions
  resizeImage(imageData: Uint8Array, oldWidth: number, oldHeight: number, newWidth: number, newHeight: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_resize_image(imageData, oldWidth, oldHeight, newWidth, newHeight);
  }

  // Single effect processing
  applyBlur(imageData: Uint8Array, width: number, height: number, intensity: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "blur", intensity);
  }

  adjustBrightness(imageData: Uint8Array, width: number, height: number, factor: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "brightness", factor);
  }

  adjustContrast(imageData: Uint8Array, width: number, height: number, factor: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "contrast", factor);
  }

  adjustSaturation(imageData: Uint8Array, width: number, height: number, factor: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "saturation", factor);
  }

  applyGrayscale(imageData: Uint8Array, width: number, height: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "grayscale", 1.0);
  }

  applySepia(imageData: Uint8Array, width: number, height: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "sepia", 1.0);
  }

  applyVignette(imageData: Uint8Array, width: number, height: number, strength: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "vignette", strength);
  }

  applyFilmGrain(imageData: Uint8Array, width: number, height: number, intensity: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "film_grain", intensity);
  }

  applyLightLeak(imageData: Uint8Array, width: number, height: number, intensity: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_process_rgba_image(imageData, width, height, "light_leak", intensity);
  }

  // Multi-effect processing with JSON
  applyMultipleEffects(imageData: Uint8Array, effects: Array<[string, number]>): Uint8Array {
    const wasm = this.ensureInitialized();
    const effectsJson = JSON.stringify(effects);
    return wasm.bevy_process_image_multi(imageData, effectsJson);
  }

  // Preset-based processing
  getAllPresets(): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_get_all_presets());
  }

  getPresetConfig(presetName: string): Array<[string, number]> {
    const wasm = this.ensureInitialized();
    const configJson = wasm.bevy_get_preset_config(presetName);
    return JSON.parse(configJson);
  }

  applyPreset(imageData: Uint8Array, presetName: string): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_apply_preset(imageData, presetName);
  }

  applyCinematicPreset(imageData: Uint8Array, presetName: string, intensity: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.bevy_apply_cinematic_preset(imageData, presetName, intensity);
  }

  // Effect suggestions based on image analysis
  suggestEffects(imageData: Uint8Array, width: number, height: number): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_suggest_effects(imageData, width, height));
  }

  // Animated effects
  createAnimatedEffect(imageData: Uint8Array, effectType: string, frames: number, intensity: number): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_create_animated_effect(imageData, effectType, frames, intensity));
  }

  animatePreset(imageData: Uint8Array, presetName: string, frames: number, maxIntensity: number): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_animate_preset(imageData, presetName, frames, maxIntensity));
  }

  // Video generation functions
  generateKenBurnsEffect(imageData: Uint8Array, width: number, height: number, frames: number, zoomFactor: number, panX: number, panY: number): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_generate_ken_burns(imageData, width, height, frames, zoomFactor, panX, panY));
  }

  generateTransition(image1Data: Uint8Array, image2Data: Uint8Array, width: number, height: number, frames: number, transitionType: string): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_generate_transition(image1Data, image2Data, width, height, frames, transitionType));
  }

  generateSlideshow(imagesData: Array<{data: Uint8Array, width: number, height: number}>, framesPerImage: number, transitionFrames: number, transitionType: string): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_generate_slideshow(imagesData, framesPerImage, transitionFrames, transitionType));
  }

  generateParallaxEffect(backgroundData: Uint8Array, foregroundData: Uint8Array, width: number, height: number, frames: number, scrollSpeed: number): string[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_generate_parallax(backgroundData, foregroundData, width, height, frames, scrollSpeed));
  }

  // Utility functions
  getPerformanceMetrics(): object {
    const wasm = this.ensureInitialized();
    return wasm.bevy_get_performance_metrics();
  }

  createPresetPreviews(imageData: Uint8Array, thumbnailWidth: number, thumbnailHeight: number): object {
    const wasm = this.ensureInitialized();
    return wasm.bevy_create_preset_previews(imageData, thumbnailWidth, thumbnailHeight);
  }

  // Batch processing
  batchProcessPreset(imagesData: Uint8Array[], presetName: string, intensity: number): Uint8Array[] {
    const wasm = this.ensureInitialized();
    return Array.from(wasm.bevy_batch_process_preset(imagesData, presetName, intensity));
  }

  // Legacy compatibility functions for existing components
  rotateImage(imageData: Uint8Array, angle: number): Uint8Array {
    // For now, use a multi-effect approach to simulate rotation
    // In the future, this could be implemented in the Bevy backend
    console.warn('Rotation not yet implemented in Bevy backend, returning original image');
    return imageData;
  }

  flipHorizontal(imageData: Uint8Array): Uint8Array {
    console.warn('Horizontal flip not yet implemented in Bevy backend, returning original image');
    return imageData;
  }

  flipVertical(imageData: Uint8Array): Uint8Array {
    console.warn('Vertical flip not yet implemented in Bevy backend, returning original image');
    return imageData;
  }

  cropImage(imageData: Uint8Array, x: number, y: number, width: number, height: number): Uint8Array {
    console.warn('Crop not yet implemented in Bevy backend, returning original image');
    return imageData;
  }

  getImageInfo(imageData: Uint8Array): ImageInfo {
    // This function is deprecated in favor of getting info from Canvas
    console.warn('getImageInfo is deprecated. Use Canvas to get image dimensions.');
    return {
      width: 100,
      height: 100,
      color: 'RGBA',
      format: 'Canvas'
    };
  }
}

// Global instance
export const rustWasm = RustWasm.getInstance();

// Hook for React components
export function useRustWasm() {
  return rustWasm;
}

// Declare global type for TypeScript
declare global {
  interface Window {
    rustWasm: any;
  }
}
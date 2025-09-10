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
      // Import WASM module built for bundlers
      const wasmModule = await import('~/wasm/vievlog_rust');
      window.rustWasm = wasmModule;
      this.initialized = true;
      console.log('🦀 Rust WASM initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize Rust WASM:', error);
      throw error;
    }
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Rust WASM not initialized. Call init() first.');
    }
    return window.rustWasm;
  }


  // Image processing functions
  resizeImage(imageData: Uint8Array, width: number, height: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.resize_image(imageData, width, height);
  }

  applyBlur(imageData: Uint8Array, sigma: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.apply_blur(imageData, sigma);
  }

  adjustBrightness(imageData: Uint8Array, factor: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.adjust_brightness(imageData, factor);
  }

  adjustContrast(imageData: Uint8Array, factor: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.adjust_contrast(imageData, factor);
  }

  applyGrayscale(imageData: Uint8Array): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.apply_grayscale(imageData);
  }

  rotateImage(imageData: Uint8Array, angle: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.rotate_image(imageData, angle);
  }

  flipHorizontal(imageData: Uint8Array): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.flip_horizontal(imageData);
  }

  flipVertical(imageData: Uint8Array): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.flip_vertical(imageData);
  }

  cropImage(imageData: Uint8Array, x: number, y: number, width: number, height: number): Uint8Array {
    const wasm = this.ensureInitialized();
    return wasm.crop_image(imageData, x, y, width, height);
  }

  getImageInfo(imageData: Uint8Array): ImageInfo {
    const wasm = this.ensureInitialized();
    const result = wasm.get_image_info(imageData);
    return JSON.parse(result);
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
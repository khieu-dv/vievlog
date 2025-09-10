// WASM loader utility for Rust functions
let wasmModule: any = null;

export interface PersonData {
  name: string;
  age: number;
  email: string;
  skills: string[];
  salary?: number;
  is_active: boolean;
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  data?: PersonData;
  timestamp: string;
  processing_time_ms: number;
}

export interface DataAnalysis {
  total_records: number;
  average_age: number;
  most_common_skill: string;
  salary_stats: SalaryStats;
  skill_distribution: SkillCount[];
}

export interface SalaryStats {
  min: number;
  max: number;
  average: number;
  median: number;
}

export interface SkillCount {
  skill: string;
  count: number;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  total_rows: number;
  filtered_rows: number;
}

export interface FilterOptions {
  min_age?: number;
  max_age?: number;
  required_skills: string[];
  min_salary?: number;
  active_only: boolean;
}

export interface TextAnalysis {
  wordCount: number;
  charCount: number;
  lineCount: number;
  readingTimeMinutes: number;
}

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

  // Basic functions
  greet(name: string): string {
    const wasm = this.ensureInitialized();
    return wasm.greet(name);
  }

  add(a: number, b: number): number {
    const wasm = this.ensureInitialized();
    return wasm.add(a, b);
  }

  fibonacci(n: number): number {
    const wasm = this.ensureInitialized();
    return wasm.fibonacci(n);
  }

  // String processing
  reverseString(input: string): string {
    const wasm = this.ensureInitialized();
    return wasm.reverse_string(input);
  }

  countWords(text: string): number {
    const wasm = this.ensureInitialized();
    return wasm.count_words(text);
  }

  // Performance testing
  heavyComputation(iterations: number): number {
    const wasm = this.ensureInitialized();
    return wasm.heavy_computation(iterations);
  }

  // Complex data processing
  processPersonData(data: PersonData): ProcessingResult {
    const wasm = this.ensureInitialized();
    return wasm.process_person_data(data);
  }

  // Bulk data processing
  processBulkData(data: PersonData[]): { result: ProcessingResult; processedData: PersonData[] } {
    const wasm = this.ensureInitialized();
    return wasm.process_bulk_data(data);
  }

  // Data analysis
  analyzeData(data: PersonData[]): DataAnalysis {
    const wasm = this.ensureInitialized();
    return wasm.analyze_data(data);
  }

  // Data filtering
  filterData(data: PersonData[], filters: FilterOptions): PersonData[] {
    const wasm = this.ensureInitialized();
    return wasm.filter_data(data, filters);
  }

  // Convert data to table format
  dataToTable(data: PersonData[]): TableData {
    const wasm = this.ensureInitialized();
    return wasm.data_to_table(data);
  }

  // Search data
  searchData(data: PersonData[], query: string): PersonData[] {
    const wasm = this.ensureInitialized();
    return wasm.search_data(data, query);
  }

  // Text analysis
  analyzeText(text: string): TextAnalysis {
    const wasm = this.ensureInitialized();
    const result = wasm.analyze_text(text);
    return JSON.parse(result);
  }

  // Utility functions
  simpleHash(input: string): number {
    const wasm = this.ensureInitialized();
    return wasm.simple_hash(input);
  }

  sumArray(numbers: number[]): number {
    const wasm = this.ensureInitialized();
    return wasm.sum_array(new Int32Array(numbers));
  }

  findMax(numbers: number[]): number | null {
    const wasm = this.ensureInitialized();
    return wasm.find_max(new Int32Array(numbers));
  }

  generateSlug(title: string): string {
    const wasm = this.ensureInitialized();
    return wasm.generate_slug(title);
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
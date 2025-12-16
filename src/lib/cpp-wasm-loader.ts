// C++ WASM loader utility for math functions
let wasmModule: any = null;

export interface MathUtilsModule {
  add(a: number, b: number): number;
  multiply(a: number, b: number): number;
  fibonacci(n: number): number;
  factorial(n: number): number;
  reverseString(str: string): string;
  toUpperCase(str: string): string;
  calculateDistance(x1: number, y1: number, x2: number, y2: number): number;
  VectorInt: any;
  VectorDouble: any;
  sortArray(arr: any): any;
  calculateMean(numbers: any): number;
}

export class CppWasm {
  private static instance: CppWasm;
  private initialized = false;

  public static getInstance(): CppWasm {
    if (!CppWasm.instance) {
      CppWasm.instance = new CppWasm();
    }
    return CppWasm.instance;
  }

  async init(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load WASM via direct script execution (Emscripten UMD pattern)
      await this.loadWasmScript();

      // Check if MathUtils is available globally
      if (typeof (window as any).MathUtils === 'function') {
        const module = await (window as any).MathUtils();
        wasmModule = module;
        window.cppWasm = module;
        this.initialized = true;
        console.log('🔧 C++ WASM initialized successfully!');
      } else {
        throw new Error('MathUtils not found on window object');
      }
    } catch (error) {
      console.error('Failed to initialize C++ WASM:', error);
      throw error;
    }
  }

  private async loadWasmScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/wasm/cpp/math_utils.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load WASM script'));
      document.head.appendChild(script);
    });
  }

  private ensureInitialized(): MathUtilsModule {
    if (!this.initialized || !wasmModule) {
      throw new Error('C++ WASM not initialized. Call init() first.');
    }
    return wasmModule;
  }

  // Math functions
  add(a: number, b: number): number {
    const wasm = this.ensureInitialized();
    return wasm.add(a, b);
  }

  multiply(a: number, b: number): number {
    const wasm = this.ensureInitialized();
    return wasm.multiply(a, b);
  }

  fibonacci(n: number): number {
    const wasm = this.ensureInitialized();
    return wasm.fibonacci(n);
  }

  factorial(n: number): number {
    const wasm = this.ensureInitialized();
    return wasm.factorial(n);
  }

  calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const wasm = this.ensureInitialized();
    return wasm.calculateDistance(x1, y1, x2, y2);
  }

  // String functions
  reverseString(str: string): string {
    const wasm = this.ensureInitialized();
    return wasm.reverseString(str);
  }

  toUpperCase(str: string): string {
    const wasm = this.ensureInitialized();
    return wasm.toUpperCase(str);
  }

  // Array functions
  sortArray(arr: number[]): number[] {
    const wasm = this.ensureInitialized();
    const vector = new wasm.VectorInt();
    arr.forEach(num => vector.push_back(num));

    const sortedVector = wasm.sortArray(vector);
    const result = [];
    for (let i = 0; i < sortedVector.size(); i++) {
      result.push(sortedVector.get(i));
    }

    // Clean up vectors
    vector.delete();
    sortedVector.delete();

    return result;
  }

  calculateMean(numbers: number[]): number {
    const wasm = this.ensureInitialized();
    const vector = new wasm.VectorDouble();
    numbers.forEach(num => vector.push_back(num));

    const mean = wasm.calculateMean(vector);

    // Clean up vector
    vector.delete();

    return mean;
  }

  // Utility function to check if initialized
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Global instance
export const cppWasm = CppWasm.getInstance();

// Declare global type for TypeScript
declare global {
  interface Window {
    cppWasm: MathUtilsModule;
  }
}
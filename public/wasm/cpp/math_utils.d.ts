declare module 'MathUtils' {
  export interface VectorInt {
    size(): number;
    get(index: number): number;
    push_back(value: number): void;
    delete(): void;
  }

  export interface VectorDouble {
    size(): number;
    get(index: number): number;
    push_back(value: number): void;
    delete(): void;
  }

  export interface MathUtilsModule {
    // Math functions
    add(a: number, b: number): number;
    multiply(a: number, b: number): number;
    fibonacci(n: number): number;
    factorial(n: number): number;

    // String functions
    reverseString(str: string): string;
    toUpperCase(str: string): string;

    // Array functions
    sortArray(arr: VectorInt): VectorInt;
    calculateMean(numbers: VectorDouble): number;

    // Complex calculations
    calculateDistance(x1: number, y1: number, x2: number, y2: number): number;

    // Vector constructors
    VectorInt: {
      new(): VectorInt;
    };
    VectorDouble: {
      new(): VectorDouble;
    };
  }

  export interface MathUtilsFactory {
    (): Promise<MathUtilsModule>;
  }

  const MathUtils: MathUtilsFactory;
  export default MathUtils;
}
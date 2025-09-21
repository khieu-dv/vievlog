'use client';

import { useState, useEffect } from 'react';
import { cppWasm } from '~/lib/cpp-wasm-loader';

export default function CppWasmDemo() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo results
  const [mathResults, setMathResults] = useState<any>({});
  const [stringResults, setStringResults] = useState<any>({});
  const [arrayResults, setArrayResults] = useState<any>({});

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await cppWasm.init();
        setIsInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load WASM module:', err);
        setError(`Failed to load WASM module: ${err}`);
        setLoading(false);
      }
    };

    loadWasm();
  }, []);

  const runMathDemos = () => {
    if (!isInitialized) return;

    const results = {
      add: cppWasm.add(15, 25),
      multiply: cppWasm.multiply(7, 8),
      fibonacci: cppWasm.fibonacci(10),
      factorial: cppWasm.factorial(5),
      distance: cppWasm.calculateDistance(0, 0, 3, 4),
    };

    setMathResults(results);
  };

  const runStringDemos = () => {
    if (!isInitialized) return;

    const testString = "Hello WebAssembly";
    const results = {
      original: testString,
      reversed: cppWasm.reverseString(testString),
      uppercase: cppWasm.toUpperCase(testString),
    };

    setStringResults(results);
  };

  const runArrayDemos = () => {
    if (!isInitialized) return;

    try {
      const originalArray = [64, 34, 25, 12, 22, 11, 90];
      const numbers = [1.5, 2.7, 3.2, 4.8, 5.1];

      const results = {
        originalArray: originalArray,
        sortedArray: cppWasm.sortArray(originalArray),
        numbers: numbers,
        mean: cppWasm.calculateMean(numbers),
      };

      setArrayResults(results);
    } catch (err) {
      console.error('Array demo error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">C++ WebAssembly Demo</h1>
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          <p className="mt-4">Loading WebAssembly module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">C++ WebAssembly Demo</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">C++ WebAssembly Demo</h1>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        ✅ WebAssembly module loaded successfully!
      </div>

      <div className="grid gap-6">

        {/* Math Functions Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Math Functions</h2>
          <button
            onClick={runMathDemos}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Run Math Demos
          </button>

          {Object.keys(mathResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <ul className="space-y-1">
                <li><strong>Add (15 + 25):</strong> {mathResults.add}</li>
                <li><strong>Multiply (7 × 8):</strong> {mathResults.multiply}</li>
                <li><strong>Fibonacci (10th):</strong> {mathResults.fibonacci}</li>
                <li><strong>Factorial (5!):</strong> {mathResults.factorial}</li>
                <li><strong>Distance (0,0) to (3,4):</strong> {mathResults.distance?.toFixed(2)}</li>
              </ul>
            </div>
          )}
        </div>

        {/* String Functions Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">String Functions</h2>
          <button
            onClick={runStringDemos}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Run String Demos
          </button>

          {Object.keys(stringResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <ul className="space-y-1">
                <li><strong>Original:</strong> "{stringResults.original}"</li>
                <li><strong>Reversed:</strong> "{stringResults.reversed}"</li>
                <li><strong>Uppercase:</strong> "{stringResults.uppercase}"</li>
              </ul>
            </div>
          )}
        </div>

        {/* Array Functions Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Array Functions</h2>
          <button
            onClick={runArrayDemos}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Run Array Demos
          </button>

          {Object.keys(arrayResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <ul className="space-y-2">
                <li>
                  <strong>Original Array:</strong> [{arrayResults.originalArray?.join(', ')}]
                </li>
                <li>
                  <strong>Sorted Array:</strong> [{arrayResults.sortedArray?.join(', ')}]
                </li>
                <li>
                  <strong>Numbers:</strong> [{arrayResults.numbers?.join(', ')}]
                </li>
                <li>
                  <strong>Mean:</strong> {arrayResults.mean?.toFixed(3)}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Performance Info */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
          <p className="mb-2">
            This demo showcases C++ code compiled to WebAssembly using Emscripten.
            The functions are executing native C++ code in your browser with near-native performance.
          </p>
          <p className="mb-2">
            <strong>Features demonstrated:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Math operations (add, multiply, fibonacci, factorial)</li>
            <li>String manipulation (reverse, uppercase)</li>
            <li>Array processing (sort, mean calculation)</li>
            <li>Memory management with C++ vectors</li>
            <li>Bidirectional data transfer between JS and C++</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
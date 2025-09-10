"use client";

import React, { useState, useEffect } from 'react';
import { rustWasm, PersonData, TextAnalysis } from '~/lib/wasm-loader';
import { Button } from '~/components/ui/Button';

export function RustWasmDemo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const initWasm = async () => {
      try {
        setLoading(true);
        await rustWasm.init();
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize WASM:', error);
      } finally {
        setLoading(false);
      }
    };

    initWasm();
  }, []);

  const runBasicFunctions = () => {
    if (!isLoaded) return;

    const basicResults = {
      greeting: rustWasm.greet("VieVlog User"),
      addition: rustWasm.add(42, 58),
      fibonacci: rustWasm.fibonacci(10),
      reversed: rustWasm.reverseString("Hello Rust!"),
      wordCount: rustWasm.countWords("This is a sample text for word counting"),
      slug: rustWasm.generateSlug("This is a Sample Blog Title!")
    };

    setResults({ ...results, basic: basicResults });
  };

  const runPerformanceTest = () => {
    if (!isLoaded) return;

    console.time('Rust Heavy Computation');
    const result = rustWasm.heavyComputation(1000000);
    console.timeEnd('Rust Heavy Computation');

    setResults({ ...results, performance: { result, iterations: 1000000 } });
  };

  const runTextAnalysis = () => {
    if (!isLoaded) return;

    const sampleText = `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
      in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
      nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
      sunt in culpa qui officia deserunt mollit anim id est laborum.
    `;

    const analysis: TextAnalysis = rustWasm.analyzeText(sampleText);
    setResults({ ...results, textAnalysis: analysis });
  };

  const runArrayOperations = () => {
    if (!isLoaded) return;

    const numbers = [1, 5, 3, 9, 2, 8, 4, 7, 6];
    const arrayResults = {
      original: numbers,
      sum: rustWasm.sumArray(numbers),
      max: rustWasm.findMax(numbers)
    };

    setResults({ ...results, arrays: arrayResults });
  };

  const runDataProcessing = () => {
    if (!isLoaded) return;

    const personData: PersonData = {
      name: "John Doe",
      age: 25,
      email: "JOHN.DOE@EXAMPLE.COM"
    };

    const processed = rustWasm.processPersonData(personData);
    setResults({ ...results, dataProcessing: { original: personData, processed } });
  };

  const runHashFunction = () => {
    if (!isLoaded) return;

    const text = "Hello, Rust WASM!";
    const hash = rustWasm.simpleHash(text);
    setResults({ ...results, hash: { text, hash } });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Rust WASM...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-red-600">
          <p>Failed to load Rust WASM module.</p>
          <p className="text-sm mt-2">Check browser console for details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🦀 Rust + Next.js Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demo of Rust functions running in WebAssembly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Functions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Basic Functions</h3>
          <Button onClick={runBasicFunctions} className="mb-3 w-full">
            Run Basic Functions
          </Button>
          {results.basic && (
            <div className="space-y-2 text-sm">
              <div><strong>Greeting:</strong> {results.basic.greeting}</div>
              <div><strong>42 + 58 =</strong> {results.basic.addition}</div>
              <div><strong>Fibonacci(10):</strong> {results.basic.fibonacci}</div>
              <div><strong>Reversed:</strong> {results.basic.reversed}</div>
              <div><strong>Word Count:</strong> {results.basic.wordCount}</div>
              <div><strong>Slug:</strong> {results.basic.slug}</div>
            </div>
          )}
        </div>

        {/* Performance Test */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Performance Test</h3>
          <Button onClick={runPerformanceTest} className="mb-3 w-full">
            Run Heavy Computation
          </Button>
          {results.performance && (
            <div className="text-sm">
              <div><strong>Iterations:</strong> {results.performance.iterations.toLocaleString()}</div>
              <div><strong>Result:</strong> {results.performance.result.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-2">Check console for timing</div>
            </div>
          )}
        </div>

        {/* Text Analysis */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Text Analysis</h3>
          <Button onClick={runTextAnalysis} className="mb-3 w-full">
            Analyze Text
          </Button>
          {results.textAnalysis && (
            <div className="space-y-2 text-sm">
              <div><strong>Words:</strong> {results.textAnalysis.wordCount}</div>
              <div><strong>Characters:</strong> {results.textAnalysis.charCount}</div>
              <div><strong>Lines:</strong> {results.textAnalysis.lineCount}</div>
              <div><strong>Reading Time:</strong> {results.textAnalysis.readingTimeMinutes} min</div>
            </div>
          )}
        </div>

        {/* Array Operations */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Array Operations</h3>
          <Button onClick={runArrayOperations} className="mb-3 w-full">
            Process Array
          </Button>
          {results.arrays && (
            <div className="space-y-2 text-sm">
              <div><strong>Array:</strong> [{results.arrays.original.join(', ')}]</div>
              <div><strong>Sum:</strong> {results.arrays.sum}</div>
              <div><strong>Max:</strong> {results.arrays.max}</div>
            </div>
          )}
        </div>

        {/* Data Processing */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Data Processing</h3>
          <Button onClick={runDataProcessing} className="mb-3 w-full">
            Process Person Data
          </Button>
          {results.dataProcessing && (
            <div className="space-y-2 text-sm">
              <div><strong>Original:</strong></div>
              <div className="pl-2 text-xs">
                {JSON.stringify(results.dataProcessing.original, null, 2)}
              </div>
              <div><strong>Processed:</strong></div>
              <div className="pl-2 text-xs">
                {JSON.stringify(results.dataProcessing.processed, null, 2)}
              </div>
            </div>
          )}
        </div>

        {/* Hash Function */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Hash Function</h3>
          <Button onClick={runHashFunction} className="mb-3 w-full">
            Generate Hash
          </Button>
          {results.hash && (
            <div className="space-y-2 text-sm">
              <div><strong>Text:</strong> "{results.hash.text}"</div>
              <div><strong>Hash:</strong> {results.hash.hash}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
          🚀 What's Happening Here?
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Rust code compiled to WebAssembly</li>
          <li>• High-performance computing in the browser</li>
          <li>• Type-safe integration with TypeScript</li>
          <li>• Real-time performance comparisons possible</li>
          <li>• Zero-cost abstractions from Rust</li>
        </ul>
      </div>
    </div>
  );
}
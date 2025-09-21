'use client';

import { useState, useEffect } from 'react';
import { cppWasm } from '~/lib/cpp-wasm-loader';
import { SmartInputHelper } from '~/components/common/SmartInputHelper';
import { Header } from '~/components/common/Header';
import { Footer } from '~/components/common/Footer';

export default function CppWasmDemo() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo results
  const [mathResults, setMathResults] = useState<any>({});
  const [stringResults, setStringResults] = useState<any>({});
  const [arrayResults, setArrayResults] = useState<any>({});

  // Service selection
  const [activeService, setActiveService] = useState('math');

  // User inputs
  const [mathInputs, setMathInputs] = useState({
    a: '15',
    b: '25',
    n: '10',
    x1: '0',
    y1: '0',
    x2: '3',
    y2: '4'
  });

  const [stringInput, setStringInput] = useState('Hello WebAssembly');
  const [arrayInput, setArrayInput] = useState('64,34,25,12,22,11,90');
  const [numberArrayInput, setNumberArrayInput] = useState('1.5,2.7,3.2,4.8,5.1');

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

    const a = parseInt(mathInputs.a) || 0;
    const b = parseInt(mathInputs.b) || 0;
    const n = parseInt(mathInputs.n) || 0;
    const x1 = parseFloat(mathInputs.x1) || 0;
    const y1 = parseFloat(mathInputs.y1) || 0;
    const x2 = parseFloat(mathInputs.x2) || 0;
    const y2 = parseFloat(mathInputs.y2) || 0;

    const results = {
      add: cppWasm.add(a, b),
      multiply: cppWasm.multiply(a, b),
      fibonacci: cppWasm.fibonacci(n),
      factorial: cppWasm.factorial(n <= 20 ? n : 20), // Limit to prevent overflow
      distance: cppWasm.calculateDistance(x1, y1, x2, y2),
    };

    setMathResults(results);
  };

  const runStringDemos = () => {
    if (!isInitialized) return;

    const results = {
      original: stringInput,
      reversed: cppWasm.reverseString(stringInput),
      uppercase: cppWasm.toUpperCase(stringInput),
    };

    setStringResults(results);
  };

  const runArrayDemos = () => {
    if (!isInitialized) return;

    try {
      const originalArray = arrayInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const numbers = numberArrayInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));

      const results = {
        originalArray: originalArray,
        sortedArray: cppWasm.sortArray(originalArray),
        numbers: numbers,
        mean: numbers.length > 0 ? cppWasm.calculateMean(numbers) : 0,
      };

      setArrayResults(results);
    } catch (err) {
      console.error('Array demo error:', err);
      setArrayResults({
        error: 'Invalid array format. Please enter comma-separated numbers.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-600 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading WebAssembly</h2>
              <p className="text-gray-600 dark:text-gray-400">Initializing C++ runtime environment...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-center mb-8">
              C++ WebAssembly Studio
            </h1>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Loading Error</h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                C++ WebAssembly Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a service to test C++ functions compiled to WebAssembly
              </p>

              {/* Status */}
              <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 mt-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">WASM Ready</span>
              </div>
            </div>

          {/* Service Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveService('math')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeService === 'math'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🔢 Math Functions
              </button>
              <button
                onClick={() => setActiveService('string')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeService === 'string'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📝 String Processing
              </button>
              <button
                onClick={() => setActiveService('array')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeService === 'array'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📊 Array Operations
              </button>
            </div>

            {/* Service Content */}
            <div className="p-6">
              {/* Math Service */}
              {activeService === 'math' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mathematical Operations</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number A</label>
                      <input
                        type="number"
                        value={mathInputs.a}
                        onChange={(e) => setMathInputs(prev => ({ ...prev, a: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number B</label>
                      <input
                        type="number"
                        value={mathInputs.b}
                        onChange={(e) => setMathInputs(prev => ({ ...prev, b: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N (Fibonacci)</label>
                      <input
                        type="number"
                        value={mathInputs.n}
                        onChange={(e) => setMathInputs(prev => ({ ...prev, n: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="10"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance Points</label>
                      <div className="grid grid-cols-2 gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={mathInputs.x1}
                          onChange={(e) => setMathInputs(prev => ({ ...prev, x1: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="x1"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={mathInputs.y1}
                          onChange={(e) => setMathInputs(prev => ({ ...prev, y1: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="y1"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={mathInputs.x2}
                          onChange={(e) => setMathInputs(prev => ({ ...prev, x2: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="x2"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={mathInputs.y2}
                          onChange={(e) => setMathInputs(prev => ({ ...prev, y2: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="y2"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={runMathDemos}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Run Math Functions
                  </button>

                  {Object.keys(mathResults).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Results:</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Add:</strong> {mathInputs.a} + {mathInputs.b} = {mathResults.add}</div>
                        <div><strong>Multiply:</strong> {mathInputs.a} × {mathInputs.b} = {mathResults.multiply}</div>
                        <div><strong>Fibonacci:</strong> F({mathInputs.n}) = {mathResults.fibonacci}</div>
                        <div><strong>Factorial:</strong> {mathInputs.n}! = {mathResults.factorial}</div>
                        <div><strong>Distance:</strong> d(({mathInputs.x1},{mathInputs.y1}), ({mathInputs.x2},{mathInputs.y2})) = {mathResults.distance?.toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* String Service */}
              {activeService === 'string' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">String Processing</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
                    <input
                      type="text"
                      value={stringInput}
                      onChange={(e) => setStringInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter any text here..."
                    />
                  </div>

                  <button
                    onClick={runStringDemos}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                  >
                    Process String
                  </button>

                  {Object.keys(stringResults).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Results:</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Original:</div>
                          <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">"{stringResults.original}"</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Reversed:</div>
                          <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">"{stringResults.reversed}"</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Uppercase:</div>
                          <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border">"{stringResults.uppercase}"</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Array Service */}
              {activeService === 'array' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Array Operations</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Integer Array (for sorting)</label>
                      <input
                        type="text"
                        value={arrayInput}
                        onChange={(e) => setArrayInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono"
                        placeholder="64,34,25,12,22,11,90"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Comma-separated integers
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number Array (for mean calculation)</label>
                      <input
                        type="text"
                        value={numberArrayInput}
                        onChange={(e) => setNumberArrayInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono"
                        placeholder="1.5,2.7,3.2,4.8,5.1"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Comma-separated decimal numbers
                      </p>
                    </div>
                  </div>

                  {/* Smart Input Helper */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <SmartInputHelper
                      code={`
// Example code that processes arrays
const numbers = input.split(',').map(x => parseFloat(x.trim()));
const integers = input.split(',').map(x => parseInt(x.trim()));
console.log('Processing arrays:', numbers, integers);
                      `}
                      language="javascript"
                      input={arrayInput}
                      onInputChange={setArrayInput}
                      className=""
                    />
                  </div>

                  <button
                    onClick={runArrayDemos}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                  >
                    Process Arrays
                  </button>

                  {Object.keys(arrayResults).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Results:</h4>
                      {arrayResults.error ? (
                        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                          <strong>Error:</strong> {arrayResults.error}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sorting Results:</div>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">Original:</div>
                                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border text-sm">
                                  [{arrayResults.originalArray?.join(', ')}]
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">Sorted:</div>
                                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border text-sm">
                                  [{arrayResults.sortedArray?.join(', ')}]
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Statistics:</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">Numbers:</div>
                                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border text-sm">
                                  [{arrayResults.numbers?.join(', ')}]
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">Mean:</div>
                                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border text-sm font-bold">
                                  {arrayResults.mean?.toFixed(3)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
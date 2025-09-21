'use client';

import { useState, useEffect } from 'react';
import { cppWasm } from '~/lib/cpp-wasm-loader';
import { SmartInputHelper } from '~/components/common/SmartInputHelper';

export default function CppWasmDemo() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo results
  const [mathResults, setMathResults] = useState<any>({});
  const [stringResults, setStringResults] = useState<any>({});
  const [arrayResults, setArrayResults] = useState<any>({});

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

          {/* Math Input Form */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number A</label>
              <input
                type="number"
                value={mathInputs.a}
                onChange={(e) => setMathInputs(prev => ({ ...prev, a: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number B</label>
              <input
                type="number"
                value={mathInputs.b}
                onChange={(e) => setMathInputs(prev => ({ ...prev, b: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N (Fibonacci)</label>
              <input
                type="number"
                value={mathInputs.n}
                onChange={(e) => setMathInputs(prev => ({ ...prev, n: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                max="20"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance Points</label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={mathInputs.x1}
                  onChange={(e) => setMathInputs(prev => ({ ...prev, x1: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="x1"
                />
                <input
                  type="number"
                  step="0.1"
                  value={mathInputs.y1}
                  onChange={(e) => setMathInputs(prev => ({ ...prev, y1: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="y1"
                />
                <input
                  type="number"
                  step="0.1"
                  value={mathInputs.x2}
                  onChange={(e) => setMathInputs(prev => ({ ...prev, x2: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="x2"
                />
                <input
                  type="number"
                  step="0.1"
                  value={mathInputs.y2}
                  onChange={(e) => setMathInputs(prev => ({ ...prev, y2: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="y2"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runMathDemos}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Run Math Functions
          </button>

          {Object.keys(mathResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              <ul className="space-y-1">
                <li><strong>Add ({mathInputs.a} + {mathInputs.b}):</strong> {mathResults.add}</li>
                <li><strong>Multiply ({mathInputs.a} × {mathInputs.b}):</strong> {mathResults.multiply}</li>
                <li><strong>Fibonacci ({mathInputs.n}th):</strong> {mathResults.fibonacci}</li>
                <li><strong>Factorial ({mathInputs.n}!):</strong> {mathResults.factorial}</li>
                <li><strong>Distance ({mathInputs.x1},{mathInputs.y1}) to ({mathInputs.x2},{mathInputs.y2}):</strong> {mathResults.distance?.toFixed(2)}</li>
              </ul>
            </div>
          )}
        </div>

        {/* String Functions Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">String Functions</h2>

          {/* String Input Form */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Input String</label>
            <input
              type="text"
              value={stringInput}
              onChange={(e) => setStringInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter any text here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This string will be processed by C++ functions compiled to WebAssembly
            </p>
          </div>

          <button
            onClick={runStringDemos}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Process String
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

          {/* Array Input Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Integer Array (for sorting)</label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="64,34,25,12,22,11,90"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter comma-separated integers
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number Array (for mean calculation)</label>
              <input
                type="text"
                value={numberArrayInput}
                onChange={(e) => setNumberArrayInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1.5,2.7,3.2,4.8,5.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter comma-separated decimal numbers
              </p>
            </div>
          </div>

          {/* Smart Input Helper for Array Validation */}
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
            className="mb-4"
          />

          <button
            onClick={runArrayDemos}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Process Arrays
          </button>

          {Object.keys(arrayResults).length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Results:</h3>
              {arrayResults.error ? (
                <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
                  <strong>Error:</strong> {arrayResults.error}
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>

        {/* Interactive Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4">🚀 Interactive C++ WASM Demo</h2>
          <p className="mb-4 text-gray-700">
            This is a live interactive demo where you can input your own numbers and strings to see C++ functions
            compiled to WebAssembly running directly in your browser with near-native performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-blue-600 mb-2">🔢 Number Processing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom math operations (add, multiply)</li>
                <li>• Fibonacci sequence generation</li>
                <li>• Factorial calculation (max 20 for safety)</li>
                <li>• Distance calculation between points</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-green-600 mb-2">📝 String & Array Processing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• String reversal and case conversion</li>
                <li>• Array sorting algorithms</li>
                <li>• Statistical calculations (mean)</li>
                <li>• Memory-efficient C++ vectors</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 How to Use:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Enter your own numbers and strings in the input fields above</li>
              <li>Click the respective "Run" or "Process" buttons</li>
              <li>Watch as your data is processed by native C++ code compiled to WASM</li>
              <li>See real-time results with your custom inputs!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
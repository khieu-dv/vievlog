"use client";

import { useState, useEffect } from "react";
import { SortAsc } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function SortingSection() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<"bubble" | "quick" | "merge" | "heap" | "selection" | "insertion">("bubble");
  const [wasm, setWasm] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [result, setResult] = useState("");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Sorting algorithms đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  const runSort = async () => {
    if (!wasmReady || !wasm) {
      setResult("❌ WASM chưa sẵn sàng");
      return;
    }

    setSorting(true);
    const startTime = performance.now();

    try {
      let sortedArray;
      switch (algorithm) {
        case "bubble":
          sortedArray = wasm.algorithms.sorting.bubbleSort([...array]);
          break;
        case "quick":
          sortedArray = wasm.algorithms.sorting.quickSort([...array]);
          break;
        case "merge":
          sortedArray = wasm.algorithms.sorting.mergeSort([...array]);
          break;
        case "heap":
          sortedArray = wasm.algorithms.sorting.heapSort([...array]);
          break;
        case "selection":
          sortedArray = wasm.algorithms.sorting.selectionSort([...array]);
          break;
        case "insertion":
          sortedArray = wasm.algorithms.sorting.insertionSort([...array]);
          break;
        default:
          sortedArray = wasm.algorithms.sorting.quickSort([...array]);
      }

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      const resultArray = sortedArray as number[];
      setArray(resultArray);
      setResult(`🦀 Rust ${algorithm} sort hoàn thành trong ${duration}ms. Kết quả: [${resultArray.join(', ')}]`);
    } catch (error) {
      setResult("❌ Rust WASM sorting failed: " + error);
    }

    setSorting(false);
  };

  const compareAlgorithms = async () => {
    if (!wasmReady || !wasm) {
      setResult("❌ WASM chưa sẵn sàng");
      return;
    }

    setSorting(true);
    try {
      const comparison = wasm.benchmarks.sorting.compare([...array]);
      const results = Array.from(comparison);
      let resultText = "🦀 So sánh hiệu suất các thuật toán sắp xếp Rust:\n";
      results.forEach((result: any) => {
        const [algo, time] = Array.from(result);
        resultText += `- ${algo}: ${time}ms\n`;
      });
      setResult(resultText);
    } catch (error) {
      setResult("❌ Rust WASM comparison failed: " + error);
    }
    setSorting(false);
  };

  const shuffleArray = () => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setArray(newArray);
    setResult("Đã xáo trộn mảng");
  };

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
  };

  const randomizeArray = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SortAsc className="h-5 w-5" />
          🦀 Rust WASM Giải Thuật Sắp Xếp
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác các giải thuật sắp xếp sử dụng Rust WASM. Các thuật toán được tối ưu hóa và có thể so sánh hiệu suất trực tiếp.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Sắp Xếp Tương Tác:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as "bubble" | "quick" | "merge" | "heap" | "selection" | "insertion")}
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                disabled={sorting}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="quick">Quick Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="heap">Heap Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
              </select>
              <button
                onClick={runSort}
                disabled={sorting || !wasmReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {sorting ? "Đang sắp xếp..." : `🦀 Chạy ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort`}
              </button>
              <button
                onClick={compareAlgorithms}
                disabled={sorting || !wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🏁 So Sánh Tất Cả
              </button>
              <button
                onClick={resetArray}
                disabled={sorting}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                🔄 Đặt lại
              </button>
              <button
                onClick={shuffleArray}
                disabled={sorting}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                🔀 Xáo Trộn
              </button>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong>
                <pre className="mt-2 text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}

            <div className="flex gap-2 flex-wrap items-end">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 border rounded text-center transition-all duration-200"
                  style={{
                    height: `${40 + value}px`,
                    minWidth: '50px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center'
                  }}
                >
                  <span className="text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Luồng Thuật Toán Bubble Sort:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    START([Bắt đầu]) --> INPUT[Mảng đầu vào]
                    INPUT --> CHECK{Kích thước > 1?}
                    CHECK -->|Không| END([Kết thúc])
                    CHECK -->|Có| BUBBLE[Bubble Sort]

                    BUBBLE --> OUTER[i = 0 đến n-1]
                    OUTER --> INNER[j = 0 đến n-i-2]
                    INNER --> COMPARE{"arr[j] > arr[j+1]?"}
                    COMPARE -->|Có| SWAP["Hoán đổi arr[j], arr[j+1]"]
                    COMPARE -->|Không| NEXT_J[j++]
                    SWAP --> NEXT_J
                    NEXT_J --> CHECK_J{j < n-i-1?}
                    CHECK_J -->|Có| INNER
                    CHECK_J -->|Không| NEXT_I[i++]
                    NEXT_I --> CHECK_I{i < n-1?}
                    CHECK_I -->|Có| OUTER
                    CHECK_I -->|Không| SORTED[Mảng đã sắp xếp]
                    SORTED --> END

                    style START fill:#4CAF50,color:#fff
                    style END fill:#F44336,color:#fff
                    style SWAP fill:#FF9800,color:#fff
                    style SORTED fill:#2196F3,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Giải Thuật:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Giải Thuật</th>
                    <th className="text-left py-2">Tốt Nhất</th>
                    <th className="text-left py-2">Trung Bình</th>
                    <th className="text-left py-2">Xấu Nhất</th>
                    <th className="text-left py-2">Bộ Nhớ</th>
                    <th className="text-left py-2">Ổn Định</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bubble Sort</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Quick Sort</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n²)</td>
                    <td className="py-2">O(log n)</td>
                    <td className="py-2">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Merge Sort</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <RustCodeEditor
              code={`// Bubble Sort - O(n²)
fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

// Quick Sort - O(n log n) trung bình
fn quick_sort<T: Ord>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = partition(arr);
    quick_sort(&mut arr[0..pivot]);
    quick_sort(&mut arr[pivot + 1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
    let pivot = arr.len() - 1;
    let mut i = 0;

    for j in 0..pivot {
        if arr[j] <= arr[pivot] {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, pivot);
    i
}

// Merge Sort - O(n log n) luôn
fn merge_sort<T: Ord + Clone>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort(&mut arr[0..mid]);
    merge_sort(&mut arr[mid..]);

    let mut temp = arr.to_vec();
    merge(&arr[0..mid], &arr[mid..], &mut temp);
    arr.copy_from_slice(&temp);
}`}
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
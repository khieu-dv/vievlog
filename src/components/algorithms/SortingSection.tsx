"use client";

import { useState, useEffect } from "react";
import { SortAsc } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function SortingSection() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<"bubble" | "quick" | "merge" | "heap" | "selection" | "insertion">("bubble");
  const [wasm, setWasm] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [result, setResult] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

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

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4 border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📊 Sắp Xếp là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Sắp xếp (Sorting)</strong> là quá trình sắp đặt các phần tử theo thứ tự nhất định (tăng dần hoặc giảm dần).
            Là một trong những vấn đề cơ bản nhất trong khoa học máy tính.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">🎯 Tại sao cần sắp xếp?</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Tìm kiếm nhanh hơn</li>
                <li>• Dễ phân tích dữ liệu</li>
                <li>• Cơ sở cho nhiều thuật toán</li>
                <li>• Hiển thị đẹp cho người dùng</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">💡 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Danh bạ điện thoại</li>
                <li>• Kết quả tìm kiếm Google</li>
                <li>• Sắp xếp file theo tên/ngày</li>
                <li>• Xếp hạng trong game</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg mb-4 border-l-4 border-rose-500">
          <h4 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">⚡ Phân loại thuật toán sắp xếp:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <strong>Stable vs Unstable:</strong>
              <br/><span className="text-gray-600 dark:text-gray-400">Có giữ thứ tự phần tử bằng nhau?</span>
            </div>
            <div>
              <strong>In-place vs Out-place:</strong>
              <br/><span className="text-gray-600 dark:text-gray-400">Cần thêm bộ nhớ không?</span>
            </div>
            <div>
              <strong>Comparison vs Non-comparison:</strong>
              <br/><span className="text-gray-600 dark:text-gray-400">So sánh phần tử hay không?</span>
            </div>
          </div>
        </div>

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
                graph LR
                    A[Bắt đầu] --> B{n > 1?}
                    B -->|Có| C[i = 0 to n-1]
                    C --> D[j = 0 to n-i-2]
                    D --> E{"arr[j] > arr[j+1]?"}
                    E -->|Có| G[Swap]
                    E -->|Không| H[j++]
                    G --> H
                    H --> I{j < n-i-1?}
                    I -->|Có| D
                    I -->|Không| J[i++]
                    J --> K{i < n-1?}
                    K -->|Có| C
                    K -->|Không| F[Kết thúc]
                    B -->|Không| F

                    style A fill:#4CAF50,color:#fff
                    style F fill:#F44336,color:#fff
                    style G fill:#FF9800,color:#fff
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
            <h4 className="font-medium mb-4">Cài Đặt:</h4>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="border-b border-gray-200 dark:border-gray-600">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveLanguageTab("rust")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "rust"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Rust
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("cpp")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "cpp"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("python")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "python"
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Python
                  </button>
                </nav>
              </div>
            </div>

            {/* Language-specific Code */}
            {activeLanguageTab === "rust" && (
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
}

fn merge<T: Ord + Clone>(left: &[T], right: &[T], result: &mut [T]) {
    let mut i = 0;
    let mut j = 0;
    let mut k = 0;

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result[k] = left[i].clone();
            i += 1;
        } else {
            result[k] = right[j].clone();
            j += 1;
        }
        k += 1;
    }

    while i < left.len() {
        result[k] = left[i].clone();
        i += 1;
        k += 1;
    }

    while j < right.len() {
        result[k] = right[j].clone();
        j += 1;
        k += 1;
    }
}

// Heap Sort - O(n log n)
fn heap_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify(arr, n, i);
    }

    // Extract elements one by one
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(arr, i, 0);
    }
}

fn heapify<T: Ord>(arr: &mut [T], n: usize, i: usize) {
    let mut largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if left < n && arr[left] > arr[largest] {
        largest = left;
    }

    if right < n && arr[right] > arr[largest] {
        largest = right;
    }

    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}

// Selection Sort - O(n²)
fn selection_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();
    for i in 0..n {
        let mut min_idx = i;
        for j in i + 1..n {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        arr.swap(i, min_idx);
    }
}

// Insertion Sort - O(n²)
fn insertion_sort<T: Ord + Clone>(arr: &mut [T]) {
    for i in 1..arr.len() {
        let key = arr[i].clone();
        let mut j = i;

        while j > 0 && arr[j - 1] > key {
            arr[j] = arr[j - 1].clone();
            j -= 1;
        }
        arr[j] = key;
    }
}

// Sử dụng
fn main() {
    let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
    println!("Original: {:?}", arr);

    quick_sort(&mut arr);
    println!("Quick sorted: {:?}", arr);

    let mut arr2 = vec![64, 34, 25, 12, 22, 11, 90];
    merge_sort(&mut arr2);
    println!("Merge sorted: {:?}", arr2);
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <vector>
#include <algorithm>
#include <iostream>

// Bubble Sort - O(n²)
template<typename T>
void bubbleSort(std::vector<T>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// Quick Sort - O(n log n) trung bình
template<typename T>
void quickSort(std::vector<T>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

template<typename T>
int partition(std::vector<T>& arr, int low, int high) {
    T pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

// Merge Sort - O(n log n) luôn
template<typename T>
void mergeSort(std::vector<T>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

template<typename T>
void merge(std::vector<T>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    std::vector<T> leftArr(n1), rightArr(n2);

    for (int i = 0; i < n1; i++)
        leftArr[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        rightArr[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

// Heap Sort - O(n log n)
template<typename T>
void heapSort(std::vector<T>& arr) {
    int n = arr.size();

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Extract elements one by one
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

template<typename T>
void heapify(std::vector<T>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

// Selection Sort - O(n²)
template<typename T>
void selectionSort(std::vector<T>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        std::swap(arr[i], arr[min_idx]);
    }
}

// Insertion Sort - O(n²)
template<typename T>
void insertionSort(std::vector<T>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        T key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Hàm tiện ích để in mảng
template<typename T>
void printArray(const std::vector<T>& arr) {
    for (const auto& element : arr) {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

// Sử dụng
int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};

    std::cout << "Original array: ";
    printArray(arr);

    // Quick Sort
    auto arr1 = arr;
    quickSort(arr1, 0, arr1.size() - 1);
    std::cout << "Quick sorted: ";
    printArray(arr1);

    // Merge Sort
    auto arr2 = arr;
    mergeSort(arr2, 0, arr2.size() - 1);
    std::cout << "Merge sorted: ";
    printArray(arr2);

    // Heap Sort
    auto arr3 = arr;
    heapSort(arr3);
    std::cout << "Heap sorted: ";
    printArray(arr3);

    // STL sort (Introsort - hybrid of quicksort, heapsort, and insertion sort)
    auto arr4 = arr;
    std::sort(arr4.begin(), arr4.end());
    std::cout << "STL sorted: ";
    printArray(arr4);

    return 0;
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`# Bubble Sort - O(n²)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Quick Sort - O(n log n) trung bình
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# Quick Sort in-place
def quick_sort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        pi = partition(arr, low, high)
        quick_sort_inplace(arr, low, pi - 1)
        quick_sort_inplace(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Merge Sort - O(n log n) luôn
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Heap Sort - O(n log n)
def heap_sort(arr):
    def heapify(arr, n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n and arr[left] > arr[largest]:
            largest = left

        if right < n and arr[right] > arr[largest]:
            largest = right

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(arr, n, largest)

    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

    return arr

# Selection Sort - O(n²)
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Insertion Sort - O(n²)
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key
    return arr

# Counting Sort - O(n + k) cho số nguyên nhỏ
def counting_sort(arr, max_val=None):
    if not arr:
        return arr

    if max_val is None:
        max_val = max(arr)

    count = [0] * (max_val + 1)

    # Đếm số lần xuất hiện
    for num in arr:
        count[num] += 1

    # Xây dựng lại mảng
    result = []
    for i, freq in enumerate(count):
        result.extend([i] * freq)

    return result

# Radix Sort - O(d * (n + k))
def radix_sort(arr):
    if not arr:
        return arr

    max_num = max(arr)
    exp = 1

    while max_num // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10

    return arr

def counting_sort_for_radix(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1

    for i in range(1, 10):
        count[i] += count[i - 1]

    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1

    for i in range(n):
        arr[i] = output[i]

# Bucket Sort - O(n + k) cho dữ liệu phân bố đều
def bucket_sort(arr, num_buckets=10):
    if len(arr) <= 1:
        return arr

    # Tìm giá trị min và max
    min_val, max_val = min(arr), max(arr)
    bucket_range = (max_val - min_val) / num_buckets

    # Tạo buckets
    buckets = [[] for _ in range(num_buckets)]

    # Phân phối phần tử vào buckets
    for num in arr:
        if num == max_val:
            buckets[num_buckets - 1].append(num)
        else:
            bucket_index = int((num - min_val) / bucket_range)
            buckets[bucket_index].append(num)

    # Sắp xếp từng bucket và gộp lại
    result = []
    for bucket in buckets:
        if bucket:
            result.extend(sorted(bucket))  # Hoặc dùng insertion_sort

    return result

# Tim Sort (Python's default sort) - hybrid stable sort
# Sử dụng built-in vì implementation phức tạp
def tim_sort(arr):
    return sorted(arr)

# Benchmark function
import time
import random

def benchmark_sorts(arr_size=1000):
    """So sánh hiệu suất các thuật toán sắp xếp"""
    # Tạo mảng ngẫu nhiên
    original = [random.randint(1, 1000) for _ in range(arr_size)]

    algorithms = [
        ("Bubble Sort", bubble_sort),
        ("Selection Sort", selection_sort),
        ("Insertion Sort", insertion_sort),
        ("Merge Sort", merge_sort),
        ("Quick Sort", quick_sort),
        ("Heap Sort", heap_sort),
        ("Tim Sort (Built-in)", tim_sort),
    ]

    results = []

    for name, func in algorithms:
        arr_copy = original.copy()
        start_time = time.time()

        try:
            if name == "Quick Sort (In-place)":
                quick_sort_inplace(arr_copy)
            else:
                sorted_arr = func(arr_copy)

            end_time = time.time()
            duration = (end_time - start_time) * 1000  # milliseconds
            results.append((name, duration))

        except RecursionError:
            results.append((name, "Stack Overflow"))

    return results

# Ví dụ sử dụng
if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {arr}")

    # Test các thuật toán
    print(f"Bubble Sort: {bubble_sort(arr.copy())}")
    print(f"Quick Sort: {quick_sort(arr.copy())}")
    print(f"Merge Sort: {merge_sort(arr.copy())}")
    print(f"Heap Sort: {heap_sort(arr.copy())}")
    print(f"Selection Sort: {selection_sort(arr.copy())}")
    print(f"Insertion Sort: {insertion_sort(arr.copy())}")

    # Benchmark (chỉ chạy với mảng nhỏ để tránh chậm)
    print("\nBenchmark results (100 elements):")
    for name, duration in benchmark_sorts(100):
        print(f"{name}: {duration}ms")

    # Sử dụng sort có sẵn của Python
    arr_builtin = [64, 34, 25, 12, 22, 11, 90]
    arr_builtin.sort()  # In-place
    print(f"\nBuilt-in sort: {arr_builtin}")

    # Hoặc
    arr_builtin2 = [64, 34, 25, 12, 22, 11, 90]
    sorted_arr = sorted(arr_builtin2)  # Trả về mảng mới
    print(f"Sorted function: {sorted_arr}")`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
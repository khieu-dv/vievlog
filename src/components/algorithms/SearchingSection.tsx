"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function SearchingSection() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");
  const [customArray, setCustomArray] = useState<string>("1,3,5,7,9,11,13,15,17,19");
  const [currentArray, setCurrentArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [algorithm, setAlgorithm] = useState<"linear" | "binary" | "interpolation" | "jump" | "exponential" | "ternary">("binary");
  const [wasm, setWasm] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        setWasm(wasmInstance);
        setWasmReady(true);
        setSearchResult("✅ Rust WASM Search algorithms đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setSearchResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  const updateArray = () => {
    try {
      const newArray = customArray.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      newArray.sort((a, b) => a - b); // Ensure sorted for binary search
      setCurrentArray(newArray);
      setSearchResult("");
    } catch (error) {
      setSearchResult("Mảng không hợp lệ");
    }
  };

  const runSearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      setSearchResult("Vui lòng nhập một số hợp lệ");
      return;
    }

    if (!wasmReady || !wasm) {
      setSearchResult("❌ WASM chưa sẵn sàng");
      return;
    }

    const startTime = performance.now();

    try {
      let result;
      let algorithmName = "";

      switch (algorithm) {
        case "linear":
          result = wasm.algorithms.searching.linearSearch(currentArray, target);
          algorithmName = "Linear Search";
          break;
        case "binary":
          result = wasm.algorithms.searching.binarySearch(currentArray, target);
          algorithmName = "Binary Search";
          break;
        case "interpolation":
          result = wasm.algorithms.searching.interpolationSearch(currentArray, target);
          algorithmName = "Interpolation Search";
          break;
        case "jump":
          result = wasm.algorithms.searching.jumpSearch(currentArray, target);
          algorithmName = "Jump Search";
          break;
        case "exponential":
          result = wasm.algorithms.searching.exponentialSearch(currentArray, target);
          algorithmName = "Exponential Search";
          break;
        case "ternary":
          result = wasm.algorithms.searching.ternarySearch(currentArray, target);
          algorithmName = "Ternary Search";
          break;
        default:
          result = wasm.algorithms.searching.binarySearch(currentArray, target);
          algorithmName = "Binary Search";
      }

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(4);

      if (result !== null && result !== undefined) {
        setSearchResult(`🦀 ${algorithmName}: Tìm thấy ${target} ở vị trí ${result} trong ${duration}ms`);
      } else {
        setSearchResult(`🦀 ${algorithmName}: Không tìm thấy ${target} trong ${duration}ms`);
      }
    } catch (error) {
      setSearchResult("❌ Rust WASM search failed: " + error);
    }
  };

  const compareAlgorithms = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      setSearchResult("Vui lòng nhập một số hợp lệ");
      return;
    }

    if (!wasmReady || !wasm) {
      setSearchResult("❌ WASM chưa sẵn sàng");
      return;
    }

    try {
      const comparison = wasm.benchmarks.searching.compare(currentArray, target);
      const results = Array.from(comparison);
      let resultText = `🦀 So sánh hiệu suất tìm kiếm ${target}:\n`;
      results.forEach((result: any) => {
        const [algo, time] = Array.from(result);
        resultText += `- ${algo}: ${time}ms\n`;
      });
      setSearchResult(resultText);
    } catch (error) {
      setSearchResult("❌ Rust WASM comparison failed: " + error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" />
          🦀 Rust WASM Giải Thuật Tìm Kiếm
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4 border-l-4 border-yellow-500">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">🔍 Tìm Kiếm là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Tìm kiếm (Searching)</strong> là quá trình tìm một phần tử cụ thể trong tập dữ liệu.
            Là một trong những vấn đề cơ bản nhất và được sử dụng hàng ngày.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">📱 Ứng dụng hàng ngày:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Tìm liên hệ trong điện thoại</li>
                <li>• Google search</li>
                <li>• Tìm file trong máy tính</li>
                <li>• Tìm sản phẩm trong e-commerce</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">⚡ Yếu tố quan trọng:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Tốc độ tìm kiếm</li>
                <li>• Dữ liệu có sắp xếp chưa?</li>
                <li>• Kích thước tập dữ liệu</li>
                <li>• Bộ nhớ sử dụng</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg mb-4 border-l-4 border-violet-500">
          <h4 className="font-semibold text-violet-800 dark:text-violet-300 mb-2">🏃‍♂️ Phân loại thuật toán tìm kiếm:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Linear Search:</strong> Duyệt từ đầu đến cuối
              <br/><span className="text-gray-600 dark:text-gray-400">O(n) - Đơn giản, mảng không cần sắp xếp</span>
            </div>
            <div>
              <strong>Binary Search:</strong> Chia đôi tìm kiếm
              <br/><span className="text-gray-600 dark:text-gray-400">O(log n) - Nhanh, mảng phải sắp xếp</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Hình Mảng:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customArray}
                onChange={(e) => setCustomArray(e.target.value)}
                placeholder="Nhập mảng (phân cách bằng dấu phẩy)"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500 flex-1"
              />
              <button
                onClick={updateArray}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Cập nhật
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mảng hiện tại: [{currentArray.join(", ")}]
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Tìm Kiếm Tương Tác:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as "linear" | "binary" | "interpolation" | "jump" | "exponential" | "ternary")}
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              >
                <option value="linear">Linear Search</option>
                <option value="binary">Binary Search</option>
                <option value="interpolation">Interpolation Search</option>
                <option value="jump">Jump Search</option>
                <option value="exponential">Exponential Search</option>
                <option value="ternary">Ternary Search</option>
              </select>
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập số cần tìm"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={runSearch}
                disabled={!wasmReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                🦀 Tìm Kiếm
              </button>
              <button
                onClick={compareAlgorithms}
                disabled={!wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🏁 So Sánh Tất Cả
              </button>
            </div>

            {searchResult && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong>
                <pre className="mt-2 text-sm whitespace-pre-wrap">{searchResult}</pre>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Thuật Toán Tìm Kiếm:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Tìm Kiếm Tuyến Tính"
                        LS_START([Bắt đầu]) --> LS_I[i = 0]
                        LS_I --> LS_CHECK{"arr[i] == target?"}
                        LS_CHECK -->|Có| LS_FOUND[Tìm thấy tại i]
                        LS_CHECK -->|Không| LS_NEXT[i++]
                        LS_NEXT --> LS_END_CHECK{i < length?}
                        LS_END_CHECK -->|Có| LS_CHECK
                        LS_END_CHECK -->|Không| LS_NOT_FOUND[Không tìm thấy]
                    end

                    subgraph "Tìm Kiếm Nhị Phân"
                        BS_START([Bắt đầu]) --> BS_INIT["left = 0, right = n-1"]
                        BS_INIT --> BS_CHECK{left <= right?}
                        BS_CHECK -->|Không| BS_NOT_FOUND[Không tìm thấy]
                        BS_CHECK -->|Có| BS_MID["mid = (left + right) / 2"]
                        BS_MID --> BS_COMPARE{"arr[mid] == target?"}
                        BS_COMPARE -->|Có| BS_FOUND[Tìm thấy tại mid]
                        BS_COMPARE -->|"arr[mid] < target"| BS_RIGHT[left = mid + 1]
                        BS_COMPARE -->|"arr[mid] > target"| BS_LEFT[right = mid - 1]
                        BS_RIGHT --> BS_CHECK
                        BS_LEFT --> BS_CHECK
                    end

                    style LS_FOUND fill:#4CAF50,color:#fff
                    style BS_FOUND fill:#4CAF50,color:#fff
                    style LS_NOT_FOUND fill:#F44336,color:#fff
                    style BS_NOT_FOUND fill:#F44336,color:#fff
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
                    <th className="text-left py-2">Độ Phức Tạp</th>
                    <th className="text-left py-2">Yêu Cầu</th>
                    <th className="text-left py-2">Ưu Điểm</th>
                    <th className="text-left py-2">Nhược Điểm</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Linear Search</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Không</td>
                    <td className="py-2">Đơn giản, mảng không cần sắp xếp</td>
                    <td className="py-2">Chậm với mảng lớn</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Binary Search</td>
                    <td className="py-2">O(log n)</td>
                    <td className="py-2">Mảng đã sắp xếp</td>
                    <td className="py-2">Rất nhanh</td>
                    <td className="py-2">Cần sắp xếp trước</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Interpolation Search</td>
                    <td className="py-2">O(log log n)</td>
                    <td className="py-2">Mảng đã sắp xếp, phân bố đều</td>
                    <td className="py-2">Nhanh nhất khi dữ liệu phân bố đều</td>
                    <td className="py-2">Hiệu suất giảm với dữ liệu không đều</td>
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
                code={`// Binary Search - O(log n) - yêu cầu mảng đã sắp xếp
fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid = left + (right - left) / 2;

        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => {
                if mid == 0 { break; }
                right = mid - 1;
            }
        }
    }
    None
}

// Linear Search - O(n) - hoạt động với mọi mảng
fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (index, item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

// Interpolation Search - O(log log n) với dữ liệu phân bố đều
fn interpolation_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right && target >= arr[left] && target <= arr[right] {
        if left == right {
            return if arr[left] == target { Some(left) } else { None };
        }

        let pos = left + ((target - arr[left]) as usize * (right - left))
                   / (arr[right] - arr[left]) as usize;

        if arr[pos] == target {
            return Some(pos);
        } else if arr[pos] < target {
            left = pos + 1;
        } else {
            right = pos.saturating_sub(1);
        }
    }
    None
}

// Jump Search - O(√n) - tốt cho mảng đã sắp xếp
fn jump_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let n = arr.len();
    let step = (n as f64).sqrt() as usize;
    let mut prev = 0;

    // Tìm block chứa target
    while prev < n && arr[(step.min(n) - 1).min(prev + step - 1)] < *target {
        prev += step;
        if prev >= n {
            return None;
        }
    }

    // Linear search trong block
    for i in prev..step.min(n).min(prev + step) {
        if arr[i] == *target {
            return Some(i);
        }
    }
    None
}

// Exponential Search - O(log n)
fn exponential_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let n = arr.len();
    if n == 0 {
        return None;
    }

    if arr[0] == *target {
        return Some(0);
    }

    // Tìm range cho binary search
    let mut i = 1;
    while i < n && arr[i] <= *target {
        i *= 2;
    }

    // Binary search trong range [i/2, min(i, n-1)]
    binary_search_range(arr, target, i / 2, i.min(n - 1))
}

fn binary_search_range<T: Ord>(arr: &[T], target: &T, mut left: usize, mut right: usize) -> Option<usize> {
    while left <= right {
        let mid = left + (right - left) / 2;

        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => {
                if mid == 0 { break; }
                right = mid - 1;
            }
        }
    }
    None
}

// Ternary Search - O(log₃ n)
fn ternary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid1 = left + (right - left) / 3;
        let mid2 = right - (right - left) / 3;

        if arr[mid1] == *target {
            return Some(mid1);
        }
        if arr[mid2] == *target {
            return Some(mid2);
        }

        if *target < arr[mid1] {
            if mid1 == 0 { break; }
            right = mid1 - 1;
        } else if *target > arr[mid2] {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            if mid2 == 0 { break; }
            right = mid2 - 1;
        }
    }
    None
}

// Sử dụng
fn main() {
    let arr = vec![1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let target = 7;

    if let Some(index) = binary_search(&arr, &target) {
        println!("Binary search: Found {} at index {}", target, index);
    }

    if let Some(index) = linear_search(&arr, &target) {
        println!("Linear search: Found {} at index {}", target, index);
    }

    if let Some(index) = jump_search(&arr, &target) {
        println!("Jump search: Found {} at index {}", target, index);
    }
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <vector>
#include <iostream>
#include <cmath>
#include <algorithm>

// Binary Search - O(log n)
template<typename T>
int binarySearch(const std::vector<T>& arr, const T& target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Not found
}

// Linear Search - O(n)
template<typename T>
int linearSearch(const std::vector<T>& arr, const T& target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1; // Not found
}

// Interpolation Search - O(log log n) cho dữ liệu phân bố đều
int interpolationSearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left == right) {
            return (arr[left] == target) ? left : -1;
        }

        // Tính vị trí interpolation
        int pos = left + ((double)(target - arr[left]) / (arr[right] - arr[left])) * (right - left);

        if (arr[pos] == target) {
            return pos;
        } else if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }
    return -1;
}

// Jump Search - O(√n)
template<typename T>
int jumpSearch(const std::vector<T>& arr, const T& target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;

    // Tìm block chứa target
    while (arr[std::min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) {
            return -1;
        }
    }

    // Linear search trong block
    while (arr[prev] < target) {
        prev++;
        if (prev == std::min(step, n)) {
            return -1;
        }
    }

    return (arr[prev] == target) ? prev : -1;
}

// Exponential Search - O(log n)
template<typename T>
int exponentialSearch(const std::vector<T>& arr, const T& target) {
    int n = arr.size();
    if (n == 0) return -1;
    if (arr[0] == target) return 0;

    // Tìm range cho binary search
    int i = 1;
    while (i < n && arr[i] <= target) {
        i *= 2;
    }

    // Binary search trong range [i/2, min(i, n-1)]
    int left = i / 2;
    int right = std::min(i, n - 1);

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// Ternary Search - O(log₃ n)
template<typename T>
int ternarySearch(const std::vector<T>& arr, const T& target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;

        if (arr[mid1] == target) return mid1;
        if (arr[mid2] == target) return mid2;

        if (target < arr[mid1]) {
            right = mid1 - 1;
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }
    return -1;
}

// Fibonacci Search - O(log n)
template<typename T>
int fibonacciSearch(const std::vector<T>& arr, const T& target) {
    int n = arr.size();
    int fib2 = 0;   // (m-2)'th Fibonacci number
    int fib1 = 1;   // (m-1)'th Fibonacci number
    int fib = fib2 + fib1; // m'th Fibonacci number

    // fib sẽ là Fibonacci nhỏ nhất >= n
    while (fib < n) {
        fib2 = fib1;
        fib1 = fib;
        fib = fib2 + fib1;
    }

    int offset = -1;

    while (fib > 1) {
        int i = std::min(offset + fib2, n - 1);

        if (arr[i] < target) {
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
        } else if (arr[i] > target) {
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
        } else {
            return i;
        }
    }

    if (fib1 && offset + 1 < n && arr[offset + 1] == target) {
        return offset + 1;
    }

    return -1;
}

// Hàm tiện ích để test
void testSearchAlgorithms() {
    std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 7;

    std::cout << "Array: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << "\nSearching for: " << target << "\n\n";

    int result;

    result = binarySearch(arr, target);
    std::cout << "Binary Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = linearSearch(arr, target);
    std::cout << "Linear Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = interpolationSearch(arr, target);
    std::cout << "Interpolation Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = jumpSearch(arr, target);
    std::cout << "Jump Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = exponentialSearch(arr, target);
    std::cout << "Exponential Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = ternarySearch(arr, target);
    std::cout << "Ternary Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";

    result = fibonacciSearch(arr, target);
    std::cout << "Fibonacci Search: " << (result != -1 ? "Found at index " + std::to_string(result) : "Not found") << "\n";
}

int main() {
    testSearchAlgorithms();

    // Sử dụng STL binary_search
    std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 7;

    // Kiểm tra tồn tại
    bool found = std::binary_search(arr.begin(), arr.end(), target);
    std::cout << "\nSTL binary_search: " << (found ? "Found" : "Not found") << "\n";

    // Tìm vị trí
    auto it = std::lower_bound(arr.begin(), arr.end(), target);
    if (it != arr.end() && *it == target) {
        int index = std::distance(arr.begin(), it);
        std::cout << "STL lower_bound: Found at index " << index << "\n";
    }

    return 0;
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`import math
import bisect
from typing import List, Optional

def binary_search(arr: List[int], target: int) -> Optional[int]:
    """Binary Search - O(log n)"""
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return None

def linear_search(arr: List[int], target: int) -> Optional[int]:
    """Linear Search - O(n)"""
    for i, value in enumerate(arr):
        if value == target:
            return i
    return None

def interpolation_search(arr: List[int], target: int) -> Optional[int]:
    """Interpolation Search - O(log log n) cho dữ liệu phân bố đều"""
    left, right = 0, len(arr) - 1

    while left <= right and target >= arr[left] and target <= arr[right]:
        if left == right:
            return left if arr[left] == target else None

        # Tính vị trí interpolation
        pos = left + int(((target - arr[left]) / (arr[right] - arr[left])) * (right - left))

        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            left = pos + 1
        else:
            right = pos - 1

    return None

def jump_search(arr: List[int], target: int) -> Optional[int]:
    """Jump Search - O(√n)"""
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0

    # Tìm block chứa target
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return None

    # Linear search trong block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return None

    return prev if arr[prev] == target else None

def exponential_search(arr: List[int], target: int) -> Optional[int]:
    """Exponential Search - O(log n)"""
    n = len(arr)
    if n == 0:
        return None
    if arr[0] == target:
        return 0

    # Tìm range cho binary search
    i = 1
    while i < n and arr[i] <= target:
        i *= 2

    # Binary search trong range [i//2, min(i, n-1)]
    return binary_search_range(arr, target, i // 2, min(i, n - 1))

def binary_search_range(arr: List[int], target: int, left: int, right: int) -> Optional[int]:
    """Binary search trong một range cụ thể"""
    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return None

def ternary_search(arr: List[int], target: int) -> Optional[int]:
    """Ternary Search - O(log₃ n)"""
    left, right = 0, len(arr) - 1

    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3

        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2

        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1

    return None

def fibonacci_search(arr: List[int], target: int) -> Optional[int]:
    """Fibonacci Search - O(log n)"""
    n = len(arr)
    fib2, fib1 = 0, 1  # Fibonacci numbers
    fib = fib2 + fib1

    # Tìm Fibonacci nhỏ nhất >= n
    while fib < n:
        fib2, fib1 = fib1, fib
        fib = fib2 + fib1

    offset = -1

    while fib > 1:
        i = min(offset + fib2, n - 1)

        if arr[i] < target:
            fib, fib1, fib2 = fib1, fib2, fib - fib1
            offset = i
        elif arr[i] > target:
            fib, fib1, fib2 = fib2, fib1 - fib2, fib - fib1
        else:
            return i

    # Kiểm tra phần tử cuối cùng
    if fib1 and offset + 1 < n and arr[offset + 1] == target:
        return offset + 1

    return None

def sentinal_search(arr: List[int], target: int) -> Optional[int]:
    """Sentinal Linear Search - O(n) nhưng ít so sánh hơn"""
    n = len(arr)
    if n == 0:
        return None

    # Lưu giá trị cuối cùng
    last = arr[n - 1]

    # Đặt sentinal
    arr[n - 1] = target

    i = 0
    while arr[i] != target:
        i += 1

    # Khôi phục giá trị cuối cùng
    arr[n - 1] = last

    # Kiểm tra kết quả
    if i < n - 1 or arr[n - 1] == target:
        return i
    else:
        return None

def meta_binary_search(arr: List[int], target: int) -> Optional[int]:
    """Meta Binary Search - sử dụng bit manipulation"""
    n = len(arr)
    if n == 0:
        return None

    # Tìm power of 2 lớn nhất <= n
    lg = 0
    while (1 << lg) <= n:
        lg += 1
    lg -= 1

    pos = 0
    for i in range(lg, -1, -1):
        if pos + (1 << i) < n and arr[pos + (1 << i)] <= target:
            pos += (1 << i)

    return pos if arr[pos] == target else None

def hash_search(arr: List[int], target: int) -> Optional[int]:
    """Hash-based search - O(1) average, O(n) worst case"""
    # Tạo hash table từ mảng
    hash_table = {value: index for index, value in enumerate(arr)}
    return hash_table.get(target)

def benchmark_search_algorithms(arr: List[int], target: int):
    """So sánh hiệu suất các thuật toán tìm kiếm"""
    import time

    algorithms = [
        ("Linear Search", linear_search),
        ("Binary Search", binary_search),
        ("Interpolation Search", interpolation_search),
        ("Jump Search", jump_search),
        ("Exponential Search", exponential_search),
        ("Ternary Search", ternary_search),
        ("Fibonacci Search", fibonacci_search),
        ("Hash Search", hash_search),
    ]

    results = []

    for name, func in algorithms:
        start_time = time.time()
        result = func(arr.copy(), target)  # Copy để tránh thay đổi mảng gốc
        end_time = time.time()

        duration = (end_time - start_time) * 1000000  # microseconds
        results.append((name, result, duration))

    return results

# Ví dụ sử dụng
if __name__ == "__main__":
    arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    target = 7

    print(f"Array: {arr}")
    print(f"Searching for: {target}\n")

    # Test các thuật toán
    algorithms = [
        ("Binary Search", binary_search),
        ("Linear Search", linear_search),
        ("Interpolation Search", interpolation_search),
        ("Jump Search", jump_search),
        ("Exponential Search", exponential_search),
        ("Ternary Search", ternary_search),
        ("Fibonacci Search", fibonacci_search),
        ("Hash Search", hash_search),
    ]

    for name, func in algorithms:
        result = func(arr, target)
        print(f"{name}: {f'Found at index {result}' if result is not None else 'Not found'}")

    # Sử dụng bisect module của Python
    print("\nUsing Python's bisect module:")
    index = bisect.bisect_left(arr, target)
    if index < len(arr) and arr[index] == target:
        print(f"bisect_left: Found at index {index}")
    else:
        print("bisect_left: Not found")

    # Benchmark
    print("\nBenchmark results:")
    results = benchmark_search_algorithms(arr, target)
    for name, result, duration in results:
        status = f"Found at index {result}" if result is not None else "Not found"
        print(f"{name}: {status} ({duration:.2f} μs)")

    # Tìm kiếm với từ khóa trong chuỗi
    def string_search_example():
        text = "Hello, this is a sample text for searching"
        pattern = "sample"

        # Boyer-Moore-like approach
        def simple_string_search(text: str, pattern: str) -> List[int]:
            positions = []
            start = 0
            while True:
                pos = text.find(pattern, start)
                if pos != -1:
                    positions.append(pos)
                    start = pos + 1
                else:
                    break
            return positions

        positions = simple_string_search(text, pattern)
        print(f"\nString search example:")
        print(f"Text: {text}")
        print(f"Pattern: '{pattern}'")
        print(f"Found at positions: {positions}")

    string_search_example()

    # Tìm kiếm 2D
    def search_2d_matrix(matrix: List[List[int]], target: int) -> bool:
        """Tìm kiếm trong ma trận đã sắp xếp"""
        if not matrix or not matrix[0]:
            return False

        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1

        while left <= right:
            mid = (left + right) // 2
            mid_value = matrix[mid // n][mid % n]

            if mid_value == target:
                return True
            elif mid_value < target:
                left = mid + 1
            else:
                right = mid - 1

        return False

    # Test 2D search
    matrix = [
        [1,  4,  7,  11],
        [2,  5,  8,  12],
        [3,  6,  9,  16],
        [10, 13, 14, 17]
    ]
    target_2d = 5
    found_2d = search_2d_matrix(matrix, target_2d)
    print(f"\n2D Matrix search for {target_2d}: {'Found' if found_2d else 'Not found'}")`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
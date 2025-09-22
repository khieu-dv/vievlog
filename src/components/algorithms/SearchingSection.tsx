"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function SearchingSection() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");
  const [customArray, setCustomArray] = useState<string>("1,3,5,7,9,11,13,15,17,19");
  const [currentArray, setCurrentArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [algorithm, setAlgorithm] = useState<"linear" | "binary" | "interpolation" | "jump" | "exponential" | "ternary">("binary");
  const [wasm, setWasm] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);

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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
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
}`}
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
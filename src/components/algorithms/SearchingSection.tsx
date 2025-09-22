"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

export function SearchingSection() {
  const [searchArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");
  const [searchSteps, setSearchSteps] = useState<string[]>([]);
  const [customArray, setCustomArray] = useState<string>("1,3,5,7,9,11,13,15,17,19");
  const [currentArray, setCurrentArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);

  const updateArray = () => {
    try {
      const newArray = customArray.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      newArray.sort((a, b) => a - b); // Ensure sorted for binary search
      setCurrentArray(newArray);
      setSearchResult("");
      setSearchSteps([]);
    } catch (error) {
      setSearchResult("Mảng không hợp lệ");
    }
  };

  const binarySearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      setSearchResult("Vui lòng nhập một số hợp lệ");
      return;
    }

    const steps: string[] = [];
    let left = 0;
    let right = currentArray.length - 1;
    let iterations = 0;

    steps.push(`Bắt đầu: Tìm ${target} trong mảng [${currentArray.join(", ")}]`);
    steps.push(`Khởi tạo: left = ${left}, right = ${right}`);

    while (left <= right) {
      iterations++;
      const mid = Math.floor((left + right) / 2);
      steps.push(`Lần ${iterations}: mid = ${mid}, arr[${mid}] = ${currentArray[mid]}`);

      if (currentArray[mid] === target) {
        steps.push(`Tìm thấy! ${target} ở vị trí ${mid}`);
        setSearchResult(`Tìm thấy ${target} ở vị trí ${mid} sau ${iterations} lần so sánh`);
        setSearchSteps(steps);
        return;
      } else if (currentArray[mid] < target) {
        left = mid + 1;
        steps.push(`${currentArray[mid]} < ${target}, tìm phần phải: left = ${left}`);
      } else {
        right = mid - 1;
        steps.push(`${currentArray[mid]} > ${target}, tìm phần trái: right = ${right}`);
      }
    }

    steps.push(`Không tìm thấy ${target} trong mảng`);
    setSearchResult(`Không tìm thấy ${target} sau ${iterations} lần so sánh`);
    setSearchSteps(steps);
  };

  const linearSearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      setSearchResult("Vui lòng nhập một số hợp lệ");
      return;
    }

    const steps: string[] = [];
    steps.push(`Bắt đầu: Tìm ${target} trong mảng [${currentArray.join(", ")}]`);

    for (let i = 0; i < currentArray.length; i++) {
      steps.push(`Lần ${i + 1}: Kiểm tra arr[${i}] = ${currentArray[i]}`);

      if (currentArray[i] === target) {
        steps.push(`Tìm thấy! ${target} ở vị trí ${i}`);
        setSearchResult(`Tìm thấy ${target} ở vị trí ${i} sau ${i + 1} lần so sánh (Tìm kiếm tuyến tính)`);
        setSearchSteps(steps);
        return;
      }
    }

    steps.push(`Không tìm thấy ${target} trong mảng`);
    setSearchResult(`Không tìm thấy ${target} sau ${currentArray.length} lần so sánh (Tìm kiếm tuyến tính)`);
    setSearchSteps(steps);
  };

  const interpolationSearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      setSearchResult("Vui lòng nhập một số hợp lệ");
      return;
    }

    const steps: string[] = [];
    let left = 0;
    let right = currentArray.length - 1;
    let iterations = 0;

    steps.push(`Bắt đầu: Tìm ${target} bằng Interpolation Search`);
    steps.push(`Mảng: [${currentArray.join(", ")}]`);

    while (left <= right && target >= currentArray[left] && target <= currentArray[right]) {
      iterations++;

      if (left === right) {
        if (currentArray[left] === target) {
          steps.push(`Tìm thấy! ${target} ở vị trí ${left}`);
          setSearchResult(`Tìm thấy ${target} ở vị trí ${left} sau ${iterations} lần so sánh (Interpolation Search)`);
        } else {
          steps.push(`Không tìm thấy ${target}`);
          setSearchResult(`Không tìm thấy ${target} sau ${iterations} lần so sánh (Interpolation Search)`);
        }
        setSearchSteps(steps);
        return;
      }

      // Interpolation formula
      const pos = left + Math.floor(((target - currentArray[left]) / (currentArray[right] - currentArray[left])) * (right - left));
      const safePpos = Math.max(left, Math.min(right, pos));

      steps.push(`Lần ${iterations}: Ước tính vị trí = ${safePpos}, arr[${safePpos}] = ${currentArray[safePpos]}`);

      if (currentArray[safePpos] === target) {
        steps.push(`Tìm thấy! ${target} ở vị trí ${safePpos}`);
        setSearchResult(`Tìm thấy ${target} ở vị trí ${safePpos} sau ${iterations} lần so sánh (Interpolation Search)`);
        setSearchSteps(steps);
        return;
      }

      if (currentArray[safePpos] < target) {
        left = safePpos + 1;
        steps.push(`${currentArray[safePpos]} < ${target}, tìm phần phải`);
      } else {
        right = safePpos - 1;
        steps.push(`${currentArray[safePpos]} > ${target}, tìm phần trái`);
      }
    }

    steps.push(`Không tìm thấy ${target}`);
    setSearchResult(`Không tìm thấy ${target} sau ${iterations} lần so sánh (Interpolation Search)`);
    setSearchSteps(steps);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Giải Thuật Tìm Kiếm
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Giải thuật tìm kiếm tìm vị trí của giá trị mục tiêu trong cấu trúc dữ liệu.
        </p>

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
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập số cần tìm"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={binarySearch}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Tìm kiếm nhị phân
              </button>
              <button
                onClick={linearSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tìm kiếm tuyến tính
              </button>
              <button
                onClick={interpolationSearch}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Interpolation Search
              </button>
            </div>

            {searchResult && (
              <div className="mb-3 p-3 bg-gray-200 dark:bg-slate-600 rounded">
                <strong>Kết quả:</strong> {searchResult}
              </div>
            )}

            {searchSteps.length > 0 && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <strong>Các bước thực hiện:</strong>
                <ol className="mt-2 text-sm space-y-1">
                  {searchSteps.map((step, index) => (
                    <li key={index} className="list-decimal list-inside">
                      {step}
                    </li>
                  ))}
                </ol>
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
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Binary Search - O(log n) - yêu cầu mảng đã sắp xếp
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
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
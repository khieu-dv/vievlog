"use client";

import { useState } from "react";
import { Layout } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { SmartCodeRunner } from "~/components/common/SmartCodeRunner";
import { EditableCodeEditor } from "~/components/common/EditableCodeEditor";

export function ArraysSection() {
  const [vector, setVector] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");
  const [activeSection, setActiveSection] = useState<"overview" | "interactive" | "implementation">("overview");

  // Interactive visualization states
  const [animationArray, setAnimationArray] = useState<number[]>([10, 25, 8, 42, 15, 33]);
  const [searchValue, setSearchValue] = useState("");
  const [accessIndex, setAccessIndex] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Code running states
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(false);

  // Code storage for different languages
  const [codeState, setCodeState] = useState({
    rust: `fn main() {
    println!("=== Vector Demo trong Rust ===");

    // Vector trong Rust - An toàn bộ nhớ và nhanh chóng
    let mut vec = Vec::new();

    // Thêm phần tử
    println!("Thêm các phần tử: 1, 2, 3");
    vec.push(1);
    vec.push(2);
    vec.push(3);

    println!("Vector ban đầu: {:?}", vec);
    println!("Kích thước: {}", vec.len());

    // Truy cập an toàn
    match vec.get(0) {
        Some(value) => println!("Phần tử đầu: {}", value),
        None => println!("Index không tồn tại"),
    }

    // Tìm kiếm phần tử
    let target = 2;
    match vec.iter().position(|&x| x == target) {
        Some(index) => println!("Tìm thấy phần tử {} tại vị trí: {}", target, index),
        None => println!("Không tìm thấy phần tử {}", target),
    }

    // Duyệt qua vector
    println!("Duyệt vector:");
    for (index, value) in vec.iter().enumerate() {
        println!("  vec[{}] = {}", index, value);
    }

    // Xóa phần tử cuối
    if let Some(last) = vec.pop() {
        println!("Đã xóa phần tử cuối: {}", last);
    }

    println!("Vector sau khi xóa: {:?}", vec);
    println!("Kích thước sau khi xóa: {}", vec.len());

    // Thêm thêm phần tử
    vec.push(0);
    println!("Thêm phần tử 0 vào cuối:");
    println!("Vector cuối cùng: {:?}", vec);

    // Vector với dung lượng định trước
    let vec_with_capacity: Vec<i32> = Vec::with_capacity(10);
    println!("Vector với capacity 10: {:?}", vec_with_capacity);
    println!("Kích thước: {}, Capacity: {}", vec_with_capacity.len(), vec_with_capacity.capacity());
}`,
    cpp: `#include <vector>
#include <iostream>
#include <algorithm>

int main() {
    std::cout << "=== Vector Demo trong C++ ===" << std::endl;

    // Vector trong C++ - Hiệu quả và linh hoạt
    std::vector<int> vec;

    // Thêm phần tử
    std::cout << "Thêm các phần tử: 1, 2, 3" << std::endl;
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(3);

    std::cout << "Vector ban đầu: ";
    for (const auto& value : vec) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
    std::cout << "Kích thước: " << vec.size() << std::endl;

    // Truy cập an toàn
    if (vec.size() > 0) {
        std::cout << "Phần tử đầu: " << vec[0] << std::endl;
    }

    // Tìm kiếm phần tử
    int target = 2;
    auto it = std::find(vec.begin(), vec.end(), target);
    if (it != vec.end()) {
        std::cout << "Tìm thấy phần tử " << target << " tại vị trí: " << std::distance(vec.begin(), it) << std::endl;
    } else {
        std::cout << "Không tìm thấy phần tử " << target << std::endl;
    }

    // Duyệt qua vector
    std::cout << "Duyệt vector:" << std::endl;
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << "  vec[" << i << "] = " << vec[i] << std::endl;
    }

    // Xóa phần tử cuối
    if (!vec.empty()) {
        int last = vec.back();
        vec.pop_back();
        std::cout << "Đã xóa phần tử cuối: " << last << std::endl;
    }

    std::cout << "Vector sau khi xóa: ";
    for (const auto& value : vec) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
    std::cout << "Kích thước sau khi xóa: " << vec.size() << std::endl;

    // Thêm thêm phần tử
    vec.push_back(0);
    std::cout << "Thêm phần tử 0 vào cuối:" << std::endl;
    std::cout << "Vector cuối cùng: ";
    for (const auto& value : vec) {
        std::cout << value << " ";
    }
    std::cout << std::endl;

    // Vector với capacity định trước
    std::vector<int> vec_with_capacity;
    vec_with_capacity.reserve(10);
    std::cout << "Vector với capacity 10: ";
    for (const auto& value : vec_with_capacity) {
        std::cout << value << " ";
    }
    if (vec_with_capacity.empty()) std::cout << "(rỗng)";
    std::cout << std::endl;
    std::cout << "Kích thước: " << vec_with_capacity.size() << ", Capacity: " << vec_with_capacity.capacity() << std::endl;

    return 0;
}`,
    python: `def main():
    print("=== List Demo trong Python ===")

    # List trong Python - Linh hoạt và dễ sử dụng
    vec = []

    # Thêm phần tử
    print("Thêm các phần tử: 1, 2, 3")
    vec.append(1)
    vec.append(2)
    vec.append(3)

    print(f"List ban đầu: {vec}")
    print(f"Kích thước: {len(vec)}")

    # Truy cập an toàn
    if len(vec) > 0:
        print(f"Phần tử đầu: {vec[0]}")

    # Tìm kiếm phần tử
    target = 2
    try:
        index = vec.index(target)
        print(f"Tìm thấy phần tử {target} tại vị trí: {index}")
    except ValueError:
        print(f"Không tìm thấy phần tử {target}")

    # Duyệt qua list
    print("Duyệt list:")
    for index, value in enumerate(vec):
        print(f"  vec[{index}] = {value}")

    # Xóa phần tử cuối
    if vec:
        last = vec.pop()
        print(f"Đã xóa phần tử cuối: {last}")

    print(f"List sau khi xóa: {vec}")
    print(f"Kích thước sau khi xóa: {len(vec)}")

    # Thêm thêm phần tử
    vec.append(0)
    print("Thêm phần tử 0 vào cuối:")
    print(f"List cuối cùng: {vec}")

    # List với capacity (pre-allocation)
    vec_with_capacity = [None] * 10  # Pre-allocate 10 elements
    vec_with_capacity = []  # Reset to empty
    print(f"List với pre-allocation: {vec_with_capacity}")
    print(f"Kích thước: {len(vec_with_capacity)}, Capacity: (dynamic)")

    # Tính năng đặc biệt của Python
    print("\\nTính năng mạnh mẽ của Python:")
    # List comprehension
    squares = [x**2 for x in vec]
    print(f"Bình phương các phần tử: {squares}")

    # Slicing
    if len(vec) >= 2:
        subset = vec[0:2]
        print(f"Slice [0:2]: {subset}")

if __name__ == "__main__":
    main()`
  });

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setVector([...vector, value]);
      setInputValue("");
    }
  };

  const handlePop = () => {
    setVector(vector.slice(0, -1));
  };

  // Animation functions
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateAccess = async () => {
    const index = parseInt(accessIndex);
    if (isNaN(index) || index < 0 || index >= animationArray.length) {
      setAnimationStep("❌ Chỉ số không hợp lệ!");
      return;
    }

    setIsAnimating(true);
    setAnimationStep(`🔍 Truy cập phần tử tại index ${index}...`);

    // Highlight the accessed element
    setHighlightedIndex(index);
    await sleep(1000);

    setAnimationStep(`✅ Giá trị tại index ${index} là: ${animationArray[index]} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateSearch = async () => {
    const searchVal = parseInt(searchValue);
    if (isNaN(searchVal)) {
      setAnimationStep("❌ Giá trị tìm kiếm không hợp lệ!");
      return;
    }

    setIsAnimating(true);
    setAnimationStep(`🔍 Bắt đầu tìm kiếm giá trị ${searchVal}...`);
    await sleep(1000);

    // Linear search animation
    for (let i = 0; i < animationArray.length; i++) {
      setHighlightedIndex(i);
      setAnimationStep(`🔍 Kiểm tra index ${i}: ${animationArray[i]} ${animationArray[i] === searchVal ? '= ✅' : '≠'} ${searchVal}`);
      await sleep(800);

      if (animationArray[i] === searchVal) {
        setAnimationStep(`🎉 Tìm thấy ${searchVal} tại index ${i}! (Độ phức tạp: O(n))`);
        await sleep(2000);
        setHighlightedIndex(null);
        setIsAnimating(false);
        return;
      }
    }

    setAnimationStep(`❌ Không tìm thấy ${searchVal} trong mảng! (Đã kiểm tra ${animationArray.length} phần tử)`);
    await sleep(2000);
    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateInsert = async () => {
    const newValue = parseInt(inputValue);
    if (isNaN(newValue)) return;

    setIsAnimating(true);
    setAnimationStep(`➕ Thêm ${newValue} vào cuối mảng...`);

    // Show the new element being added
    setAnimationArray([...animationArray, newValue]);
    setHighlightedIndex(animationArray.length);
    await sleep(1000);

    setAnimationStep(`✅ Đã thêm ${newValue}! Kích thước mảng: ${animationArray.length + 1} (Độ phức tạp: O(1) amortized)`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
    setInputValue("");
  };

  const animateRemove = async () => {
    if (animationArray.length === 0) {
      setAnimationStep("❌ Mảng đã rỗng!");
      return;
    }

    setIsAnimating(true);
    const lastIndex = animationArray.length - 1;
    const removedValue = animationArray[lastIndex];

    setHighlightedIndex(lastIndex);
    setAnimationStep(`➖ Xóa phần tử cuối: ${removedValue}...`);
    await sleep(1000);

    setAnimationArray(animationArray.slice(0, -1));
    setAnimationStep(`✅ Đã xóa ${removedValue}! Kích thước mảng: ${animationArray.length - 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const resetArray = () => {
    setAnimationArray([10, 25, 8, 42, 15, 33]);
    setHighlightedIndex(null);
    setAnimationStep("");
  };

  // Code running functions
  const getLanguageId = (lang: string): number => {
    const languageMap: Record<string, number> = {
      rust: 73,
      cpp: 54,
      python: 71,
    };
    return languageMap[lang] || 54;
  };

  const getCurrentCode = (): string => {
    return codeState[activeLanguageTab as keyof typeof codeState] || "";
  };

  const updateCode = (newCode: string) => {
    setCodeState(prev => ({
      ...prev,
      [activeLanguageTab]: newCode
    }));
  };

  const handleRunCode = async (input: string) => {
    setIsRunningCode(true);
    setCodeOutput("Đang chạy code...");
    setShowOutput(true);

    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: getCurrentCode(),
          language_id: getLanguageId(activeLanguageTab),
          stdin: input
        }),
      });

      const result = await response.json();

      if (result.error) {
        setCodeOutput(`Lỗi: ${result.error}`);
      } else if (result.logs && result.logs.length > 0) {
        setCodeOutput(result.logs.join('\n'));
      } else {
        setCodeOutput('Code chạy thành công nhưng không có output.');
      }
    } catch (error) {
      setCodeOutput(`Lỗi kết nối: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section with Navigation Pills */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Layout className="h-6 w-6 text-blue-500" />
              Mảng & Vector
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-2xl">
              Khám phá cấu trúc dữ liệu cơ bản nhất - từ mảng tĩnh đến vector động với các minh họa tương tác.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-600">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "overview"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              📚 Tổng quan
            </button>
            <button
              onClick={() => setActiveSection("interactive")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "interactive"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              🎮 Tương tác
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "implementation"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              💻 Cài đặt
            </button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Array Definition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                📊
              </div>
              <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Mảng (Array)</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Cấu trúc dữ liệu cơ bản nhất, lưu trữ các phần tử cùng kiểu trong bộ nhớ liên tiếp.
              Mỗi phần tử có một chỉ số (index) bắt đầu từ 0.
            </p>

            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  ✅ Ưu điểm
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Truy cập siêu nhanh O(1)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Tiết kiệm bộ nhớ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Duyệt tuần tự hiệu quả
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                  ❌ Nhược điểm
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Kích thước cố định
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Chèn/xóa giữa chậm O(n)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Phải biết trước kích thước
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vector Definition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-purple-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                🔧
              </div>
              <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">Vector (Mảng Động)</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Phiên bản cải tiến của mảng, có thể tự động thay đổi kích thước.
              Khi hết chỗ, vector sẽ tự động cấp phát bộ nhớ mới.
            </p>

            {/* Complexity Table */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border">
              <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200 text-sm">Độ phức tạp thời gian</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Truy cập:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Tìm kiếm:</span>
                  <span className="font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">O(n)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Thêm cuối:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)*</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Xóa cuối:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">* amortized</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Section */}
      {activeSection === "interactive" && (
        <div className="space-y-6">
          {/* Interactive Array Visualization */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm">
                🎮
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">
                  Minh Họa Tương Tác
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thao tác trực tiếp với mảng để hiểu rõ cách hoạt động
                </p>
              </div>
            </div>

            {/* Array Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-6 overflow-x-auto pb-4">
                <div className="flex items-center gap-2 min-w-max">
                  {animationArray.map((value, index) => (
                    <div key={`${index}-${value}`} className="flex flex-col items-center group">
                      {/* Index label */}
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 h-4">
                        {index}
                      </div>
                      {/* Array element */}
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all duration-500 font-bold text-lg cursor-pointer ${
                          highlightedIndex === index
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 border-red-500 scale-110 shadow-xl animate-pulse text-white"
                            : "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border-blue-300 dark:border-blue-600 hover:scale-105 hover:shadow-md group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-700 dark:group-hover:to-indigo-700"
                        }`}
                      >
                        {value}
                      </div>
                      {/* Memory address visual */}
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        0x{(1000 + index * 4).toString(16)}
                      </div>
                    </div>
                  ))}
                  {animationArray.length === 0 && (
                    <div className="text-gray-500 italic text-center p-8 bg-gray-50 dark:bg-slate-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-2xl mb-1">📭</div>
                      <div className="text-sm font-semibold mb-1">Mảng rỗng</div>
                      <div className="text-xs">Hãy thêm phần tử để bắt đầu</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Animation status */}
              {animationStep && (
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 mb-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className={isAnimating ? "animate-spin" : ""}>⚡</div>
                    <div className="font-semibold text-orange-800 dark:text-orange-300 text-lg">
                      {animationStep}
                    </div>
                  </div>
                </div>
              )}

              {/* Array info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">📏</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Kích thước</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{animationArray.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">🔢</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Index từ</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        0 → {Math.max(0, animationArray.length - 1)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">💾</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bộ nhớ</div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {animationArray.length * 4} bytes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Access by Index */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <div>
                    <h5 className="font-bold text-green-700 dark:text-green-400 text-sm">Truy Cập</h5>
                    <p className="text-xs text-green-600 dark:text-green-500 font-mono">O(1)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={accessIndex}
                    onChange={(e) => setAccessIndex(e.target.value)}
                    placeholder={`Nhập index (0-${animationArray.length - 1})`}
                    min="0"
                    max={animationArray.length - 1}
                    className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateAccess}
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔍 Truy cập
                  </button>
                </div>
              </div>

              {/* Linear Search */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🔎
                  </div>
                  <div>
                    <h5 className="font-bold text-blue-700 dark:text-blue-400 text-sm">Tìm Kiếm</h5>
                    <p className="text-xs text-blue-600 dark:text-blue-500 font-mono">O(n)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Nhập giá trị cần tìm"
                    className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateSearch}
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm rounded-md hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔎 Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Insert */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-purple-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <div>
                    <h5 className="font-bold text-purple-700 dark:text-purple-400 text-sm">Thêm</h5>
                    <p className="text-xs text-purple-600 dark:text-purple-500 font-mono">O(1)*</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập giá trị mới"
                    className="w-full px-3 py-2 border-2 border-purple-200 dark:border-purple-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateInsert}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➕ Thêm cuối
                  </button>
                </div>
              </div>

              {/* Remove and Reset */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🛠️
                  </div>
                  <div>
                    <h5 className="font-bold text-red-700 dark:text-red-400 text-sm">Điều Khiển</h5>
                    <p className="text-xs text-red-600 dark:text-red-500">Quản lý mảng</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={animateRemove}
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➖ Xóa cuối
                  </button>
                  <button
                    onClick={resetArray}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-medium text-sm rounded-md hover:from-gray-600 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Operation Explanations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    ⚡
                  </div>
                  <h6 className="font-bold text-green-700 dark:text-green-300">Truy cập O(1)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Có thể truy cập trực tiếp bất kỳ phần tử nào thông qua index, không phụ thuộc vào kích thước mảng.
                  Địa chỉ = base_address + (index × element_size)
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    🔍
                  </div>
                  <h6 className="font-bold text-blue-700 dark:text-blue-300">Tìm kiếm O(n)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Phải duyệt từng phần tử một cho đến khi tìm thấy hoặc hết mảng.
                  Trường hợp xấu nhất: kiểm tra tất cả n phần tử.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Memory Layout */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-600 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-white">
                💾
              </div>
              <div>
                <h4 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                  Bố Trí Bộ Nhớ
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Hiểu cách mảng được lưu trữ trong bộ nhớ
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-xl border">
              <MermaidDiagram
                chart={`
                  graph LR
                      subgraph "Mảng Tĩnh"
                          A["arr[0]: 10<br/>0x1000"] --> B["arr[1]: 20<br/>0x1004"] --> C["arr[2]: 30<br/>0x1008"] --> D["arr[3]: 40<br/>0x100C"]
                      end

                      subgraph "Vector (Mảng Động)"
                          E["vec[0]: 10<br/>0x2000"] --> F["vec[1]: 20<br/>0x2004"] --> G["vec[2]: 30<br/>0x2008"] --> H["vec[3]: 40<br/>0x200C"] --> I["capacity: 8<br/>reserved"]
                          style I fill:#e1f5fe
                      end

                      J["push()"] -.-> I
                      K["pop()"] -.-> H
                `}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Implementation Section */}
      {activeSection === "implementation" && (
        <div className="space-y-6">
          {/* Simple Vector Demo */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-sm">
                🧪
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
                  Vector Tương Tác Đơn Giản
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thử nghiệm nhanh với vector cơ bản
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập số"
                  className="flex-1 px-4 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 transition-all"
                />
                <button
                  onClick={handlePush}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  ➕ Thêm
                </button>
                <button
                  onClick={handlePop}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 transition-all"
                >
                  ➖ Xóa
                </button>
              </div>

              <div className="flex gap-2 flex-wrap min-h-[60px] items-center">
                {vector.map((value, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-600 rounded-lg text-center font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    {value}
                  </div>
                ))}
                {vector.length === 0 && (
                  <div className="text-gray-500 italic text-center flex-1 py-4">
                    📭 Vector rỗng - Hãy thêm phần tử
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-green-700 dark:text-green-300">
                <strong>Kích thước hiện tại:</strong> {vector.length} phần tử
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm">
                💻
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">
                  Cài Đặt Chi Tiết
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Mã nguồn trong các ngôn ngữ phổ biến
                </p>
              </div>
            </div>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveLanguageTab("rust")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "rust"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  🦀 Rust
                </button>
                <button
                  onClick={() => setActiveLanguageTab("cpp")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "cpp"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  ⚡ C++
                </button>
                <button
                  onClick={() => setActiveLanguageTab("python")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "python"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  🐍 Python
                </button>
              </div>
            </div>

            {/* Editable Code */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded ${
                    activeLanguageTab === "rust" ? "bg-orange-100 dark:bg-orange-900/30" :
                    activeLanguageTab === "cpp" ? "bg-blue-100 dark:bg-blue-900/30" :
                    "bg-green-100 dark:bg-green-900/30"
                  }`}>
                    {activeLanguageTab === "rust" ? "🦀" :
                     activeLanguageTab === "cpp" ? "⚡" : "🐍"}
                  </div>
                  <h5 className={`text-lg font-bold ${
                    activeLanguageTab === "rust" ? "text-orange-700 dark:text-orange-300" :
                    activeLanguageTab === "cpp" ? "text-blue-700 dark:text-blue-300" :
                    "text-green-700 dark:text-green-300"
                  }`}>
                    {activeLanguageTab === "rust" ? "Vector trong Rust" :
                     activeLanguageTab === "cpp" ? "Vector trong C++" :
                     "List trong Python"}
                  </h5>
                </div>

                {/* Monaco Editor */}
                <div className="relative">
                  <EditableCodeEditor
                    code={getCurrentCode()}
                    onChange={updateCode}
                    language={activeLanguageTab}
                    height="400px"
                    theme="vs-dark"
                  />
                  <div className="absolute top-2 right-2 text-xs text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg z-10">
                    {activeLanguageTab.toUpperCase()} - Có thể chỉnh sửa
                  </div>
                </div>

                {/* Code Templates */}
                <div className="flex gap-2 flex-wrap items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        const defaultCode = codeState[activeLanguageTab as keyof typeof codeState];
                        updateCode(defaultCode);
                      }}
                      className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      🔄 Reset về mẫu gốc
                    </button>
                    <button
                      onClick={() => updateCode("")}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                    >
                      🗑️ Xóa tất cả
                    </button>

                    <div className="text-xs text-gray-500 flex items-center">
                      💡 Mẹo: Chỉnh sửa code và nhấn "▶️ Chạy Code" để xem kết quả
                    </div>
                  </div>

                  {/* Play Button */}
                  <SmartCodeRunner
                    code={getCurrentCode()}
                    language={activeLanguageTab}
                    onRun={handleRunCode}
                    isRunning={isRunningCode}
                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
                    buttonText="▶️ Chạy Code"
                  />
                </div>
              </div>
            </div>

            {/* Output Section */}
            {showOutput && (
              <div className="mt-6 bg-slate-900 dark:bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white">
                    📺
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white">Kết quả chạy</h5>
                    <p className="text-gray-400 text-sm">Output từ {activeLanguageTab} code</p>
                  </div>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-black rounded-lg p-4 border border-gray-600">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {codeOutput || "Chưa có output..."}
                  </pre>
                </div>
                {isRunningCode && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400">
                    <div className="animate-spin">⚙️</div>
                    <span className="text-sm">Đang thực thi code...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
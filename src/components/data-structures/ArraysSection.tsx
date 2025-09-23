"use client";

import { useState } from "react";
import { Layout } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";

export function ArraysSection() {
  const [vector, setVector] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Interactive visualization states
  const [animationArray, setAnimationArray] = useState<number[]>([10, 25, 8, 42, 15, 33]);
  const [searchValue, setSearchValue] = useState("");
  const [accessIndex, setAccessIndex] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Mảng Động (Vector)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📚 Mảng là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Mảng (Array)</strong> là cấu trúc dữ liệu cơ bản nhất, lưu trữ các phần tử cùng kiểu dữ liệu trong bộ nhớ liên tiếp.
            Mỗi phần tử có một chỉ số (index) bắt đầu từ 0.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">✅ Ưu điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Truy cập nhanh O(1)</li>
                <li>Tiết kiệm bộ nhớ</li>
                <li>Duyệt tuần tự hiệu quả</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-red-600 dark:text-red-400">❌ Nhược điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Kích thước cố định (mảng tĩnh)</li>
                <li>Chèn/xóa giữa chậm O(n)</li>
                <li>Phải biết trước kích thước</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">🔧 Vector (Mảng Động)</h4>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Vector</strong> là phiên bản cải tiến của mảng, có thể tự động thay đổi kích thước.
            Khi hết chỗ, vector sẽ tự động cấp phát bộ nhớ mới và sao chép dữ liệu.
          </p>
        </div>

        <div className="space-y-4">
          {/* Interactive Array Visualization */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
              🎮 Minh Họa Tương Tác - Thao Tác với Mảng
            </h4>

            {/* Array Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max">
                  {animationArray.map((value, index) => (
                    <div key={`${index}-${value}`} className="flex flex-col items-center">
                      {/* Index label */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 h-4">
                        {index}
                      </div>
                      {/* Array element */}
                      <div
                        className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-500 font-bold text-lg ${
                          highlightedIndex === index
                            ? "bg-yellow-400 border-red-500 scale-110 shadow-lg animate-pulse"
                            : "bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 hover:scale-105"
                        }`}
                      >
                        {value}
                      </div>
                      {/* Arrow between elements */}
                      {index < animationArray.length - 1 && (
                        <div className="absolute mt-8 ml-16 text-gray-400">→</div>
                      )}
                    </div>
                  ))}
                  {animationArray.length === 0 && (
                    <div className="text-gray-500 italic text-center p-8">
                      Mảng rỗng - Hãy thêm phần tử để bắt đầu
                    </div>
                  )}
                </div>
              </div>

              {/* Animation status */}
              {animationStep && (
                <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-3 mb-4">
                  <div className="font-medium text-orange-800 dark:text-orange-300">
                    {animationStep}
                  </div>
                </div>
              )}

              {/* Array info */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <strong>Kích thước:</strong> {animationArray.length}
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <strong>Index từ:</strong> 0 đến {Math.max(0, animationArray.length - 1)}
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <strong>Bộ nhớ:</strong> {animationArray.length * 4} bytes (int)
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Access by Index */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">🔍 Truy Cập (O(1))</h5>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={accessIndex}
                    onChange={(e) => setAccessIndex(e.target.value)}
                    placeholder="Nhập index"
                    min="0"
                    max={animationArray.length - 1}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateAccess}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Truy cập
                  </button>
                </div>
              </div>

              {/* Linear Search */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">🔎 Tìm Kiếm (O(n))</h5>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Nhập giá trị"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateSearch}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Insert */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">➕ Thêm (O(1))</h5>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập giá trị"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateInsert}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                  >
                    Thêm cuối
                  </button>
                </div>
              </div>

              {/* Remove and Reset */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">🛠️ Điều Khiển</h5>
                <div className="space-y-2">
                  <button
                    onClick={animateRemove}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    ➖ Xóa cuối
                  </button>
                  <button
                    onClick={resetArray}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Operation Explanations */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                <strong className="text-green-700 dark:text-green-300">Truy cập O(1):</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Có thể truy cập trực tiếp bất kỳ phần tử nào thông qua index, không phụ thuộc vào kích thước mảng.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <strong className="text-blue-700 dark:text-blue-300">Tìm kiếm O(n):</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Phải duyệt từng phần tử một cho đến khi tìm thấy hoặc hết mảng. Trường hợp xấu nhất: n lần so sánh.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Mảng & Vector:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Mảng Tĩnh"
                        A[0: 10] --> B[1: 20] --> C[2: 30] --> D[3: 40]
                    end

                    subgraph "Vector (Mảng Động)"
                        E[0: 10] --> F[1: 20] --> G[2: 30] --> H[3: 40] --> I[4: ...]
                        style I fill:#e1f5fe
                    end

                    J[push] -.-> I
                    K[pop] -.-> H
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Vector Tương Tác:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={handlePush}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Thêm
              </button>
              <button
                onClick={handlePop}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {vector.map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 border rounded text-center"
                >
                  {value}
                </div>
              ))}
              {vector.length === 0 && (
                <div className="text-gray-500 italic">Vector rỗng</div>
              )}
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
                code={`// Các thao tác với Vector trong Rust
let mut vec = Vec::new();
vec.push(1);
vec.push(2);
vec.push(3);
let last = vec.pop(); // Trả về Option<T>

// Truy cập theo chỉ số
let first = vec[0];
let second = vec.get(1); // Trả về Option<&T>

// Duyệt qua các phần tử
for item in &vec {
    println!("{}", item);
}`}
                height="200px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`// Các thao tác với Vector trong C++
#include <vector>
#include <iostream>

std::vector<int> vec;
vec.push_back(1);
vec.push_back(2);
vec.push_back(3);
vec.pop_back(); // Xóa phần tử cuối

// Truy cập theo chỉ số
int first = vec[0];
int second = vec.at(1); // An toàn hơn với kiểm tra bounds

// Duyệt qua các phần tử
for (const auto& item : vec) {
    std::cout << item << " ";
}

// Hoặc dùng iterator
for (auto it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << " ";
}`}
                height="200px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`# Các thao tác với List trong Python
vec = []
vec.append(1)
vec.append(2)
vec.append(3)
last = vec.pop()  # Xóa và trả về phần tử cuối

# Truy cập theo chỉ số
first = vec[0]
second = vec[1]

# Duyệt qua các phần tử
for item in vec:
    print(item)

# List comprehension
squared = [x**2 for x in vec]

# Slicing
subset = vec[0:2]  # Lấy từ index 0 đến 1

# Thêm nhiều phần tử
vec.extend([4, 5, 6])
# Hoặc
vec += [7, 8, 9]`}
                height="200px"
              />
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Truy cập:</strong> O(1)
              </div>
              <div>
                <strong>Tìm kiếm:</strong> O(n)
              </div>
              <div>
                <strong>Thêm vào cuối:</strong> O(1) amortized
              </div>
              <div>
                <strong>Xóa cuối:</strong> O(1)
              </div>
              <div>
                <strong>Thêm vào giữa:</strong> O(n)
              </div>
              <div>
                <strong>Xóa ở giữa:</strong> O(n)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
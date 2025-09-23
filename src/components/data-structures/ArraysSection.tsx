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
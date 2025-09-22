"use client";

import { useState } from "react";
import { Layout } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";

export function ArraysSection() {
  const [vector, setVector] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
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
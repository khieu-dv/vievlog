"use client";

import { useState } from "react";
import { Layout } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Mảng là tập hợp các phần tử liên tiếp trong bộ nhớ. Vector là mảng động có thể tăng giảm kích thước trong quá trình chạy.
        </p>

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
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Các thao tác với Vector trong Rust
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
            </pre>
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
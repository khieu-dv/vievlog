"use client";

import { Activity } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

export function ComplexitySection() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        So Sánh Độ Phức Tạp Giải Thuật
      </h3>

      {/* Định nghĩa và giải thích cơ bản */}
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 border-l-4 border-red-500">
        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">⏱️ Độ Phức Tạp là gì?</h4>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          <strong>Độ phức tạp (Complexity)</strong> đo lường tài nguyên cần thiết để chạy thuật toán:
          thời gian (Time) và không gian (Space). Giúp so sánh hiệu quả các thuật toán.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white dark:bg-slate-800 p-3 rounded">
            <strong className="text-blue-600 dark:text-blue-400">🕐 Time Complexity:</strong>
            <div className="mt-1 text-gray-600 dark:text-gray-300">
              Thời gian chạy tăng như thế nào khi input tăng?
              <br/>VD: O(n) = input gấp đôi → thời gian gấp đôi
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded">
            <strong className="text-green-600 dark:text-green-400">💾 Space Complexity:</strong>
            <div className="mt-1 text-gray-600 dark:text-gray-300">
              Bộ nhớ cần thêm khi input tăng?
              <br/>VD: O(1) = input tăng, bộ nhớ không đổi
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg mb-6 border-l-4 border-pink-500">
        <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">📊 Big O Notation:</h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
          <strong>Big O</strong> mô tả hiệu suất xấu nhất của thuật toán. Bỏ qua hằng số và tập trung vào tốc độ tăng trưởng.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center">
            <strong>O(1)</strong><br/>Tuyệt vời ✅
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded text-center">
            <strong>O(log n)</strong><br/>Rất tốt ✅
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded text-center">
            <strong>O(n)</strong><br/>Chấp nhận được ⚠️
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-2 rounded text-center">
            <strong>O(n²)</strong><br/>Chậm ❌
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Biểu Đồ Độ Phức Tạp Thời Gian:</h4>
        <MermaidDiagram
          chart={`
            graph TD
                subgraph "Độ Phức Tạp Thời Gian"
                    O1["O(1) - Hằng số"]
                    OLOG["O(log n) - Logarithm"]
                    ON["O(n) - Tuyến tính"]
                    ONLOG["O(n log n) - Quasi-linear"]
                    ON2["O(n²) - Bậc hai"]
                    ON3["O(n³) - Bậc ba"]

                    O1 --> OLOG
                    OLOG --> ON
                    ON --> ONLOG
                    ONLOG --> ON2
                    ON2 --> ON3
                end

                subgraph "Ví dụ Giải thuật"
                    O1 -.-> EX1["Array access<br/>Hash table lookup"]
                    OLOG -.-> EX2["Binary search<br/>Tree operations"]
                    ON -.-> EX3["Linear search<br/>Array traversal"]
                    ONLOG -.-> EX4["Merge sort<br/>Quick sort (avg)"]
                    ON2 -.-> EX5["Bubble sort<br/>Insertion sort"]
                    ON3 -.-> EX6["Matrix multiplication<br/>Triple nested loops"]
                end

                style O1 fill:#4CAF50,color:#fff
                style OLOG fill:#8BC34A,color:#fff
                style ON fill:#FFEB3B,color:#000
                style ONLOG fill:#FF9800,color:#fff
                style ON2 fill:#F44336,color:#fff
                style ON3 fill:#9C27B0,color:#fff
          `}
          className="mb-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
          <h4 className="font-medium mb-2">Cấu Trúc Dữ Liệu:</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cấu Trúc</th>
                  <th className="text-left py-2">Truy Cập</th>
                  <th className="text-left py-2">Tìm Kiếm</th>
                  <th className="text-left py-2">Thêm</th>
                  <th className="text-left py-2">Xóa</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-b">
                  <td className="py-2 font-medium">Array</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Linked List</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Binary Search Tree</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(log n)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Hash Table</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
          <h4 className="font-medium mb-2">Giải Thuật Sắp Xếp:</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Giải Thuật</th>
                  <th className="text-left py-2">Tốt Nhất</th>
                  <th className="text-left py-2">Trung Bình</th>
                  <th className="text-left py-2">Xấu Nhất</th>
                  <th className="text-left py-2">Bộ Nhớ</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-b">
                  <td className="py-2 font-medium">Sắp Xếp Nổi Bọt</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Sắp Xếp Nhanh</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(log n)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Sắp Xếp Trộn</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Heap Sort</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
          <h4 className="font-medium mb-2">Giải Thuật Tìm Kiếm:</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Giải Thuật</th>
                  <th className="text-left py-2">Tốt Nhất</th>
                  <th className="text-left py-2">Trung Bình</th>
                  <th className="text-left py-2">Xấu Nhất</th>
                  <th className="text-left py-2">Bộ Nhớ</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-b">
                  <td className="py-2 font-medium">Tìm Kiếm Nhị Phân</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Tìm Kiếm Tuyến Tính</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
          <h4 className="font-medium mb-2">Lời Khuyên Chọn Giải Thuật:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Dữ liệu nhỏ (n {"<"} 50):</strong> Giải thuật đơn giản như Bubble Sort, Linear Search
            </div>
            <div>
              <strong>Dữ liệu trung bình (50 ≤ n ≤ 10,000):</strong> Quick Sort, Binary Search
            </div>
            <div>
              <strong>Dữ liệu lớn (n {">"} 10,000):</strong> Merge Sort, Hash Table, Binary Search Tree
            </div>
            <div>
              <strong>Dữ liệu đã sắp xếp:</strong> Binary Search, Insertion Sort cho phần tử mới
            </div>
            <div>
              <strong>Bộ nhớ hạn chế:</strong> In-place algorithms (Quick Sort, Heap Sort)
            </div>
            <div>
              <strong>Yêu cầu ổn định:</strong> Merge Sort, Stable sorting algorithms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
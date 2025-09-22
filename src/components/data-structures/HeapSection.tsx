"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

export function HeapSection() {
  const [heap, setHeap] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [heapType, setHeapType] = useState<"max" | "min">("max");

  const insert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newHeap = [...heap, value];
      heapifyUp(newHeap, newHeap.length - 1);
      setHeap(newHeap);
      setResult(`Đã thêm ${value} vào ${heapType} heap. Kích thước: ${newHeap.length}`);
      setInputValue("");
    } else {
      setResult("Vui lòng nhập một số hợp lệ");
    }
  };

  const extractTop = () => {
    if (heap.length === 0) {
      setResult("Heap trống, không thể extract");
      return;
    }

    const newHeap = [...heap];
    const top = newHeap[0];

    if (newHeap.length === 1) {
      setHeap([]);
      setResult(`Đã extract ${top} (heap trống)`);
      return;
    }

    // Move last element to root and heapify down
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    heapifyDown(newHeap, 0);

    setHeap(newHeap);
    setResult(`Đã extract ${top} khỏi ${heapType} heap. Kích thước: ${newHeap.length}`);
  };

  const peek = () => {
    if (heap.length > 0) {
      const topValue = heap[0];
      setResult(`Phần tử ${heapType === "max" ? "lớn nhất" : "nhỏ nhất"}: ${topValue}`);
    } else {
      setResult("Heap trống");
    }
  };

  const clear = () => {
    setHeap([]);
    setResult("Đã xóa toàn bộ heap");
  };

  const toggleHeapType = () => {
    const newType = heapType === "max" ? "min" : "max";
    setHeapType(newType);
    if (heap.length > 0) {
      // Rebuild heap with new type
      const newHeap = [...heap];
      buildHeap(newHeap);
      setHeap(newHeap);
      setResult(`Đã chuyển sang ${newType} heap`);
    }
  };

  const compare = (a: number, b: number): boolean => {
    return heapType === "max" ? a > b : a < b;
  };

  const heapifyUp = (arr: number[], index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (!compare(arr[index], arr[parentIndex])) break;

      [arr[index], arr[parentIndex]] = [arr[parentIndex], arr[index]];
      index = parentIndex;
    }
  };

  const heapifyDown = (arr: number[], index: number) => {
    const length = arr.length;

    while (true) {
      let extremeIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < length && compare(arr[leftChild], arr[extremeIndex])) {
        extremeIndex = leftChild;
      }

      if (rightChild < length && compare(arr[rightChild], arr[extremeIndex])) {
        extremeIndex = rightChild;
      }

      if (extremeIndex === index) break;

      [arr[index], arr[extremeIndex]] = [arr[extremeIndex], arr[index]];
      index = extremeIndex;
    }
  };

  const buildHeap = (arr: number[]) => {
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapifyDown(arr, i);
    }
  };

  const heapSort = () => {
    if (heap.length <= 1) {
      setResult("Heap cần ít nhất 2 phần tử để sắp xếp");
      return;
    }

    const sortedArray = [...heap];
    const originalType = heapType;

    // Convert to max heap for sorting
    if (heapType === "min") {
      for (let i = Math.floor(sortedArray.length / 2) - 1; i >= 0; i--) {
        heapifyDownForSort(sortedArray, i, sortedArray.length, "max");
      }
    }

    // Heap sort
    for (let i = sortedArray.length - 1; i > 0; i--) {
      [sortedArray[0], sortedArray[i]] = [sortedArray[i], sortedArray[0]];
      heapifyDownForSort(sortedArray, 0, i, "max");
    }

    setResult(`Heap sort: [${sortedArray.join(", ")}] (${originalType} heap giữ nguyên)`);
  };

  const heapifyDownForSort = (arr: number[], index: number, heapSize: number, type: "max" | "min") => {
    while (true) {
      let extremeIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < heapSize) {
        const shouldSwap = type === "max" ? arr[leftChild] > arr[extremeIndex] : arr[leftChild] < arr[extremeIndex];
        if (shouldSwap) extremeIndex = leftChild;
      }

      if (rightChild < heapSize) {
        const shouldSwap = type === "max" ? arr[rightChild] > arr[extremeIndex] : arr[rightChild] < arr[extremeIndex];
        if (shouldSwap) extremeIndex = rightChild;
      }

      if (extremeIndex === index) break;

      [arr[index], arr[extremeIndex]] = [arr[extremeIndex], arr[index]];
      index = extremeIndex;
    }
  };

  const getTreeVisualization = () => {
    if (heap.length === 0) return "Heap trống";

    const levels: string[][] = [];
    let currentLevel = 0;
    let index = 0;

    while (index < heap.length) {
      const levelSize = Math.pow(2, currentLevel);
      const level: string[] = [];

      for (let i = 0; i < levelSize && index < heap.length; i++, index++) {
        level.push(heap[index].toString());
      }

      levels.push(level);
      currentLevel++;
    }

    return levels.map((level, levelIndex) => (
      <div key={levelIndex} className="text-center mb-2">
        <div className="flex justify-center gap-4">
          {level.map((value, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                levelIndex === 0
                  ? "border-red-500 bg-red-100 dark:bg-red-900/20"
                  : "border-blue-500 bg-blue-100 dark:bg-blue-900/20"
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Heap (Đống)
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Heap là cây nhị phân hoàn chỉnh thỏa mãn tính chất heap: mỗi node cha lớn hơn (max-heap) hoặc nhỏ hơn (min-heap) các node con.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Hình Heap:</h4>
            <div className="flex gap-2 mb-3">
              <button
                onClick={toggleHeapType}
                className={`px-4 py-2 rounded ${
                  heapType === "max"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {heapType.toUpperCase()} HEAP
              </button>
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                {heapType === "max" ? "Phần tử lớn nhất ở gốc" : "Phần tử nhỏ nhất ở gốc"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thao Tác Heap:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={insert}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Insert
              </button>
              <button
                onClick={extractTop}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Extract {heapType === "max" ? "Max" : "Min"}
              </button>
              <button
                onClick={peek}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Peek
              </button>
              <button
                onClick={heapSort}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Heap Sort
              </button>
              <button
                onClick={clear}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Trạng Thái Heap:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Loại:</strong> {heapType.toUpperCase()} Heap
              </p>
              <p className="text-sm">
                <strong>Kích thước:</strong> {heap.length}
              </p>
              <p className="text-sm">
                <strong>Mảng:</strong> [{heap.join(", ")}]
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <h5 className="font-medium mb-2">Cây Heap:</h5>
                <div className="min-h-[100px] flex flex-col justify-center">
                  {heap.length > 0 ? getTreeVisualization() : (
                    <div className="text-gray-500 text-center">Heap trống</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Heap:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    subgraph "Max Heap Example"
                        ROOT[50] --> LEFT1[30]
                        ROOT --> RIGHT1[40]
                        LEFT1 --> LEFT2[10]
                        LEFT1 --> RIGHT2[20]
                        RIGHT1 --> LEFT3[35]
                        RIGHT1 --> RIGHT3[25]
                    end

                    subgraph "Heap Operations"
                        INSERT[Insert] --> HEAPIFY_UP[Heapify Up]
                        EXTRACT[Extract] --> HEAPIFY_DOWN[Heapify Down]
                        HEAPIFY_UP --> PARENT_COMPARE[Compare with Parent]
                        HEAPIFY_DOWN --> CHILD_COMPARE[Compare with Children]
                    end

                    subgraph "Array Representation"
                        ARR0[Index 0: 50]
                        ARR1[Index 1: 30]
                        ARR2[Index 2: 40]
                        ARR3[Index 3: 10]
                        ARR4[Index 4: 20]
                        ARR5[Index 5: 35]
                        ARR6[Index 6: 25]
                    end

                    subgraph "Index Relations"
                        PARENT["Parent: (i-1)/2"]
                        LEFT_CHILD["Left Child: 2*i+1"]
                        RIGHT_CHILD["Right Child: 2*i+2"]
                    end

                    style ROOT fill:#FF5722,color:#fff
                    style INSERT fill:#4CAF50,color:#fff
                    style EXTRACT fill:#F44336,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Ứng Dụng Heap:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">Priority Queue:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Task scheduling</li>
                  <li>• Dijkstra's algorithm</li>
                  <li>• A* search algorithm</li>
                  <li>• Event simulation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">Heap Sort:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• O(n log n) guaranteed</li>
                  <li>• In-place sorting</li>
                  <li>• Memory efficient</li>
                  <li>• Not stable</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp Heap:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Thao Tác</th>
                    <th className="text-left py-2">Độ Phức Tạp</th>
                    <th className="text-left py-2">Mô Tả</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Insert</td>
                    <td className="py-2">O(log n)</td>
                    <td className="py-2">Heapify up từ leaf</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Extract Max/Min</td>
                    <td className="py-2">O(log n)</td>
                    <td className="py-2">Heapify down từ root</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Peek</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">Truy cập root</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Build Heap</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Heapify từ dưới lên</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Heap Sort</td>
                    <td className="py-2">O(n log n)</td>
                    <td className="py-2">Build + n lần extract</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`use std::cmp::Ordering;

#[derive(Debug)]
pub struct BinaryHeap<T> {
    data: Vec<T>,
    is_max_heap: bool,
}

impl<T: Ord + Clone> BinaryHeap<T> {
    pub fn new_max_heap() -> Self {
        BinaryHeap {
            data: Vec::new(),
            is_max_heap: true,
        }
    }

    pub fn new_min_heap() -> Self {
        BinaryHeap {
            data: Vec::new(),
            is_max_heap: false,
        }
    }

    fn compare(&self, a: &T, b: &T) -> bool {
        if self.is_max_heap {
            a > b
        } else {
            a < b
        }
    }

    pub fn insert(&mut self, item: T) {
        self.data.push(item);
        self.heapify_up(self.data.len() - 1);
    }

    pub fn extract(&mut self) -> Option<T> {
        if self.data.is_empty() {
            return None;
        }

        if self.data.len() == 1 {
            return self.data.pop();
        }

        let result = self.data[0].clone();
        let last = self.data.pop().unwrap();
        self.data[0] = last;
        self.heapify_down(0);
        Some(result)
    }

    pub fn peek(&self) -> Option<&T> {
        self.data.first()
    }

    fn heapify_up(&mut self, mut index: usize) {
        while index > 0 {
            let parent_index = (index - 1) / 2;
            if !self.compare(&self.data[index], &self.data[parent_index]) {
                break;
            }
            self.data.swap(index, parent_index);
            index = parent_index;
        }
    }

    fn heapify_down(&mut self, mut index: usize) {
        loop {
            let mut extreme_index = index;
            let left_child = 2 * index + 1;
            let right_child = 2 * index + 2;

            if left_child < self.data.len()
                && self.compare(&self.data[left_child], &self.data[extreme_index]) {
                extreme_index = left_child;
            }

            if right_child < self.data.len()
                && self.compare(&self.data[right_child], &self.data[extreme_index]) {
                extreme_index = right_child;
            }

            if extreme_index == index {
                break;
            }

            self.data.swap(index, extreme_index);
            index = extreme_index;
        }
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }

    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }
}

// Heap Sort implementation
pub fn heap_sort<T: Ord + Clone>(arr: &mut [T]) {
    let len = arr.len();
    if len <= 1 {
        return;
    }

    // Build max heap
    for i in (0..len / 2).rev() {
        heapify_down_sort(arr, i, len);
    }

    // Extract elements one by one
    for i in (1..len).rev() {
        arr.swap(0, i);
        heapify_down_sort(arr, 0, i);
    }
}

fn heapify_down_sort<T: Ord>(arr: &mut [T], mut index: usize, heap_size: usize) {
    loop {
        let mut largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        if left < heap_size && arr[left] > arr[largest] {
            largest = left;
        }

        if right < heap_size && arr[right] > arr[largest] {
            largest = right;
        }

        if largest == index {
            break;
        }

        arr.swap(index, largest);
        index = largest;
    }
}

// Sử dụng
fn main() {
    let mut max_heap = BinaryHeap::new_max_heap();
    max_heap.insert(10);
    max_heap.insert(20);
    max_heap.insert(15);

    println!("Max: {:?}", max_heap.extract()); // Some(20)

    let mut min_heap = BinaryHeap::new_min_heap();
    min_heap.insert(10);
    min_heap.insert(20);
    min_heap.insert(15);

    println!("Min: {:?}", min_heap.extract()); // Some(10)

    // Heap sort
    let mut arr = vec![3, 1, 4, 1, 5, 9, 2, 6];
    heap_sort(&mut arr);
    println!("Sorted: {:?}", arr); // [1, 1, 2, 3, 4, 5, 6, 9]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
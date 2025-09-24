"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function HeapSection() {
  const [rustHeap, setRustHeap] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [heapDisplay, setHeapDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [heapType, setHeapType] = useState<"max" | "min">("max");
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newHeap = wasmInstance.dataStructures.createBinaryHeap(heapType === "max");
        setRustHeap(newHeap);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Heap đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust heap
  const updateDisplayFromRustHeap = () => {
    if (rustHeap) {
      try {
        const heapArray = Array.from(rustHeap.to_array()) as number[];
        setHeapDisplay(heapArray);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustHeap) {
        try {
          rustHeap.insert(value);
          const wasmSize = rustHeap.len();
          setResult(`🦀 Đã thêm ${value} vào ${heapType} heap. Kích thước: ${wasmSize}`);
          updateDisplayFromRustHeap();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM insert failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    } else {
      setResult("Vui lòng nhập một số hợp lệ");
    }
  };

  const extractTop = () => {
    if (wasmReady && rustHeap) {
      try {
        const extractedValue = rustHeap.extract();
        const wasmSize = rustHeap.len();
        if (extractedValue !== null && extractedValue !== undefined) {
          setResult(`🦀 Đã extract ${extractedValue} khỏi ${heapType} heap. Kích thước: ${wasmSize}`);
        } else {
          setResult("🦀 Heap trống, không thể extract");
        }
        updateDisplayFromRustHeap();
      } catch (error) {
        setResult("❌ Rust WASM extract failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const peek = () => {
    if (wasmReady && rustHeap) {
      try {
        const topValue = rustHeap.peek();
        if (topValue !== null && topValue !== undefined) {
          setResult(`🦀 Phần tử ${heapType === "max" ? "lớn nhất" : "nhỏ nhất"}: ${topValue}`);
        } else {
          setResult("🦀 Heap trống");
        }
      } catch (error) {
        setResult("❌ Rust WASM peek failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const clear = () => {
    if (wasmReady && rustHeap) {
      try {
        rustHeap.clear();
        setResult("🦀 Đã xóa toàn bộ heap");
        updateDisplayFromRustHeap();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const toggleHeapType = async () => {
    const newType = heapType === "max" ? "min" : "max";
    setHeapType(newType);

    if (wasmReady && wasm) {
      try {
        // Create new heap with different type
        const newHeap = wasm.dataStructures.createBinaryHeap(newType === "max");

        // If old heap had elements, copy them to new heap
        if (rustHeap && rustHeap.len() > 0) {
          const oldElements = Array.from(rustHeap.to_array()) as number[];
          oldElements.forEach((element: number) => newHeap.insert(element));
        }

        setRustHeap(newHeap);
        setResult(`🦀 Đã chuyển sang ${newType} heap`);
        updateDisplayFromRustHeap();
      } catch (error) {
        setResult("❌ Rust WASM toggle failed: " + error);
      }
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
    if (wasmReady && wasm && heapDisplay.length > 1) {
      try {
        const sortedArray = wasm.algorithms.heap.heapSortHeaps([...heapDisplay]);
        const resultArray = Array.from(sortedArray);
        setResult(`🦀 Kết quả heap sort: [${resultArray.join(', ')}]`);
      } catch (error) {
        setResult("❌ Rust WASM heap sort failed: " + error);
      }
    } else {
      setResult("Heap cần ít nhất 2 phần tử để sắp xếp hoặc WASM chưa sẵn sàng");
    }

    const sortedArray = [...heapDisplay];
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
    if (heapDisplay.length === 0) return "Heap trống";

    const levels: string[][] = [];
    let currentLevel = 0;
    let index = 0;

    while (index < heapDisplay.length) {
      const levelSize = Math.pow(2, currentLevel);
      const level: string[] = [];

      for (let i = 0; i < levelSize && index < heapDisplay.length; i++, index++) {
        level.push(heapDisplay[index].toString());
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
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          🦀 Rust WASM Heap (Đống)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4 border-l-4 border-rose-500">
          <h4 className="font-semibold text-rose-700 mb-2">🏔️ Heap là gì?</h4>
          <p className="text-muted-foreground mb-3">
            <strong>Heap (Đống)</strong> là cây nhị phân hoàn chỉnh đặc biệt thỏa mãn <strong>tính chất heap</strong>:
            Node cha luôn lớn hơn (Max-Heap) hoặc nhỏ hơn (Min-Heap) tất cả các node con.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-background p-3 rounded border">
              <strong className="text-blue-600">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-muted-foreground">
                <li>• Priority Queue (hàng đợi ưu tiên)</li>
                <li>• Heap Sort (sắp xếp đống)</li>
                <li>• Dijkstra's algorithm</li>
                <li>• Memory management</li>
              </ul>
            </div>
            <div className="bg-background p-3 rounded border">
              <strong className="text-green-600">⚡ Tính chất quan trọng:</strong>
              <ul className="mt-1 text-muted-foreground">
                <li>• Cây nhị phân hoàn chỉnh</li>
                <li>• Insert/Delete: O(log n)</li>
                <li>• Find min/max: O(1)</li>
                <li>• Được lưu trong array</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mb-4 border-l-4 border-violet-500">
          <h4 className="font-semibold text-violet-700 mb-2">🔺 Max-Heap vs Min-Heap:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Max-Heap:</strong> Cha ≥ Con
              <br/><span className="text-muted-foreground">→ Root = phần tử lớn nhất</span>
            </div>
            <div>
              <strong>Min-Heap:</strong> Cha ≤ Con
              <br/><span className="text-muted-foreground">→ Root = phần tử nhỏ nhất</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border">
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
              <span className="flex items-center text-sm text-muted-foreground">
                {heapType === "max" ? "Phần tử lớn nhất ở gốc" : "Phần tử nhỏ nhất ở gốc"}
              </span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Thao Tác Heap:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded bg-background border-border"
              />
              <button
                onClick={insert}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Insert
              </button>
              <button
                onClick={extractTop}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Extract {heapType === "max" ? "Max" : "Min"}
              </button>
              <button
                onClick={peek}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Peek
              </button>
              <button
                onClick={heapSort}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Heap Sort
              </button>
              <button
                onClick={clear}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
                <strong>Kích thước:</strong> {wasmReady && rustHeap ? rustHeap.len() : "Chưa khởi tạo"}
              </p>
              <p className="text-sm">
                <strong>Mảng:</strong> [{heapDisplay.join(", ")}]
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <h5 className="font-medium mb-2">Cây Heap:</h5>
                <div className="min-h-[100px] flex flex-col justify-center">
                  {heapDisplay.length > 0 ? getTreeVisualization() : (
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
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Task scheduling</li>
                  <li>• Dijkstra's algorithm</li>
                  <li>• A* search algorithm</li>
                  <li>• Event simulation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">Heap Sort:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
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
                code={`use std::cmp::Ordering;

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

    pub fn clear(&mut self) {
        self.data.clear();
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

// Priority Queue sử dụng BinaryHeap từ std
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Debug, Eq, PartialEq)]
struct Task {
    priority: u32,
    description: String,
}

impl Ord for Task {
    fn cmp(&self, other: &Self) -> Ordering {
        self.priority.cmp(&other.priority)
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn priority_queue_example() {
    let mut pq = BinaryHeap::new();

    pq.push(Task { priority: 3, description: "Low priority".to_string() });
    pq.push(Task { priority: 1, description: "High priority".to_string() });
    pq.push(Task { priority: 2, description: "Medium priority".to_string() });

    while let Some(task) = pq.pop() {
        println!("Executing: {} (priority: {})", task.description, task.priority);
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

    // Priority queue
    priority_queue_example();
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <vector>
#include <queue>
#include <iostream>
#include <algorithm>
#include <functional>

template<typename T>
class BinaryHeap {
private:
    std::vector<T> data;
    bool isMaxHeap;

    bool compare(const T& a, const T& b) const {
        return isMaxHeap ? (a > b) : (a < b);
    }

    void heapifyUp(size_t index) {
        while (index > 0) {
            size_t parentIndex = (index - 1) / 2;
            if (!compare(data[index], data[parentIndex])) {
                break;
            }
            std::swap(data[index], data[parentIndex]);
            index = parentIndex;
        }
    }

    void heapifyDown(size_t index) {
        size_t size = data.size();
        while (true) {
            size_t extremeIndex = index;
            size_t leftChild = 2 * index + 1;
            size_t rightChild = 2 * index + 2;

            if (leftChild < size && compare(data[leftChild], data[extremeIndex])) {
                extremeIndex = leftChild;
            }

            if (rightChild < size && compare(data[rightChild], data[extremeIndex])) {
                extremeIndex = rightChild;
            }

            if (extremeIndex == index) {
                break;
            }

            std::swap(data[index], data[extremeIndex]);
            index = extremeIndex;
        }
    }

public:
    BinaryHeap(bool maxHeap = true) : isMaxHeap(maxHeap) {}

    void insert(const T& item) {
        data.push_back(item);
        heapifyUp(data.size() - 1);
    }

    T extract() {
        if (data.empty()) {
            throw std::runtime_error("Heap is empty");
        }

        if (data.size() == 1) {
            T result = data[0];
            data.clear();
            return result;
        }

        T result = data[0];
        data[0] = data.back();
        data.pop_back();
        heapifyDown(0);
        return result;
    }

    const T& peek() const {
        if (data.empty()) {
            throw std::runtime_error("Heap is empty");
        }
        return data[0];
    }

    bool empty() const {
        return data.empty();
    }

    size_t size() const {
        return data.size();
    }

    void clear() {
        data.clear();
    }

    const std::vector<T>& getData() const {
        return data;
    }
};

// Heap Sort implementation
template<typename T>
void heapSort(std::vector<T>& arr) {
    if (arr.size() <= 1) return;

    // Build max heap
    for (int i = arr.size() / 2 - 1; i >= 0; i--) {
        heapifyDownForSort(arr, i, arr.size());
    }

    // Extract elements one by one
    for (size_t i = arr.size() - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapifyDownForSort(arr, 0, i);
    }
}

template<typename T>
void heapifyDownForSort(std::vector<T>& arr, size_t index, size_t heapSize) {
    while (true) {
        size_t largest = index;
        size_t left = 2 * index + 1;
        size_t right = 2 * index + 2;

        if (left < heapSize && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest == index) {
            break;
        }

        std::swap(arr[index], arr[largest]);
        index = largest;
    }
}

// Priority Queue với custom comparator
struct Task {
    int priority;
    std::string description;

    Task(int p, const std::string& desc) : priority(p), description(desc) {}

    // Đối với priority_queue, comparator ngược lại
    bool operator<(const Task& other) const {
        return priority > other.priority; // Min-heap behavior
    }
};

void demonstratePriorityQueue() {
    std::priority_queue<Task> pq;

    pq.push(Task(3, "Low priority"));
    pq.push(Task(1, "High priority"));
    pq.push(Task(2, "Medium priority"));

    while (!pq.empty()) {
        Task task = pq.top();
        pq.pop();
        std::cout << "Executing: " << task.description
                  << " (priority: " << task.priority << ")" << std::endl;
    }
}

// Top K elements
template<typename T>
std::vector<T> findTopK(std::vector<T>& nums, int k) {
    std::priority_queue<T, std::vector<T>, std::greater<T>> minHeap;

    for (const T& num : nums) {
        if (minHeap.size() < k) {
            minHeap.push(num);
        } else if (num > minHeap.top()) {
            minHeap.pop();
            minHeap.push(num);
        }
    }

    std::vector<T> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }

    std::reverse(result.begin(), result.end());
    return result;
}

int main() {
    // Custom Binary Heap
    BinaryHeap<int> maxHeap(true);
    maxHeap.insert(10);
    maxHeap.insert(20);
    maxHeap.insert(15);

    std::cout << "Max: " << maxHeap.extract() << std::endl; // 20

    BinaryHeap<int> minHeap(false);
    minHeap.insert(10);
    minHeap.insert(20);
    minHeap.insert(15);

    std::cout << "Min: " << minHeap.extract() << std::endl; // 10

    // Heap Sort
    std::vector<int> arr = {3, 1, 4, 1, 5, 9, 2, 6};
    heapSort(arr);
    std::cout << "Sorted: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << std::endl;

    // Priority Queue
    demonstratePriorityQueue();

    // Top K elements
    std::vector<int> nums = {3, 2, 1, 5, 6, 4};
    auto topK = findTopK(nums, 2);
    std::cout << "Top 2 elements: ";
    for (int x : topK) std::cout << x << " ";
    std::cout << std::endl;

    return 0;
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`import heapq
from typing import List, Optional, Any

class BinaryHeap:
    def __init__(self, is_max_heap=True):
        """Khởi tạo binary heap"""
        self.data = []
        self.is_max_heap = is_max_heap

    def _compare(self, a, b):
        """So sánh hai phần tử theo loại heap"""
        return a > b if self.is_max_heap else a < b

    def _heapify_up(self, index):
        """Heapify lên trên từ index"""
        while index > 0:
            parent_index = (index - 1) // 2
            if not self._compare(self.data[index], self.data[parent_index]):
                break
            self.data[index], self.data[parent_index] = \
                self.data[parent_index], self.data[index]
            index = parent_index

    def _heapify_down(self, index):
        """Heapify xuống dưới từ index"""
        while True:
            extreme_index = index
            left_child = 2 * index + 1
            right_child = 2 * index + 2

            if (left_child < len(self.data) and
                self._compare(self.data[left_child], self.data[extreme_index])):
                extreme_index = left_child

            if (right_child < len(self.data) and
                self._compare(self.data[right_child], self.data[extreme_index])):
                extreme_index = right_child

            if extreme_index == index:
                break

            self.data[index], self.data[extreme_index] = \
                self.data[extreme_index], self.data[index]
            index = extreme_index

    def insert(self, item):
        """Thêm phần tử vào heap"""
        self.data.append(item)
        self._heapify_up(len(self.data) - 1)

    def extract(self):
        """Lấy phần tử đỉnh (max hoặc min)"""
        if not self.data:
            raise IndexError("Heap is empty")

        if len(self.data) == 1:
            return self.data.pop()

        result = self.data[0]
        self.data[0] = self.data.pop()
        self._heapify_down(0)
        return result

    def peek(self):
        """Xem phần tử đỉnh mà không xóa"""
        if not self.data:
            raise IndexError("Heap is empty")
        return self.data[0]

    def is_empty(self):
        """Kiểm tra heap rỗng"""
        return len(self.data) == 0

    def size(self):
        """Lấy kích thước heap"""
        return len(self.data)

    def clear(self):
        """Xóa tất cả phần tử"""
        self.data.clear()

    def get_data(self):
        """Lấy dữ liệu heap"""
        return self.data.copy()

    def __str__(self):
        heap_type = "Max" if self.is_max_heap else "Min"
        return f"{heap_type}Heap({self.data})"

def heap_sort(arr):
    """Heap sort algorithm"""
    if len(arr) <= 1:
        return arr

    result = arr.copy()

    # Build max heap
    for i in range(len(result) // 2 - 1, -1, -1):
        _heapify_down_for_sort(result, i, len(result))

    # Extract elements one by one
    for i in range(len(result) - 1, 0, -1):
        result[0], result[i] = result[i], result[0]
        _heapify_down_for_sort(result, 0, i)

    return result

def _heapify_down_for_sort(arr, index, heap_size):
    """Heapify cho heap sort"""
    while True:
        largest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < heap_size and arr[left] > arr[largest]:
            largest = left

        if right < heap_size and arr[right] > arr[largest]:
            largest = right

        if largest == index:
            break

        arr[index], arr[largest] = arr[largest], arr[index]
        index = largest

class PriorityQueue:
    def __init__(self, max_heap=False):
        """Priority Queue sử dụng heapq"""
        self.heap = []
        self.is_max_heap = max_heap
        self.index = 0  # Để đảm bảo thứ tự stable

    def push(self, item, priority=0):
        """Thêm phần tử với độ ưu tiên"""
        if self.is_max_heap:
            priority = -priority  # Đảo dấu để tạo max heap
        heapq.heappush(self.heap, (priority, self.index, item))
        self.index += 1

    def pop(self):
        """Lấy phần tử có độ ưu tiên cao nhất"""
        if not self.heap:
            raise IndexError("Priority queue is empty")
        priority, _, item = heapq.heappop(self.heap)
        return item

    def peek(self):
        """Xem phần tử có độ ưu tiên cao nhất"""
        if not self.heap:
            raise IndexError("Priority queue is empty")
        return self.heap[0][2]

    def is_empty(self):
        return len(self.heap) == 0

    def size(self):
        return len(self.heap)

def find_top_k_elements(nums, k):
    """Tìm k phần tử lớn nhất"""
    if k >= len(nums):
        return sorted(nums, reverse=True)

    # Sử dụng min heap với kích thước k
    min_heap = []

    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            heapq.heapreplace(min_heap, num)

    return sorted(min_heap, reverse=True)

def merge_k_sorted_lists(lists):
    """Gộp k danh sách đã sắp xếp"""
    heap = []
    result = []

    # Thêm phần tử đầu tiên của mỗi danh sách vào heap
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))  # (value, list_index, element_index)

    while heap:
        value, list_idx, elem_idx = heapq.heappop(heap)
        result.append(value)

        # Nếu còn phần tử trong danh sách
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))

    return result

def sliding_window_maximum(nums, k):
    """Tìm giá trị lớn nhất trong mỗi cửa sổ trượt"""
    if not nums or k <= 0:
        return []

    result = []
    max_heap = []

    for i, num in enumerate(nums):
        # Thêm phần tử hiện tại vào heap
        heapq.heappush(max_heap, (-num, i))  # (-value, index)

        # Loại bỏ các phần tử nằm ngoài cửa sổ
        while max_heap and max_heap[0][1] <= i - k:
            heapq.heappop(max_heap)

        # Nếu đã đủ k phần tử, thêm max vào kết quả
        if i >= k - 1:
            result.append(-max_heap[0][0])

    return result

# Ví dụ sử dụng
if __name__ == "__main__":
    # Custom Binary Heap
    max_heap = BinaryHeap(is_max_heap=True)
    max_heap.insert(10)
    max_heap.insert(20)
    max_heap.insert(15)
    print(f"Max: {max_heap.extract()}")  # 20

    min_heap = BinaryHeap(is_max_heap=False)
    min_heap.insert(10)
    min_heap.insert(20)
    min_heap.insert(15)
    print(f"Min: {min_heap.extract()}")  # 10

    # Heap Sort
    arr = [3, 1, 4, 1, 5, 9, 2, 6]
    sorted_arr = heap_sort(arr)
    print(f"Sorted: {sorted_arr}")  # [1, 1, 2, 3, 4, 5, 6, 9]

    # Priority Queue
    pq = PriorityQueue(max_heap=True)
    pq.push("task3", 3)
    pq.push("task1", 1)
    pq.push("task2", 2)
    print(f"High priority: {pq.pop()}")  # task3 (highest priority)

    # Top K elements
    nums = [3, 2, 1, 5, 6, 4]
    top_k = find_top_k_elements(nums, 2)
    print(f"Top 2 elements: {top_k}")  # [6, 5]

    # Merge sorted lists
    lists = [[1, 4, 5], [1, 3, 4], [2, 6]]
    merged = merge_k_sorted_lists(lists)
    print(f"Merged: {merged}")  # [1, 1, 2, 3, 4, 4, 5, 6]

    # Sliding window maximum
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    max_in_windows = sliding_window_maximum(nums, k)
    print(f"Sliding window max: {max_in_windows}")  # [3, 3, 5, 5, 6, 7]

    # Sử dụng heapq có sẵn
    heap = []
    heapq.heappush(heap, 3)
    heapq.heappush(heap, 1)
    heapq.heappush(heap, 4)
    print(f"Min from heapq: {heapq.heappop(heap)}")  # 1

    # Max heap với heapq (dùng số âm)
    max_heap_list = []
    for num in [3, 1, 4]:
        heapq.heappush(max_heap_list, -num)
    print(f"Max from heapq: {-heapq.heappop(max_heap_list)}")  # 4`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
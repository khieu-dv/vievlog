"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function QueueSection() {
  const [rustQueue, setRustQueue] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [queueDisplay, setQueueDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newQueue = wasmInstance.dataStructures.createQueue();
        setRustQueue(newQueue);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Queue đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust queue
  const updateDisplayFromRustQueue = () => {
    if (rustQueue) {
      try {
        const queueArray = Array.from(rustQueue.to_array()) as number[];
        setQueueDisplay(queueArray);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const enqueue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustQueue) {
        try {
          rustQueue.enqueue(value);
          const wasmSize = rustQueue.len();
          setResult(`🦀 Đã enqueue ${value} vào queue. Kích thước: ${wasmSize}`);
          updateDisplayFromRustQueue();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM enqueue failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    } else {
      setResult("Vui lòng nhập một số hợp lệ");
    }
  };

  const dequeue = () => {
    if (wasmReady && rustQueue) {
      try {
        const dequeuedValue = rustQueue.dequeue();
        const wasmSize = rustQueue.len();
        if (dequeuedValue !== null && dequeuedValue !== undefined) {
          setResult(`🦀 Đã dequeue ${dequeuedValue} khỏi queue. Kích thước: ${wasmSize}`);
        } else {
          setResult("🦀 Queue trống, không thể dequeue");
        }
        updateDisplayFromRustQueue();
      } catch (error) {
        setResult("❌ Rust WASM dequeue failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const front = () => {
    if (wasmReady && rustQueue) {
      try {
        const frontValue = rustQueue.front();
        if (frontValue !== null && frontValue !== undefined) {
          setResult(`🦀 Phần tử đầu queue: ${frontValue}`);
        } else {
          setResult("🦀 Queue trống");
        }
      } catch (error) {
        setResult("❌ Rust WASM front failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const rear = () => {
    if (wasmReady && rustQueue) {
      try {
        const rearValue = rustQueue.rear();
        if (rearValue !== null && rearValue !== undefined) {
          setResult(`🦀 Phần tử cuối queue: ${rearValue}`);
        } else {
          setResult("🦀 Queue trống");
        }
      } catch (error) {
        setResult("❌ Rust WASM rear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const clear = () => {
    if (wasmReady && rustQueue) {
      try {
        rustQueue.clear();
        setResult("🦀 Đã xóa toàn bộ queue");
        updateDisplayFromRustQueue();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  // Circular Queue simulation
  const [circularQueue, setCircularQueue] = useState<(number | null)[]>(Array(5).fill(null));
  const [frontIndex, setFrontIndex] = useState(0);
  const [rearIndex, setRearIndex] = useState(0);
  const [circularSize, setCircularSize] = useState(0);
  const [circularInput, setCircularInput] = useState("");
  const [circularResult, setCircularResult] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  const circularEnqueue = () => {
    const value = parseInt(circularInput);
    if (!isNaN(value)) {
      if (circularSize < 5) {
        const newQueue = [...circularQueue];
        newQueue[rearIndex] = value;
        setCircularQueue(newQueue);
        setRearIndex((rearIndex + 1) % 5);
        setCircularSize(circularSize + 1);
        setCircularResult(`Đã enqueue ${value}. Kích thước: ${circularSize + 1}`);
        setCircularInput("");
      } else {
        setCircularResult("Circular queue đầy!");
      }
    }
  };

  const circularDequeue = () => {
    if (circularSize > 0) {
      const value = circularQueue[frontIndex];
      const newQueue = [...circularQueue];
      newQueue[frontIndex] = null;
      setCircularQueue(newQueue);
      setFrontIndex((frontIndex + 1) % 5);
      setCircularSize(circularSize - 1);
      setCircularResult(`Đã dequeue ${value}. Kích thước: ${circularSize - 1}`);
    } else {
      setCircularResult("Circular queue trống!");
    }
  };

  const clearCircular = () => {
    setCircularQueue(Array(5).fill(null));
    setFrontIndex(0);
    setRearIndex(0);
    setCircularSize(0);
    setCircularResult("Đã xóa toàn bộ circular queue");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          🦀 Rust WASM Queue (Hàng Đợi)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg mb-4 border-l-4 border-cyan-500">
          <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-2">🚶‍♂️ Queue là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Queue (Hàng Đợi)</strong> là cấu trúc dữ liệu tuân theo nguyên tắc <strong>FIFO (First In, First Out)</strong>.
            Giống như xếp hàng mua vé: người đến trước sẽ được phục vụ trước.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Hàng đợi in ấn (Print Queue)</li>
                <li>• Xử lý tasks, job scheduling</li>
                <li>• Breadth-First Search (BFS)</li>
                <li>• Buffer cho streaming</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">⚡ Thao tác chính:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• <strong>Enqueue:</strong> Thêm vào cuối</li>
                <li>• <strong>Dequeue:</strong> Lấy từ đầu</li>
                <li>• <strong>Front:</strong> Xem phần tử đầu</li>
                <li>• <strong>Rear:</strong> Xem phần tử cuối</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">🔄 Queue vs Stack:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Queue (FIFO):</strong> Thêm cuối, lấy đầu
              <br/><span className="text-gray-600 dark:text-gray-400">→ Công bằng, theo thứ tự</span>
            </div>
            <div>
              <strong>Stack (LIFO):</strong> Thêm đỉnh, lấy đỉnh
              <br/><span className="text-gray-600 dark:text-gray-400">→ Ưu tiên mới nhất</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thao Tác Queue Cơ Bản:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={enqueue}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Enqueue
              </button>
              <button
                onClick={dequeue}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Dequeue
              </button>
              <button
                onClick={front}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Front
              </button>
              <button
                onClick={rear}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Rear
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
            <h4 className="font-medium mb-2">Trạng Thái Queue:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Kích thước:</strong> {wasmReady && rustQueue ? rustQueue.len() : "Chưa khởi tạo"}
              </p>
              <p className="text-sm">
                <strong>Front:</strong> {queueDisplay.length > 0 ? queueDisplay[0] : "Queue trống"}
              </p>
              <p className="text-sm">
                <strong>Rear:</strong> {queueDisplay.length > 0 ? queueDisplay[queueDisplay.length - 1] : "Queue trống"}
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className="font-mono text-sm">
                  {queueDisplay.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">Queue trống</div>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto">
                      {queueDisplay.map((value, index) => (
                        <div
                          key={index}
                          className={`p-2 border-2 min-w-[60px] text-center ${
                            index === 0
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : index === queueDisplay.length - 1
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {value}
                          {index === 0 && <div className="text-xs text-blue-600">FRONT</div>}
                          {index === queueDisplay.length - 1 && <div className="text-xs text-green-600">REAR</div>}
                        </div>
                      ))}
                      <div className="flex items-center text-gray-500">→ OUT</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Circular Queue (Hàng Đợi Vòng):</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={circularInput}
                onChange={(e) => setCircularInput(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={circularEnqueue}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Enqueue
              </button>
              <button
                onClick={circularDequeue}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Dequeue
              </button>
              <button
                onClick={clearCircular}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>

            {circularResult && (
              <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <strong>Kết quả:</strong> {circularResult}
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <div className="text-sm mb-2">
                <strong>Capacity:</strong> 5, <strong>Size:</strong> {circularSize}, <strong>Front:</strong> {frontIndex}, <strong>Rear:</strong> {rearIndex}
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-2">
                  {circularQueue.map((value, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 border-2 flex flex-col items-center justify-center text-sm ${
                        index === frontIndex && circularSize > 0
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : index === (rearIndex - 1 + 5) % 5 && circularSize > 0
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : value !== null
                          ? "border-gray-400 bg-gray-100 dark:bg-gray-700"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <div className="font-mono">{value ?? "-"}</div>
                      <div className="text-xs text-gray-500">[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Queue:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Linear Queue"
                        FRONT[Front] --> ELEM1[Element 1]
                        ELEM1 --> ELEM2[Element 2]
                        ELEM2 --> ELEM3[Element 3]
                        ELEM3 --> REAR[Rear]

                        ENQUEUE[Enqueue] --> REAR
                        DEQUEUE[Dequeue] --> FRONT
                    end

                    subgraph "Circular Queue"
                        C0[0] --> C1[1]
                        C1 --> C2[2]
                        C2 --> C3[3]
                        C3 --> C4[4]
                        C4 --> C0

                        CFRONT[Front] -.-> C1
                        CREAR[Rear] -.-> C3
                    end

                    subgraph "Queue Applications"
                        APP1[Task Scheduling]
                        APP2[Buffer for IO]
                        APP3[BFS Algorithm]
                        APP4[Print Queue]
                        APP5[Call Center]
                    end

                    style FRONT fill:#2196F3,color:#fff
                    style REAR fill:#4CAF50,color:#fff
                    style ENQUEUE fill:#4CAF50,color:#fff
                    style DEQUEUE fill:#F44336,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Loại Queue:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Loại Queue</th>
                    <th className="text-left py-2">Ưu Điểm</th>
                    <th className="text-left py-2">Nhược Điểm</th>
                    <th className="text-left py-2">Sử Dụng</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Simple Queue</td>
                    <td className="py-2">Đơn giản, dễ hiểu</td>
                    <td className="py-2">Lãng phí bộ nhớ</td>
                    <td className="py-2">Ứng dụng cơ bản</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Circular Queue</td>
                    <td className="py-2">Tiết kiệm bộ nhớ</td>
                    <td className="py-2">Phức tạp hơn</td>
                    <td className="py-2">Buffer, OS scheduling</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Priority Queue</td>
                    <td className="py-2">Ưu tiên phần tử</td>
                    <td className="py-2">Phức tạp cao</td>
                    <td className="py-2">Dijkstra, Huffman</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Deque</td>
                    <td className="py-2">Linh hoạt 2 đầu</td>
                    <td className="py-2">Overhead cao</td>
                    <td className="py-2">Sliding window</td>
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
                code={`use std::collections::VecDeque;

// Simple Queue implementation
#[derive(Debug)]
pub struct Queue<T> {
    items: VecDeque<T>,
}

impl<T> Queue<T> {
    pub fn new() -> Self {
        Queue {
            items: VecDeque::new(),
        }
    }

    // Thêm phần tử vào cuối queue
    pub fn enqueue(&mut self, item: T) {
        self.items.push_back(item);
    }

    // Lấy phần tử từ đầu queue
    pub fn dequeue(&mut self) -> Option<T> {
        self.items.pop_front()
    }

    // Xem phần tử đầu queue
    pub fn front(&self) -> Option<&T> {
        self.items.front()
    }

    // Xem phần tử cuối queue
    pub fn back(&self) -> Option<&T> {
        self.items.back()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }

    pub fn clear(&mut self) {
        self.items.clear();
    }
}

// Circular Queue implementation
#[derive(Debug)]
pub struct CircularQueue<T> {
    data: Vec<Option<T>>,
    front: usize,
    rear: usize,
    size: usize,
    capacity: usize,
}

impl<T> CircularQueue<T> {
    pub fn new(capacity: usize) -> Self {
        CircularQueue {
            data: vec![None; capacity],
            front: 0,
            rear: 0,
            size: 0,
            capacity,
        }
    }

    pub fn enqueue(&mut self, item: T) -> Result<(), &'static str> {
        if self.is_full() {
            return Err("Queue is full");
        }

        self.data[self.rear] = Some(item);
        self.rear = (self.rear + 1) % self.capacity;
        self.size += 1;
        Ok(())
    }

    pub fn dequeue(&mut self) -> Option<T> {
        if self.is_empty() {
            return None;
        }

        let item = self.data[self.front].take();
        self.front = (self.front + 1) % self.capacity;
        self.size -= 1;
        item
    }

    pub fn is_empty(&self) -> bool {
        self.size == 0
    }

    pub fn is_full(&self) -> bool {
        self.size == self.capacity
    }

    pub fn len(&self) -> usize {
        self.size
    }
}

// Priority Queue sử dụng BinaryHeap
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Debug)]
pub struct PriorityQueue<T> {
    heap: BinaryHeap<Reverse<T>>, // Min-heap
}

impl<T: Ord> PriorityQueue<T> {
    pub fn new() -> Self {
        PriorityQueue {
            heap: BinaryHeap::new(),
        }
    }

    pub fn enqueue(&mut self, item: T) {
        self.heap.push(Reverse(item));
    }

    pub fn dequeue(&mut self) -> Option<T> {
        self.heap.pop().map(|Reverse(item)| item)
    }

    pub fn peek(&self) -> Option<&T> {
        self.heap.peek().map(|Reverse(item)| item)
    }

    pub fn is_empty(&self) -> bool {
        self.heap.is_empty()
    }

    pub fn len(&self) -> usize {
        self.heap.len()
    }
}

// Sử dụng
fn main() {
    // Simple Queue
    let mut queue = Queue::new();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    println!("Front: {:?}", queue.front()); // Some(1)
    println!("Dequeue: {:?}", queue.dequeue()); // Some(1)
    println!("Size: {}", queue.len()); // 2

    // Circular Queue
    let mut cq = CircularQueue::new(3);
    cq.enqueue(10).unwrap();
    cq.enqueue(20).unwrap();
    println!("Dequeue: {:?}", cq.dequeue()); // Some(10)

    // Priority Queue
    let mut pq = PriorityQueue::new();
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(2);
    println!("Priority dequeue: {:?}", pq.dequeue()); // Some(1)
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <queue>
#include <deque>
#include <vector>
#include <iostream>
#include <stdexcept>

template<typename T>
class Queue {
private:
    std::deque<T> items;

public:
    // Thêm phần tử vào cuối queue
    void enqueue(const T& item) {
        items.push_back(item);
    }

    // Lấy phần tử từ đầu queue
    T dequeue() {
        if (empty()) {
            throw std::runtime_error("Queue is empty");
        }
        T item = items.front();
        items.pop_front();
        return item;
    }

    // Xem phần tử đầu queue
    const T& front() const {
        if (empty()) {
            throw std::runtime_error("Queue is empty");
        }
        return items.front();
    }

    // Xem phần tử cuối queue
    const T& back() const {
        if (empty()) {
            throw std::runtime_error("Queue is empty");
        }
        return items.back();
    }

    bool empty() const {
        return items.empty();
    }

    size_t size() const {
        return items.size();
    }

    void clear() {
        items.clear();
    }
};

// Circular Queue implementation
template<typename T>
class CircularQueue {
private:
    std::vector<T> data;
    int front_idx;
    int rear_idx;
    int current_size;
    int capacity;

public:
    CircularQueue(int cap) : capacity(cap), front_idx(0), rear_idx(0), current_size(0) {
        data.resize(capacity);
    }

    bool enqueue(const T& item) {
        if (isFull()) {
            return false;
        }
        data[rear_idx] = item;
        rear_idx = (rear_idx + 1) % capacity;
        current_size++;
        return true;
    }

    bool dequeue(T& item) {
        if (isEmpty()) {
            return false;
        }
        item = data[front_idx];
        front_idx = (front_idx + 1) % capacity;
        current_size--;
        return true;
    }

    bool front(T& item) const {
        if (isEmpty()) {
            return false;
        }
        item = data[front_idx];
        return true;
    }

    bool isEmpty() const {
        return current_size == 0;
    }

    bool isFull() const {
        return current_size == capacity;
    }

    int size() const {
        return current_size;
    }

    void clear() {
        front_idx = 0;
        rear_idx = 0;
        current_size = 0;
    }
};

// Double-ended queue (Deque)
template<typename T>
class Deque {
private:
    std::deque<T> items;

public:
    void pushFront(const T& item) {
        items.push_front(item);
    }

    void pushBack(const T& item) {
        items.push_back(item);
    }

    T popFront() {
        if (empty()) {
            throw std::runtime_error("Deque is empty");
        }
        T item = items.front();
        items.pop_front();
        return item;
    }

    T popBack() {
        if (empty()) {
            throw std::runtime_error("Deque is empty");
        }
        T item = items.back();
        items.pop_back();
        return item;
    }

    const T& front() const {
        if (empty()) {
            throw std::runtime_error("Deque is empty");
        }
        return items.front();
    }

    const T& back() const {
        if (empty()) {
            throw std::runtime_error("Deque is empty");
        }
        return items.back();
    }

    bool empty() const {
        return items.empty();
    }

    size_t size() const {
        return items.size();
    }
};

// Sử dụng STL queue và priority_queue
void demonstrateSTLQueues() {
    // STL queue
    std::queue<int> q;
    q.push(1);
    q.push(2);
    q.push(3);
    std::cout << "Front: " << q.front() << std::endl; // 1
    q.pop();
    std::cout << "Size: " << q.size() << std::endl;   // 2

    // STL priority_queue (max-heap by default)
    std::priority_queue<int> pq;
    pq.push(3);
    pq.push(1);
    pq.push(2);
    std::cout << "Top: " << pq.top() << std::endl; // 3 (largest)
    pq.pop();

    // Min-heap priority_queue
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
    min_pq.push(3);
    min_pq.push(1);
    min_pq.push(2);
    std::cout << "Min top: " << min_pq.top() << std::endl; // 1 (smallest)
}

int main() {
    // Sử dụng custom Queue
    Queue<int> queue;
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    std::cout << "Front: " << queue.front() << std::endl; // 1
    std::cout << "Dequeue: " << queue.dequeue() << std::endl; // 1
    std::cout << "Size: " << queue.size() << std::endl; // 2

    // Sử dụng Circular Queue
    CircularQueue<int> cq(3);
    cq.enqueue(10);
    cq.enqueue(20);
    int value;
    if (cq.dequeue(value)) {
        std::cout << "Circular dequeue: " << value << std::endl; // 10
    }

    // Sử dụng Deque
    Deque<int> dq;
    dq.pushBack(1);
    dq.pushFront(0);
    dq.pushBack(2);
    std::cout << "Deque front: " << dq.front() << std::endl; // 0
    std::cout << "Deque back: " << dq.back() << std::endl;   // 2

    demonstrateSTLQueues();

    return 0;
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`from collections import deque
import heapq

class Queue:
    def __init__(self):
        """Khởi tạo queue rỗng"""
        self.items = deque()

    def enqueue(self, item):
        """Thêm phần tử vào cuối queue"""
        self.items.append(item)

    def dequeue(self):
        """Lấy phần tử từ đầu queue"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.popleft()

    def front(self):
        """Xem phần tử đầu queue"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]

    def rear(self):
        """Xem phần tử cuối queue"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[-1]

    def is_empty(self):
        """Kiểm tra queue có rỗng không"""
        return len(self.items) == 0

    def size(self):
        """Lấy số phần tử trong queue"""
        return len(self.items)

    def clear(self):
        """Xóa tất cả phần tử"""
        self.items.clear()

    def __str__(self):
        """Biểu diễn chuỗi của queue"""
        return f"Queue({list(self.items)})"

    def __len__(self):
        """Hỗ trợ hàm len()"""
        return len(self.items)

class CircularQueue:
    def __init__(self, capacity):
        """Khởi tạo circular queue với capacity cho trước"""
        self.capacity = capacity
        self.data = [None] * capacity
        self.front = 0
        self.rear = 0
        self.size = 0

    def enqueue(self, item):
        """Thêm phần tử vào queue"""
        if self.is_full():
            raise OverflowError("Queue is full")

        self.data[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity
        self.size += 1

    def dequeue(self):
        """Lấy phần tử từ queue"""
        if self.is_empty():
            raise IndexError("Queue is empty")

        item = self.data[self.front]
        self.data[self.front] = None
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return item

    def front_item(self):
        """Xem phần tử đầu queue"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.data[self.front]

    def is_empty(self):
        """Kiểm tra queue có rỗng không"""
        return self.size == 0

    def is_full(self):
        """Kiểm tra queue có đầy không"""
        return self.size == self.capacity

    def get_size(self):
        """Lấy số phần tử hiện tại"""
        return self.size

    def clear(self):
        """Xóa tất cả phần tử"""
        self.data = [None] * self.capacity
        self.front = 0
        self.rear = 0
        self.size = 0

    def __str__(self):
        """Biểu diễn chuỗi của circular queue"""
        if self.is_empty():
            return "CircularQueue([])"

        items = []
        i = self.front
        for _ in range(self.size):
            items.append(self.data[i])
            i = (i + 1) % self.capacity
        return f"CircularQueue({items})"

class PriorityQueue:
    def __init__(self):
        """Khởi tạo priority queue (min-heap)"""
        self.heap = []

    def enqueue(self, item, priority=0):
        """Thêm phần tử với độ ưu tiên"""
        heapq.heappush(self.heap, (priority, item))

    def dequeue(self):
        """Lấy phần tử có độ ưu tiên cao nhất (số nhỏ nhất)"""
        if self.is_empty():
            raise IndexError("Priority queue is empty")
        priority, item = heapq.heappop(self.heap)
        return item

    def peek(self):
        """Xem phần tử có độ ưu tiên cao nhất"""
        if self.is_empty():
            raise IndexError("Priority queue is empty")
        return self.heap[0][1]

    def is_empty(self):
        """Kiểm tra rỗng"""
        return len(self.heap) == 0

    def size(self):
        """Lấy số phần tử"""
        return len(self.heap)

class Deque:
    def __init__(self):
        """Khởi tạo double-ended queue"""
        self.items = deque()

    def add_front(self, item):
        """Thêm vào đầu"""
        self.items.appendleft(item)

    def add_rear(self, item):
        """Thêm vào cuối"""
        self.items.append(item)

    def remove_front(self):
        """Lấy từ đầu"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self.items.popleft()

    def remove_rear(self):
        """Lấy từ cuối"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self.items.pop()

    def peek_front(self):
        """Xem phần tử đầu"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self.items[0]

    def peek_rear(self):
        """Xem phần tử cuối"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self.items[-1]

    def is_empty(self):
        """Kiểm tra rỗng"""
        return len(self.items) == 0

    def size(self):
        """Lấy số phần tử"""
        return len(self.items)

def sliding_window_maximum(nums, k):
    """Tìm giá trị lớn nhất trong cửa sổ trượt k phần tử"""
    if not nums or k == 0:
        return []

    dq = deque()  # Lưu chỉ số
    result = []

    for i in range(len(nums)):
        # Loại bỏ các chỉ số không còn trong cửa sổ
        while dq and dq[0] <= i - k:
            dq.popleft()

        # Loại bỏ các phần tử nhỏ hơn phần tử hiện tại
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()

        dq.append(i)

        # Nếu đã đủ k phần tử, thêm vào kết quả
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result

# Ví dụ sử dụng
if __name__ == "__main__":
    # Simple Queue
    queue = Queue()
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    print(f"Front: {queue.front()}")  # 1
    print(f"Dequeue: {queue.dequeue()}")  # 1
    print(f"Size: {queue.size()}")  # 2
    print(queue)  # Queue([2, 3])

    # Circular Queue
    cq = CircularQueue(3)
    cq.enqueue(10)
    cq.enqueue(20)
    print(f"Circular dequeue: {cq.dequeue()}")  # 10
    print(cq)  # CircularQueue([20])

    # Priority Queue
    pq = PriorityQueue()
    pq.enqueue("task3", 3)
    pq.enqueue("task1", 1)  # Độ ưu tiên cao hơn
    pq.enqueue("task2", 2)
    print(f"High priority: {pq.dequeue()}")  # task1

    # Deque
    dq = Deque()
    dq.add_rear(1)
    dq.add_front(0)
    dq.add_rear(2)
    print(f"Front: {dq.peek_front()}")  # 0
    print(f"Rear: {dq.peek_rear()}")   # 2

    # Sliding window maximum
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    result = sliding_window_maximum(nums, k)
    print(f"Sliding window max: {result}")  # [3, 3, 5, 5, 6, 7]

    # Sử dụng deque có sẵn của Python
    from collections import deque
    python_queue = deque()
    python_queue.append(1)  # enqueue
    python_queue.append(2)  # enqueue
    python_queue.append(3)  # enqueue
    print(python_queue.popleft())  # dequeue -> 1
    print(len(python_queue))  # size -> 2`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Queue sử dụng Rust WASM. Queue là cấu trúc dữ liệu FIFO (First In, First Out) - phần tử đầu tiên được thêm vào sẽ là phần tử đầu tiên được lấy ra.
        </p>

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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
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

// Sử dụng
fn main() {
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
}`}
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
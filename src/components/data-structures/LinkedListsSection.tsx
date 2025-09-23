"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

interface ListNode {
  value: number;
  next?: ListNode;
}

export function LinkedListsSection() {
  const [rustLinkedList, setRustLinkedList] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [listDisplay, setListDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newLinkedList = wasmInstance.dataStructures.createLinkedList();
        setRustLinkedList(newLinkedList);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Linked List đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust linked list
  const updateDisplayFromRustList = () => {
    if (rustLinkedList) {
      try {
        const listArray = Array.from(rustLinkedList.to_array()) as number[];
        setListDisplay(listArray);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const addToHead = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustLinkedList) {
        try {
          rustLinkedList.push_front(value);
          const listSize = rustLinkedList.len();
          setResult(`🦀 Đã thêm ${value} vào đầu danh sách. Kích thước: ${listSize}`);
          updateDisplayFromRustList();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM addToHead failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const addToTail = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustLinkedList) {
        try {
          rustLinkedList.push_back(value);
          const listSize = rustLinkedList.len();
          setResult(`🦀 Đã thêm ${value} vào cuối danh sách. Kích thước: ${listSize}`);
          updateDisplayFromRustList();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM addToTail failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const removeHead = () => {
    if (wasmReady && rustLinkedList) {
      try {
        const removed = rustLinkedList.pop_front();
        const listSize = rustLinkedList.len();
        if (removed !== null && removed !== undefined) {
          setResult(`🦀 Đã xóa phần tử đầu: ${removed}. Kích thước: ${listSize}`);
        } else {
          setResult(`🦀 Danh sách trống, không thể xóa`);
        }
        updateDisplayFromRustList();
      } catch (error) {
        setResult("❌ Rust WASM removeHead failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const removeTail = () => {
    if (wasmReady && rustLinkedList) {
      try {
        const removed = rustLinkedList.pop_back();
        const listSize = rustLinkedList.len();
        if (removed !== null && removed !== undefined) {
          setResult(`🦀 Đã xóa phần tử cuối: ${removed}. Kích thước: ${listSize}`);
        } else {
          setResult(`🦀 Danh sách trống, không thể xóa`);
        }
        updateDisplayFromRustList();
      } catch (error) {
        setResult("❌ Rust WASM removeTail failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const clear = () => {
    if (wasmReady && rustLinkedList) {
      try {
        rustLinkedList.clear();
        setResult("🦀 Đã xóa toàn bộ danh sách");
        updateDisplayFromRustList();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <List className="h-5 w-5" />
          🦀 Rust WASM Danh Sách Liên Kết
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg mb-4 border-l-4 border-lime-500">
          <h4 className="font-semibold text-lime-800 dark:text-lime-300 mb-2">🔗 Danh Sách Liên Kết là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Linked List (Danh Sách Liên Kết)</strong> là cấu trúc dữ liệu tuyến tính trong đó các phần tử (node) được lưu trữ trong các vị trí bộ nhớ không liên tiếp.
            Mỗi node chứa dữ liệu và pointer trỏ đến node tiếp theo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">✅ Ưu điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Kích thước động</li>
                <li>Thêm/xóa đầu nhanh O(1)</li>
                <li>Sử dụng bộ nhớ hiệu quả</li>
                <li>Không cần biết trước kích thước</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-red-600 dark:text-red-400">❌ Nhược điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Truy cập chậm O(n)</li>
                <li>Tốn bộ nhớ cho pointer</li>
                <li>Không cache-friendly</li>
                <li>Không thể binary search</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-lg mb-4 border-l-4 border-fuchsia-500">
          <h4 className="font-semibold text-fuchsia-800 dark:text-fuchsia-300 mb-2">🎯 Khi nào dùng Linked List?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-blue-600 dark:text-blue-400">🎪 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Undo/Redo trong editor</li>
                <li>• Browser history</li>
                <li>• Music playlist</li>
                <li>• Implement Stack/Queue</li>
              </ul>
            </div>
            <div>
              <strong className="text-purple-600 dark:text-purple-400">⚡ So với Array:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Array: Truy cập nhanh, thêm/xóa chậm</li>
                <li>• Linked List: Truy cập chậm, thêm/xóa nhanh</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Danh Sách Liên Kết:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Danh Sách Liên Kết Đơn"
                        HEAD["HEAD"] --> A
                        A["Node 1<br/>Data: 10<br/>Next: →"] --> B["Node 2<br/>Data: 20<br/>Next: →"]
                        B --> C["Node 3<br/>Data: 30<br/>Next: NULL"]
                        C --> NULL1[NULL]
                        style NULL1 fill:#ffcdd2
                    end

                    subgraph "Các Thao Tác"
                        INSERT["Thêm vào đầu"] -.-> HEAD
                        DELETE["Xóa node"] -.-> B
                        SEARCH["Tìm kiếm"] -.-> A
                    end
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Danh Sách Tương Tác:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={addToHead}
                disabled={!wasmReady}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                🦀 Thêm vào đầu
              </button>
              <button
                onClick={addToTail}
                disabled={!wasmReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                🦀 Thêm vào cuối
              </button>
              <button
                onClick={removeHead}
                disabled={!wasmReady}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                🦀 Xóa đầu
              </button>
              <button
                onClick={removeTail}
                disabled={!wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🦀 Xóa cuối
              </button>
              <button
                onClick={clear}
                disabled={!wasmReady}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                🧹 Xóa tất cả
              </button>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              {listDisplay.length === 0 ? (
                <div className="text-gray-500 italic">Danh sách rỗng</div>
              ) : (
                <>
                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs">🦀 HEAD</div>
                  {listDisplay.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="border-2 border-orange-500 p-2 rounded bg-orange-50 dark:bg-orange-900">
                        <div className="text-xs text-gray-600 dark:text-gray-300">Data: {value}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          Next: {index < listDisplay.length - 1 ? "→" : "NULL"}
                        </div>
                      </div>
                      {index < listDisplay.length - 1 && <span className="text-orange-500">→</span>}
                    </div>
                  ))}
                  <span className="text-red-500">NULL</span>
                </>
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
              code={`#[derive(Debug)]
struct Node<T> {
    data: T,
    next: Option<Box<Node<T>>>,
}

#[derive(Debug)]
struct LinkedList<T> {
    head: Option<Box<Node<T>>>,
    size: usize,
}

impl<T> LinkedList<T> {
    fn new() -> Self {
        LinkedList { head: None, size: 0 }
    }

    fn push_front(&mut self, data: T) {
        let new_node = Box::new(Node {
            data,
            next: self.head.take(),
        });
        self.head = Some(new_node);
        self.size += 1;
    }

    fn pop_front(&mut self) -> Option<T> {
        self.head.take().map(|node| {
            self.head = node.next;
            self.size -= 1;
            node.data
        })
    }

    fn push_back(&mut self, data: T) {
        let new_node = Box::new(Node {
            data,
            next: None,
        });

        if self.head.is_none() {
            self.head = Some(new_node);
        } else {
            let mut current = self.head.as_mut().unwrap();
            while current.next.is_some() {
                current = current.next.as_mut().unwrap();
            }
            current.next = Some(new_node);
        }
        self.size += 1;
    }

    fn display(&self) -> Vec<&T> {
        let mut result = Vec::new();
        let mut current = &self.head;

        while let Some(node) = current {
            result.push(&node.data);
            current = &node.next;
        }

        result
    }
}`}
                height="350px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <iostream>
#include <memory>

template<typename T>
class LinkedList {
private:
    struct Node {
        T data;
        std::unique_ptr<Node> next;

        Node(const T& value) : data(value), next(nullptr) {}
    };

    std::unique_ptr<Node> head;
    size_t size;

public:
    LinkedList() : head(nullptr), size(0) {}

    // Thêm vào đầu danh sách
    void push_front(const T& data) {
        auto new_node = std::make_unique<Node>(data);
        new_node->next = std::move(head);
        head = std::move(new_node);
        size++;
    }

    // Xóa phần tử đầu
    void pop_front() {
        if (head) {
            head = std::move(head->next);
            size--;
        }
    }

    // Thêm vào cuối danh sách
    void push_back(const T& data) {
        auto new_node = std::make_unique<Node>(data);

        if (!head) {
            head = std::move(new_node);
        } else {
            Node* current = head.get();
            while (current->next) {
                current = current->next.get();
            }
            current->next = std::move(new_node);
        }
        size++;
    }

    // Hiển thị danh sách
    void display() const {
        Node* current = head.get();
        std::cout << "HEAD -> ";
        while (current) {
            std::cout << current->data << " -> ";
            current = current->next.get();
        }
        std::cout << "NULL" << std::endl;
    }

    bool empty() const { return head == nullptr; }
    size_t length() const { return size; }
};`}
                height="350px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`class Node:
    """Node class cho Linked List"""
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    """Cài đặt Linked List đơn giản"""

    def __init__(self):
        self.head = None
        self.size = 0

    def push_front(self, data):
        """Thêm phần tử vào đầu danh sách"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1

    def pop_front(self):
        """Xóa và trả về phần tử đầu"""
        if not self.head:
            return None

        data = self.head.data
        self.head = self.head.next
        self.size -= 1
        return data

    def push_back(self, data):
        """Thêm phần tử vào cuối danh sách"""
        new_node = Node(data)

        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node

        self.size += 1

    def pop_back(self):
        """Xóa và trả về phần tử cuối"""
        if not self.head:
            return None

        if not self.head.next:
            data = self.head.data
            self.head = None
            self.size -= 1
            return data

        current = self.head
        while current.next.next:
            current = current.next

        data = current.next.data
        current.next = None
        self.size -= 1
        return data

    def display(self):
        """Hiển thị danh sách"""
        result = []
        current = self.head

        while current:
            result.append(current.data)
            current = current.next

        return result

    def is_empty(self):
        return self.head is None

    def __len__(self):
        return self.size

# Sử dụng:
# ll = LinkedList()
# ll.push_front(1)
# ll.push_back(2)
# print(ll.display())  # [1, 2]`}
                height="350px"
              />
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Truy cập:</strong> O(n)
              </div>
              <div>
                <strong>Tìm kiếm:</strong> O(n)
              </div>
              <div>
                <strong>Thêm vào đầu:</strong> O(1)
              </div>
              <div>
                <strong>Xóa đầu:</strong> O(1)
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
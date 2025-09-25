"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { SmartCodeRunner } from "~/components/common/SmartCodeRunner";
import { EditableCodeEditor } from "~/components/common/EditableCodeEditor";
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
  const [activeSection, setActiveSection] = useState<"overview" | "interactive" | "implementation">("overview");

  // Interactive visualization states
  const [animationList, setAnimationList] = useState<number[]>([10, 25, 8]);
  const [searchValue, setSearchValue] = useState("");
  const [insertValue, setInsertValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Code running states
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(false);

  // Code storage for different languages
  const [codeState, setCodeState] = useState({
    rust: `#[derive(Debug)]
struct ListNode<T> {
    data: T,
    next: Option<Box<ListNode<T>>>,
}

#[derive(Debug)]
struct LinkedList<T>
where
    T: std::fmt::Debug + Copy + PartialEq,
{
    head: Option<Box<ListNode<T>>>,
    size: usize,
}

impl<T> LinkedList<T>
where
    T: std::fmt::Debug + Copy + PartialEq,
{
    fn new() -> Self {
        LinkedList { head: None, size: 0 }
    }

    fn push_front(&mut self, data: T) {
        let new_node = Box::new(ListNode {
            data,
            next: self.head.take(),
        });
        self.head = Some(new_node);
        self.size += 1;
    }

    fn pop_front(&mut self) -> Option<T> {
        if let Some(old_head) = self.head.take() {
            self.head = old_head.next;
            self.size -= 1;
            Some(old_head.data)
        } else {
            None
        }
    }

    fn display(&self) {
        let mut current = &self.head;
        print!("LinkedList: ");
        while let Some(node) = current {
            print!("{:?} -> ", node.data);
            current = &node.next;
        }
        println!("null");
    }

    fn search(&self, target: T) -> Option<usize>
    where
        T: PartialEq,
    {
        let mut current = &self.head;
        let mut index = 0;
        while let Some(node) = current {
            if node.data == target {
                return Some(index);
            }
            current = &node.next;
            index += 1;
        }
        None
    }
}

fn main() {
    let mut list = LinkedList::new();

    println!("=== Linked List Demo trong Rust ===");

    // Thêm phần tử
    println!("Thêm các phần tử: 1, 2, 3");
    list.push_front(3);
    list.push_front(2);
    list.push_front(1);

    list.display();
    println!("Kích thước: {}", list.size);

    // Tìm kiếm phần tử
    if let Some(index) = list.search(2) {
        println!("Tìm thấy phần tử 2 tại vị trí: {}", index);
    } else {
        println!("Không tìm thấy phần tử 2");
    }

    // Xóa phần tử
    if let Some(value) = list.pop_front() {
        println!("Đã xóa phần tử đầu: {:?}", value);
    }

    list.display();
    println!("Kích thước sau khi xóa: {}", list.size);

    // Thêm thêm phần tử
    list.push_front(0);
    println!("Thêm phần tử 0 vào đầu:");
    list.display();
}`,
    cpp: `#include <iostream>

struct Node {
    int data;
    Node* next;

    Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    size_t size;

public:
    LinkedList() : head(nullptr), size(0) {}

    ~LinkedList() {
        while (head) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }

    void push_front(int data) {
        Node* new_node = new Node(data);
        new_node->next = head;
        head = new_node;
        size++;
    }

    bool pop_front() {
        if (!head) return false;

        int removed_data = head->data;
        Node* temp = head;
        head = head->next;
        delete temp;
        size--;

        std::cout << "Đã xóa phần tử đầu: " << removed_data << std::endl;
        return true;
    }

    void display() const {
        std::cout << "LinkedList: ";
        Node* current = head;
        while (current) {
            std::cout << current->data << " -> ";
            current = current->next;
        }
        std::cout << "null" << std::endl;
    }

    int search(int target) const {
        Node* current = head;
        int index = 0;
        while (current) {
            if (current->data == target) {
                return index;
            }
            current = current->next;
            index++;
        }
        return -1; // Không tìm thấy
    }

    size_t get_size() const { return size; }
    bool is_empty() const { return head == nullptr; }
};

int main() {
    LinkedList list;

    std::cout << "=== Linked List Demo trong C++ ===" << std::endl;

    // Thêm phần tử
    std::cout << "Thêm các phần tử: 1, 2, 3" << std::endl;
    list.push_front(3);
    list.push_front(2);
    list.push_front(1);

    list.display();
    std::cout << "Kích thước: " << list.get_size() << std::endl;

    // Tìm kiếm phần tử
    int search_target = 2;
    int index = list.search(search_target);
    if (index != -1) {
        std::cout << "Tìm thấy phần tử " << search_target << " tại vị trí: " << index << std::endl;
    } else {
        std::cout << "Không tìm thấy phần tử " << search_target << std::endl;
    }

    // Xóa phần tử
    list.pop_front();
    list.display();
    std::cout << "Kích thước sau khi xóa: " << list.get_size() << std::endl;

    // Thêm phần tử mới
    list.push_front(0);
    std::cout << "Thêm phần tử 0 vào đầu:" << std::endl;
    list.display();

    return 0;
}`,
    python: `class ListNode:
    """Node của Linked List"""
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
        new_node = ListNode(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1

    def pop_front(self):
        """Xóa phần tử đầu danh sách"""
        if not self.head:
            return None

        data = self.head.data
        self.head = self.head.next
        self.size -= 1
        return data

    def display(self):
        """Hiển thị toàn bộ danh sách"""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements) + " -> null"

    def search(self, target):
        """Tìm kiếm phần tử trong danh sách"""
        current = self.head
        index = 0
        while current:
            if current.data == target:
                return index
            current = current.next
            index += 1
        return -1

    def is_empty(self):
        """Kiểm tra danh sách có rỗng không"""
        return self.head is None

    def get_size(self):
        """Trả về kích thước danh sách"""
        return self.size

def main():
    """Hàm chính để demo LinkedList"""
    linked_list = LinkedList()

    print("=== Linked List Demo trong Python ===")

    # Thêm phần tử
    print("Thêm các phần tử: 1, 2, 3")
    linked_list.push_front(3)
    linked_list.push_front(2)
    linked_list.push_front(1)

    print(f"LinkedList: {linked_list.display()}")
    print(f"Kích thước: {linked_list.get_size()}")

    # Tìm kiếm
    search_target = 2
    index = linked_list.search(search_target)
    if index != -1:
        print(f"Tìm thấy {search_target} tại vị trí: {index}")
    else:
        print(f"Không tìm thấy {search_target}")

    # Xóa phần tử
    removed = linked_list.pop_front()
    if removed is not None:
        print(f"Đã xóa phần tử đầu: {removed}")

    print(f"LinkedList sau khi xóa: {linked_list.display()}")
    print(f"Kích thước: {linked_list.get_size()}")

    # Thêm phần tử mới
    linked_list.push_front(0)
    print("Thêm phần tử 0 vào đầu:")
    print(f"LinkedList: {linked_list.display()}")

    # Hiển thị thông tin cuối cùng
    print(f"Danh sách có rỗng không? {linked_list.is_empty()}")
    print(f"Kích thước cuối cùng: {linked_list.get_size()}")

if __name__ == "__main__":
    main()`
  });

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

  // Animation functions for interactive visualization
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateSearch = async () => {
    const searchVal = parseInt(searchValue);
    if (isNaN(searchVal)) {
      setAnimationStep("❌ Giá trị tìm kiếm không hợp lệ!");
      return;
    }

    setIsAnimating(true);
    setAnimationStep(`🔍 Bắt đầu tìm kiếm giá trị ${searchVal} trong linked list...`);
    await sleep(1000);

    // Traverse the linked list
    for (let i = 0; i < animationList.length; i++) {
      setHighlightedIndex(i);
      setAnimationStep(`🔍 Node ${i}: ${animationList[i]} ${animationList[i] === searchVal ? '= ✅' : '≠'} ${searchVal}`);
      await sleep(1200);

      if (animationList[i] === searchVal) {
        setAnimationStep(`🎉 Tìm thấy ${searchVal} tại node ${i}! (Độ phức tạp: O(n))`);
        await sleep(2000);
        setHighlightedIndex(null);
        setIsAnimating(false);
        return;
      }
    }

    setAnimationStep(`❌ Không tìm thấy ${searchVal} trong linked list! (Đã duyệt ${animationList.length} nodes)`);
    await sleep(2000);
    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateInsertHead = async () => {
    const newValue = parseInt(insertValue);
    if (isNaN(newValue)) return;

    setIsAnimating(true);
    setAnimationStep(`➕ Thêm ${newValue} vào đầu linked list...`);
    await sleep(1000);

    setAnimationList([newValue, ...animationList]);
    setHighlightedIndex(0);
    setAnimationStep(`✅ Đã thêm ${newValue} vào đầu! Kích thước: ${animationList.length + 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
    setInsertValue("");
  };

  const animateInsertTail = async () => {
    const newValue = parseInt(insertValue);
    if (isNaN(newValue)) return;

    setIsAnimating(true);
    setAnimationStep(`➕ Thêm ${newValue} vào cuối linked list...`);

    // Show traversal to end
    for (let i = 0; i < animationList.length; i++) {
      setHighlightedIndex(i);
      setAnimationStep(`🚶 Duyệt đến node ${i} để tìm cuối list...`);
      await sleep(600);
    }

    setAnimationList([...animationList, newValue]);
    setHighlightedIndex(animationList.length);
    setAnimationStep(`✅ Đã thêm ${newValue} vào cuối! Kích thước: ${animationList.length + 1} (Độ phức tạp: O(n))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
    setInsertValue("");
  };

  const animateRemoveHead = async () => {
    if (animationList.length === 0) {
      setAnimationStep("❌ Linked list đã rỗng!");
      return;
    }

    setIsAnimating(true);
    const removedValue = animationList[0];

    setHighlightedIndex(0);
    setAnimationStep(`➖ Xóa node đầu: ${removedValue}...`);
    await sleep(1000);

    setAnimationList(animationList.slice(1));
    setAnimationStep(`✅ Đã xóa ${removedValue}! Kích thước: ${animationList.length - 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateRemoveTail = async () => {
    if (animationList.length === 0) {
      setAnimationStep("❌ Linked list đã rỗng!");
      return;
    }

    setIsAnimating(true);
    const lastIndex = animationList.length - 1;
    const removedValue = animationList[lastIndex];

    // Show traversal to find the second-to-last node
    for (let i = 0; i < lastIndex; i++) {
      setHighlightedIndex(i);
      setAnimationStep(`🚶 Duyệt đến node ${i} để tìm node cuối...`);
      await sleep(600);
    }

    setHighlightedIndex(lastIndex);
    setAnimationStep(`➖ Xóa node cuối: ${removedValue}...`);
    await sleep(1000);

    setAnimationList(animationList.slice(0, -1));
    setAnimationStep(`✅ Đã xóa ${removedValue}! Kích thước: ${animationList.length - 1} (Độ phức tạp: O(n))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const resetLinkedList = () => {
    setAnimationList([10, 25, 8]);
    setHighlightedIndex(null);
    setAnimationStep("");
  };

  // Code running functions
  const getLanguageId = (lang: string): number => {
    const languageMap: Record<string, number> = {
      rust: 73,
      cpp: 54,
      python: 71,
    };
    return languageMap[lang] || 54;
  };

  const getCurrentCode = (): string => {
    return codeState[activeLanguageTab as keyof typeof codeState] || "";
  };

  const updateCode = (newCode: string) => {
    setCodeState(prev => ({
      ...prev,
      [activeLanguageTab]: newCode
    }));
  };

  const handleRunCode = async (input: string) => {
    setIsRunningCode(true);
    setCodeOutput("Đang chạy code...");
    setShowOutput(true);

    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: getCurrentCode(),
          language_id: getLanguageId(activeLanguageTab),
          stdin: input
        }),
      });

      const result = await response.json();

      if (result.error) {
        setCodeOutput(`Lỗi: ${result.error}`);
      } else if (result.logs && result.logs.length > 0) {
        setCodeOutput(result.logs.join('\n'));
      } else {
        setCodeOutput('Code chạy thành công nhưng không có output.');
      }
    } catch (error) {
      setCodeOutput(`Lỗi kết nối: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <List className="h-6 w-6 text-emerald-500" />
            Danh Sách Liên Kết
          </h3>
          <p className="text-muted-foreground">
            Cấu trúc dữ liệu động với các node liên kết, hiệu quả cho thao tác chèn/xóa O(1).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div></div>

          {/* Navigation Pills */}
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
          <button
            onClick={() => setActiveSection("overview")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeSection === "overview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📚 Tổng quan
          </button>
          <button
            onClick={() => setActiveSection("interactive")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeSection === "interactive"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎮 Tương tác
          </button>
          <button
            onClick={() => setActiveSection("implementation")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeSection === "implementation"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💻 Cài đặt
          </button>
        </div>
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="space-y-8">
          {/* Linked List Definition */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                🔗
              </div>
              <div>
                <h4 className="text-lg font-semibold">Danh Sách Liên Kết</h4>
                <p className="text-sm text-muted-foreground">Dynamic data structure với nodes liên kết</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <h5 className="font-medium text-emerald-700 dark:text-emerald-400">Ưu điểm</h5>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Kích thước động
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Chèn/xóa O(1)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Flexible memory
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <h5 className="font-medium text-red-700 dark:text-red-400">Nhược điểm</h5>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Truy cập chậm O(n)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Extra memory overhead
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
                    Poor cache locality
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases & Applications */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                🎯
              </div>
              <div>
                <h4 className="text-lg font-semibold">Ứng Dụng Thực Tế</h4>
                <p className="text-sm text-muted-foreground">Các trường hợp sử dụng phổ biến</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Ứng dụng phổ biến
              </h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    ↶
                  </div>
                  <span>Undo/Redo operations</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    🌐
                  </div>
                  <span>Browser history</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    🎵
                  </div>
                  <span>Music playlists</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    📚
                  </div>
                  <span>Stack/Queue implementation</span>
                </div>
              </div>
            </div>

            {/* Complexity Comparison */}
            <div className="rounded-lg border bg-card p-4">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                Độ phức tạp so với Array
              </h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Truy cập</span>
                  <code className="text-xs font-mono bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded">O(n)</code>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Tìm kiếm</span>
                  <code className="text-xs font-mono bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded">O(n)</code>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Thêm đầu</span>
                  <code className="text-xs font-mono bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">O(1)</code>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Xóa đầu</span>
                  <code className="text-xs font-mono bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">O(1)</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Section */}
      {activeSection === "interactive" && (
        <div className="space-y-8">
          {/* Interactive Linked List Visualization */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                🎮
              </div>
              <div>
                <h4 className="text-lg font-semibold">Minh Họa Tương Tác</h4>
                <p className="text-sm text-muted-foreground">
                  Thao tác trực tiếp với linked list để hiểu cách hoạt động
                </p>
              </div>
            </div>

            {/* Linked List Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-6 overflow-x-auto pb-4">
                <div className="flex items-center gap-3 min-w-max">
                  {/* HEAD pointer */}
                  {animationList.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 h-4">HEAD</div>
                      <div className="bg-orange-500 text-white px-2 py-2 rounded font-bold text-sm">
                        →
                      </div>
                    </div>
                  )}

                  {/* Linked List Nodes */}
                  {animationList.map((value, index) => (
                    <div key={`${index}-${value}`} className="flex items-center gap-2">
                      {/* Node */}
                      <div className="flex flex-col items-center group">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 h-4">
                          Node {index}
                        </div>
                        <div
                          className={`flex items-center border-2 rounded-lg transition-all duration-500 ${
                            highlightedIndex === index
                              ? "border-red-500 scale-110 shadow-xl"
                              : "border-green-300 dark:border-green-600 hover:scale-105"
                          }`}
                        >
                          {/* Data part */}
                          <div
                            className={`px-3 py-2 rounded-l-lg font-bold text-base ${
                              highlightedIndex === index
                                ? "bg-yellow-400 animate-pulse text-black"
                                : "bg-green-100 dark:bg-green-800 group-hover:bg-green-200 dark:group-hover:bg-green-700"
                            }`}
                          >
                            {value}
                          </div>
                          {/* Pointer part */}
                          <div
                            className={`px-2 py-2 rounded-r-lg text-sm font-mono ${
                              highlightedIndex === index
                                ? "bg-yellow-300 text-black"
                                : "bg-green-200 dark:bg-green-700 group-hover:bg-green-300 dark:group-hover:bg-green-600"
                            }`}
                          >
                            {index < animationList.length - 1 ? "→" : "∅"}
                          </div>
                        </div>
                      </div>

                      {/* Arrow between nodes */}
                      {index < animationList.length - 1 && (
                        <div className="text-green-500 text-xl">→</div>
                      )}
                    </div>
                  ))}

                  {/* NULL at the end */}
                  {animationList.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 h-4">NULL</div>
                      <div className="bg-red-500 text-white px-2 py-2 rounded font-bold text-sm">
                        ∅
                      </div>
                    </div>
                  )}

                  {animationList.length === 0 && (
                    <div className="text-gray-500 italic text-center p-8 bg-gray-50 dark:bg-slate-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-2xl mb-1">🔗</div>
                      <div className="text-sm font-semibold mb-1">Linked List rỗng</div>
                      <div className="text-xs">Hãy thêm node để bắt đầu</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Animation status */}
              {animationStep && (
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 mb-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className={isAnimating ? "animate-spin" : ""}>⚡</div>
                    <div className="font-semibold text-orange-800 dark:text-orange-300 text-lg">
                      {animationStep}
                    </div>
                  </div>
                </div>
              )}

              {/* List info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">🔗</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Nodes</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{animationList.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">📍</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Head</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {animationList.length > 0 ? animationList[0] : "NULL"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">🎯</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tail</div>
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {animationList.length > 0 ? animationList[animationList.length - 1] : "NULL"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Search */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <div>
                    <h5 className="font-bold text-blue-700 dark:text-blue-400 text-sm">Tìm Kiếm</h5>
                    <p className="text-xs text-blue-600 dark:text-blue-500 font-mono">O(n)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Nhập giá trị cần tìm"
                    className="w-full px-3 py-2 border-2 border-blue-200 dark:border-blue-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateSearch}
                    disabled={isAnimating || animationList.length === 0}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    🔍 Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Insert at Head */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <div>
                    <h5 className="font-bold text-green-700 dark:text-green-400 text-sm">Thêm Đầu</h5>
                    <p className="text-xs text-green-600 dark:text-green-500 font-mono">O(1)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={insertValue}
                    onChange={(e) => setInsertValue(e.target.value)}
                    placeholder="Nhập giá trị mới"
                    className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateInsertHead}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ➕ Thêm đầu
                  </button>
                </div>
              </div>

              {/* Insert at Tail */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-purple-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <div>
                    <h5 className="font-bold text-purple-700 dark:text-purple-400 text-sm">Thêm Cuối</h5>
                    <p className="text-xs text-purple-600 dark:text-purple-500 font-mono">O(n)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={animateInsertTail}
                    disabled={isAnimating || !insertValue}
                    className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ➕ Thêm cuối
                  </button>
                  <button
                    onClick={animateRemoveHead}
                    disabled={isAnimating || animationList.length === 0}
                    className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ➖ Xóa đầu
                  </button>
                </div>
              </div>

              {/* Remove and Reset */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-orange-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🛠️
                  </div>
                  <div>
                    <h5 className="font-bold text-orange-700 dark:text-orange-400 text-sm">Điều Khiển</h5>
                    <p className="text-xs text-orange-600 dark:text-orange-500">Quản lý list</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={animateRemoveTail}
                    disabled={isAnimating || animationList.length === 0}
                    className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ➖ Xóa cuối
                  </button>
                  <button
                    onClick={resetLinkedList}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Operation Explanations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    ⚡
                  </div>
                  <h6 className="font-bold text-green-700 dark:text-green-300">Thêm vào đầu O(1)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Chỉ cần tạo node mới và cập nhật pointer HEAD, không phụ thuộc vào kích thước list.
                  Thao tác này luôn nhanh và hiệu quả.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    🔍
                  </div>
                  <h6 className="font-bold text-blue-700 dark:text-blue-300">Tìm kiếm/Thêm cuối O(n)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Phải duyệt từ đầu đến cuối để tìm vị trí cần thiết.
                  Trường hợp xấu nhất: kiểm tra tất cả n node.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Section */}
      {activeSection === "implementation" && (
        <div className="space-y-6">
          {/* WASM LinkedList Demo */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                🦀
              </div>
              <div>
                <h4 className="text-lg font-semibold">Rust WASM LinkedList</h4>
                <p className="text-sm text-muted-foreground">
                  Demo tương tác với Rust WebAssembly
                </p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex gap-3 mb-4 flex-wrap">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập số"
                  className="flex-1 min-w-[120px] px-4 py-2 border-2 border-orange-200 dark:border-orange-700 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-700 transition-all"
                />
                <button
                  onClick={addToHead}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
                >
                  🦀 Thêm đầu
                </button>
                <button
                  onClick={addToTail}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
                >
                  🦀 Thêm cuối
                </button>
                <button
                  onClick={removeHead}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
                >
                  🦀 Xóa đầu
                </button>
                <button
                  onClick={removeTail}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
                >
                  🦀 Xóa cuối
                </button>
                <button
                  onClick={clear}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
                >
                  🧹 Xóa tất cả
                </button>
              </div>

              {result && (
                <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                  <strong>Kết quả:</strong> {result}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm overflow-x-auto min-h-[60px] items-center">
                {listDisplay.length === 0 ? (
                  <div className="text-gray-500 italic text-center flex-1 py-4">
                    🔗 LinkedList rỗng - Hãy thêm node
                  </div>
                ) : (
                  <>
                    <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">🦀 HEAD</div>
                    {listDisplay.map((value, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="border-2 border-orange-500 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-2">
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">Data: {value}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Next: {index < listDisplay.length - 1 ? "→" : "NULL"}
                            </div>
                          </div>
                        </div>
                        {index < listDisplay.length - 1 && <span className="text-orange-500 text-lg">→</span>}
                      </div>
                    ))}
                    <span className="text-red-500 font-bold">NULL</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white text-sm">
                💻
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  Cài Đặt Chi Tiết
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Mã nguồn trong các ngôn ngữ phổ biến
                </p>
              </div>
            </div>

            {/* Language Tabs and Run Button */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveLanguageTab("rust")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeLanguageTab === "rust"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  🦀 Rust
                </button>
                <button
                  onClick={() => setActiveLanguageTab("cpp")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeLanguageTab === "cpp"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  ⚡ C++
                </button>
                <button
                  onClick={() => setActiveLanguageTab("python")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeLanguageTab === "python"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  🐍 Python
                </button>
              </div>

              {/* Play Button */}
              <SmartCodeRunner
                code={getCurrentCode()}
                language={activeLanguageTab}
                onRun={handleRunCode}
                isRunning={isRunningCode}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
                buttonText="▶️ Chạy Code"
              />
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border">

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded ${
                    activeLanguageTab === "rust" ? "bg-orange-100 dark:bg-orange-900/30" :
                    activeLanguageTab === "cpp" ? "bg-blue-100 dark:bg-blue-900/30" :
                    "bg-green-100 dark:bg-green-900/30"
                  }`}>
                    {activeLanguageTab === "rust" ? "🦀" :
                     activeLanguageTab === "cpp" ? "⚡" : "🐍"}
                  </div>
                  <h5 className={`text-lg font-bold ${
                    activeLanguageTab === "rust" ? "text-orange-700 dark:text-orange-300" :
                    activeLanguageTab === "cpp" ? "text-blue-700 dark:text-blue-300" :
                    "text-green-700 dark:text-green-300"
                  }`}>
                    {activeLanguageTab === "rust" ? "LinkedList trong Rust" :
                     activeLanguageTab === "cpp" ? "LinkedList trong C++" :
                     "LinkedList trong Python"}
                  </h5>
                </div>

                {/* Monaco Editor */}
                <div className="relative">
                  <EditableCodeEditor
                    code={getCurrentCode()}
                    onChange={updateCode}
                    language={activeLanguageTab}
                    height="400px"
                    theme="vs-dark"
                  />
                  <div className="absolute top-2 right-2 text-xs text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg z-10">
                    {activeLanguageTab.toUpperCase()} - Có thể chỉnh sửa
                  </div>
                </div>

                {/* Code Templates */}
                <div className="flex gap-2 flex-wrap items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        const defaultCode = codeState[activeLanguageTab as keyof typeof codeState];
                        updateCode(defaultCode);
                      }}
                      className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                    >
                      🔄 Reset về mẫu gốc
                    </button>
                    <button
                      onClick={() => updateCode("")}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                    >
                      🗑️ Xóa tất cả
                    </button>

                    <div className="text-xs text-gray-500 flex items-center">
                      💡 Mẹo: Chỉnh sửa code và nhấn "▶️ Chạy Code" để xem kết quả
                    </div>
                  </div>

                  {/* Play Button */}
                  <SmartCodeRunner
                    code={getCurrentCode()}
                    language={activeLanguageTab}
                    onRun={handleRunCode}
                    isRunning={isRunningCode}
                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
                    buttonText="▶️ Chạy Code"
                  />
                </div>
              </div>
            </div>

            {/* Output Section */}
            {showOutput && (
              <div className="mt-6 bg-slate-900 dark:bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white">
                    📺
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white">Kết quả chạy</h5>
                    <p className="text-gray-400 text-sm">Output từ {activeLanguageTab} code</p>
                  </div>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-black rounded-lg p-4 border border-gray-600">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {codeOutput || "Chưa có output..."}
                  </pre>
                </div>
                {isRunningCode && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400">
                    <div className="animate-spin">⚙️</div>
                    <span className="text-sm">Đang thực thi code...</span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

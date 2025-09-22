"use client";

import { useState } from "react";
import { List } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

interface ListNode {
  value: number;
  next?: ListNode;
}

export function LinkedListsSection() {
  const [list, setList] = useState<ListNode | null>(null);
  const [inputValue, setInputValue] = useState("");

  const addToHead = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newNode: ListNode = { value, next: list || undefined };
      setList(newNode);
      setInputValue("");
    }
  };

  const removeHead = () => {
    if (list) {
      setList(list.next || null);
    }
  };

  const listToArray = (node: ListNode | null): number[] => {
    const result: number[] = [];
    let current = node;
    while (current) {
      result.push(current.value);
      current = current.next || null;
    }
    return result;
  };

  const listArray = listToArray(list);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <List className="h-5 w-5" />
          Danh Sách Liên Kết
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Danh sách liên kết là cấu trúc dữ liệu tuyến tính, trong đó các phần tử được lưu trữ trong các nút, và mỗi nút chứa dữ liệu và tham chiếu đến nút tiếp theo.
        </p>

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
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={addToHead}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Thêm vào đầu
              </button>
              <button
                onClick={removeHead}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa đầu
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              {listArray.length === 0 ? (
                <div className="text-gray-500 italic">Danh sách rỗng</div>
              ) : (
                <>
                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">HEAD</div>
                  {listArray.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="border-2 border-blue-500 p-2 rounded bg-blue-50 dark:bg-blue-900">
                        <div className="text-xs text-gray-600 dark:text-gray-300">Data: {value}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          Next: {index < listArray.length - 1 ? "→" : "NULL"}
                        </div>
                      </div>
                      {index < listArray.length - 1 && <span className="text-blue-500">→</span>}
                    </div>
                  ))}
                  <span className="text-red-500">NULL</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`#[derive(Debug)]
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
}`}
            </pre>
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
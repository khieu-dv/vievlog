"use client";

import { useState } from "react";
import {
  Binary,
  GitBranch,
  Layout,
  List,
  Network,
  Search,
  Shuffle,
  SortAsc,
  TreePine,
  Activity
} from "lucide-react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

// Import Rust WASM functions (will be implemented later)
// import init, {
//   create_vector,
//   vector_push,
//   create_binary_tree,
//   tree_insert,
//   bubble_sort,
//   quick_sort,
//   binary_search,
//   linear_search
// } from "rust-wasm/pkg/vievlog_rust";

interface TabProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const tabs: TabProps[] = [
  {
    id: "arrays",
    title: "Mảng & Vector",
    icon: Layout,
    content: <ArraysContent />
  },
  {
    id: "linked-lists",
    title: "Danh Sách Liên Kết",
    icon: List,
    content: <LinkedListsContent />
  },
  {
    id: "trees",
    title: "Cây",
    icon: TreePine,
    content: <TreesContent />
  },
  {
    id: "graphs",
    title: "Đồ Thị",
    icon: Network,
    content: <GraphsContent />
  },
  {
    id: "sorting",
    title: "Sắp Xếp",
    icon: SortAsc,
    content: <SortingContent />
  },
  {
    id: "searching",
    title: "Tìm Kiếm",
    icon: Search,
    content: <SearchingContent />
  }
];

function ArraysContent() {
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
        </div>
      </div>
    </div>
  );
}

function LinkedListsContent() {
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
            <h4 className="font-medium mb-2">Biểu Diễn Trực Quan:</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="border-2 border-blue-500 p-2 rounded">
                Dữ liệu: 1 | Tiếp: →
              </div>
              <span>→</span>
              <div className="border-2 border-blue-500 p-2 rounded">
                Dữ liệu: 2 | Tiếp: →
              </div>
              <span>→</span>
              <div className="border-2 border-blue-500 p-2 rounded">
                Dữ liệu: 3 | Tiếp: NULL
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation:</h4>
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
        </div>
      </div>
    </div>
  );
}

function TreesContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TreePine className="h-5 w-5" />
          Cây Nhị Phân
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cây nhị phân là cấu trúc dữ liệu phân cấp, trong đó mỗi nút có tối đa hai con, được gọi là con trái và con phải.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Cây Nhị Phân:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    subgraph "Cây Tìm Kiếm Nhị Phân"
                        A[50] --> B[30]
                        A --> C[70]
                        B --> D[20]
                        B --> E[40]
                        C --> F[60]
                        C --> G[80]
                        D --> D1[10]
                        D --> D2[25]
                        E --> E1[35]
                        E --> E2[45]

                        style A fill:#4CAF50,color:#fff
                        style B fill:#2196F3,color:#fff
                        style C fill:#2196F3,color:#fff
                        style D fill:#FF9800,color:#fff
                        style E fill:#FF9800,color:#fff
                        style F fill:#FF9800,color:#fff
                        style G fill:#FF9800,color:#fff
                    end

                    subgraph "Quy Tắc BST"
                        ROOT["Gốc: 50"]
                        LEFT["Trái ≤ Cha"]
                        RIGHT["Phải ≥ Cha"]
                        ROOT -.-> LEFT
                        ROOT -.-> RIGHT
                    end
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thuộc Tính Cây Tìm Kiếm Nhị Phân:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Giá trị con trái ≤ Giá trị cha</li>
              <li>Giá trị con phải ≥ Giá trị cha</li>
              <li>Cả cây con trái và phải đều là BST</li>
              <li>Duyệt theo thứ tự cho dãy đã sắp xếp</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {`#[derive(Debug)]
struct TreeNode<T> {
    value: T,
    left: Option<Box<TreeNode<T>>>,
    right: Option<Box<TreeNode<T>>>,
}

impl<T: Ord> TreeNode<T> {
    fn new(value: T) -> Self {
        TreeNode {
            value,
            left: None,
            right: None,
        }
    }

    fn insert(&mut self, value: T) {
        if value <= self.value {
            match &mut self.left {
                Some(left) => left.insert(value),
                None => self.left = Some(Box::new(TreeNode::new(value))),
            }
        } else {
            match &mut self.right {
                Some(right) => right.insert(value),
                None => self.right = Some(Box::new(TreeNode::new(value))),
            }
        }
    }

    fn search(&self, value: &T) -> bool {
        match value.cmp(&self.value) {
            std::cmp::Ordering::Equal => true,
            std::cmp::Ordering::Less => {
                self.left.as_ref().map_or(false, |left| left.search(value))
            }
            std::cmp::Ordering::Greater => {
                self.right.as_ref().map_or(false, |right| right.search(value))
            }
        }
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Đồ Thị
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Đồ thị là tập hợp các đỉnh (nút) được kết nối bởi các cạnh. Đồ thị có thể biểu diễn mạng lưới, mối quan hệ và nhiều vấn đề thực tế.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Các Loại Đồ Thị:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Đồ Thị Có Hướng"
                        A1[A] --> B1[B]
                        B1 --> C1[C]
                        C1 --> A1
                        A1 --> D1[D]
                    end

                    subgraph "Đồ Thị Vô Hướng"
                        A2[A] --- B2[B]
                        B2 --- C2[C]
                        C2 --- D2[D]
                        A2 --- D2
                        B2 --- D2
                    end

                    subgraph "Đồ Thị Có Trọng Số"
                        A3[A] -->|5| B3[B]
                        B3 -->|3| C3[C]
                        A3 -->|8| C3
                        C3 -->|2| D3[D]
                        A3 -->|7| D3
                    end

                    style A1 fill:#4CAF50,color:#fff
                    style A2 fill:#2196F3,color:#fff
                    style A3 fill:#FF9800,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Loại Đồ Thị:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Đồ Thị Có Hướng:</strong> Cạnh có hướng (A → B)
              </div>
              <div>
                <strong>Đồ Thị Vô Hướng:</strong> Cạnh hai chiều (A ↔ B)
              </div>
              <div>
                <strong>Đồ Thị Có Trọng Số:</strong> Cạnh có trọng số/chi phí
              </div>
              <div>
                <strong>Đồ Thị Không Trọng Số:</strong> Tất cả cạnh có trọng số bằng nhau
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation (Adjacency List):</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {`use std::collections::HashMap;

#[derive(Debug)]
struct Graph<T> {
    adjacency_list: HashMap<T, Vec<T>>,
}

impl<T: Clone + Eq + std::hash::Hash> Graph<T> {
    fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    fn add_vertex(&mut self, vertex: T) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    fn add_edge(&mut self, from: T, to: T) {
        self.adjacency_list
            .entry(from.clone())
            .or_insert(Vec::new())
            .push(to.clone());

        // For undirected graph, add reverse edge
        self.adjacency_list
            .entry(to)
            .or_insert(Vec::new())
            .push(from);
    }

    fn get_neighbors(&self, vertex: &T) -> Option<&Vec<T>> {
        self.adjacency_list.get(vertex)
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortingContent() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);

  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    setSorting(false);
  };

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SortAsc className="h-5 w-5" />
          Giải Thuật Sắp Xếp
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Giải thuật sắp xếp sắp xếp các phần tử theo thứ tự nhất định. Dưới đây là một số giải thuật sắp xếp phổ biến và cách cài đặt.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Sắp Xếp Nổi Bọt Tương Tác:</h4>
            <div className="flex gap-2 mb-3">
              <button
                onClick={bubbleSort}
                disabled={sorting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {sorting ? "Đang sắp xếp..." : "Bắt đầu Sắp xếp nổi bọt"}
              </button>
              <button
                onClick={resetArray}
                disabled={sorting}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Đặt lại
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 border rounded text-center"
                  style={{
                    height: `${20 + value}px`,
                    minWidth: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Luồng Thuật Toán Sắp Xếp:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    START([Bắt đầu]) --> INPUT[Mảng đầu vào]
                    INPUT --> CHECK{Kích thước > 1?}
                    CHECK -->|Không| END([Kết thúc])
                    CHECK -->|Có| BUBBLE[Bubble Sort]

                    BUBBLE --> OUTER[i = 0 đến n-1]
                    OUTER --> INNER[j = 0 đến n-i-2]
                    INNER --> COMPARE{"arr[j] > arr[j+1]?"}
                    COMPARE -->|Có| SWAP["Hoán đổi arr[j], arr[j+1]"]
                    COMPARE -->|Không| NEXT_J[j++]
                    SWAP --> NEXT_J
                    NEXT_J --> CHECK_J{j < n-i-1?}
                    CHECK_J -->|Có| INNER
                    CHECK_J -->|Không| NEXT_I[i++]
                    NEXT_I --> CHECK_I{i < n-1?}
                    CHECK_I -->|Có| OUTER
                    CHECK_I -->|Không| SORTED[Mảng đã sắp xếp]
                    SORTED --> END

                    style START fill:#4CAF50,color:#fff
                    style END fill:#F44336,color:#fff
                    style SWAP fill:#FF9800,color:#fff
                    style SORTED fill:#2196F3,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementations:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {`// Bubble Sort - O(n²)
fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

// Quick Sort - O(n log n) average
fn quick_sort<T: Ord>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = partition(arr);
    quick_sort(&mut arr[0..pivot]);
    quick_sort(&mut arr[pivot + 1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
    let pivot = arr.len() - 1;
    let mut i = 0;

    for j in 0..pivot {
        if arr[j] <= arr[pivot] {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, pivot);
    i
}

// Merge Sort - O(n log n) always
fn merge_sort<T: Ord + Clone>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort(&mut arr[0..mid]);
    merge_sort(&mut arr[mid..]);

    let mut temp = arr.to_vec();
    merge(&arr[0..mid], &arr[mid..], &mut temp);
    arr.copy_from_slice(&temp);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchingContent() {
  const [searchArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");

  const binarySearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) return;

    let left = 0;
    let right = searchArray.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (searchArray[mid] === target) {
        setSearchResult(`Found ${target} at index ${mid}`);
        return;
      } else if (searchArray[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    setSearchResult(`${target} not found in array`);
  };

  const linearSearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) return;

    for (let i = 0; i < searchArray.length; i++) {
      if (searchArray[i] === target) {
        setSearchResult(`Found ${target} at index ${i} (Linear Search)`);
        return;
      }
    }
    setSearchResult(`${target} not found in array (Linear Search)`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Giải Thuật Tìm Kiếm
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Giải thuật tìm kiếm tìm vị trí của giá trị mục tiêu trong cấu trúc dữ liệu.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Tìm Kiếm Tương Tác:</h4>
            <div className="mb-3">
              <p className="text-sm mb-2">Mảng đã sắp xếp: {searchArray.join(", ")}</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Nhập số cần tìm"
                  className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                />
                <button
                  onClick={binarySearch}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Tìm kiếm nhị phân
                </button>
                <button
                  onClick={linearSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Tìm kiếm tuyến tính
                </button>
              </div>
              {searchResult && (
                <div className="mt-2 p-2 bg-gray-200 dark:bg-slate-600 rounded text-sm">
                  {searchResult}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Thuật Toán Tìm Kiếm:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Tìm Kiếm Tuyến Tính"
                        LS_START([Bắt đầu]) --> LS_I[i = 0]
                        LS_I --> LS_CHECK{"arr[i] == target?"}
                        LS_CHECK -->|Có| LS_FOUND[Tìm thấy tại i]
                        LS_CHECK -->|Không| LS_NEXT[i++]
                        LS_NEXT --> LS_END_CHECK{i < length?}
                        LS_END_CHECK -->|Có| LS_CHECK
                        LS_END_CHECK -->|Không| LS_NOT_FOUND[Không tìm thấy]
                    end

                    subgraph "Tìm Kiếm Nhị Phân"
                        BS_START([Bắt đầu]) --> BS_INIT["left = 0, right = n-1"]
                        BS_INIT --> BS_CHECK{left <= right?}
                        BS_CHECK -->|Không| BS_NOT_FOUND[Không tìm thấy]
                        BS_CHECK -->|Có| BS_MID["mid = (left + right) / 2"]
                        BS_MID --> BS_COMPARE{"arr[mid] == target?"}
                        BS_COMPARE -->|Có| BS_FOUND[Tìm thấy tại mid]
                        BS_COMPARE -->|"arr[mid] < target"| BS_RIGHT[left = mid + 1]
                        BS_COMPARE -->|"arr[mid] > target"| BS_LEFT[right = mid - 1]
                        BS_RIGHT --> BS_CHECK
                        BS_LEFT --> BS_CHECK
                    end

                    style LS_FOUND fill:#4CAF50,color:#fff
                    style BS_FOUND fill:#4CAF50,color:#fff
                    style LS_NOT_FOUND fill:#F44336,color:#fff
                    style BS_NOT_FOUND fill:#F44336,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementations:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {`// Binary Search - O(log n) - requires sorted array
fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid = left + (right - left) / 2;

        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => {
                if mid == 0 { break; }
                right = mid - 1;
            }
        }
    }
    None
}

// Linear Search - O(n) - works on unsorted arrays
fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (index, item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

// Using built-in methods
fn search_examples() {
    let arr = vec![1, 3, 5, 7, 9];

    // Binary search (built-in)
    let result = arr.binary_search(&5);
    println!("{:?}", result); // Ok(2)

    // Linear search using iterator
    let pos = arr.iter().position(|&x| x == 5);
    println!("{:?}", pos); // Some(2)
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataStructuresPage() {
  const [activeTab, setActiveTab] = useState("arrays");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Binary className="h-8 w-8 text-blue-500" />
            Cấu Trúc Dữ Liệu & Giải Thuật
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Các ví dụ tương tác và cài đặt Rust cho các cấu trúc dữ liệu và giải thuật cơ bản.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>

        {/* Performance Comparison */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            So Sánh Độ Phức Tạp Giải Thuật
          </h3>

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Giải Thuật</th>
                  <th className="text-left py-2">Trường Hợp Tốt Nhất</th>
                  <th className="text-left py-2">Trường Hợp Trung Bình</th>
                  <th className="text-left py-2">Trường Hợp Xấu Nhất</th>
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
      </div>

      <Footer />
    </div>
  );
}
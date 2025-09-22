"use client";

import { useState, useEffect } from "react";
import { TreePine } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function TreesSection() {
  const [rustBST, setRustBST] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [treeDisplay, setTreeDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newBST = wasmInstance.dataStructures.createBST();
        setRustBST(newBST);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Binary Search Tree đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust BST
  const updateDisplayFromRustBST = () => {
    if (rustBST) {
      try {
        const inorderArray = Array.from(rustBST.inorderTraversal()) as number[];
        setTreeDisplay(inorderArray);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const insertValue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustBST) {
        try {
          rustBST.insert(value);
          const treeSize = rustBST.size();
          setResult(`🦀 Đã thêm ${value} vào cây. Kích thước: ${treeSize}`);
          updateDisplayFromRustBST();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM insert failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const searchInTree = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      if (wasmReady && rustBST) {
        try {
          const found = rustBST.search(value);
          if (found) {
            setResult(`🦀 Tìm thấy ${value} trong cây`);
          } else {
            setResult(`🦀 Không tìm thấy ${value} trong cây`);
          }
        } catch (error) {
          setResult("❌ Rust WASM search failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const removeValue = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      if (wasmReady && rustBST) {
        try {
          const removed = rustBST.remove(value);
          const treeSize = rustBST.size();
          if (removed) {
            setResult(`🦀 Đã xóa ${value} khỏi cây. Kích thước: ${treeSize}`);
          } else {
            setResult(`🦀 Không tìm thấy ${value} để xóa`);
          }
          updateDisplayFromRustBST();
        } catch (error) {
          setResult("❌ Rust WASM remove failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const clear = () => {
    if (wasmReady && rustBST) {
      try {
        rustBST.clear();
        setResult("🦀 Đã xóa toàn bộ cây");
        updateDisplayFromRustBST();
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
          <TreePine className="h-5 w-5" />
          🦀 Rust WASM Cây Tìm Kiếm Nhị Phân
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Cây Tìm Kiếm Nhị Phân sử dụng Rust WASM. BST được tối ưu hóa là cấu trúc dữ liệu phân cấp cho phép tìm kiếm, thêm và xóa hiệu quả với độ phức tạp O(log n).
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
            <h4 className="font-medium mb-2">Cây Tương Tác:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số để thêm"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={insertValue}
                disabled={!wasmReady}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                🦀 Thêm
              </button>
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập số để tìm/xóa"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={searchInTree}
                disabled={!wasmReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                🦀 Tìm kiếm
              </button>
              <button
                onClick={removeValue}
                disabled={!wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🦀 Xóa
              </button>
              <button
                onClick={clear}
                disabled={!wasmReady}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                🧹 Xóa hết
              </button>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}

            <div className="mb-3">
              <strong>🦀 Duyệt theo thứ tự (Inorder):</strong>
              <div className="flex gap-1 flex-wrap mt-1">
                {treeDisplay.length > 0 ? (
                  treeDisplay.map((value, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded text-sm">
                      {value}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">Cây rỗng</span>
                )}
              </div>
            </div>
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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <RustCodeEditor
              code={`#[derive(Debug)]
struct TreeNode<T> {
    value: T,
    left: Option<Box<TreeNode<T>>>,
    right: Option<Box<TreeNode<T>>>,
}

#[derive(Debug)]
struct BinarySearchTree<T: Ord> {
    root: Option<Box<TreeNode<T>>>,
    size: usize,
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

    fn inorder_traversal(&self, result: &mut Vec<&T>) {
        if let Some(left) = &self.left {
            left.inorder_traversal(result);
        }
        result.push(&self.value);
        if let Some(right) = &self.right {
            right.inorder_traversal(result);
        }
    }

    fn find_min(&self) -> &T {
        match &self.left {
            Some(left) => left.find_min(),
            None => &self.value,
        }
    }
}

impl<T: Ord> BinarySearchTree<T> {
    fn new() -> Self {
        BinarySearchTree {
            root: None,
            size: 0,
        }
    }

    fn insert(&mut self, value: T) {
        match &mut self.root {
            Some(root) => root.insert(value),
            None => self.root = Some(Box::new(TreeNode::new(value))),
        }
        self.size += 1;
    }

    fn search(&self, value: &T) -> bool {
        match &self.root {
            Some(root) => root.search(value),
            None => false,
        }
    }
}`}
              height="400px"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tìm kiếm (cân bằng):</strong> O(log n)
              </div>
              <div>
                <strong>Tìm kiếm (xấu nhất):</strong> O(n)
              </div>
              <div>
                <strong>Thêm (cân bằng):</strong> O(log n)
              </div>
              <div>
                <strong>Thêm (xấu nhất):</strong> O(n)
              </div>
              <div>
                <strong>Xóa (cân bằng):</strong> O(log n)
              </div>
              <div>
                <strong>Xóa (xấu nhất):</strong> O(n)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
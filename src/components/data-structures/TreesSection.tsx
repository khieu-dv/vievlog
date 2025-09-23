"use client";

import { useState, useEffect } from "react";
import { TreePine } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function TreesSection() {
  const [rustBST, setRustBST] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [treeDisplay, setTreeDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

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
        const inorderArray = Array.from(rustBST.inorder_traversal()) as number[];
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
          const treeSize = rustBST.len();
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
          const treeSize = rustBST.len();
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

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4 border-l-4 border-green-500">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🌳 Cây là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Cây (Tree)</strong> là cấu trúc dữ liệu phân cấp gồm các nút (node) được kết nối bởi các cạnh (edge).
            Mỗi cây có một nút gốc (root) và các nút con tạo thành cấu trúc phân nhánh.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">📝 Thuật ngữ:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Root: Nút gốc</li>
                <li>• Leaf: Nút lá</li>
                <li>• Parent/Child: Cha/Con</li>
                <li>• Height: Chiều cao</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">✅ Ưu điểm:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Tìm kiếm nhanh</li>
                <li>• Sắp xếp tự động</li>
                <li>• Duyệt có thứ tự</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-orange-600 dark:text-orange-400">⚠️ Lưu ý:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Có thể mất cân bằng</li>
                <li>• Tốn bộ nhớ pointer</li>
                <li>• Phức tạp hơn mảng</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4 border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">🔍 Cây Tìm Kiếm Nhị Phân (BST)</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>BST</strong> là cây nhị phân đặc biệt với quy tắc:
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mx-1">trái &lt; gốc &lt; phải</span>
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mỗi nút có tối đa 2 con: con trái chứa giá trị nhỏ hơn, con phải chứa giá trị lớn hơn nút cha.
          </div>
        </div>

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
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <memory>
#include <iostream>
#include <vector>

template<typename T>
struct TreeNode {
    T value;
    std::unique_ptr<TreeNode<T>> left;
    std::unique_ptr<TreeNode<T>> right;

    TreeNode(T val) : value(val), left(nullptr), right(nullptr) {}
};

template<typename T>
class BinarySearchTree {
private:
    std::unique_ptr<TreeNode<T>> root;
    size_t size;

    void insertHelper(std::unique_ptr<TreeNode<T>>& node, T value) {
        if (!node) {
            node = std::make_unique<TreeNode<T>>(value);
            return;
        }

        if (value <= node->value) {
            insertHelper(node->left, value);
        } else {
            insertHelper(node->right, value);
        }
    }

    bool searchHelper(const std::unique_ptr<TreeNode<T>>& node, T value) const {
        if (!node) return false;

        if (value == node->value) return true;
        else if (value < node->value) return searchHelper(node->left, value);
        else return searchHelper(node->right, value);
    }

    void inorderHelper(const std::unique_ptr<TreeNode<T>>& node, std::vector<T>& result) const {
        if (!node) return;

        inorderHelper(node->left, result);
        result.push_back(node->value);
        inorderHelper(node->right, result);
    }

public:
    BinarySearchTree() : root(nullptr), size(0) {}

    void insert(T value) {
        insertHelper(root, value);
        size++;
    }

    bool search(T value) const {
        return searchHelper(root, value);
    }

    std::vector<T> inorderTraversal() const {
        std::vector<T> result;
        inorderHelper(root, result);
        return result;
    }

    size_t getSize() const { return size; }
};`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
        self.size = 0

    def insert(self, value):
        """Thêm giá trị vào cây"""
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert_helper(self.root, value)
        self.size += 1

    def _insert_helper(self, node, value):
        if value <= node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_helper(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_helper(node.right, value)

    def search(self, value):
        """Tìm kiếm giá trị trong cây"""
        return self._search_helper(self.root, value)

    def _search_helper(self, node, value):
        if node is None:
            return False

        if value == node.value:
            return True
        elif value < node.value:
            return self._search_helper(node.left, value)
        else:
            return self._search_helper(node.right, value)

    def inorder_traversal(self):
        """Duyệt cây theo thứ tự (in-order)"""
        result = []
        self._inorder_helper(self.root, result)
        return result

    def _inorder_helper(self, node, result):
        if node is not None:
            self._inorder_helper(node.left, result)
            result.append(node.value)
            self._inorder_helper(node.right, result)

    def remove(self, value):
        """Xóa giá trị khỏi cây"""
        self.root, removed = self._remove_helper(self.root, value)
        if removed:
            self.size -= 1
        return removed

    def _remove_helper(self, node, value):
        if node is None:
            return None, False

        if value < node.value:
            node.left, removed = self._remove_helper(node.left, value)
            return node, removed
        elif value > node.value:
            node.right, removed = self._remove_helper(node.right, value)
            return node, removed
        else:
            # Tìm thấy node cần xóa
            if node.left is None:
                return node.right, True
            elif node.right is None:
                return node.left, True
            else:
                # Node có 2 con
                min_node = self._find_min(node.right)
                node.value = min_node.value
                node.right, _ = self._remove_helper(node.right, min_node.value)
                return node, True

    def _find_min(self, node):
        while node.left is not None:
            node = node.left
        return node

    def get_size(self):
        return self.size

    def is_empty(self):
        return self.size == 0`}
                height="400px"
              />
            )}
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
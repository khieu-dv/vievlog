"use client";

import { useState } from "react";
import { TreePine } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }

  insert(value: number): void {
    if (value <= this.value) {
      if (this.left) {
        this.left.insert(value);
      } else {
        this.left = new TreeNode(value);
      }
    } else {
      if (this.right) {
        this.right.insert(value);
      } else {
        this.right = new TreeNode(value);
      }
    }
  }

  search(value: number): boolean {
    if (value === this.value) return true;
    if (value < this.value) {
      return this.left ? this.left.search(value) : false;
    } else {
      return this.right ? this.right.search(value) : false;
    }
  }

  inorderTraversal(): number[] {
    const result: number[] = [];
    if (this.left) result.push(...this.left.inorderTraversal());
    result.push(this.value);
    if (this.right) result.push(...this.right.inorderTraversal());
    return result;
  }
}

export function TreesSection() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");

  const insertValue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (tree) {
        tree.insert(value);
        setTree(new TreeNode(tree.value)); // Force re-render
        // Copy the tree structure
        const newTree = new TreeNode(tree.value);
        const copyTree = (original: TreeNode, copy: TreeNode) => {
          if (original.left) {
            copy.left = new TreeNode(original.left.value);
            copyTree(original.left, copy.left);
          }
          if (original.right) {
            copy.right = new TreeNode(original.right.value);
            copyTree(original.right, copy.right);
          }
        };
        copyTree(tree, newTree);
        newTree.insert(value);
        setTree(newTree);
      } else {
        setTree(new TreeNode(value));
      }
      setInputValue("");
    }
  };

  const searchInTree = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value) && tree) {
      const found = tree.search(value);
      setSearchResult(found ? `Tìm thấy ${value} trong cây` : `Không tìm thấy ${value} trong cây`);
    } else {
      setSearchResult("Cây rỗng hoặc giá trị không hợp lệ");
    }
  };

  const clearTree = () => {
    setTree(null);
    setSearchResult("");
  };

  const inorderResult = tree ? tree.inorderTraversal() : [];

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
            <h4 className="font-medium mb-2">Cây Tương Tác:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số để thêm"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={insertValue}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Thêm
              </button>
              <button
                onClick={clearTree}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa hết
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập số để tìm"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={searchInTree}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tìm kiếm
              </button>
            </div>

            {searchResult && (
              <div className="mb-3 p-2 bg-gray-200 dark:bg-slate-600 rounded text-sm">
                {searchResult}
              </div>
            )}

            <div className="mb-3">
              <strong>Duyệt theo thứ tự (Inorder):</strong>
              <div className="flex gap-1 flex-wrap mt-1">
                {inorderResult.length > 0 ? (
                  inorderResult.map((value, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-sm">
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
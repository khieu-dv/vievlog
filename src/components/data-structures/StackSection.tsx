"use client";

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function StackSection() {
  const [rustStack, setRustStack] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [stackDisplay, setStackDisplay] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [expression, setExpression] = useState("");
  const [balanceResult, setBalanceResult] = useState("");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newStack = wasmInstance.dataStructures.createStack();
        setRustStack(newStack);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Stack đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Helper function to update display array from Rust stack
  const updateDisplayFromRustStack = () => {
    if (rustStack) {
      try {
        const stackArray = Array.from(rustStack.to_array()) as number[];
        setStackDisplay(stackArray);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const push = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      if (wasmReady && rustStack) {
        try {
          rustStack.push(value);
          const wasmSize = rustStack.len();
          setResult(`🦀 Đã push ${value} vào stack. Kích thước: ${wasmSize}`);
          updateDisplayFromRustStack();
          setInputValue("");
        } catch (error) {
          setResult("❌ Rust WASM push failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const pop = () => {
    if (wasmReady && rustStack) {
      try {
        const poppedValue = rustStack.pop();
        const wasmSize = rustStack.len();
        if (poppedValue !== null && poppedValue !== undefined) {
          setResult(`🦀 Đã pop ${poppedValue} khỏi stack. Kích thước: ${wasmSize}`);
        } else {
          setResult(`🦀 Stack rỗng, không thể pop`);
        }
        updateDisplayFromRustStack();
      } catch (error) {
        setResult("❌ Rust WASM pop failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const peek = () => {
    if (wasmReady && rustStack) {
      try {
        const topValue = rustStack.peek();
        if (topValue !== null && topValue !== undefined) {
          setResult(`🦀 Phần tử trên đỉnh: ${topValue}`);
        } else {
          setResult(`🦀 Stack rỗng`);
        }
      } catch (error) {
        setResult("❌ Rust WASM peek failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const clear = () => {
    if (wasmReady && rustStack) {
      try {
        rustStack.clear();
        const wasmSize = rustStack.len();
        setResult(`🦀 Đã xóa toàn bộ stack. Kích thước: ${wasmSize}`);
        updateDisplayFromRustStack();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const checkExpressionBalance = () => {
    if (expression.trim() && wasmReady && wasm) {
      try {
        const result = wasm.algorithms.utils.isBalancedParentheses(expression);
        setBalanceResult(`🦀 Biểu thức "${expression}" ${result ? "Cân bằng" : "Không cân bằng"}`);
      } catch (error) {
        setBalanceResult("❌ Rust WASM error: " + error);
      }
    } else {
      setBalanceResult("❌ WASM chưa sẵn sàng hoặc biểu thức trống");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5" />
          🦀 Rust WASM Stack (Ngăn Xếp)
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Stack sử dụng Rust WASM. Stack được tối ưu hóa là cấu trúc dữ liệu LIFO (Last In, First Out) cho phép thêm và lấy phần tử chỉ ở một đầu gọi là đỉnh.
        </p>

        {result && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
            <strong>Kết quả:</strong> {result}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Stack Tương Tác:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={push}
                disabled={!wasmReady}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                🦀 Push
              </button>
              <button
                onClick={pop}
                disabled={!wasmReady}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                🦀 Pop
              </button>
              <button
                onClick={peek}
                disabled={!wasmReady}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                🦀 Peek
              </button>
              <button
                onClick={clear}
                disabled={!wasmReady}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                🧹 Clear
              </button>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">🦀 Stack hiện tại (đỉnh ở bên phải):</h5>
              <div className="flex items-end gap-1 min-h-16 p-3 bg-white dark:bg-slate-800 rounded border">
                {stackDisplay.length === 0 ? (
                  <div className="text-gray-500 italic">Stack rỗng</div>
                ) : (
                  stackDisplay.map((value, index) => (
                    <div
                      key={index}
                      className={`p-2 border-2 text-center ${
                        index === stackDisplay.length - 1
                          ? "border-orange-500 bg-orange-100 dark:bg-orange-900"
                          : "border-blue-500 bg-blue-100 dark:bg-blue-900"
                      }`}
                      style={{ minWidth: "40px" }}
                    >
                      {value}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Kiểm Tra Dấu Ngoặc Cân Bằng:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Nhập biểu thức (vd: (a+b)[c+d])"
                className="flex-1 px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={checkExpressionBalance}
                disabled={!wasmReady}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                🦀 Kiểm Tra
              </button>
            </div>
            {balanceResult && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {balanceResult}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Stack:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    subgraph "Stack Operations"
                        A[Push] --> B[Top]
                        B --> C[Element 3]
                        C --> D[Element 2]
                        D --> E[Element 1]
                        E --> F[Bottom]

                        G[Pop] --> B
                        H[Peek] -.-> B
                    end

                    style B fill:#FF9800,color:#fff
                    style A fill:#4CAF50,color:#fff
                    style G fill:#F44336,color:#fff
                    style H fill:#2196F3,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp Stack:</h4>
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
                    <td className="py-2 font-medium">Push</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">Thêm phần tử vào đỉnh</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Pop</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">Lấy phần tử từ đỉnh</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Peek/Top</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">Xem phần tử trên đỉnh</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Search</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Tìm kiếm phần tử</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {`// Stack implementation với Vec
#[derive(Debug)]
pub struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Stack {
            items: Vec::new(),
        }
    }

    pub fn push(&mut self, item: T) {
        self.items.push(item);
    }

    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    pub fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    pub fn len(&self) -> usize {
        self.items.len()
    }
}

// Kiểm tra dấu ngoặc cân bằng
fn is_balanced(expression: &str) -> bool {
    let mut stack = Vec::new();

    for ch in expression.chars() {
        match ch {
            '(' | '[' | '{' => stack.push(ch),
            ')' | ']' | '}' => {
                if let Some(last) = stack.pop() {
                    let matched = match (last, ch) {
                        ('(', ')') | ('[', ']') | ('{', '}') => true,
                        _ => false,
                    };
                    if !matched {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            _ => {} // Bỏ qua các ký tự khác
        }
    }

    stack.is_empty()
}

// Sử dụng
fn main() {
    let mut stack = Stack::new();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    println!("Top: {:?}", stack.peek()); // Some(3)
    println!("Pop: {:?}", stack.pop());  // Some(3)
    println!("Size: {}", stack.len());   // 2

    // Kiểm tra dấu ngoặc
    println!("{}", is_balanced("(a+b)[c+d]")); // true
    println!("{}", is_balanced("(a+b][c+d)")); // false
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
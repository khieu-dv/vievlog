"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

export function StackSection() {
  const [stack, setStack] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const push = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newStack = [...stack, value];
      setStack(newStack);
      setResult(`Đã push ${value} vào stack. Kích thước: ${newStack.length}`);
      setInputValue("");
    } else {
      setResult("Vui lòng nhập một số hợp lệ");
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      const poppedValue = stack[stack.length - 1];
      const newStack = stack.slice(0, -1);
      setStack(newStack);
      setResult(`Đã pop ${poppedValue} khỏi stack. Kích thước: ${newStack.length}`);
    } else {
      setResult("Stack trống, không thể pop");
    }
  };

  const peek = () => {
    if (stack.length > 0) {
      const topValue = stack[stack.length - 1];
      setResult(`Phần tử trên đỉnh: ${topValue}`);
    } else {
      setResult("Stack trống");
    }
  };

  const clear = () => {
    setStack([]);
    setResult("Đã xóa toàn bộ stack");
  };

  const checkBalance = (expression: string): string => {
    const stack: string[] = [];
    const opening = ['(', '[', '{'];
    const closing = [')', ']', '}'];
    const pairs: { [key: string]: string } = { ')': '(', ']': '[', '}': '{' };

    for (let char of expression) {
      if (opening.includes(char)) {
        stack.push(char);
      } else if (closing.includes(char)) {
        if (stack.length === 0 || stack.pop() !== pairs[char]) {
          return "Không cân bằng";
        }
      }
    }

    return stack.length === 0 ? "Cân bằng" : "Không cân bằng";
  };

  const [expression, setExpression] = useState("");
  const [balanceResult, setBalanceResult] = useState("");

  const checkExpressionBalance = () => {
    if (expression.trim()) {
      const result = checkBalance(expression);
      setBalanceResult(`Biểu thức "${expression}" ${result}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Stack (Ngăn Xếp)
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Stack là cấu trúc dữ liệu LIFO (Last In, First Out) - phần tử cuối cùng được thêm vào sẽ là phần tử đầu tiên được lấy ra.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thao Tác Stack:</h4>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={push}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Push
              </button>
              <button
                onClick={pop}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Pop
              </button>
              <button
                onClick={peek}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Peek
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
            <h4 className="font-medium mb-2">Trạng Thái Stack:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Kích thước:</strong> {stack.length}
              </p>
              <p className="text-sm">
                <strong>Top:</strong> {stack.length > 0 ? stack[stack.length - 1] : "Stack trống"}
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className="font-mono text-sm">
                  {stack.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">Stack trống</div>
                  ) : (
                    <div className="space-y-1">
                      {[...stack].reverse().map((value, index) => (
                        <div
                          key={stack.length - 1 - index}
                          className={`p-2 border-2 text-center ${
                            index === 0
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {value} {index === 0 && "← TOP"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Ứng Dụng: Kiểm Tra Dấu Ngoặc Cân Bằng:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Nhập biểu thức có dấu ngoặc: (a+b)[c+d]{e+f}"
                className="flex-1 px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={checkExpressionBalance}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Kiểm Tra
              </button>
            </div>
            {balanceResult && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
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
                        TOP[Top] --> ELEM3[Element 3]
                        ELEM3 --> ELEM2[Element 2]
                        ELEM2 --> ELEM1[Element 1]
                        ELEM1 --> BOTTOM[Bottom]

                        PUSH[Push Operation] --> TOP
                        POP[Pop Operation] --> TOP
                        PEEK[Peek Operation] --> TOP
                    end

                    subgraph "Stack Applications"
                        APP1[Function Calls]
                        APP2[Expression Evaluation]
                        APP3[Bracket Matching]
                        APP4[Undo Operations]
                        APP5[Browser History]
                    end

                    style TOP fill:#FF5722,color:#fff
                    style PUSH fill:#4CAF50,color:#fff
                    style POP fill:#F44336,color:#fff
                    style PEEK fill:#2196F3,color:#fff
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

    // Thêm phần tử vào đỉnh stack
    pub fn push(&mut self, item: T) {
        self.items.push(item);
    }

    // Lấy phần tử từ đỉnh stack
    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    // Xem phần tử trên đỉnh mà không lấy ra
    pub fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    // Kiểm tra stack có trống không
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // Lấy kích thước stack
    pub fn len(&self) -> usize {
        self.items.len()
    }
}

// Ứng dụng: Kiểm tra dấu ngoặc cân bằng
pub fn is_balanced(expression: &str) -> bool {
    let mut stack = Stack::new();
    let pairs = [('(', ')'), ('[', ']'), ('{', '}')];

    for ch in expression.chars() {
        match ch {
            '(' | '[' | '{' => stack.push(ch),
            ')' | ']' | '}' => {
                if let Some(top) = stack.pop() {
                    let mut matched = false;
                    for (open, close) in &pairs {
                        if top == *open && ch == *close {
                            matched = true;
                            break;
                        }
                    }
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
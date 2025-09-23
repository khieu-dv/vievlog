"use client";

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
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
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

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

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 border-l-4 border-red-500">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">📚 Stack là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Stack (Ngăn Xếp)</strong> là cấu trúc dữ liệu tuân theo nguyên tắc <strong>LIFO (Last In, First Out)</strong>.
            Giống như chồng sách: sách cuối cùng đặt lên sẽ là sách đầu tiên được lấy ra.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Undo/Redo trong editor</li>
                <li>• Function call stack</li>
                <li>• Browser back button</li>
                <li>• Kiểm tra ngoặc cân bằng</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">⚡ Thao tác chính:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• <strong>Push:</strong> Thêm vào đỉnh</li>
                <li>• <strong>Pop:</strong> Lấy từ đỉnh</li>
                <li>• <strong>Peek/Top:</strong> Xem đỉnh</li>
                <li>• <strong>IsEmpty:</strong> Kiểm tra rỗng</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg mb-4 border-l-4 border-pink-500">
          <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">💡 Tại sao dùng Stack?</h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Stack rất hiệu quả cho các bài toán cần "quay lại trạng thái trước":</strong>
            <br/>• Tất cả operations O(1) - cực nhanh
            <br/>• Memory hiệu quả - chỉ cần track đỉnh
            <br/>• Đơn giản implement và debug
          </div>
        </div>

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
                code={`// Stack implementation với Vec
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

    pub fn clear(&mut self) {
        self.items.clear();
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

// Chuyển đổi infix sang postfix (RPN)
fn infix_to_postfix(expression: &str) -> String {
    let mut output = Vec::new();
    let mut operator_stack = Vec::new();

    let precedence = |op: char| match op {
        '+' | '-' => 1,
        '*' | '/' => 2,
        '^' => 3,
        _ => 0,
    };

    for ch in expression.chars() {
        match ch {
            '0'..='9' | 'a'..='z' | 'A'..='Z' => output.push(ch.to_string()),
            '(' => operator_stack.push(ch),
            ')' => {
                while let Some(op) = operator_stack.pop() {
                    if op == '(' { break; }
                    output.push(op.to_string());
                }
            }
            '+' | '-' | '*' | '/' | '^' => {
                while let Some(&top) = operator_stack.last() {
                    if top == '(' || precedence(top) < precedence(ch) {
                        break;
                    }
                    output.push(operator_stack.pop().unwrap().to_string());
                }
                operator_stack.push(ch);
            }
            _ => {} // Bỏ qua khoảng trắng và ký tự khác
        }
    }

    while let Some(op) = operator_stack.pop() {
        output.push(op.to_string());
    }

    output.join(" ")
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

    // Chuyển đổi infix sang postfix
    println!("{}", infix_to_postfix("a+b*c")); // "a b c * +"
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <vector>
#include <stack>
#include <iostream>
#include <string>
#include <algorithm>

template<typename T>
class Stack {
private:
    std::vector<T> items;

public:
    void push(const T& item) {
        items.push_back(item);
    }

    T pop() {
        if (empty()) {
            throw std::runtime_error("Stack is empty");
        }
        T item = items.back();
        items.pop_back();
        return item;
    }

    const T& peek() const {
        if (empty()) {
            throw std::runtime_error("Stack is empty");
        }
        return items.back();
    }

    bool empty() const {
        return items.empty();
    }

    size_t size() const {
        return items.size();
    }

    void clear() {
        items.clear();
    }
};

// Kiểm tra dấu ngoặc cân bằng
bool isBalanced(const std::string& expression) {
    std::stack<char> stack;

    for (char ch : expression) {
        switch (ch) {
            case '(':
            case '[':
            case '{':
                stack.push(ch);
                break;
            case ')':
            case ']':
            case '}':
                if (stack.empty()) return false;
                {
                    char last = stack.top();
                    stack.pop();
                    bool matched = (last == '(' && ch == ')') ||
                                   (last == '[' && ch == ']') ||
                                   (last == '{' && ch == '}');
                    if (!matched) return false;
                }
                break;
        }
    }

    return stack.empty();
}

// Chuyển đổi infix sang postfix (RPN)
std::string infixToPostfix(const std::string& expression) {
    std::string result;
    std::stack<char> operatorStack;

    auto precedence = [](char op) {
        switch (op) {
            case '+': case '-': return 1;
            case '*': case '/': return 2;
            case '^': return 3;
            default: return 0;
        }
    };

    for (char ch : expression) {
        if (std::isalnum(ch)) {
            result += ch;
            result += ' ';
        } else if (ch == '(') {
            operatorStack.push(ch);
        } else if (ch == ')') {
            while (!operatorStack.empty() && operatorStack.top() != '(') {
                result += operatorStack.top();
                result += ' ';
                operatorStack.pop();
            }
            if (!operatorStack.empty()) {
                operatorStack.pop(); // Loại bỏ '('
            }
        } else if (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '^') {
            while (!operatorStack.empty() &&
                   operatorStack.top() != '(' &&
                   precedence(operatorStack.top()) >= precedence(ch)) {
                result += operatorStack.top();
                result += ' ';
                operatorStack.pop();
            }
            operatorStack.push(ch);
        }
    }

    while (!operatorStack.empty()) {
        result += operatorStack.top();
        result += ' ';
        operatorStack.pop();
    }

    return result;
}

// Tính toán biểu thức postfix
int evaluatePostfix(const std::string& expression) {
    std::stack<int> stack;
    std::istringstream iss(expression);
    std::string token;

    while (iss >> token) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            if (stack.size() < 2) {
                throw std::runtime_error("Invalid expression");
            }
            int b = stack.top(); stack.pop();
            int a = stack.top(); stack.pop();

            switch (token[0]) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
            }
        } else {
            stack.push(std::stoi(token));
        }
    }

    return stack.top();
}

// Sử dụng
int main() {
    Stack<int> stack;

    stack.push(1);
    stack.push(2);
    stack.push(3);

    std::cout << "Top: " << stack.peek() << std::endl; // 3
    std::cout << "Pop: " << stack.pop() << std::endl;  // 3
    std::cout << "Size: " << stack.size() << std::endl; // 2

    // Kiểm tra dấu ngoặc
    std::cout << std::boolalpha;
    std::cout << isBalanced("(a+b)[c+d]") << std::endl; // true
    std::cout << isBalanced("(a+b][c+d)") << std::endl; // false

    // Chuyển đổi infix sang postfix
    std::cout << infixToPostfix("a+b*c") << std::endl; // "a b c * + "

    return 0;
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`class Stack:
    def __init__(self):
        """Khởi tạo stack rỗng"""
        self.items = []

    def push(self, item):
        """Thêm phần tử vào đỉnh stack"""
        self.items.append(item)

    def pop(self):
        """Lấy phần tử từ đỉnh stack"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()

    def peek(self):
        """Xem phần tử trên đỉnh mà không xóa"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]

    def is_empty(self):
        """Kiểm tra stack có rỗng không"""
        return len(self.items) == 0

    def size(self):
        """Lấy số phần tử trong stack"""
        return len(self.items)

    def clear(self):
        """Xóa tất cả phần tử"""
        self.items.clear()

    def __str__(self):
        """Biểu diễn chuỗi của stack"""
        return f"Stack({self.items})"

    def __len__(self):
        """Hỗ trợ hàm len()"""
        return len(self.items)

def is_balanced(expression):
    """Kiểm tra dấu ngoặc cân bằng"""
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}

    for char in expression:
        if char in pairs:  # Nếu là ngoặc mở
            stack.append(char)
        elif char in pairs.values():  # Nếu là ngoặc đóng
            if not stack:
                return False
            last_open = stack.pop()
            if pairs.get(last_open) != char:
                return False

    return len(stack) == 0

def infix_to_postfix(expression):
    """Chuyển đổi từ infix sang postfix (RPN)"""
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    output = []
    operator_stack = []

    for char in expression:
        if char.isalnum():  # Số hoặc chữ
            output.append(char)
        elif char == '(':
            operator_stack.append(char)
        elif char == ')':
            while operator_stack and operator_stack[-1] != '(':
                output.append(operator_stack.pop())
            if operator_stack:  # Loại bỏ '('
                operator_stack.pop()
        elif char in precedence:
            while (operator_stack and
                   operator_stack[-1] != '(' and
                   operator_stack[-1] in precedence and
                   precedence[operator_stack[-1]] >= precedence[char]):
                output.append(operator_stack.pop())
            operator_stack.append(char)

    while operator_stack:
        output.append(operator_stack.pop())

    return ' '.join(output)

def evaluate_postfix(expression):
    """Tính toán biểu thức postfix"""
    stack = []
    tokens = expression.split()

    for token in tokens:
        if token in ['+', '-', '*', '/']:
            if len(stack) < 2:
                raise ValueError("Invalid expression")
            b = stack.pop()
            a = stack.pop()

            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(a / b)
        else:
            try:
                stack.append(float(token))
            except ValueError:
                raise ValueError(f"Invalid token: {token}")

    if len(stack) != 1:
        raise ValueError("Invalid expression")

    return stack[0]

def decimal_to_binary(number):
    """Chuyển đổi thập phân sang nhị phân dùng stack"""
    if number == 0:
        return "0"

    stack = []
    while number > 0:
        stack.append(str(number % 2))
        number //= 2

    binary = ""
    while stack:
        binary += stack.pop()

    return binary

def reverse_string(text):
    """Reverse chuỗi sử dụng stack"""
    stack = []
    for char in text:
        stack.append(char)

    reversed_text = ""
    while stack:
        reversed_text += stack.pop()

    return reversed_text

# Ví dụ sử dụng
if __name__ == "__main__":
    # Tạo và sử dụng stack
    stack = Stack()

    stack.push(1)
    stack.push(2)
    stack.push(3)

    print(f"Top: {stack.peek()}")  # 3
    print(f"Pop: {stack.pop()}")   # 3
    print(f"Size: {stack.size()}") # 2
    print(stack)  # Stack([1, 2])

    # Kiểm tra dấu ngoặc cân bằng
    print(is_balanced("(a+b)[c+d]"))  # True
    print(is_balanced("(a+b][c+d)"))  # False

    # Chuyển đổi infix sang postfix
    print(infix_to_postfix("a+b*c"))  # "a b c * +"
    print(infix_to_postfix("(a+b)*c"))  # "a b + c *"

    # Tính toán postfix
    print(evaluate_postfix("3 4 + 2 *"))  # 14

    # Chuyển đổi hệ số
    print(decimal_to_binary(10))  # "1010"

    # Reverse chuỗi
    print(reverse_string("hello"))  # "olleh"

    # Sử dụng list như stack trong Python
    simple_stack = []
    simple_stack.append(1)  # push
    simple_stack.append(2)  # push
    simple_stack.append(3)  # push
    print(simple_stack[-1])  # peek -> 3
    print(simple_stack.pop())  # pop -> 3
    print(len(simple_stack))  # size -> 2`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
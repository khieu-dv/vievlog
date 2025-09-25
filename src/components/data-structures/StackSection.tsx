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

  // Interactive visualization states
  const [animationStack, setAnimationStack] = useState<number[]>([10, 25, 8]);
  const [pushValue, setPushValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Animation functions
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animatePush = async () => {
    const newValue = parseInt(pushValue);
    if (isNaN(newValue)) return;

    setIsAnimating(true);
    setAnimationStep(`➕ Đang push ${newValue} vào đỉnh stack...`);
    await sleep(1000);

    // Add to top of stack
    setAnimationStack([...animationStack, newValue]);
    setHighlightedIndex(animationStack.length);
    setAnimationStep(`✅ Đã push ${newValue} vào stack! Kích thước: ${animationStack.length + 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
    setPushValue("");
  };

  const animatePop = async () => {
    if (animationStack.length === 0) {
      setAnimationStep("❌ Stack rỗng, không thể pop!");
      return;
    }

    setIsAnimating(true);
    const topIndex = animationStack.length - 1;
    const poppedValue = animationStack[topIndex];

    setHighlightedIndex(topIndex);
    setAnimationStep(`➖ Đang pop phần tử từ đỉnh stack: ${poppedValue}...`);
    await sleep(1000);

    setAnimationStack(animationStack.slice(0, -1));
    setAnimationStep(`✅ Đã pop ${poppedValue} từ stack! Kích thước: ${animationStack.length - 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animatePeek = async () => {
    if (animationStack.length === 0) {
      setAnimationStep("❌ Stack rỗng, không có phần tử để peek!");
      return;
    }

    setIsAnimating(true);
    const topIndex = animationStack.length - 1;
    const topValue = animationStack[topIndex];

    setHighlightedIndex(topIndex);
    setAnimationStep(`👁️ Peek: Phần tử trên đỉnh stack là ${topValue}`);
    await sleep(2000);

    setAnimationStep(`✅ Peek hoàn tất! TOP = ${topValue}, kích thước vẫn là ${animationStack.length} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const resetStack = () => {
    setAnimationStack([10, 25, 8]);
    setHighlightedIndex(null);
    setAnimationStep("");
    setPushValue("");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-500" />
            Stack (Ngăn Xếp)
          </h3>
          <p className="text-muted-foreground">
            Cấu trúc dữ liệu LIFO (Last In, First Out) với các thao tác push và pop O(1).
          </p>
        </div>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-red-50 dark:bg-red-950/50 p-6 rounded-lg mb-6 border-l-4 border-red-500">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">📚 Stack là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Stack (Ngăn Xếp)</strong> là cấu trúc dữ liệu tuân theo nguyên tắc <strong>LIFO (Last In, First Out)</strong>.
            Giống như chồng sách: sách cuối cùng đặt lên sẽ là sách đầu tiên được lấy ra.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-card p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Undo/Redo trong editor</li>
                <li>• Function call stack</li>
                <li>• Browser back button</li>
                <li>• Kiểm tra ngoặc cân bằng</li>
              </ul>
            </div>
            <div className="bg-card p-3 rounded">
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

        <div className="bg-pink-50 dark:bg-pink-950/50 p-6 rounded-lg mb-6 border-l-4 border-pink-500">
          <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">💡 Tại sao dùng Stack?</h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Stack rất hiệu quả cho các bài toán cần "quay lại trạng thái trước":</strong>
            <br/>• Tất cả operations O(1) - cực nhanh
            <br/>• Memory hiệu quả - chỉ cần track đỉnh
            <br/>• Đơn giản implement và debug
          </div>
        </div>

        {result && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/50 rounded border border-orange-200 dark:border-orange-800">
            <strong>Kết quả:</strong> {result}
          </div>
        )}

        <div className="space-y-4">
          {/* Interactive Stack Visualization */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
              🎮 Minh Họa Tương Tác - Stack Operations (LIFO)
            </h4>

            {/* Stack Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex flex-col items-center gap-1 min-h-96">
                  {/* TOP indicator */}
                  {animationStack.length > 0 && (
                    <div className="bg-orange-500 text-white px-4 py-2 rounded font-bold text-sm mb-2">
                      ← TOP (Đỉnh Stack)
                    </div>
                  )}

                  {/* Stack Elements (displayed vertically, top to bottom) */}
                  {animationStack.length === 0 ? (
                    <div className="text-muted-foreground italic text-center p-8 border-2 border-dashed border-border rounded-lg">
                      Stack rỗng - Hãy Push phần tử để bắt đầu
                    </div>
                  ) : (
                    <div className="flex flex-col-reverse gap-1">
                      {animationStack.map((value, reverseIndex) => {
                        const index = animationStack.length - 1 - reverseIndex;
                        return (
                          <div
                            key={`${index}-${value}`}
                            className={`w-32 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-500 font-bold text-lg relative ${
                              highlightedIndex === index
                                ? "bg-yellow-400 border-red-500 scale-110 shadow-lg animate-pulse"
                                : index === animationStack.length - 1
                                ? "bg-orange-100 dark:bg-orange-800 border-orange-500"
                                : "bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-600"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg">{value}</div>
                              <div className="text-xs opacity-75">
                                {index === animationStack.length - 1 ? "TOP" : `Pos ${index}`}
                              </div>
                            </div>
                            {/* Arrow pointing to next element */}
                            {index > 0 && (
                              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-red-500 text-xl">
                                ↓
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* BOTTOM indicator */}
                  {animationStack.length > 0 && (
                    <div className="bg-gray-500 text-white px-4 py-2 rounded font-bold text-sm mt-2">
                      BOTTOM (Đáy Stack)
                    </div>
                  )}
                </div>
              </div>

              {/* Animation status */}
              {animationStep && (
                <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-3 mb-4">
                  <div className="font-medium text-orange-800 dark:text-orange-300">
                    {animationStep}
                  </div>
                </div>
              )}

              {/* Stack info */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="bg-card p-3 rounded">
                  <strong>Kích thước:</strong> {animationStack.length}
                </div>
                <div className="bg-card p-3 rounded">
                  <strong>TOP:</strong> {animationStack.length > 0 ? animationStack[animationStack.length - 1] : "NULL"}
                </div>
                <div className="bg-card p-3 rounded">
                  <strong>Trạng thái:</strong> {animationStack.length === 0 ? "Rỗng" : "Có dữ liệu"}
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Push */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">➕ Push (O(1))</h5>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={pushValue}
                    onChange={(e) => setPushValue(e.target.value)}
                    placeholder="Nhập giá trị"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animatePush}
                    disabled={isAnimating || !pushValue}
                    className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Push vào Stack
                  </button>
                </div>
              </div>

              {/* Pop */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">➖ Pop (O(1))</h5>
                <div className="space-y-2">
                  <button
                    onClick={animatePop}
                    disabled={isAnimating || animationStack.length === 0}
                    className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Pop từ Stack
                  </button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Lấy phần tử từ đỉnh
                  </div>
                </div>
              </div>

              {/* Peek */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">👁️ Peek (O(1))</h5>
                <div className="space-y-2">
                  <button
                    onClick={animatePeek}
                    disabled={isAnimating || animationStack.length === 0}
                    className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Xem TOP
                  </button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Xem không xóa
                  </div>
                </div>
              </div>

              {/* Reset */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                <h5 className="font-medium text-gray-600 dark:text-gray-400 mb-2">🛠️ Điều Khiển</h5>
                <div className="space-y-2">
                  <button
                    onClick={resetStack}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    🔄 Reset Stack
                  </button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Khôi phục ban đầu
                  </div>
                </div>
              </div>
            </div>

            {/* Operation Explanations */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                <strong className="text-green-700 dark:text-green-300">Push O(1):</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Thêm phần tử vào đỉnh stack. Luôn nhanh không phụ thuộc kích thước.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                <strong className="text-red-700 dark:text-red-300">Pop O(1):</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Lấy và xóa phần tử từ đỉnh. LIFO - Last In First Out.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <strong className="text-blue-700 dark:text-blue-300">Peek O(1):</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Xem phần tử trên đỉnh mà không xóa. Kiểm tra trước khi pop.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Stack Tương Tác:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập số"
                className="px-3 py-2 border rounded dark:bg-background dark:border-border"
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
                  <div className="text-muted-foreground italic">Stack rỗng</div>
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

          <div className="bg-muted/50 p-6 rounded-lg border">
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
              <div className="p-3 bg-orange-50 dark:bg-orange-950/50 rounded border border-orange-200 dark:border-orange-800">
                <strong>Kết quả:</strong> {balanceResult}
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Cấu Trúc Stack:</h4>
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

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Độ Phức Tạp Stack:</h4>
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

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Cài Đặt:</h4>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveLanguageTab("rust")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "rust"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    Rust
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("cpp")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "cpp"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("python")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "python"
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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
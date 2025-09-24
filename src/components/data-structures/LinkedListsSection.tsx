"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section with Navigation Pills */}
      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-100 dark:border-slate-600 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              <List className="h-6 w-6 text-green-500" />
              Danh Sách Liên Kết
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-2xl">
              Khám phá cấu trúc dữ liệu động với các node liên kết thông qua pointer.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-600">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "overview"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              📚 Tổng quan
            </button>
            <button
              onClick={() => setActiveSection("interactive")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "interactive"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              🎮 Tương tác
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "implementation"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              💻 Cài đặt
            </button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Linked List Definition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-green-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                🔗
              </div>
              <h4 className="text-lg font-bold text-green-800 dark:text-green-300">Danh Sách Liên Kết</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Cấu trúc dữ liệu tuyến tính với các node được lưu trữ không liên tiếp trong bộ nhớ.
              Mỗi node chứa dữ liệu và pointer đến node tiếp theo.
            </p>

            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  ✅ Ưu điểm
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Kích thước động
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Thêm/xóa đầu nhanh O(1)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Không cần biết trước kích thước
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                  ❌ Nhược điểm
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Truy cập chậm O(n)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Tốn bộ nhớ cho pointer
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Không cache-friendly
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases & Applications */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-teal-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                🎯
              </div>
              <h4 className="text-lg font-bold text-teal-800 dark:text-teal-300">Ứng Dụng Thực Tế</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Linked List phù hợp cho các trường hợp cần thêm/xóa thường xuyên và không cần truy cập ngẫu nhiên.
            </p>

            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h6 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🎪 Ứng dụng phổ biến</h6>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Undo/Redo trong text editor</li>
                  <li>• Browser history navigation</li>
                  <li>• Music playlist management</li>
                  <li>• Implement Stack/Queue</li>
                </ul>
              </div>

              {/* Complexity Comparison */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border">
                <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200 text-sm">So với Array</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                    <span>Truy cập:</span>
                    <span className="font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                    <span>Tìm kiếm:</span>
                    <span className="font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">O(n)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                    <span>Thêm đầu:</span>
                    <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                    <span>Xóa đầu:</span>
                    <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Section */}
      {activeSection === "interactive" && (
        <div className="space-y-6">
          {/* Interactive Linked List Visualization */}
          <div className="bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-green-900/20 dark:via-teal-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white text-sm">
                🎮
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
                  Minh Họa Tương Tác
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thao tác trực tiếp với linked list để hiểu rõ cách hoạt động
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
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm rounded-md hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➕ Thêm cuối
                  </button>
                  <button
                    onClick={animateRemoveHead}
                    disabled={isAnimating || animationList.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm rounded-md hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➖ Xóa cuối
                  </button>
                  <button
                    onClick={resetLinkedList}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-medium text-sm rounded-md hover:from-gray-600 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white text-sm">
                🦀
              </div>
              <div>
                <h4 className="text-lg font-bold text-orange-800 dark:text-orange-300">
                  Rust WASM LinkedList
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all"
                >
                  🦀 Thêm đầu
                </button>
                <button
                  onClick={addToTail}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm rounded-md hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all"
                >
                  🦀 Thêm cuối
                </button>
                <button
                  onClick={removeHead}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 disabled:opacity-50 transition-all"
                >
                  🦀 Xóa đầu
                </button>
                <button
                  onClick={removeTail}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm rounded-md hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all"
                >
                  🦀 Xóa cuối
                </button>
                <button
                  onClick={clear}
                  disabled={!wasmReady}
                  className="px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-medium text-sm rounded-md hover:from-gray-600 hover:to-slate-600 disabled:opacity-50 transition-all"
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

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveLanguageTab("rust")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "rust"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  🦀 Rust
                </button>
                <button
                  onClick={() => setActiveLanguageTab("cpp")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "cpp"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  ⚡ C++
                </button>
                <button
                  onClick={() => setActiveLanguageTab("python")}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeLanguageTab === "python"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
                  }`}
                >
                  🐍 Python
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border">

              {/* Language-specific Code */}
              {activeLanguageTab === "rust" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">🦀</div>
                    <h5 className="text-lg font-bold text-orange-700 dark:text-orange-300">LinkedList trong Rust</h5>
                  </div>
                  <RustCodeEditor
              code={`#[derive(Debug)]
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

    fn push_back(&mut self, data: T) {
        let new_node = Box::new(Node {
            data,
            next: None,
        });

        if self.head.is_none() {
            self.head = Some(new_node);
        } else {
            let mut current = self.head.as_mut().unwrap();
            while current.next.is_some() {
                current = current.next.as_mut().unwrap();
            }
            current.next = Some(new_node);
        }
        self.size += 1;
    }

    fn display(&self) -> Vec<&T> {
        let mut result = Vec::new();
        let mut current = &self.head;

        while let Some(node) = current {
            result.push(&node.data);
            current = &node.next;
        }

        result
    }
}`}
                    height="300px"
                  />
                </div>
              )}

              {activeLanguageTab === "cpp" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">⚡</div>
                    <h5 className="text-lg font-bold text-blue-700 dark:text-blue-300">LinkedList trong C++</h5>
                  </div>
                  <CppCodeEditor
                code={`#include <iostream>
#include <memory>

template<typename T>
class LinkedList {
private:
    struct Node {
        T data;
        std::unique_ptr<Node> next;

        Node(const T& value) : data(value), next(nullptr) {}
    };

    std::unique_ptr<Node> head;
    size_t size;

public:
    LinkedList() : head(nullptr), size(0) {}

    // Thêm vào đầu danh sách
    void push_front(const T& data) {
        auto new_node = std::make_unique<Node>(data);
        new_node->next = std::move(head);
        head = std::move(new_node);
        size++;
    }

    // Xóa phần tử đầu
    void pop_front() {
        if (head) {
            head = std::move(head->next);
            size--;
        }
    }

    // Thêm vào cuối danh sách
    void push_back(const T& data) {
        auto new_node = std::make_unique<Node>(data);

        if (!head) {
            head = std::move(new_node);
        } else {
            Node* current = head.get();
            while (current->next) {
                current = current->next.get();
            }
            current->next = std::move(new_node);
        }
        size++;
    }

    // Hiển thị danh sách
    void display() const {
        Node* current = head.get();
        std::cout << "HEAD -> ";
        while (current) {
            std::cout << current->data << " -> ";
            current = current->next.get();
        }
        std::cout << "NULL" << std::endl;
    }

    bool empty() const { return head == nullptr; }
    size_t length() const { return size; }
};`}
                    height="300px"
                  />
                </div>
              )}

              {activeLanguageTab === "python" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">🐍</div>
                    <h5 className="text-lg font-bold text-green-700 dark:text-green-300">LinkedList trong Python</h5>
                  </div>
                  <PythonCodeEditor
                code={`class Node:
    """Node class cho Linked List"""
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
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1

    def pop_front(self):
        """Xóa và trả về phần tử đầu"""
        if not self.head:
            return None

        data = self.head.data
        self.head = self.head.next
        self.size -= 1
        return data

    def push_back(self, data):
        """Thêm phần tử vào cuối danh sách"""
        new_node = Node(data)

        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node

        self.size += 1

    def pop_back(self):
        """Xóa và trả về phần tử cuối"""
        if not self.head:
            return None

        if not self.head.next:
            data = self.head.data
            self.head = None
            self.size -= 1
            return data

        current = self.head
        while current.next.next:
            current = current.next

        data = current.next.data
        current.next = None
        self.size -= 1
        return data

    def display(self):
        """Hiển thị danh sách"""
        result = []
        current = self.head

        while current:
            result.append(current.data)
            current = current.next

        return result

    def is_empty(self):
        return self.head is None

    def __len__(self):
        return self.size

# Sử dụng:
# ll = LinkedList()
# ll.push_front(1)
# ll.push_back(2)
# print(ll.display())  # [1, 2]`}
                    height="300px"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
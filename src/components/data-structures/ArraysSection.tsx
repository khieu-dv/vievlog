"use client";

import { useState } from "react";
import { Layout } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";

export function ArraysSection() {
  const [vector, setVector] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");
  const [activeSection, setActiveSection] = useState<"overview" | "interactive" | "implementation">("overview");

  // Interactive visualization states
  const [animationArray, setAnimationArray] = useState<number[]>([10, 25, 8, 42, 15, 33]);
  const [searchValue, setSearchValue] = useState("");
  const [accessIndex, setAccessIndex] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Animation functions
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateAccess = async () => {
    const index = parseInt(accessIndex);
    if (isNaN(index) || index < 0 || index >= animationArray.length) {
      setAnimationStep("❌ Chỉ số không hợp lệ!");
      return;
    }

    setIsAnimating(true);
    setAnimationStep(`🔍 Truy cập phần tử tại index ${index}...`);

    // Highlight the accessed element
    setHighlightedIndex(index);
    await sleep(1000);

    setAnimationStep(`✅ Giá trị tại index ${index} là: ${animationArray[index]} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateSearch = async () => {
    const searchVal = parseInt(searchValue);
    if (isNaN(searchVal)) {
      setAnimationStep("❌ Giá trị tìm kiếm không hợp lệ!");
      return;
    }

    setIsAnimating(true);
    setAnimationStep(`🔍 Bắt đầu tìm kiếm giá trị ${searchVal}...`);
    await sleep(1000);

    // Linear search animation
    for (let i = 0; i < animationArray.length; i++) {
      setHighlightedIndex(i);
      setAnimationStep(`🔍 Kiểm tra index ${i}: ${animationArray[i]} ${animationArray[i] === searchVal ? '= ✅' : '≠'} ${searchVal}`);
      await sleep(800);

      if (animationArray[i] === searchVal) {
        setAnimationStep(`🎉 Tìm thấy ${searchVal} tại index ${i}! (Độ phức tạp: O(n))`);
        await sleep(2000);
        setHighlightedIndex(null);
        setIsAnimating(false);
        return;
      }
    }

    setAnimationStep(`❌ Không tìm thấy ${searchVal} trong mảng! (Đã kiểm tra ${animationArray.length} phần tử)`);
    await sleep(2000);
    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const animateInsert = async () => {
    const newValue = parseInt(inputValue);
    if (isNaN(newValue)) return;

    setIsAnimating(true);
    setAnimationStep(`➕ Thêm ${newValue} vào cuối mảng...`);

    // Show the new element being added
    setAnimationArray([...animationArray, newValue]);
    setHighlightedIndex(animationArray.length);
    await sleep(1000);

    setAnimationStep(`✅ Đã thêm ${newValue}! Kích thước mảng: ${animationArray.length + 1} (Độ phức tạp: O(1) amortized)`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
    setInputValue("");
  };

  const animateRemove = async () => {
    if (animationArray.length === 0) {
      setAnimationStep("❌ Mảng đã rỗng!");
      return;
    }

    setIsAnimating(true);
    const lastIndex = animationArray.length - 1;
    const removedValue = animationArray[lastIndex];

    setHighlightedIndex(lastIndex);
    setAnimationStep(`➖ Xóa phần tử cuối: ${removedValue}...`);
    await sleep(1000);

    setAnimationArray(animationArray.slice(0, -1));
    setAnimationStep(`✅ Đã xóa ${removedValue}! Kích thước mảng: ${animationArray.length - 1} (Độ phức tạp: O(1))`);
    await sleep(2000);

    setHighlightedIndex(null);
    setIsAnimating(false);
  };

  const resetArray = () => {
    setAnimationArray([10, 25, 8, 42, 15, 33]);
    setHighlightedIndex(null);
    setAnimationStep("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section with Navigation Pills */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Layout className="h-6 w-6 text-blue-500" />
              Mảng & Vector
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-2xl">
              Khám phá cấu trúc dữ liệu cơ bản nhất - từ mảng tĩnh đến vector động với các minh họa tương tác.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-600">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "overview"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              📚 Tổng quan
            </button>
            <button
              onClick={() => setActiveSection("interactive")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "interactive"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              🎮 Tương tác
            </button>
            <button
              onClick={() => setActiveSection("implementation")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                activeSection === "implementation"
                  ? "bg-green-500 text-white shadow-sm"
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
          {/* Array Definition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                📊
              </div>
              <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Mảng (Array)</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Cấu trúc dữ liệu cơ bản nhất, lưu trữ các phần tử cùng kiểu trong bộ nhớ liên tiếp.
              Mỗi phần tử có một chỉ số (index) bắt đầu từ 0.
            </p>

            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  ✅ Ưu điểm
                </h5>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Truy cập siêu nhanh O(1)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Tiết kiệm bộ nhớ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Duyệt tuần tự hiệu quả
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
                    Kích thước cố định
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Chèn/xóa giữa chậm O(n)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Phải biết trước kích thước
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vector Definition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-purple-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                🔧
              </div>
              <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">Vector (Mảng Động)</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
              Phiên bản cải tiến của mảng, có thể tự động thay đổi kích thước.
              Khi hết chỗ, vector sẽ tự động cấp phát bộ nhớ mới.
            </p>

            {/* Complexity Table */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border">
              <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200 text-sm">Độ phức tạp thời gian</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Truy cập:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Tìm kiếm:</span>
                  <span className="font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">O(n)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Thêm cuối:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)*</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border">
                  <span>Xóa cuối:</span>
                  <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">O(1)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">* amortized</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Section */}
      {activeSection === "interactive" && (
        <div className="space-y-6">
          {/* Interactive Array Visualization */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm">
                🎮
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">
                  Minh Họa Tương Tác
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thao tác trực tiếp với mảng để hiểu rõ cách hoạt động
                </p>
              </div>
            </div>

            {/* Array Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-6 overflow-x-auto pb-4">
                <div className="flex items-center gap-2 min-w-max">
                  {animationArray.map((value, index) => (
                    <div key={`${index}-${value}`} className="flex flex-col items-center group">
                      {/* Index label */}
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 h-4">
                        {index}
                      </div>
                      {/* Array element */}
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all duration-500 font-bold text-lg cursor-pointer ${
                          highlightedIndex === index
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 border-red-500 scale-110 shadow-xl animate-pulse text-white"
                            : "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border-blue-300 dark:border-blue-600 hover:scale-105 hover:shadow-md group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-700 dark:group-hover:to-indigo-700"
                        }`}
                      >
                        {value}
                      </div>
                      {/* Memory address visual */}
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        0x{(1000 + index * 4).toString(16)}
                      </div>
                    </div>
                  ))}
                  {animationArray.length === 0 && (
                    <div className="text-gray-500 italic text-center p-8 bg-gray-50 dark:bg-slate-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-2xl mb-1">📭</div>
                      <div className="text-sm font-semibold mb-1">Mảng rỗng</div>
                      <div className="text-xs">Hãy thêm phần tử để bắt đầu</div>
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

              {/* Array info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">📏</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Kích thước</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{animationArray.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">🔢</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Index từ</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        0 → {Math.max(0, animationArray.length - 1)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">💾</div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bộ nhớ</div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {animationArray.length * 4} bytes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Access by Index */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🔍
                  </div>
                  <div>
                    <h5 className="font-bold text-green-700 dark:text-green-400 text-sm">Truy Cập</h5>
                    <p className="text-xs text-green-600 dark:text-green-500 font-mono">O(1)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={accessIndex}
                    onChange={(e) => setAccessIndex(e.target.value)}
                    placeholder={`Nhập index (0-${animationArray.length - 1})`}
                    min="0"
                    max={animationArray.length - 1}
                    className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateAccess}
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔍 Truy cập
                  </button>
                </div>
              </div>

              {/* Linear Search */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🔎
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
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm rounded-md hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    🔎 Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Insert */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-purple-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    ➕
                  </div>
                  <div>
                    <h5 className="font-bold text-purple-700 dark:text-purple-400 text-sm">Thêm</h5>
                    <p className="text-xs text-purple-600 dark:text-purple-500 font-mono">O(1)*</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập giá trị mới"
                    className="w-full px-3 py-2 border-2 border-purple-200 dark:border-purple-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-slate-700 transition-all"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateInsert}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➕ Thêm cuối
                  </button>
                </div>
              </div>

              {/* Remove and Reset */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    🛠️
                  </div>
                  <div>
                    <h5 className="font-bold text-red-700 dark:text-red-400 text-sm">Điều Khiển</h5>
                    <p className="text-xs text-red-600 dark:text-red-500">Quản lý mảng</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={animateRemove}
                    disabled={isAnimating || animationArray.length === 0}
                    className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ➖ Xóa cuối
                  </button>
                  <button
                    onClick={resetArray}
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
                  <h6 className="font-bold text-green-700 dark:text-green-300">Truy cập O(1)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Có thể truy cập trực tiếp bất kỳ phần tử nào thông qua index, không phụ thuộc vào kích thước mảng.
                  Địa chỉ = base_address + (index × element_size)
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    🔍
                  </div>
                  <h6 className="font-bold text-blue-700 dark:text-blue-300">Tìm kiếm O(n)</h6>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Phải duyệt từng phần tử một cho đến khi tìm thấy hoặc hết mảng.
                  Trường hợp xấu nhất: kiểm tra tất cả n phần tử.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Memory Layout */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-600 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-white">
                💾
              </div>
              <div>
                <h4 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                  Bố Trí Bộ Nhớ
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Hiểu cách mảng được lưu trữ trong bộ nhớ
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-xl border">
              <MermaidDiagram
                chart={`
                  graph LR
                      subgraph "Mảng Tĩnh"
                          A["arr[0]: 10<br/>0x1000"] --> B["arr[1]: 20<br/>0x1004"] --> C["arr[2]: 30<br/>0x1008"] --> D["arr[3]: 40<br/>0x100C"]
                      end

                      subgraph "Vector (Mảng Động)"
                          E["vec[0]: 10<br/>0x2000"] --> F["vec[1]: 20<br/>0x2004"] --> G["vec[2]: 30<br/>0x2008"] --> H["vec[3]: 40<br/>0x200C"] --> I["capacity: 8<br/>reserved"]
                          style I fill:#e1f5fe
                      end

                      J["push()"] -.-> I
                      K["pop()"] -.-> H
                `}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Implementation Section */}
      {activeSection === "implementation" && (
        <div className="space-y-6">
          {/* Simple Vector Demo */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-sm">
                🧪
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
                  Vector Tương Tác Đơn Giản
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thử nghiệm nhanh với vector cơ bản
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập số"
                  className="flex-1 px-4 py-2 border-2 border-green-200 dark:border-green-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 transition-all"
                />
                <button
                  onClick={handlePush}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm rounded-md hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  ➕ Thêm
                </button>
                <button
                  onClick={handlePop}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium text-sm rounded-md hover:from-red-600 hover:to-rose-600 transition-all"
                >
                  ➖ Xóa
                </button>
              </div>

              <div className="flex gap-2 flex-wrap min-h-[60px] items-center">
                {vector.map((value, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-600 rounded-lg text-center font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    {value}
                  </div>
                ))}
                {vector.length === 0 && (
                  <div className="text-gray-500 italic text-center flex-1 py-4">
                    📭 Vector rỗng - Hãy thêm phần tử
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-green-700 dark:text-green-300">
                <strong>Kích thước hiện tại:</strong> {vector.length} phần tử
              </div>
            </div>
          </div>

          {/* Code Implementation */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-600 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm">
                💻
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300">
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

            {/* Language-specific Code */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border">
              {activeLanguageTab === "rust" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">🦀</div>
                    <h5 className="text-lg font-bold text-orange-700 dark:text-orange-300">Vector trong Rust</h5>
                  </div>
                  <RustCodeEditor
                    code={`// Vector trong Rust - An toàn bộ nhớ và nhanh chóng
let mut vec = Vec::new();

// Thêm phần tử
vec.push(1);
vec.push(2);
vec.push(3);

// Truy cập an toàn
match vec.get(0) {
    Some(value) => println!("Phần tử đầu: {}", value),
    None => println!("Index không tồn tại"),
}

// Duyệt qua vector
for (index, value) in vec.iter().enumerate() {
    println!("vec[{}] = {}", index, value);
}

// Xóa phần tử cuối
if let Some(last) = vec.pop() {
    println!("Đã xóa: {}", last);
}

// Vector với dung lượng định trước
let mut vec_with_capacity = Vec::with_capacity(10);
vec_with_capacity.push(42);`}
                    height="300px"
                  />
                </div>
              )}

              {activeLanguageTab === "cpp" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">⚡</div>
                    <h5 className="text-lg font-bold text-blue-700 dark:text-blue-300">Vector trong C++</h5>
                  </div>
                  <CppCodeEditor
                    code={`#include <vector>
#include <iostream>

int main() {
    // Khởi tạo vector
    std::vector<int> vec;

    // Thêm phần tử
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(3);

    // Truy cập với kiểm tra bounds
    try {
        std::cout << "Phần tử đầu: " << vec.at(0) << std::endl;
    } catch (const std::out_of_range& e) {
        std::cout << "Index ngoài phạm vi!" << std::endl;
    }

    // Duyệt vector với range-based loop (C++11+)
    for (const auto& value : vec) {
        std::cout << value << " ";
    }
    std::cout << std::endl;

    // Xóa phần tử cuối
    if (!vec.empty()) {
        vec.pop_back();
    }

    // Vector với kích thước và giá trị khởi tạo
    std::vector<int> vec2(5, 10); // 5 phần tử, mỗi phần tử = 10

    return 0;
}`}
                    height="300px"
                  />
                </div>
              )}

              {activeLanguageTab === "python" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">🐍</div>
                    <h5 className="text-lg font-bold text-green-700 dark:text-green-300">List trong Python</h5>
                  </div>
                  <PythonCodeEditor
                    code={`# List trong Python - Linh hoạt và dễ sử dụng
vec = []

# Thêm phần tử
vec.append(1)
vec.append(2)
vec.append(3)

# Truy cập với xử lý exception
try:
    print(f"Phần tử đầu: {vec[0]}")
    print(f"Phần tử cuối: {vec[-1]}")  # Python hỗ trợ index âm
except IndexError:
    print("Index ngoài phạm vi!")

# Duyệt list với enumerate
for index, value in enumerate(vec):
    print(f"vec[{index}] = {value}")

# List comprehension - tính năng mạnh mẽ của Python
squares = [x**2 for x in vec]
print(f"Bình phương: {squares}")

# Slicing - cắt list
subset = vec[0:2]  # Lấy phần tử từ 0 đến 1
print(f"Subset: {subset}")

# Thêm nhiều phần tử
vec.extend([4, 5, 6])
# Hoặc dùng operator
vec += [7, 8, 9]

# Xóa phần tử cuối
if vec:
    last = vec.pop()
    print(f"Đã xóa: {last}")

print(f"List cuối: {vec}")`}
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
"use client";

import { useState, useEffect } from "react";
import { Hash } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

interface HashEntry {
  key: string;
  value: string;
}

export function HashTableSection() {
  const [rustHashTable, setRustHashTable] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [hashTableDisplay, setHashTableDisplay] = useState<Map<string, string>>(new Map());
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Interactive visualization states
  interface HashBucket {
    entries: { key: string; value: string }[];
  }

  const [animationHashTable, setAnimationHashTable] = useState<HashBucket[]>(
    Array(8).fill(null).map(() => ({ entries: [] }))
  );
  const [insertKey, setInsertKey] = useState("");
  const [insertVal, setInsertVal] = useState("");
  const [searchHashKey, setSearchHashKey] = useState("");
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
  const [highlightedEntry, setHighlightedEntry] = useState<{bucket: number, entry: number} | null>(null);
  const [animationStep, setAnimationStep] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hashCalculation, setHashCalculation] = useState<string>("");

  // Simple hash function for display
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 10);
  };

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newHashTable = wasmInstance.dataStructures.createHashTable(10);
        setRustHashTable(newHashTable);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Hash Table đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust hash table
  const updateDisplayFromRustHashTable = () => {
    if (rustHashTable) {
      try {
        const keys = Array.from(rustHashTable.keys()) as string[];
        const newMap = new Map();
        keys.forEach((key: string) => {
          const value = rustHashTable.get(key);
          if (value !== null && value !== undefined) {
            newMap.set(key, value);
          }
        });
        setHashTableDisplay(newMap);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const insert = () => {
    if (key.trim() && value.trim()) {
      if (wasmReady && rustHashTable) {
        try {
          rustHashTable.insert(key.trim(), value.trim());
          const wasmSize = rustHashTable.len();
          setResult(`🦀 Đã thêm: ${key} = ${value}. Kích thước: ${wasmSize}`);
          updateDisplayFromRustHashTable();
          setKey("");
          setValue("");
        } catch (error) {
          setResult("❌ Rust WASM insert failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const search = () => {
    if (searchKey.trim()) {
      if (wasmReady && rustHashTable) {
        try {
          const found = rustHashTable.get(searchKey.trim());
          if (found !== null && found !== undefined) {
            setResult(`🦀 Tìm thấy: ${searchKey} = ${found}`);
          } else {
            setResult(`🦀 Không tìm thấy khóa: ${searchKey}`);
          }
        } catch (error) {
          setResult("❌ Rust WASM search failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const remove = () => {
    if (searchKey.trim()) {
      if (wasmReady && rustHashTable) {
        try {
          const existed = rustHashTable.remove(searchKey.trim());
          const wasmSize = rustHashTable.len();
          if (existed !== null && existed !== undefined) {
            setResult(`🦀 Đã xóa khóa: ${searchKey}. Kích thước: ${wasmSize}`);
            updateDisplayFromRustHashTable();
          } else {
            setResult(`🦀 Không tìm thấy khóa: ${searchKey}`);
          }
        } catch (error) {
          setResult("❌ Rust WASM remove failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const clear = () => {
    if (wasmReady && rustHashTable) {
      try {
        rustHashTable.clear();
        const wasmSize = rustHashTable.len();
        setResult(`🦀 Đã xóa toàn bộ hash table. Kích thước: ${wasmSize}`);
        updateDisplayFromRustHashTable();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  // Animation functions
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animationHashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 8);
  };

  const animateHashInsert = async () => {
    if (!insertKey.trim() || !insertVal.trim()) return;

    setIsAnimating(true);
    const key = insertKey.trim();
    const value = insertVal.trim();

    // Step 1: Calculate hash
    setAnimationStep(`🧮 Bước 1: Tính toán hash cho key "${key}"...`);
    await sleep(1000);

    const hashValue = animationHashFunction(key);
    setHashCalculation(`hash("${key}") = ${hashValue}`);
    setAnimationStep(`🧮 Hash function: hash("${key}") = ${hashValue}`);
    await sleep(1500);

    // Step 2: Highlight target bucket
    setHighlightedBucket(hashValue);
    setAnimationStep(`🎯 Bước 2: Chọn bucket ${hashValue} để lưu trữ...`);
    await sleep(1000);

    // Step 3: Check for existing key (collision detection)
    const bucket = animationHashTable[hashValue];
    const existingIndex = bucket.entries.findIndex(entry => entry.key === key);

    if (existingIndex !== -1) {
      setHighlightedEntry({ bucket: hashValue, entry: existingIndex });
      setAnimationStep(`🔄 Key "${key}" đã tồn tại! Cập nhật giá trị từ "${bucket.entries[existingIndex].value}" thành "${value}"`);
      await sleep(1500);

      // Update existing entry
      const newHashTable = [...animationHashTable];
      newHashTable[hashValue].entries[existingIndex].value = value;
      setAnimationHashTable(newHashTable);
    } else {
      // Check for collision
      if (bucket.entries.length > 0) {
        setAnimationStep(`⚠️ Collision! Bucket ${hashValue} đã có ${bucket.entries.length} entry. Sử dụng chaining...`);
        await sleep(1500);
      }

      // Insert new entry
      const newHashTable = [...animationHashTable];
      newHashTable[hashValue].entries.push({ key, value });
      setAnimationHashTable(newHashTable);
      setHighlightedEntry({ bucket: hashValue, entry: newHashTable[hashValue].entries.length - 1 });
    }

    setAnimationStep(`✅ Đã lưu "${key}" = "${value}" vào bucket ${hashValue}! (Độ phức tạp: O(1) average)`);
    await sleep(2000);

    setHighlightedBucket(null);
    setHighlightedEntry(null);
    setHashCalculation("");
    setIsAnimating(false);
    setInsertKey("");
    setInsertVal("");
  };

  const animateHashSearch = async () => {
    if (!searchHashKey.trim()) return;

    setIsAnimating(true);
    const key = searchHashKey.trim();

    // Step 1: Calculate hash
    setAnimationStep(`🔍 Bước 1: Tính toán hash cho key "${key}"...`);
    await sleep(1000);

    const hashValue = animationHashFunction(key);
    setHashCalculation(`hash("${key}") = ${hashValue}`);
    setAnimationStep(`🧮 Hash function: hash("${key}") = ${hashValue}`);
    await sleep(1500);

    // Step 2: Highlight target bucket
    setHighlightedBucket(hashValue);
    setAnimationStep(`🎯 Bước 2: Kiểm tra bucket ${hashValue}...`);
    await sleep(1000);

    // Step 3: Search in bucket
    const bucket = animationHashTable[hashValue];
    let found = false;

    for (let i = 0; i < bucket.entries.length; i++) {
      setHighlightedEntry({ bucket: hashValue, entry: i });
      const entry = bucket.entries[i];

      if (entry.key === key) {
        found = true;
        setAnimationStep(`🎉 Tìm thấy! "${key}" = "${entry.value}" tại bucket ${hashValue}`);
        await sleep(2000);
        break;
      } else {
        setAnimationStep(`🔍 Kiểm tra "${entry.key}" ≠ "${key}", tiếp tục...`);
        await sleep(800);
      }
    }

    if (!found) {
      setAnimationStep(`❌ Không tìm thấy "${key}" trong bucket ${hashValue}!`);
      await sleep(2000);
    }

    setHighlightedBucket(null);
    setHighlightedEntry(null);
    setHashCalculation("");
    setIsAnimating(false);
  };

  const animateHashRemove = async () => {
    if (!searchHashKey.trim()) return;

    setIsAnimating(true);
    const key = searchHashKey.trim();

    // Similar to search, but remove if found
    const hashValue = animationHashFunction(key);
    setHashCalculation(`hash("${key}") = ${hashValue}`);
    setHighlightedBucket(hashValue);
    setAnimationStep(`🗑️ Đang xóa "${key}" từ bucket ${hashValue}...`);
    await sleep(1500);

    const bucket = animationHashTable[hashValue];
    const entryIndex = bucket.entries.findIndex(entry => entry.key === key);

    if (entryIndex !== -1) {
      setHighlightedEntry({ bucket: hashValue, entry: entryIndex });
      const removedValue = bucket.entries[entryIndex].value;
      setAnimationStep(`✅ Tìm thấy "${key}" = "${removedValue}", xóa khỏi bucket...`);
      await sleep(1500);

      const newHashTable = [...animationHashTable];
      newHashTable[hashValue].entries.splice(entryIndex, 1);
      setAnimationHashTable(newHashTable);

      setAnimationStep(`✅ Đã xóa "${key}" khỏi hash table!`);
    } else {
      setAnimationStep(`❌ Không tìm thấy "${key}" để xóa!`);
    }

    await sleep(2000);
    setHighlightedBucket(null);
    setHighlightedEntry(null);
    setHashCalculation("");
    setIsAnimating(false);
  };

  const resetHashTable = () => {
    // Add some sample data
    const newHashTable: HashBucket[] = Array(8).fill(null).map(() => ({ entries: [] }));
    const sampleData = [{ key: "name", value: "John" }, { key: "age", value: "25" }, { key: "city", value: "HN" }];

    sampleData.forEach(({key, value}) => {
      const hash = animationHashFunction(key);
      newHashTable[hash].entries.push({ key, value });
    });

    setAnimationHashTable(newHashTable);
    setHighlightedBucket(null);
    setHighlightedEntry(null);
    setAnimationStep("");
    setInsertKey("");
    setInsertVal("");
    setSearchHashKey("");
    setHashCalculation("");
  };

  const getTotalEntries = () => {
    return animationHashTable.reduce((total, bucket) => total + bucket.entries.length, 0);
  };

  const getLoadFactor = () => {
    return (getTotalEntries() / animationHashTable.length).toFixed(2);
  };

  // Initialize with sample data
  useEffect(() => {
    resetHashTable();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Hash className="h-5 w-5" />
          🦀 Rust WASM Hash Table (Bảng Băm)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-orange-50 dark:bg-orange-950/50 p-6 rounded-lg mb-6 border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">🔗 Hash Table là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Hash Table (Bảng Băm)</strong> là cấu trúc dữ liệu sử dụng hàm băm để ánh xạ khóa (key) tới vị trí lưu trữ giá trị (value).
            Giống như từ điển: biết từ khóa → tìm thấy nghĩa ngay lập tức.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-card p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">✅ Ưu điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Truy cập cực nhanh O(1)</li>
                <li>Thêm/xóa hiệu quả</li>
                <li>Linh hoạt với key</li>
                <li>Phù hợp lưu cache</li>
              </ul>
            </div>
            <div className="bg-card p-3 rounded">
              <strong className="text-red-600 dark:text-red-400">❌ Nhược điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Collision (xung đột)</li>
                <li>Tốn bộ nhớ</li>
                <li>Không có thứ tự</li>
                <li>Phụ thuộc hash function</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-950/50 p-6 rounded-lg mb-6 border-l-4 border-cyan-500">
          <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-2">⚡ Hash Function (Hàm Băm)</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Hàm băm</strong> chuyển đổi key thành index:
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mx-1">hash("key") → index</span>
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Collision:</strong> Khi 2 key khác nhau có cùng hash → xử lý bằng Chaining hoặc Open Addressing.
          </div>
        </div>

        <div className="space-y-4">
          {/* Interactive Hash Table Visualization */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
              🎮 Minh Họa Tương Tác - Hash Table Operations
            </h4>

            {/* Hash Table Visualization */}
            <div className="mb-6">
              {/* Hash calculation display */}
              {hashCalculation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
                  <div className="font-mono text-blue-800 dark:text-blue-300">
                    🧮 Hash Calculation: {hashCalculation}
                  </div>
                </div>
              )}

              {/* Hash table buckets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {animationHashTable.map((bucket, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-3 transition-all duration-500 ${
                      highlightedBucket === index
                        ? "border-red-500 bg-yellow-100 dark:bg-yellow-900/30 scale-105 shadow-lg"
                        : "border-purple-300 dark:border-purple-600 bg-card"
                    }`}
                  >
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                      Bucket {index}
                    </div>

                    {bucket.entries.length === 0 ? (
                      <div className="text-xs text-gray-400 italic">Empty</div>
                    ) : (
                      <div className="space-y-1">
                        {bucket.entries.map((entry, entryIndex) => (
                          <div
                            key={entryIndex}
                            className={`text-xs p-2 rounded border transition-all duration-300 ${
                              highlightedEntry?.bucket === index && highlightedEntry?.entry === entryIndex
                                ? "bg-yellow-300 border-red-400 animate-pulse"
                                : "bg-muted border-border"
                            }`}
                          >
                            <div className="font-mono">
                              <span className="text-blue-600 dark:text-blue-400">"{entry.key}"</span>
                              <span className="text-gray-500"> → </span>
                              <span className="text-green-600 dark:text-green-400">"{entry.value}"</span>
                            </div>
                          </div>
                        ))}
                        {bucket.entries.length > 1 && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                            Collision: {bucket.entries.length} entries
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Animation status */}
              {animationStep && (
                <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-3 mb-4">
                  <div className="font-medium text-orange-800 dark:text-orange-300">
                    {animationStep}
                  </div>
                </div>
              )}

              {/* Hash table stats */}
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="bg-card p-3 rounded">
                  <strong>Buckets:</strong> {animationHashTable.length}
                </div>
                <div className="bg-card p-3 rounded">
                  <strong>Entries:</strong> {getTotalEntries()}
                </div>
                <div className="bg-card p-3 rounded">
                  <strong>Load Factor:</strong> {getLoadFactor()}
                </div>
                <div className="bg-card p-3 rounded">
                  <strong>Collisions:</strong> {animationHashTable.filter(b => b.entries.length > 1).length}
                </div>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Insert */}
              <div className="bg-card p-4 rounded border">
                <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">➕ Insert (O(1))</h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={insertKey}
                    onChange={(e) => setInsertKey(e.target.value)}
                    placeholder="Key"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-background dark:border-border"
                    disabled={isAnimating}
                  />
                  <input
                    type="text"
                    value={insertVal}
                    onChange={(e) => setInsertVal(e.target.value)}
                    placeholder="Value"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-background dark:border-border"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateHashInsert}
                    disabled={isAnimating || !insertKey || !insertVal}
                    className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Thêm vào Hash Table
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="bg-card p-4 rounded border">
                <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">🔍 Search (O(1))</h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={searchHashKey}
                    onChange={(e) => setSearchHashKey(e.target.value)}
                    placeholder="Nhập key tìm kiếm"
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-background dark:border-border"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={animateHashSearch}
                    disabled={isAnimating || !searchHashKey}
                    className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Remove */}
              <div className="bg-card p-4 rounded border">
                <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">🗑️ Remove (O(1))</h5>
                <div className="space-y-2">
                  <button
                    onClick={animateHashRemove}
                    disabled={isAnimating || !searchHashKey}
                    className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Xóa Key
                  </button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Xóa key từ hash table
                  </div>
                </div>
              </div>

              {/* Reset */}
              <div className="bg-card p-4 rounded border">
                <h5 className="font-medium text-gray-600 dark:text-gray-400 mb-2">🛠️ Điều Khiển</h5>
                <div className="space-y-2">
                  <button
                    onClick={resetHashTable}
                    disabled={isAnimating}
                    className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    🔄 Reset
                  </button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Khôi phục dữ liệu mẫu
                  </div>
                </div>
              </div>
            </div>

            {/* Operation Explanations */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                <strong className="text-green-700 dark:text-green-300">Hash Function:</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Chuyển đổi key thành index của bucket. Hàm tốt giảm thiểu collision.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                <strong className="text-blue-700 dark:text-blue-300">Collision Handling:</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Chaining: Mỗi bucket là 1 danh sách, nhiều entry có thể cùng bucket.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-800">
                <strong className="text-purple-700 dark:text-purple-300">Load Factor:</strong>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Tỉ lệ entries/buckets. Cao quá → nhiều collision, cần resize.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Thao Tác Hash Table:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Nhập khóa (key)"
                  className="w-full px-3 py-2 border rounded dark:bg-background dark:border-border"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Nhập giá trị (value)"
                  className="w-full px-3 py-2 border rounded dark:bg-background dark:border-border"
                />
                <button
                  onClick={insert}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Thêm Cặp Key-Value
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Nhập khóa để tìm/xóa"
                  className="w-full px-3 py-2 border rounded dark:bg-background dark:border-border"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={search}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Tìm Kiếm
                  </button>
                  <button
                    onClick={remove}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
                <button
                  onClick={clear}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Xóa Tất Cả
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/50 rounded border border-orange-200 dark:border-orange-800">
                <strong>Kết quả:</strong> {result}
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-medium mb-2">Trạng Thái Hash Table:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Số phần tử:</strong> {hashTableDisplay.size}
              </p>
              <div className="bg-card p-3 rounded max-h-32 overflow-y-auto border">
                {hashTableDisplay.size === 0 ? (
                  <p className="text-muted-foreground text-sm">Hash table trống</p>
                ) : (
                  <div className="space-y-1">
                    {Array.from(hashTableDisplay.entries()).map(([k, v]) => (
                      <div key={k} className="text-sm flex justify-between">
                        <span className="font-mono">"{k}" =&gt; "{v}"</span>
                        <span className="text-muted-foreground">Hash: {hashFunction(k)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Cấu Trúc Hash Table:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    subgraph "Hash Table Structure"
                        KEY1[Key: name] --> HASH1[Hash Function]
                        KEY2[Key: age] --> HASH2[Hash Function]
                        KEY3[Key: city] --> HASH3[Hash Function]

                        HASH1 --> BUCKET1[Bucket 0]
                        HASH2 --> BUCKET2[Bucket 1]
                        HASH3 --> BUCKET3[Bucket 2]

                        BUCKET1 --> VALUE1[Value: John]
                        BUCKET2 --> VALUE2[Value: 25]
                        BUCKET3 --> VALUE3[Value: Hanoi]
                    end

                    subgraph "Collision Handling"
                        COLLISION[Multiple Keys] --> SAMEBUCKET[Same Bucket]
                        SAMEBUCKET --> CHAINING[Chaining]
                        SAMEBUCKET --> PROBING[Open Addressing]

                        CHAINING --> LINKEDLIST[Linked List]
                        PROBING --> LINEAR[Linear Probing]
                        PROBING --> QUADRATIC[Quadratic Probing]
                    end

                    style BUCKET1 fill:#4CAF50,color:#fff
                    style BUCKET2 fill:#2196F3,color:#fff
                    style BUCKET3 fill:#FF9800,color:#fff
                    style COLLISION fill:#F44336,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">So Sánh Hash Table:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Thao Tác</th>
                    <th className="text-left py-2">Trung Bình</th>
                    <th className="text-left py-2">Xấu Nhất</th>
                    <th className="text-left py-2">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Tìm Kiếm</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Phụ thuộc vào collision</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Thêm</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Có thể cần resize</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Xóa</td>
                    <td className="py-2">O(1)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Phụ thuộc vào collision</td>
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
                code={`use std::collections::HashMap;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

// Hash Table cơ bản với chaining
#[derive(Debug)]
pub struct HashTable<K, V> {
    buckets: Vec<Vec<(K, V)>>,
    size: usize,
    capacity: usize,
}

impl<K: Clone + PartialEq + Hash, V: Clone> HashTable<K, V> {
    pub fn new(capacity: usize) -> Self {
        Self {
            buckets: vec![Vec::new(); capacity],
            size: 0,
            capacity,
        }
    }

    fn hash(&self, key: &K) -> usize {
        let mut hasher = DefaultHasher::new();
        key.hash(&mut hasher);
        (hasher.finish() as usize) % self.capacity
    }

    pub fn insert(&mut self, key: K, value: V) {
        let index = self.hash(&key);
        let bucket = &mut self.buckets[index];

        // Kiểm tra xem key đã tồn tại chưa
        for (k, v) in bucket.iter_mut() {
            if *k == key {
                *v = value;
                return;
            }
        }

        // Thêm cặp key-value mới
        bucket.push((key, value));
        self.size += 1;
    }

    pub fn get(&self, key: &K) -> Option<&V> {
        let index = self.hash(key);
        let bucket = &self.buckets[index];

        for (k, v) in bucket {
            if k == key {
                return Some(v);
            }
        }
        None
    }

    pub fn remove(&mut self, key: &K) -> Option<V> {
        let index = self.hash(key);
        let bucket = &mut self.buckets[index];

        for (i, (k, _)) in bucket.iter().enumerate() {
            if k == key {
                let (_, value) = bucket.remove(i);
                self.size -= 1;
                return Some(value);
            }
        }
        None
    }

    pub fn len(&self) -> usize {
        self.size
    }
}

// Sử dụng HashMap có sẵn trong Rust
fn hash_map_example() {
    let mut map = HashMap::new();

    // Thêm dữ liệu
    map.insert("name", "John");
    map.insert("age", "25");
    map.insert("city", "Hanoi");

    // Tìm kiếm
    if let Some(name) = map.get("name") {
        println!("Name: {}", name);
    }

    // Xóa
    map.remove("age");

    // Duyệt qua tất cả
    for (key, value) in &map {
        println!("{}: {}", key, value);
    }
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <vector>
#include <list>
#include <functional>
#include <unordered_map>
#include <iostream>

template<typename K, typename V>
class HashTable {
private:
    struct KeyValue {
        K key;
        V value;
        KeyValue(const K& k, const V& v) : key(k), value(v) {}
    };

    std::vector<std::list<KeyValue>> buckets;
    size_t bucket_count;
    size_t size;

    size_t hash(const K& key) const {
        return std::hash<K>{}(key) % bucket_count;
    }

public:
    HashTable(size_t capacity = 10)
        : buckets(capacity), bucket_count(capacity), size(0) {}

    void insert(const K& key, const V& value) {
        size_t index = hash(key);
        auto& bucket = buckets[index];

        // Kiểm tra xem key đã tồn tại chưa
        for (auto& kv : bucket) {
            if (kv.key == key) {
                kv.value = value;
                return;
            }
        }

        // Thêm cặp key-value mới
        bucket.emplace_back(key, value);
        size++;
    }

    bool get(const K& key, V& value) const {
        size_t index = hash(key);
        const auto& bucket = buckets[index];

        for (const auto& kv : bucket) {
            if (kv.key == key) {
                value = kv.value;
                return true;
            }
        }
        return false;
    }

    V* find(const K& key) {
        size_t index = hash(key);
        auto& bucket = buckets[index];

        for (auto& kv : bucket) {
            if (kv.key == key) {
                return &kv.value;
            }
        }
        return nullptr;
    }

    bool remove(const K& key) {
        size_t index = hash(key);
        auto& bucket = buckets[index];

        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->key == key) {
                bucket.erase(it);
                size--;
                return true;
            }
        }
        return false;
    }

    size_t getSize() const {
        return size;
    }

    bool empty() const {
        return size == 0;
    }

    void clear() {
        for (auto& bucket : buckets) {
            bucket.clear();
        }
        size = 0;
    }

    // In tất cả các cặp key-value
    void print() const {
        for (size_t i = 0; i < bucket_count; ++i) {
            std::cout << "Bucket " << i << ": ";
            for (const auto& kv : buckets[i]) {
                std::cout << "(" << kv.key << ", " << kv.value << ") ";
            }
            std::cout << std::endl;
        }
    }
};

// Sử dụng unordered_map có sẵn trong C++
void unordered_map_example() {
    std::unordered_map<std::string, std::string> map;

    // Thêm dữ liệu
    map["name"] = "John";
    map["age"] = "25";
    map["city"] = "Hanoi";

    // Tìm kiếm
    auto it = map.find("name");
    if (it != map.end()) {
        std::cout << "Name: " << it->second << std::endl;
    }

    // Xóa
    map.erase("age");

    // Duyệt qua tất cả
    for (const auto& pair : map) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`class HashTable:
    def __init__(self, capacity=10):
        """Khởi tạo hash table với capacity cho trước"""
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def _hash(self, key):
        """Hàm băm cơ bản"""
        return hash(key) % self.capacity

    def insert(self, key, value):
        """Thêm hoặc cập nhật cặp key-value"""
        index = self._hash(key)
        bucket = self.buckets[index]

        # Kiểm tra xem key đã tồn tại chưa
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # Cập nhật giá trị
                return

        # Thêm cặp key-value mới
        bucket.append((key, value))
        self.size += 1

    def get(self, key):
        """Lấy giá trị theo key"""
        index = self._hash(key)
        bucket = self.buckets[index]

        for k, v in bucket:
            if k == key:
                return v

        raise KeyError(f"Key '{key}' not found")

    def get_safe(self, key, default=None):
        """Lấy giá trị theo key, trả về default nếu không tìm thấy"""
        try:
            return self.get(key)
        except KeyError:
            return default

    def remove(self, key):
        """Xóa cặp key-value"""
        index = self._hash(key)
        bucket = self.buckets[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self.size -= 1
                return v

        raise KeyError(f"Key '{key}' not found")

    def contains(self, key):
        """Kiểm tra xem key có tồn tại không"""
        index = self._hash(key)
        bucket = self.buckets[index]

        for k, v in bucket:
            if k == key:
                return True
        return False

    def keys(self):
        """Trả về tất cả các key"""
        keys = []
        for bucket in self.buckets:
            for k, v in bucket:
                keys.append(k)
        return keys

    def values(self):
        """Trả về tất cả các value"""
        values = []
        for bucket in self.buckets:
            for k, v in bucket:
                values.append(v)
        return values

    def items(self):
        """Trả về tất cả các cặp (key, value)"""
        items = []
        for bucket in self.buckets:
            for k, v in bucket:
                items.append((k, v))
        return items

    def clear(self):
        """Xóa tất cả"""
        self.buckets = [[] for _ in range(self.capacity)]
        self.size = 0

    def get_size(self):
        """Lấy số phần tử"""
        return self.size

    def is_empty(self):
        """Kiểm tra rỗng"""
        return self.size == 0

    def load_factor(self):
        """Tính load factor (tỉ lệ tải)"""
        return self.size / self.capacity

    def print_table(self):
        """In toàn bộ hash table"""
        for i, bucket in enumerate(self.buckets):
            print(f"Bucket {i}: {bucket}")

    # Để sử dụng giống dict của Python
    def __getitem__(self, key):
        return self.get(key)

    def __setitem__(self, key, value):
        self.insert(key, value)

    def __delitem__(self, key):
        self.remove(key)

    def __contains__(self, key):
        return self.contains(key)

    def __len__(self):
        return self.size

    def __str__(self):
        items = self.items()
        return '{' + ', '.join(f"'{k}': '{v}'" for k, v in items) + '}'

# Sử dụng dict có sẵn trong Python
def dict_example():
    # Tạo dictionary
    data = {}

    # Thêm dữ liệu
    data["name"] = "John"
    data["age"] = "25"
    data["city"] = "Hanoi"

    # Tìm kiếm
    if "name" in data:
        print(f"Name: {data['name']}")

    # Xóa
    del data["age"]

    # Duyệt qua tất cả
    for key, value in data.items():
        print(f"{key}: {value}")

# Ví dụ sử dụng:
# ht = HashTable()
# ht["name"] = "John"
# ht["age"] = 25
# print(ht["name"])  # John
# print("name" in ht)  # True
# print(len(ht))  # 2`}
                height="400px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
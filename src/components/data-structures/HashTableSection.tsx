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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5" />
          🦀 Rust WASM Hash Table (Bảng Băm)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4 border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">🔗 Hash Table là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Hash Table (Bảng Băm)</strong> là cấu trúc dữ liệu sử dụng hàm băm để ánh xạ khóa (key) tới vị trí lưu trữ giá trị (value).
            Giống như từ điển: biết từ khóa → tìm thấy nghĩa ngay lập tức.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">✅ Ưu điểm:</strong>
              <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Truy cập cực nhanh O(1)</li>
                <li>Thêm/xóa hiệu quả</li>
                <li>Linh hoạt với key</li>
                <li>Phù hợp lưu cache</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
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

        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg mb-4 border-l-4 border-cyan-500">
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
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thao Tác Hash Table:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Nhập khóa (key)"
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Nhập giá trị (value)"
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
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
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
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
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Trạng Thái Hash Table:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Số phần tử:</strong> {hashTableDisplay.size}
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded max-h-32 overflow-y-auto">
                {hashTableDisplay.size === 0 ? (
                  <p className="text-gray-500 text-sm">Hash table trống</p>
                ) : (
                  <div className="space-y-1">
                    {Array.from(hashTableDisplay.entries()).map(([k, v]) => (
                      <div key={k} className="text-sm flex justify-between">
                        <span className="font-mono">"{k}" =&gt; "{v}"</span>
                        <span className="text-gray-500">Hash: {hashFunction(k)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Trúc Hash Table:</h4>
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

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Hash Table:</h4>
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
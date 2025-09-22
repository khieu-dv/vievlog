"use client";

import { useState } from "react";
import { Hash } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

interface HashEntry {
  key: string;
  value: string;
}

export function HashTableSection() {
  const [hashTable, setHashTable] = useState<Map<string, string>>(new Map());
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [result, setResult] = useState("");

  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 7; // Simple hash table with 7 buckets
  };

  const insert = () => {
    if (key.trim() && value.trim()) {
      const newTable = new Map(hashTable);
      newTable.set(key.trim(), value.trim());
      setHashTable(newTable);
      setResult(`Đã thêm: ${key} = ${value} (Hash: ${hashFunction(key)})`);
      setKey("");
      setValue("");
    }
  };

  const search = () => {
    if (searchKey.trim()) {
      const found = hashTable.get(searchKey.trim());
      if (found) {
        setResult(`Tìm thấy: ${searchKey} = ${found} (Hash: ${hashFunction(searchKey)})`);
      } else {
        setResult(`Không tìm thấy khóa: ${searchKey}`);
      }
    }
  };

  const remove = () => {
    if (searchKey.trim()) {
      const newTable = new Map(hashTable);
      const existed = newTable.delete(searchKey.trim());
      setHashTable(newTable);
      if (existed) {
        setResult(`Đã xóa khóa: ${searchKey}`);
      } else {
        setResult(`Không tìm thấy khóa: ${searchKey}`);
      }
    }
  };

  const clear = () => {
    setHashTable(new Map());
    setResult("Đã xóa toàn bộ hash table");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Hash Table (Bảng Băm)
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Hash Table sử dụng hàm băm để ánh xạ khóa tới giá trị, cho phép truy cập dữ liệu với độ phức tạp O(1) trung bình.
        </p>

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
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Trạng Thái Hash Table:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Số phần tử:</strong> {hashTable.size}
              </p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded max-h-32 overflow-y-auto">
                {hashTable.size === 0 ? (
                  <p className="text-gray-500 text-sm">Hash table trống</p>
                ) : (
                  <div className="space-y-1">
                    {Array.from(hashTable.entries()).map(([k, v]) => (
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
                        KEY1[Key: "name"] --> HASH1[Hash Function]
                        KEY2[Key: "age"] --> HASH2[Hash Function]
                        KEY3[Key: "city"] --> HASH3[Hash Function]

                        HASH1 --> BUCKET1[Bucket 0]
                        HASH2 --> BUCKET2[Bucket 1]
                        HASH3 --> BUCKET3[Bucket 2]

                        BUCKET1 --> VALUE1["Value: John"]
                        BUCKET2 --> VALUE2["Value: 25"]
                        BUCKET3 --> VALUE3["Value: Hanoi"]
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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`use std::collections::HashMap;
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
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
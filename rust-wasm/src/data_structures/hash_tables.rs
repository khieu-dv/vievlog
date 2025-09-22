use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::HashMap;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

/// Hash Table with chaining collision resolution
#[wasm_bindgen]
pub struct HashTable {
    buckets: Vec<Vec<(String, String)>>,
    size: usize,
    capacity: usize,
}

#[wasm_bindgen]
impl HashTable {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize) -> HashTable {
        HashTable {
            buckets: vec![Vec::new(); capacity.max(1)],
            size: 0,
            capacity: capacity.max(1),
        }
    }

    fn hash(&self, key: &str) -> usize {
        let mut hasher = DefaultHasher::new();
        key.hash(&mut hasher);
        (hasher.finish() as usize) % self.capacity
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, key: &str, value: &str) -> bool {
        let index = self.hash(key);
        let bucket = &mut self.buckets[index];

        // Check if key already exists
        for (k, v) in bucket.iter_mut() {
            if k == key {
                *v = value.to_string();
                return false; // Updated existing key
            }
        }

        // Add new key-value pair
        bucket.push((key.to_string(), value.to_string()));
        self.size += 1;

        // Resize if load factor > 0.75
        if self.size > self.capacity * 3 / 4 {
            self.resize();
        }

        true // Inserted new key
    }

    #[wasm_bindgen]
    pub fn get(&self, key: &str) -> Option<String> {
        let index = self.hash(key);
        let bucket = &self.buckets[index];

        for (k, v) in bucket {
            if k == key {
                return Some(v.clone());
            }
        }
        None
    }

    #[wasm_bindgen]
    pub fn remove(&mut self, key: &str) -> Option<String> {
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

    #[wasm_bindgen]
    pub fn contains_key(&self, key: &str) -> bool {
        self.get(key).is_some()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn capacity(&self) -> usize {
        self.capacity
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.size == 0
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        for bucket in &mut self.buckets {
            bucket.clear();
        }
        self.size = 0;
    }

    #[wasm_bindgen]
    pub fn load_factor(&self) -> f64 {
        self.size as f64 / self.capacity as f64
    }

    #[wasm_bindgen]
    pub fn keys(&self) -> Array {
        let mut result = Vec::new();
        for bucket in &self.buckets {
            for (key, _) in bucket {
                result.push(JsValue::from(key));
            }
        }
        result.iter().cloned().collect()
    }

    #[wasm_bindgen]
    pub fn values(&self) -> Array {
        let mut result = Vec::new();
        for bucket in &self.buckets {
            for (_, value) in bucket {
                result.push(JsValue::from(value));
            }
        }
        result.iter().cloned().collect()
    }

    #[wasm_bindgen]
    pub fn entries(&self) -> Array {
        let mut result = Vec::new();
        for bucket in &self.buckets {
            for (key, value) in bucket {
                let entry = Array::new();
                entry.push(&JsValue::from(key));
                entry.push(&JsValue::from(value));
                result.push(JsValue::from(entry));
            }
        }
        result.iter().cloned().collect()
    }

    #[wasm_bindgen]
    pub fn bucket_sizes(&self) -> Array {
        self.buckets
            .iter()
            .map(|bucket| JsValue::from(bucket.len()))
            .collect()
    }

    #[wasm_bindgen]
    pub fn max_bucket_size(&self) -> usize {
        self.buckets.iter().map(|bucket| bucket.len()).max().unwrap_or(0)
    }

    fn resize(&mut self) {
        let old_buckets = std::mem::take(&mut self.buckets);
        self.capacity *= 2;
        self.buckets = vec![Vec::new(); self.capacity];
        self.size = 0;

        for bucket in old_buckets {
            for (key, value) in bucket {
                self.insert(&key, &value);
            }
        }
    }
}

/// Simple HashMap wrapper for string-to-string mappings
#[wasm_bindgen]
pub struct SimpleHashMap {
    map: HashMap<String, String>,
}

#[wasm_bindgen]
impl SimpleHashMap {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SimpleHashMap {
        SimpleHashMap {
            map: HashMap::new(),
        }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, key: &str, value: &str) -> Option<String> {
        self.map.insert(key.to_string(), value.to_string())
    }

    #[wasm_bindgen]
    pub fn get(&self, key: &str) -> Option<String> {
        self.map.get(key).cloned()
    }

    #[wasm_bindgen]
    pub fn remove(&mut self, key: &str) -> Option<String> {
        self.map.remove(key)
    }

    #[wasm_bindgen]
    pub fn contains_key(&self, key: &str) -> bool {
        self.map.contains_key(key)
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.map.len()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.map.is_empty()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.map.clear();
    }

    #[wasm_bindgen]
    pub fn keys(&self) -> Array {
        self.map.keys().map(|k| JsValue::from(k)).collect()
    }

    #[wasm_bindgen]
    pub fn values(&self) -> Array {
        self.map.values().map(|v| JsValue::from(v)).collect()
    }

    #[wasm_bindgen]
    pub fn entries(&self) -> Array {
        self.map
            .iter()
            .map(|(k, v)| {
                let entry = Array::new();
                entry.push(&JsValue::from(k));
                entry.push(&JsValue::from(v));
                JsValue::from(entry)
            })
            .collect()
    }
}

/// Integer HashMap for performance testing
#[wasm_bindgen]
pub struct IntHashMap {
    map: HashMap<i32, i32>,
}

#[wasm_bindgen]
impl IntHashMap {
    #[wasm_bindgen(constructor)]
    pub fn new() -> IntHashMap {
        IntHashMap {
            map: HashMap::new(),
        }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, key: i32, value: i32) -> Option<i32> {
        self.map.insert(key, value)
    }

    #[wasm_bindgen]
    pub fn get(&self, key: i32) -> Option<i32> {
        self.map.get(&key).copied()
    }

    #[wasm_bindgen]
    pub fn remove(&mut self, key: i32) -> Option<i32> {
        self.map.remove(&key)
    }

    #[wasm_bindgen]
    pub fn contains_key(&self, key: i32) -> bool {
        self.map.contains_key(&key)
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.map.len()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.map.is_empty()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.map.clear();
    }

    #[wasm_bindgen]
    pub fn keys(&self) -> Array {
        self.map.keys().map(|&k| JsValue::from(k)).collect()
    }

    #[wasm_bindgen]
    pub fn values(&self) -> Array {
        self.map.values().map(|&v| JsValue::from(v)).collect()
    }

    #[wasm_bindgen]
    pub fn entries(&self) -> Array {
        self.map
            .iter()
            .map(|(&k, &v)| {
                let entry = Array::new();
                entry.push(&JsValue::from(k));
                entry.push(&JsValue::from(v));
                JsValue::from(entry)
            })
            .collect()
    }

    #[wasm_bindgen]
    pub fn from_arrays(keys: &Array, values: &Array) -> IntHashMap {
        let mut map = IntHashMap::new();
        let min_len = keys.length().min(values.length());

        for i in 0..min_len {
            if let (Some(key), Some(value)) = (
                keys.get(i).as_f64().map(|x| x as i32),
                values.get(i).as_f64().map(|x| x as i32),
            ) {
                map.insert(key, value);
            }
        }

        map
    }
}

/// Hash function utilities
#[wasm_bindgen]
pub fn hash_string(input: &str) -> u64 {
    let mut hasher = DefaultHasher::new();
    input.hash(&mut hasher);
    hasher.finish()
}

#[wasm_bindgen]
pub fn hash_string_with_modulo(input: &str, modulo: usize) -> usize {
    let hash = hash_string(input);
    (hash as usize) % modulo.max(1)
}

/// Simple hash function for demonstration
#[wasm_bindgen]
pub fn simple_hash(input: &str, table_size: usize) -> usize {
    let mut hash = 0usize;
    for byte in input.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as usize);
    }
    hash % table_size.max(1)
}

/// Performance test: hash operations
#[wasm_bindgen]
pub fn benchmark_hash_operations(operation: &str, iterations: usize) -> f64 {
    let start = js_sys::Date::now();

    match operation {
        "insert" => {
            let mut map = IntHashMap::new();
            for i in 0..iterations {
                map.insert(i as i32, i as i32 * 2);
            }
        }
        "lookup" => {
            let mut map = IntHashMap::new();
            // Pre-populate
            for i in 0..iterations {
                map.insert(i as i32, i as i32 * 2);
            }
            // Benchmark lookups
            let start_lookup = js_sys::Date::now();
            for i in 0..iterations {
                map.get(i as i32);
            }
            return js_sys::Date::now() - start_lookup;
        }
        "remove" => {
            let mut map = IntHashMap::new();
            // Pre-populate
            for i in 0..iterations {
                map.insert(i as i32, i as i32 * 2);
            }
            // Benchmark removals
            let start_remove = js_sys::Date::now();
            for i in 0..iterations {
                map.remove(i as i32);
            }
            return js_sys::Date::now() - start_remove;
        }
        _ => {}
    }

    js_sys::Date::now() - start
}
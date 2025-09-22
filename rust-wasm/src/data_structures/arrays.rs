use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Dynamic Array/Vector Implementation
#[wasm_bindgen]
pub struct RustVector {
    data: Vec<i32>,
}

#[wasm_bindgen]
impl RustVector {
    #[wasm_bindgen(constructor)]
    pub fn new() -> RustVector {
        RustVector { data: Vec::new() }
    }

    #[wasm_bindgen]
    pub fn with_capacity(capacity: usize) -> RustVector {
        RustVector {
            data: Vec::with_capacity(capacity)
        }
    }

    #[wasm_bindgen]
    pub fn push(&mut self, value: i32) {
        self.data.push(value);
    }

    #[wasm_bindgen]
    pub fn pop(&mut self) -> Option<i32> {
        self.data.pop()
    }

    #[wasm_bindgen]
    pub fn get(&self, index: usize) -> Option<i32> {
        self.data.get(index).copied()
    }

    #[wasm_bindgen]
    pub fn set(&mut self, index: usize, value: i32) -> bool {
        if index < self.data.len() {
            self.data[index] = value;
            true
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, index: usize, value: i32) -> bool {
        if index <= self.data.len() {
            self.data.insert(index, value);
            true
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn remove(&mut self, index: usize) -> Option<i32> {
        if index < self.data.len() {
            Some(self.data.remove(index))
        } else {
            None
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.data.len()
    }

    #[wasm_bindgen]
    pub fn capacity(&self) -> usize {
        self.data.capacity()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.data.clear();
    }

    #[wasm_bindgen]
    pub fn reverse(&mut self) {
        self.data.reverse();
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.data.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn from_array(arr: &Array) -> RustVector {
        let mut vector = RustVector::new();
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                vector.push(val as i32);
            }
        }
        vector
    }

    #[wasm_bindgen]
    pub fn contains(&self, value: i32) -> bool {
        self.data.contains(&value)
    }

    #[wasm_bindgen]
    pub fn index_of(&self, value: i32) -> Option<usize> {
        self.data.iter().position(|&x| x == value)
    }

    #[wasm_bindgen]
    pub fn extend(&mut self, other: &RustVector) {
        self.data.extend_from_slice(&other.data);
    }

    #[wasm_bindgen]
    pub fn clone_vector(&self) -> RustVector {
        RustVector {
            data: self.data.clone()
        }
    }
}

/// Static Array with fixed size
#[wasm_bindgen]
pub struct StaticArray {
    data: Vec<i32>,
    size: usize,
}

#[wasm_bindgen]
impl StaticArray {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> StaticArray {
        StaticArray {
            data: vec![0; size],
            size,
        }
    }

    #[wasm_bindgen]
    pub fn get(&self, index: usize) -> Option<i32> {
        if index < self.size {
            Some(self.data[index])
        } else {
            None
        }
    }

    #[wasm_bindgen]
    pub fn set(&mut self, index: usize, value: i32) -> bool {
        if index < self.size {
            self.data[index] = value;
            true
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn fill(&mut self, value: i32) {
        self.data.fill(value);
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.data.iter().map(|&x| JsValue::from(x)).collect()
    }
}

/// Utility functions for array operations
#[wasm_bindgen]
pub fn array_sum(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

#[wasm_bindgen]
pub fn array_max(arr: &[i32]) -> Option<i32> {
    arr.iter().max().copied()
}

#[wasm_bindgen]
pub fn array_min(arr: &[i32]) -> Option<i32> {
    arr.iter().min().copied()
}

#[wasm_bindgen]
pub fn array_reverse(mut arr: Vec<i32>) -> Array {
    arr.reverse();
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn array_slice(arr: &[i32], start: usize, end: usize) -> Array {
    if start <= end && end <= arr.len() {
        arr[start..end].iter().map(|&x| JsValue::from(x)).collect()
    } else {
        Array::new()
    }
}
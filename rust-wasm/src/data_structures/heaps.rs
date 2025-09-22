use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Binary Heap implementation (Min-Heap by default)
#[wasm_bindgen]
pub struct BinaryHeap {
    data: Vec<i32>,
    is_max_heap: bool,
}

#[wasm_bindgen]
impl BinaryHeap {
    #[wasm_bindgen(constructor)]
    pub fn new(is_max_heap: bool) -> BinaryHeap {
        BinaryHeap {
            data: Vec::new(),
            is_max_heap,
        }
    }

    #[wasm_bindgen]
    pub fn with_capacity(capacity: usize, is_max_heap: bool) -> BinaryHeap {
        BinaryHeap {
            data: Vec::with_capacity(capacity),
            is_max_heap,
        }
    }

    fn compare(&self, a: i32, b: i32) -> bool {
        if self.is_max_heap {
            a > b
        } else {
            a < b
        }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, item: i32) {
        self.data.push(item);
        self.heapify_up(self.data.len() - 1);
    }

    #[wasm_bindgen]
    pub fn extract(&mut self) -> Option<i32> {
        if self.data.is_empty() {
            return None;
        }

        if self.data.len() == 1 {
            return self.data.pop();
        }

        let root = self.data[0];
        self.data[0] = self.data.pop().unwrap();
        self.heapify_down(0);
        Some(root)
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<i32> {
        self.data.first().copied()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
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
    pub fn clear(&mut self) {
        self.data.clear();
    }

    #[wasm_bindgen]
    pub fn is_max_heap(&self) -> bool {
        self.is_max_heap
    }

    #[wasm_bindgen]
    pub fn change_heap_type(&mut self, is_max_heap: bool) {
        if self.is_max_heap != is_max_heap {
            self.is_max_heap = is_max_heap;
            self.heapify();
        }
    }

    fn heapify_up(&mut self, mut index: usize) {
        while index > 0 {
            let parent = (index - 1) / 2;
            if !self.compare(self.data[index], self.data[parent]) {
                break;
            }
            self.data.swap(index, parent);
            index = parent;
        }
    }

    fn heapify_down(&mut self, mut index: usize) {
        loop {
            let mut target = index;
            let left = 2 * index + 1;
            let right = 2 * index + 2;

            if left < self.data.len() && self.compare(self.data[left], self.data[target]) {
                target = left;
            }

            if right < self.data.len() && self.compare(self.data[right], self.data[target]) {
                target = right;
            }

            if target == index {
                break;
            }

            self.data.swap(index, target);
            index = target;
        }
    }

    fn heapify(&mut self) {
        if self.data.len() <= 1 {
            return;
        }

        for i in (0..self.data.len() / 2).rev() {
            self.heapify_down(i);
        }
    }

    #[wasm_bindgen]
    pub fn build_heap(&mut self, arr: Vec<i32>) {
        self.data = arr;
        self.heapify();
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.data.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn from_array(arr: &Array, is_max_heap: bool) -> BinaryHeap {
        let mut heap = BinaryHeap::new(is_max_heap);
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                heap.insert(val as i32);
            }
        }
        heap
    }

    #[wasm_bindgen]
    pub fn is_valid_heap(&self) -> bool {
        for i in 0..self.data.len() / 2 {
            let left = 2 * i + 1;
            let right = 2 * i + 2;

            if left < self.data.len() && self.compare(self.data[left], self.data[i]) {
                return false;
            }

            if right < self.data.len() && self.compare(self.data[right], self.data[i]) {
                return false;
            }
        }
        true
    }

    #[wasm_bindgen]
    pub fn get_parent(&self, index: usize) -> Option<i32> {
        if index == 0 || index >= self.data.len() {
            None
        } else {
            let parent_idx = (index - 1) / 2;
            Some(self.data[parent_idx])
        }
    }

    #[wasm_bindgen]
    pub fn get_left_child(&self, index: usize) -> Option<i32> {
        let left = 2 * index + 1;
        if left < self.data.len() {
            Some(self.data[left])
        } else {
            None
        }
    }

    #[wasm_bindgen]
    pub fn get_right_child(&self, index: usize) -> Option<i32> {
        let right = 2 * index + 2;
        if right < self.data.len() {
            Some(self.data[right])
        } else {
            None
        }
    }

    #[wasm_bindgen]
    pub fn height(&self) -> i32 {
        if self.data.is_empty() {
            -1
        } else {
            ((self.data.len() as f64).log2().floor()) as i32
        }
    }
}

/// Heap Sort implementation from heaps module
#[wasm_bindgen]
pub fn heap_sort_heaps(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    if n <= 1 {
        return arr.iter().map(|&x| JsValue::from(x)).collect();
    }

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify_array(&mut arr, n, i);
    }

    // Extract elements one by one
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify_array(&mut arr, i, 0);
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn heapify_array(arr: &mut [i32], heap_size: usize, root: usize) {
    let mut largest = root;
    let left = 2 * root + 1;
    let right = 2 * root + 2;

    if left < heap_size && arr[left] > arr[largest] {
        largest = left;
    }

    if right < heap_size && arr[right] > arr[largest] {
        largest = right;
    }

    if largest != root {
        arr.swap(root, largest);
        heapify_array(arr, heap_size, largest);
    }
}

/// Priority Queue using Binary Heap
#[wasm_bindgen]
pub struct PriorityQueueHeap {
    heap: BinaryHeap,
}

#[wasm_bindgen]
impl PriorityQueueHeap {
    #[wasm_bindgen(constructor)]
    pub fn new(is_max_priority: bool) -> PriorityQueueHeap {
        PriorityQueueHeap {
            heap: BinaryHeap::new(is_max_priority),
        }
    }

    #[wasm_bindgen]
    pub fn enqueue(&mut self, item: i32) {
        self.heap.insert(item);
    }

    #[wasm_bindgen]
    pub fn dequeue(&mut self) -> Option<i32> {
        self.heap.extract()
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<i32> {
        self.heap.peek()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.heap.is_empty()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.heap.len()
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.heap.to_array()
    }
}

/// Median Finder using two heaps
#[wasm_bindgen]
pub struct MedianFinder {
    max_heap: BinaryHeap, // Left half (smaller elements)
    min_heap: BinaryHeap, // Right half (larger elements)
}

#[wasm_bindgen]
impl MedianFinder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> MedianFinder {
        MedianFinder {
            max_heap: BinaryHeap::new(true),  // Max heap for smaller half
            min_heap: BinaryHeap::new(false), // Min heap for larger half
        }
    }

    #[wasm_bindgen]
    pub fn add_number(&mut self, num: i32) {
        if self.max_heap.is_empty() || num <= self.max_heap.peek().unwrap_or(i32::MIN) {
            self.max_heap.insert(num);
        } else {
            self.min_heap.insert(num);
        }

        // Balance the heaps
        if self.max_heap.len() > self.min_heap.len() + 1 {
            if let Some(val) = self.max_heap.extract() {
                self.min_heap.insert(val);
            }
        } else if self.min_heap.len() > self.max_heap.len() + 1 {
            if let Some(val) = self.min_heap.extract() {
                self.max_heap.insert(val);
            }
        }
    }

    #[wasm_bindgen]
    pub fn find_median(&self) -> f64 {
        if self.max_heap.len() == self.min_heap.len() {
            let left = self.max_heap.peek().unwrap_or(0) as f64;
            let right = self.min_heap.peek().unwrap_or(0) as f64;
            (left + right) / 2.0
        } else if self.max_heap.len() > self.min_heap.len() {
            self.max_heap.peek().unwrap_or(0) as f64
        } else {
            self.min_heap.peek().unwrap_or(0) as f64
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.max_heap.len() + self.min_heap.len()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.max_heap.is_empty() && self.min_heap.is_empty()
    }
}

/// K Largest Elements
#[wasm_bindgen]
pub fn find_k_largest(arr: Vec<i32>, k: usize) -> Array {
    if k == 0 || arr.is_empty() {
        return Array::new();
    }

    let mut min_heap = BinaryHeap::new(false); // Min heap

    for num in arr {
        min_heap.insert(num);
        if min_heap.len() > k {
            min_heap.extract();
        }
    }

    let mut result = Vec::new();
    while let Some(val) = min_heap.extract() {
        result.push(val);
    }
    result.reverse(); // Largest to smallest

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// K Smallest Elements
#[wasm_bindgen]
pub fn find_k_smallest(arr: Vec<i32>, k: usize) -> Array {
    if k == 0 || arr.is_empty() {
        return Array::new();
    }

    let mut max_heap = BinaryHeap::new(true); // Max heap

    for num in arr {
        max_heap.insert(num);
        if max_heap.len() > k {
            max_heap.extract();
        }
    }

    let mut result = Vec::new();
    while let Some(val) = max_heap.extract() {
        result.push(val);
    }
    result.reverse(); // Smallest to largest

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Check if array represents a valid heap
#[wasm_bindgen]
pub fn is_heap(arr: &[i32], is_max_heap: bool) -> bool {
    let n = arr.len();

    for i in 0..n / 2 {
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if is_max_heap {
            if left < n && arr[i] < arr[left] {
                return false;
            }
            if right < n && arr[i] < arr[right] {
                return false;
            }
        } else {
            if left < n && arr[i] > arr[left] {
                return false;
            }
            if right < n && arr[i] > arr[right] {
                return false;
            }
        }
    }

    true
}

/// Merge K Sorted Arrays using heap
#[wasm_bindgen]
pub fn merge_k_sorted_arrays(arrays: &Array) -> Array {
    if arrays.length() == 0 {
        return Array::new();
    }

    let mut min_heap = Vec::new(); // (value, array_index, element_index)
    let mut array_data: Vec<Vec<i32>> = Vec::new();

    // Convert JS arrays to Rust vectors and initialize heap
    for i in 0..arrays.length() {
        if let Some(arr) = arrays.get(i).dyn_ref::<Array>() {
            let mut rust_arr = Vec::new();
            for j in 0..arr.length() {
                if let Some(val) = arr.get(j).as_f64() {
                    rust_arr.push(val as i32);
                }
            }
            if !rust_arr.is_empty() {
                min_heap.push((rust_arr[0], i as usize, 0));
                array_data.push(rust_arr);
            }
        }
    }

    // Build min heap
    min_heap.sort_by(|a, b| b.0.cmp(&a.0)); // Reverse for min heap behavior with pop

    let mut result = Vec::new();

    while !min_heap.is_empty() {
        // Extract minimum
        let (val, arr_idx, elem_idx) = min_heap.remove(0);
        result.push(val);

        // Add next element from same array
        if elem_idx + 1 < array_data[arr_idx].len() {
            let next_val = array_data[arr_idx][elem_idx + 1];

            // Insert in correct position to maintain min heap
            let mut inserted = false;
            for i in 0..min_heap.len() {
                if next_val <= min_heap[i].0 {
                    min_heap.insert(i, (next_val, arr_idx, elem_idx + 1));
                    inserted = true;
                    break;
                }
            }
            if !inserted {
                min_heap.push((next_val, arr_idx, elem_idx + 1));
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Performance benchmark for heap operations
#[wasm_bindgen]
pub fn benchmark_heap_operations(operation: &str, iterations: usize, is_max_heap: bool) -> f64 {
    let start = js_sys::Date::now();

    match operation {
        "insert" => {
            let mut heap = BinaryHeap::new(is_max_heap);
            for i in 0..iterations {
                heap.insert(i as i32);
            }
        }
        "extract" => {
            let mut heap = BinaryHeap::new(is_max_heap);
            // Pre-populate
            for i in 0..iterations {
                heap.insert(i as i32);
            }
            // Benchmark extractions
            let start_extract = js_sys::Date::now();
            for _ in 0..iterations {
                heap.extract();
            }
            return js_sys::Date::now() - start_extract;
        }
        "heapify" => {
            let arr: Vec<i32> = (0..iterations as i32).collect();
            let mut heap = BinaryHeap::new(is_max_heap);
            let start_heapify = js_sys::Date::now();
            heap.build_heap(arr);
            return js_sys::Date::now() - start_heapify;
        }
        "heap_sort" => {
            let arr: Vec<i32> = (0..iterations as i32).rev().collect(); // Worst case for heap sort
            let start_sort = js_sys::Date::now();
            heap_sort_heaps(arr);
            return js_sys::Date::now() - start_sort;
        }
        _ => {}
    }

    js_sys::Date::now() - start
}
use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::VecDeque;

/// Queue implementation using VecDeque
#[wasm_bindgen]
pub struct Queue {
    items: VecDeque<i32>,
}

#[wasm_bindgen]
impl Queue {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Queue {
        Queue {
            items: VecDeque::new(),
        }
    }

    #[wasm_bindgen]
    pub fn with_capacity(capacity: usize) -> Queue {
        Queue {
            items: VecDeque::with_capacity(capacity),
        }
    }

    #[wasm_bindgen]
    pub fn enqueue(&mut self, item: i32) {
        self.items.push_back(item);
    }

    #[wasm_bindgen]
    pub fn dequeue(&mut self) -> Option<i32> {
        self.items.pop_front()
    }

    #[wasm_bindgen]
    pub fn front(&self) -> Option<i32> {
        self.items.front().copied()
    }

    #[wasm_bindgen]
    pub fn back(&self) -> Option<i32> {
        self.items.back().copied()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.items.len()
    }

    #[wasm_bindgen]
    pub fn capacity(&self) -> usize {
        self.items.capacity()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.items.clear();
    }

    #[wasm_bindgen]
    pub fn contains(&self, item: i32) -> bool {
        self.items.contains(&item)
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.items.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn from_array(arr: &Array) -> Queue {
        let mut queue = Queue::new();
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                queue.enqueue(val as i32);
            }
        }
        queue
    }
}

/// Circular Queue with fixed capacity
#[wasm_bindgen]
pub struct CircularQueue {
    data: Vec<Option<i32>>,
    front: usize,
    rear: usize,
    size: usize,
    capacity: usize,
}

#[wasm_bindgen]
impl CircularQueue {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize) -> CircularQueue {
        CircularQueue {
            data: vec![None; capacity.max(1)],
            front: 0,
            rear: 0,
            size: 0,
            capacity: capacity.max(1),
        }
    }

    #[wasm_bindgen]
    pub fn enqueue(&mut self, item: i32) -> bool {
        if self.is_full() {
            return false;
        }

        self.data[self.rear] = Some(item);
        self.rear = (self.rear + 1) % self.capacity;
        self.size += 1;
        true
    }

    #[wasm_bindgen]
    pub fn dequeue(&mut self) -> Option<i32> {
        if self.is_empty() {
            return None;
        }

        let item = self.data[self.front].take();
        self.front = (self.front + 1) % self.capacity;
        self.size -= 1;
        item
    }

    #[wasm_bindgen]
    pub fn front(&self) -> Option<i32> {
        if self.is_empty() {
            None
        } else {
            self.data[self.front]
        }
    }

    #[wasm_bindgen]
    pub fn rear(&self) -> Option<i32> {
        if self.is_empty() {
            None
        } else {
            let rear_idx = if self.rear == 0 { self.capacity - 1 } else { self.rear - 1 };
            self.data[rear_idx]
        }
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.size == 0
    }

    #[wasm_bindgen]
    pub fn is_full(&self) -> bool {
        self.size == self.capacity
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
    pub fn clear(&mut self) {
        self.data.fill(None);
        self.front = 0;
        self.rear = 0;
        self.size = 0;
    }

    #[wasm_bindgen]
    pub fn get_front_index(&self) -> usize {
        self.front
    }

    #[wasm_bindgen]
    pub fn get_rear_index(&self) -> usize {
        self.rear
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        let mut result = Vec::new();
        if !self.is_empty() {
            let mut current = self.front;
            for _ in 0..self.size {
                if let Some(value) = self.data[current] {
                    result.push(value);
                }
                current = (current + 1) % self.capacity;
            }
        }
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn get_raw_data(&self) -> Array {
        self.data.iter().map(|&opt| {
            match opt {
                Some(val) => JsValue::from(val),
                None => JsValue::NULL,
            }
        }).collect()
    }
}

/// Priority Queue (Min-Heap based)
#[wasm_bindgen]
pub struct PriorityQueue {
    heap: Vec<(i32, i32)>, // (priority, value)
}

#[wasm_bindgen]
impl PriorityQueue {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PriorityQueue {
        PriorityQueue {
            heap: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn enqueue(&mut self, value: i32, priority: i32) {
        self.heap.push((priority, value));
        self.heapify_up(self.heap.len() - 1);
    }

    #[wasm_bindgen]
    pub fn dequeue(&mut self) -> Option<i32> {
        if self.heap.is_empty() {
            return None;
        }

        if self.heap.len() == 1 {
            return Some(self.heap.pop().unwrap().1);
        }

        let min_item = self.heap[0].1;
        self.heap[0] = self.heap.pop().unwrap();
        self.heapify_down(0);
        Some(min_item)
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<i32> {
        self.heap.first().map(|(_, value)| *value)
    }

    #[wasm_bindgen]
    pub fn peek_priority(&self) -> Option<i32> {
        self.heap.first().map(|(priority, _)| *priority)
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
    pub fn clear(&mut self) {
        self.heap.clear();
    }

    fn heapify_up(&mut self, mut index: usize) {
        while index > 0 {
            let parent = (index - 1) / 2;
            if self.heap[index].0 >= self.heap[parent].0 {
                break;
            }
            self.heap.swap(index, parent);
            index = parent;
        }
    }

    fn heapify_down(&mut self, mut index: usize) {
        loop {
            let mut smallest = index;
            let left = 2 * index + 1;
            let right = 2 * index + 2;

            if left < self.heap.len() && self.heap[left].0 < self.heap[smallest].0 {
                smallest = left;
            }

            if right < self.heap.len() && self.heap[right].0 < self.heap[smallest].0 {
                smallest = right;
            }

            if smallest == index {
                break;
            }

            self.heap.swap(index, smallest);
            index = smallest;
        }
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.heap.iter().map(|(priority, value)| {
            let item = Array::new();
            item.push(&JsValue::from(*value));
            item.push(&JsValue::from(*priority));
            JsValue::from(item)
        }).collect()
    }
}

/// Deque (Double-ended queue)
#[wasm_bindgen]
pub struct Deque {
    items: VecDeque<i32>,
}

#[wasm_bindgen]
impl Deque {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Deque {
        Deque {
            items: VecDeque::new(),
        }
    }

    #[wasm_bindgen]
    pub fn push_front(&mut self, item: i32) {
        self.items.push_front(item);
    }

    #[wasm_bindgen]
    pub fn push_back(&mut self, item: i32) {
        self.items.push_back(item);
    }

    #[wasm_bindgen]
    pub fn pop_front(&mut self) -> Option<i32> {
        self.items.pop_front()
    }

    #[wasm_bindgen]
    pub fn pop_back(&mut self) -> Option<i32> {
        self.items.pop_back()
    }

    #[wasm_bindgen]
    pub fn front(&self) -> Option<i32> {
        self.items.front().copied()
    }

    #[wasm_bindgen]
    pub fn back(&self) -> Option<i32> {
        self.items.back().copied()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.items.len()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.items.clear();
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.items.iter().map(|&x| JsValue::from(x)).collect()
    }
}

/// Queue algorithms and utilities

/// Breadth-First Search using queue
#[wasm_bindgen]
pub fn bfs_traversal(adj_list: &Array, start: i32) -> Array {
    let mut visited = std::collections::HashSet::new();
    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    queue.push_back(start);
    visited.insert(start);

    while let Some(vertex) = queue.pop_front() {
        result.push(vertex);

        // Get neighbors from adjacency list
        if let Some(neighbors) = adj_list.get(vertex as u32).dyn_ref::<Array>() {
            for i in 0..neighbors.length() {
                if let Some(neighbor) = neighbors.get(i).as_f64() {
                    let neighbor = neighbor as i32;
                    if !visited.contains(&neighbor) {
                        visited.insert(neighbor);
                        queue.push_back(neighbor);
                    }
                }
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Level order traversal of binary tree
#[wasm_bindgen]
pub fn level_order_traversal(tree_array: &Array) -> Array {
    if tree_array.length() == 0 {
        return Array::new();
    }

    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    queue.push_back(0); // Root index

    while let Some(index) = queue.pop_front() {
        if index < tree_array.length() {
            if let Some(value) = tree_array.get(index).as_f64() {
                result.push(value as i32);

                // Add left and right children
                let left_child = 2 * index + 1;
                let right_child = 2 * index + 2;

                if left_child < tree_array.length() {
                    queue.push_back(left_child);
                }
                if right_child < tree_array.length() {
                    queue.push_back(right_child);
                }
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Sliding window maximum using deque
#[wasm_bindgen]
pub fn sliding_window_maximum(arr: Vec<i32>, window_size: usize) -> Array {
    if arr.is_empty() || window_size == 0 || window_size > arr.len() {
        return Array::new();
    }

    let mut deque = VecDeque::new();
    let mut result = Vec::new();

    for i in 0..arr.len() {
        // Remove elements outside current window
        while let Some(&front) = deque.front() {
            if front <= i.saturating_sub(window_size) {
                deque.pop_front();
            } else {
                break;
            }
        }

        // Remove elements smaller than current element
        while let Some(&back) = deque.back() {
            if arr[back] <= arr[i] {
                deque.pop_back();
            } else {
                break;
            }
        }

        deque.push_back(i);

        // Add to result if window is complete
        if i >= window_size - 1 {
            if let Some(&front) = deque.front() {
                result.push(arr[front]);
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// First negative integer in every window
#[wasm_bindgen]
pub fn first_negative_in_window(arr: Vec<i32>, window_size: usize) -> Array {
    if arr.is_empty() || window_size == 0 || window_size > arr.len() {
        return Array::new();
    }

    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    // Process first window
    for i in 0..window_size {
        if arr[i] < 0 {
            queue.push_back(i);
        }
    }

    // First window result
    if let Some(&front) = queue.front() {
        result.push(arr[front]);
    } else {
        result.push(0);
    }

    // Process remaining windows
    for i in window_size..arr.len() {
        // Remove elements outside current window
        while let Some(&front) = queue.front() {
            if front <= i - window_size {
                queue.pop_front();
            } else {
                break;
            }
        }

        // Add current element if negative
        if arr[i] < 0 {
            queue.push_back(i);
        }

        // Get first negative in current window
        if let Some(&front) = queue.front() {
            result.push(arr[front]);
        } else {
            result.push(0);
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Queue using two stacks
#[wasm_bindgen]
pub struct QueueUsingStacks {
    stack1: Vec<i32>, // For enqueue
    stack2: Vec<i32>, // For dequeue
}

#[wasm_bindgen]
impl QueueUsingStacks {
    #[wasm_bindgen(constructor)]
    pub fn new() -> QueueUsingStacks {
        QueueUsingStacks {
            stack1: Vec::new(),
            stack2: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn enqueue(&mut self, item: i32) {
        self.stack1.push(item);
    }

    #[wasm_bindgen]
    pub fn dequeue(&mut self) -> Option<i32> {
        if self.stack2.is_empty() {
            while let Some(item) = self.stack1.pop() {
                self.stack2.push(item);
            }
        }
        self.stack2.pop()
    }

    #[wasm_bindgen]
    pub fn front(&mut self) -> Option<i32> {
        if self.stack2.is_empty() {
            while let Some(item) = self.stack1.pop() {
                self.stack2.push(item);
            }
        }
        self.stack2.last().copied()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.stack1.is_empty() && self.stack2.is_empty()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.stack1.len() + self.stack2.len()
    }
}

/// Performance benchmark for queue operations
#[wasm_bindgen]
pub fn benchmark_queue_operations(operation: &str, iterations: usize) -> f64 {
    let start = js_sys::Date::now();

    match operation {
        "enqueue" => {
            let mut queue = Queue::new();
            for i in 0..iterations {
                queue.enqueue(i as i32);
            }
        }
        "dequeue" => {
            let mut queue = Queue::new();
            // Pre-populate
            for i in 0..iterations {
                queue.enqueue(i as i32);
            }
            // Benchmark dequeues
            let start_dequeue = js_sys::Date::now();
            for _ in 0..iterations {
                queue.dequeue();
            }
            return js_sys::Date::now() - start_dequeue;
        }
        "circular_enqueue" => {
            let mut queue = CircularQueue::new(iterations);
            for i in 0..iterations {
                queue.enqueue(i as i32);
            }
        }
        "priority_enqueue" => {
            let mut pq = PriorityQueue::new();
            for i in 0..iterations {
                pq.enqueue(i as i32, (iterations - i) as i32);
            }
        }
        _ => {}
    }

    js_sys::Date::now() - start
}
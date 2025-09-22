use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::HashMap;

// Vector/Dynamic Array Implementation
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
    pub fn len(&self) -> usize {
        self.data.len()
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.data.iter().map(|&x| JsValue::from(x)).collect()
    }
}

// Binary Tree Node
#[wasm_bindgen]
pub struct TreeNode {
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

#[wasm_bindgen]
impl TreeNode {
    #[wasm_bindgen(constructor)]
    pub fn new(value: i32) -> TreeNode {
        TreeNode {
            value,
            left: None,
            right: None,
        }
    }

    #[wasm_bindgen]
    pub fn get_value(&self) -> i32 {
        self.value
    }
}

// Binary Search Tree
#[wasm_bindgen]
pub struct BinarySearchTree {
    root: Option<Box<TreeNode>>,
}

#[wasm_bindgen]
impl BinarySearchTree {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BinarySearchTree {
        BinarySearchTree { root: None }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, value: i32) {
        self.root = Self::insert_recursive(self.root.take(), value);
    }

    fn insert_recursive(node: Option<Box<TreeNode>>, value: i32) -> Option<Box<TreeNode>> {
        match node {
            None => Some(Box::new(TreeNode::new(value))),
            Some(mut node) => {
                if value <= node.value {
                    node.left = Self::insert_recursive(node.left.take(), value);
                } else {
                    node.right = Self::insert_recursive(node.right.take(), value);
                }
                Some(node)
            }
        }
    }

    #[wasm_bindgen]
    pub fn search(&self, value: i32) -> bool {
        Self::search_recursive(&self.root, value)
    }

    fn search_recursive(node: &Option<Box<TreeNode>>, value: i32) -> bool {
        match node {
            None => false,
            Some(node) => {
                if value == node.value {
                    true
                } else if value < node.value {
                    Self::search_recursive(&node.left, value)
                } else {
                    Self::search_recursive(&node.right, value)
                }
            }
        }
    }

    #[wasm_bindgen]
    pub fn inorder_traversal(&self) -> Array {
        let mut result = Vec::new();
        Self::inorder_recursive(&self.root, &mut result);
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    fn inorder_recursive(node: &Option<Box<TreeNode>>, result: &mut Vec<i32>) {
        if let Some(node) = node {
            Self::inorder_recursive(&node.left, result);
            result.push(node.value);
            Self::inorder_recursive(&node.right, result);
        }
    }
}

// Linked List Node
#[wasm_bindgen]
struct ListNode {
    value: i32,
    next: Option<Box<ListNode>>,
}

// Linked List
#[wasm_bindgen]
pub struct LinkedList {
    head: Option<Box<ListNode>>,
    size: usize,
}

#[wasm_bindgen]
impl LinkedList {
    #[wasm_bindgen(constructor)]
    pub fn new() -> LinkedList {
        LinkedList { head: None, size: 0 }
    }

    #[wasm_bindgen]
    pub fn push_front(&mut self, value: i32) {
        let new_node = Box::new(ListNode {
            value,
            next: self.head.take(),
        });
        self.head = Some(new_node);
        self.size += 1;
    }

    #[wasm_bindgen]
    pub fn pop_front(&mut self) -> Option<i32> {
        self.head.take().map(|node| {
            self.head = node.next;
            self.size -= 1;
            node.value
        })
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        let mut result = Vec::new();
        let mut current = &self.head;
        while let Some(node) = current {
            result.push(node.value);
            current = &node.next;
        }
        result.iter().map(|&x| JsValue::from(x)).collect()
    }
}

// Graph using adjacency list
#[wasm_bindgen]
pub struct Graph {
    adjacency_list: HashMap<i32, Vec<i32>>,
}

#[wasm_bindgen]
impl Graph {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Graph {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    #[wasm_bindgen]
    pub fn add_vertex(&mut self, vertex: i32) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    #[wasm_bindgen]
    pub fn add_edge(&mut self, from: i32, to: i32) {
        self.adjacency_list
            .entry(from)
            .or_insert(Vec::new())
            .push(to);
    }

    #[wasm_bindgen]
    pub fn add_undirected_edge(&mut self, vertex1: i32, vertex2: i32) {
        self.add_edge(vertex1, vertex2);
        self.add_edge(vertex2, vertex1);
    }

    #[wasm_bindgen]
    pub fn get_neighbors(&self, vertex: i32) -> Array {
        match self.adjacency_list.get(&vertex) {
            Some(neighbors) => neighbors.iter().map(|&x| JsValue::from(x)).collect(),
            None => Array::new(),
        }
    }

    #[wasm_bindgen]
    pub fn get_vertices(&self) -> Array {
        self.adjacency_list
            .keys()
            .map(|&x| JsValue::from(x))
            .collect()
    }
}

// Sorting Algorithms
#[wasm_bindgen]
pub fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

#[wasm_bindgen]
pub fn bubble_sort_array(mut arr: Vec<i32>) -> Array {
    bubble_sort(&mut arr);
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn quick_sort_array(mut arr: Vec<i32>) -> Array {
    quick_sort(&mut arr);
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn quick_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = partition(arr);
    quick_sort(&mut arr[0..pivot]);
    quick_sort(&mut arr[pivot + 1..]);
}

fn partition(arr: &mut [i32]) -> usize {
    let pivot = arr.len() - 1;
    let mut i = 0;

    for j in 0..pivot {
        if arr[j] <= arr[pivot] {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, pivot);
    i
}

#[wasm_bindgen]
pub fn merge_sort_array(mut arr: Vec<i32>) -> Array {
    merge_sort(&mut arr);
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn merge_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort(&mut arr[0..mid]);
    merge_sort(&mut arr[mid..]);

    let mut temp = arr.to_vec();
    merge(&arr[0..mid], &arr[mid..], &mut temp);
    arr.copy_from_slice(&temp);
}

fn merge(left: &[i32], right: &[i32], result: &mut [i32]) {
    let (mut i, mut j, mut k) = (0, 0, 0);

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result[k] = left[i];
            i += 1;
        } else {
            result[k] = right[j];
            j += 1;
        }
        k += 1;
    }

    while i < left.len() {
        result[k] = left[i];
        i += 1;
        k += 1;
    }

    while j < right.len() {
        result[k] = right[j];
        j += 1;
        k += 1;
    }
}

// Searching Algorithms
#[wasm_bindgen]
pub fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid = left + (right - left) / 2;

        match arr[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => {
                if mid == 0 {
                    break;
                }
                right = mid - 1;
            }
        }
    }
    None
}

#[wasm_bindgen]
pub fn binary_search_array(arr: Vec<i32>, target: i32) -> JsValue {
    match binary_search(&arr, target) {
        Some(index) => JsValue::from(index as u32),
        None => JsValue::NULL,
    }
}

#[wasm_bindgen]
pub fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
    for (index, &item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

#[wasm_bindgen]
pub fn linear_search_array(arr: Vec<i32>, target: i32) -> JsValue {
    match linear_search(&arr, target) {
        Some(index) => JsValue::from(index as u32),
        None => JsValue::NULL,
    }
}

// Utility functions for performance testing
#[wasm_bindgen]
pub fn generate_random_array(size: usize, max_value: i32) -> Array {
    use js_sys::Math;
    let mut arr = Vec::with_capacity(size);
    for _ in 0..size {
        let random_value = (Math::random() * max_value as f64) as i32;
        arr.push(random_value);
    }
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn generate_sorted_array(size: usize) -> Array {
    let arr: Vec<i32> = (1..=size as i32).collect();
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

// Performance benchmark function
#[wasm_bindgen]
pub fn benchmark_sort(algorithm: &str, arr: Vec<i32>) -> f64 {
    let start = js_sys::Date::now();

    match algorithm {
        "bubble" => {
            let _sorted = bubble_sort_array(arr);
        }
        "quick" => {
            let _sorted = quick_sort_array(arr);
        }
        "merge" => {
            let _sorted = merge_sort_array(arr);
        }
        _ => {}
    }

    js_sys::Date::now() - start
}
use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Bubble Sort - O(n²) time complexity
#[wasm_bindgen]
pub fn bubble_sort(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    for i in 0..n {
        let mut swapped = false;
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break; // Array is already sorted
        }
    }
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Bubble Sort with step tracking
#[wasm_bindgen]
pub fn bubble_sort_with_steps(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    let mut steps = Vec::new();

    steps.push(format!("Initial array: {:?}", arr));

    for i in 0..n {
        let mut swapped = false;
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
                steps.push(format!("Pass {}: Swapped {} and {} -> {:?}", i + 1, arr[j + 1], arr[j], arr));
            }
        }
        if !swapped {
            steps.push(format!("Pass {}: No swaps needed, array is sorted", i + 1));
            break;
        }
    }

    steps.push(format!("Final sorted array: {:?}", arr));
    steps.iter().map(|s| JsValue::from(s)).collect()
}

/// Selection Sort - O(n²) time complexity
#[wasm_bindgen]
pub fn selection_sort(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    for i in 0..n {
        let mut min_idx = i;
        for j in i + 1..n {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        if min_idx != i {
            arr.swap(i, min_idx);
        }
    }
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Insertion Sort - O(n²) time complexity, good for small arrays
#[wasm_bindgen]
pub fn insertion_sort(mut arr: Vec<i32>) -> Array {
    for i in 1..arr.len() {
        let key = arr[i];
        let mut j = i;

        while j > 0 && arr[j - 1] > key {
            arr[j] = arr[j - 1];
            j -= 1;
        }
        arr[j] = key;
    }
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Quick Sort - O(n log n) average, O(n²) worst case
#[wasm_bindgen]
pub fn quick_sort(mut arr: Vec<i32>) -> Array {
    let len = arr.len();
    quick_sort_recursive(&mut arr, 0, len);
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn quick_sort_recursive(arr: &mut [i32], low: usize, high: usize) {
    if low < high && high > low + 1 {
        let pivot = partition(arr, low, high);
        if pivot > 0 {
            quick_sort_recursive(arr, low, pivot);
        }
        quick_sort_recursive(arr, pivot + 1, high);
    }
}

fn partition(arr: &mut [i32], low: usize, high: usize) -> usize {
    let pivot = arr[high - 1];
    let mut i = low;

    for j in low..high - 1 {
        if arr[j] <= pivot {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, high - 1);
    i
}

/// Merge Sort - O(n log n) time complexity, stable
#[wasm_bindgen]
pub fn merge_sort(mut arr: Vec<i32>) -> Array {
    merge_sort_recursive(&mut arr);
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn merge_sort_recursive(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort_recursive(&mut arr[0..mid]);
    merge_sort_recursive(&mut arr[mid..]);

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

/// Heap Sort - O(n log n) time complexity, in-place
#[wasm_bindgen]
pub fn heap_sort(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    if n <= 1 {
        return arr.iter().map(|&x| JsValue::from(x)).collect();
    }

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify(&mut arr, n, i);
    }

    // Extract elements one by one
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(&mut arr, i, 0);
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn heapify(arr: &mut [i32], heap_size: usize, root: usize) {
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
        heapify(arr, heap_size, largest);
    }
}

/// Counting Sort - O(n + k) time complexity for small ranges
#[wasm_bindgen]
pub fn counting_sort(arr: Vec<i32>) -> Array {
    if arr.is_empty() {
        return Array::new();
    }

    let max_val = *arr.iter().max().unwrap() as usize;
    let min_val = *arr.iter().min().unwrap() as usize;
    let range = max_val - min_val + 1;

    let mut count = vec![0; range];
    let mut result = vec![0; arr.len()];

    // Count occurrences
    for &num in &arr {
        count[(num as usize) - min_val] += 1;
    }

    // Cumulative count
    for i in 1..range {
        count[i] += count[i - 1];
    }

    // Build result array
    for &num in arr.iter().rev() {
        let idx = (num as usize) - min_val;
        count[idx] -= 1;
        result[count[idx]] = num;
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Radix Sort - O(d * (n + k)) where d is number of digits
#[wasm_bindgen]
pub fn radix_sort(mut arr: Vec<i32>) -> Array {
    if arr.is_empty() {
        return Array::new();
    }

    let max_val = *arr.iter().max().unwrap();
    let mut exp = 1;

    while max_val / exp > 0 {
        counting_sort_radix(&mut arr, exp);
        exp *= 10;
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

fn counting_sort_radix(arr: &mut [i32], exp: i32) {
    let n = arr.len();
    let mut output = vec![0; n];
    let mut count = [0; 10];

    // Count occurrences of each digit
    for &num in arr.iter() {
        count[((num / exp) % 10) as usize] += 1;
    }

    // Cumulative count
    for i in 1..10 {
        count[i] += count[i - 1];
    }

    // Build output array
    for &num in arr.iter().rev() {
        let digit = ((num / exp) % 10) as usize;
        count[digit] -= 1;
        output[count[digit]] = num;
    }

    // Copy back to original array
    arr.copy_from_slice(&output);
}

/// Bucket Sort - O(n + k) average case
#[wasm_bindgen]
pub fn bucket_sort(arr: Vec<f64>, bucket_count: usize) -> Array {
    if arr.is_empty() || bucket_count == 0 {
        return Array::new();
    }

    let min_val = arr.iter().fold(f64::INFINITY, |a, &b| a.min(b));
    let max_val = arr.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));

    if min_val == max_val {
        return arr.iter().map(|&x| JsValue::from(x)).collect();
    }

    let range = max_val - min_val;
    let mut buckets: Vec<Vec<f64>> = vec![Vec::new(); bucket_count];

    // Distribute elements into buckets
    for &num in &arr {
        let bucket_idx = ((num - min_val) / range * (bucket_count as f64 - 1.0)) as usize;
        let bucket_idx = bucket_idx.min(bucket_count - 1);
        buckets[bucket_idx].push(num);
    }

    // Sort individual buckets and concatenate
    let mut result = Vec::new();
    for mut bucket in buckets {
        bucket.sort_by(|a, b| a.partial_cmp(b).unwrap());
        result.extend(bucket);
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Shell Sort - O(n^1.5) average case
#[wasm_bindgen]
pub fn shell_sort(mut arr: Vec<i32>) -> Array {
    let n = arr.len();
    let mut gap = n / 2;

    while gap > 0 {
        for i in gap..n {
            let temp = arr[i];
            let mut j = i;

            while j >= gap && arr[j - gap] > temp {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        gap /= 2;
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Cocktail Shaker Sort (Bidirectional Bubble Sort)
#[wasm_bindgen]
pub fn cocktail_sort(mut arr: Vec<i32>) -> Array {
    let mut start = 0;
    let mut end = arr.len();
    let mut swapped = true;

    while swapped {
        swapped = false;

        // Forward pass
        for i in start..end - 1 {
            if arr[i] > arr[i + 1] {
                arr.swap(i, i + 1);
                swapped = true;
            }
        }

        if !swapped {
            break;
        }

        end -= 1;
        swapped = false;

        // Backward pass
        for i in (start..end - 1).rev() {
            if arr[i] > arr[i + 1] {
                arr.swap(i, i + 1);
                swapped = true;
            }
        }

        start += 1;
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Utility functions for sorting analysis

/// Check if array is sorted
#[wasm_bindgen]
pub fn is_sorted(arr: &[i32]) -> bool {
    for i in 1..arr.len() {
        if arr[i] < arr[i - 1] {
            return false;
        }
    }
    true
}

/// Generate different types of test arrays
#[wasm_bindgen]
pub fn generate_random_array(size: usize, max_value: i32) -> Array {
    let mut arr = Vec::with_capacity(size);
    for _ in 0..size {
        let random_value = (js_sys::Math::random() * max_value as f64) as i32;
        arr.push(random_value);
    }
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn generate_sorted_array(size: usize) -> Array {
    let arr: Vec<i32> = (1..=size as i32).collect();
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn generate_reverse_sorted_array(size: usize) -> Array {
    let arr: Vec<i32> = (1..=size as i32).rev().collect();
    arr.iter().map(|&x| JsValue::from(x)).collect()
}

#[wasm_bindgen]
pub fn generate_nearly_sorted_array(size: usize, swap_count: usize) -> Array {
    let mut arr: Vec<i32> = (1..=size as i32).collect();

    for _ in 0..swap_count.min(size / 2) {
        let i = (js_sys::Math::random() * size as f64) as usize;
        let j = (js_sys::Math::random() * size as f64) as usize;
        if i < arr.len() && j < arr.len() {
            arr.swap(i, j);
        }
    }

    arr.iter().map(|&x| JsValue::from(x)).collect()
}

/// Performance benchmark for sorting algorithms
#[wasm_bindgen]
pub fn benchmark_sort(algorithm: &str, arr: Vec<i32>) -> f64 {
    let start = js_sys::Date::now();

    match algorithm {
        "bubble" => {
            bubble_sort(arr);
        }
        "selection" => {
            selection_sort(arr);
        }
        "insertion" => {
            insertion_sort(arr);
        }
        "quick" => {
            quick_sort(arr);
        }
        "merge" => {
            merge_sort(arr);
        }
        "heap" => {
            heap_sort(arr);
        }
        "shell" => {
            shell_sort(arr);
        }
        "cocktail" => {
            cocktail_sort(arr);
        }
        "counting" => {
            counting_sort(arr);
        }
        "radix" => {
            radix_sort(arr);
        }
        _ => {}
    }

    js_sys::Date::now() - start
}

/// Compare multiple sorting algorithms
#[wasm_bindgen]
pub fn compare_sorting_algorithms(arr: Vec<i32>) -> Array {
    let algorithms = [
        "bubble", "selection", "insertion", "quick",
        "merge", "heap", "shell", "cocktail"
    ];

    let mut results = Vec::new();

    for &algo in &algorithms {
        let time = benchmark_sort(algo, arr.clone());
        let result = Array::new();
        result.push(&JsValue::from(algo));
        result.push(&JsValue::from(time));
        results.push(JsValue::from(result));
    }

    results.iter().cloned().collect()
}
use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Linear Search - O(n) time complexity
#[wasm_bindgen]
pub fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
    for (index, &item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

/// Linear Search with step tracking
#[wasm_bindgen]
pub fn linear_search_with_steps(arr: Vec<i32>, target: i32) -> Array {
    let mut steps = Vec::new();
    steps.push(format!("Searching for {} in array: {:?}", target, arr));

    for (index, &item) in arr.iter().enumerate() {
        steps.push(format!("Step {}: Checking arr[{}] = {}", index + 1, index, item));
        if item == target {
            steps.push(format!("Found {} at index {}", target, index));
            return steps.iter().map(|s| JsValue::from(s)).collect();
        }
    }

    steps.push(format!("{} not found in array", target));
    steps.iter().map(|s| JsValue::from(s)).collect()
}

/// Binary Search - O(log n) time complexity, requires sorted array
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

/// Binary Search with step tracking
#[wasm_bindgen]
pub fn binary_search_with_steps(arr: Vec<i32>, target: i32) -> Array {
    let mut steps = Vec::new();
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);
    let mut step_count = 0;

    steps.push(format!("Searching for {} in sorted array: {:?}", target, arr));
    steps.push(format!("Initial: left = {}, right = {}", left, right));

    while left <= right {
        step_count += 1;
        let mid = left + (right - left) / 2;
        steps.push(format!("Step {}: mid = {}, arr[{}] = {}", step_count, mid, mid, arr[mid]));

        match arr[mid].cmp(&target) {
            std::cmp::Ordering::Equal => {
                steps.push(format!("Found {} at index {}", target, mid));
                return steps.iter().map(|s| JsValue::from(s)).collect();
            }
            std::cmp::Ordering::Less => {
                steps.push(format!("  {} < {}, search right half", arr[mid], target));
                left = mid + 1;
                steps.push(format!("  New left = {}", left));
            }
            std::cmp::Ordering::Greater => {
                steps.push(format!("  {} > {}, search left half", arr[mid], target));
                if mid == 0 {
                    break;
                }
                right = mid - 1;
                steps.push(format!("  New right = {}", right));
            }
        }
    }

    steps.push(format!("{} not found in array", target));
    steps.iter().map(|s| JsValue::from(s)).collect()
}

/// Interpolation Search - O(log log n) for uniformly distributed data
#[wasm_bindgen]
pub fn interpolation_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right && target >= arr[left] && target <= arr[right] {
        if left == right {
            return if arr[left] == target { Some(left) } else { None };
        }

        // Interpolation formula
        let pos = left + ((target - arr[left]) as usize * (right - left))
                   / (arr[right] - arr[left]) as usize;

        if arr[pos] == target {
            return Some(pos);
        } else if arr[pos] < target {
            left = pos + 1;
        } else {
            right = pos.saturating_sub(1);
        }
    }
    None
}

/// Jump Search - O(√n) time complexity
#[wasm_bindgen]
pub fn jump_search(arr: &[i32], target: i32) -> Option<usize> {
    let n = arr.len();
    let jump = (n as f64).sqrt() as usize;
    let mut prev = 0;

    // Find the block where element is present
    while arr[std::cmp::min(jump, n) - 1] < target {
        prev = jump;
        if prev >= n {
            return None;
        }
    }

    // Linear search in the identified block
    while arr[prev] < target {
        prev += 1;
        if prev == std::cmp::min(jump, n) {
            return None;
        }
    }

    if arr[prev] == target {
        Some(prev)
    } else {
        None
    }
}

/// Exponential Search - O(log n) time complexity
#[wasm_bindgen]
pub fn exponential_search(arr: &[i32], target: i32) -> Option<usize> {
    let n = arr.len();
    if n == 0 {
        return None;
    }

    if arr[0] == target {
        return Some(0);
    }

    // Find range for binary search
    let mut bound = 1;
    while bound < n && arr[bound] <= target {
        bound *= 2;
    }

    // Binary search in the found range
    binary_search_range(arr, target, bound / 2, std::cmp::min(bound, n - 1))
}

fn binary_search_range(arr: &[i32], target: i32, left: usize, right: usize) -> Option<usize> {
    let mut left = left;
    let mut right = right;

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

/// Ternary Search - O(log₃ n) time complexity
#[wasm_bindgen]
pub fn ternary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid1 = left + (right - left) / 3;
        let mid2 = right - (right - left) / 3;

        if arr[mid1] == target {
            return Some(mid1);
        }
        if arr[mid2] == target {
            return Some(mid2);
        }

        if target < arr[mid1] {
            right = mid1.saturating_sub(1);
        } else if target > arr[mid2] {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            right = mid2.saturating_sub(1);
        }
    }
    None
}

/// Fibonacci Search - O(log n) time complexity
#[wasm_bindgen]
pub fn fibonacci_search(arr: &[i32], target: i32) -> Option<usize> {
    let n = arr.len();
    if n == 0 {
        return None;
    }

    // Generate Fibonacci numbers
    let mut fib_m2 = 0; // (m-2)'th Fibonacci number
    let mut fib_m1 = 1; // (m-1)'th Fibonacci number
    let mut fib_m = fib_m2 + fib_m1; // m'th Fibonacci number

    while fib_m < n {
        fib_m2 = fib_m1;
        fib_m1 = fib_m;
        fib_m = fib_m2 + fib_m1;
    }

    let mut offset = 0;

    while fib_m > 1 {
        let i = std::cmp::min(offset + fib_m2, n - 1);

        if arr[i] < target {
            fib_m = fib_m1;
            fib_m1 = fib_m2;
            fib_m2 = fib_m - fib_m1;
            offset = i;
        } else if arr[i] > target {
            fib_m = fib_m2;
            fib_m1 = fib_m1 - fib_m2;
            fib_m2 = fib_m - fib_m1;
        } else {
            return Some(i);
        }
    }

    if fib_m1 == 1 && offset + 1 < n && arr[offset + 1] == target {
        Some(offset + 1)
    } else {
        None
    }
}

/// Find first occurrence of target in sorted array with duplicates
#[wasm_bindgen]
pub fn find_first_occurrence(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);
    let mut result = None;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid] == target {
            result = Some(mid);
            right = mid.saturating_sub(1); // Continue searching left
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            if mid == 0 {
                break;
            }
            right = mid - 1;
        }
    }
    result
}

/// Find last occurrence of target in sorted array with duplicates
#[wasm_bindgen]
pub fn find_last_occurrence(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);
    let mut result = None;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid] == target {
            result = Some(mid);
            left = mid + 1; // Continue searching right
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            if mid == 0 {
                break;
            }
            right = mid - 1;
        }
    }
    result
}

/// Count occurrences of target in sorted array
#[wasm_bindgen]
pub fn count_occurrences(arr: &[i32], target: i32) -> usize {
    if let (Some(first), Some(last)) = (find_first_occurrence(arr, target), find_last_occurrence(arr, target)) {
        last - first + 1
    } else {
        0
    }
}

/// Find peak element in array (element that is greater than its neighbors)
#[wasm_bindgen]
pub fn find_peak_element(arr: &[i32]) -> Option<usize> {
    let n = arr.len();
    if n == 0 {
        return None;
    }
    if n == 1 {
        return Some(0);
    }

    let mut left = 0;
    let mut right = n - 1;

    while left <= right {
        let mid = left + (right - left) / 2;

        // Check if mid is a peak
        let left_smaller = mid == 0 || arr[mid] > arr[mid - 1];
        let right_smaller = mid == n - 1 || arr[mid] > arr[mid + 1];

        if left_smaller && right_smaller {
            return Some(mid);
        }

        // If left neighbor is greater, peak lies on left side
        if mid > 0 && arr[mid - 1] > arr[mid] {
            right = mid - 1;
        } else {
            // Peak lies on right side
            left = mid + 1;
        }
    }

    None
}

/// Search in rotated sorted array
#[wasm_bindgen]
pub fn search_rotated_array(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid] == target {
            return Some(mid);
        }

        // Check which half is sorted
        if arr[left] <= arr[mid] {
            // Left half is sorted
            if target >= arr[left] && target < arr[mid] {
                right = mid.saturating_sub(1);
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if target > arr[mid] && target <= arr[right] {
                left = mid + 1;
            } else {
                right = mid.saturating_sub(1);
            }
        }
    }

    None
}

/// Find minimum element in rotated sorted array
#[wasm_bindgen]
pub fn find_min_rotated_array(arr: &[i32]) -> Option<i32> {
    if arr.is_empty() {
        return None;
    }

    let mut left = 0;
    let mut right = arr.len() - 1;

    while left < right {
        let mid = left + (right - left) / 2;

        if arr[mid] > arr[right] {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    Some(arr[left])
}

/// Search for target in 2D matrix (sorted row-wise and column-wise)
#[wasm_bindgen]
pub fn search_2d_matrix(matrix: &Array, target: i32) -> Array {
    let rows = matrix.length() as usize;
    if rows == 0 {
        return Array::new();
    }

    // Get first row to determine columns
    let binding = matrix.get(0);
    let first_row = binding.dyn_ref::<Array>().unwrap();
    let cols = first_row.length() as usize;
    if cols == 0 {
        return Array::new();
    }

    let mut row = 0;
    let mut col = cols - 1;

    loop {
        let binding = matrix.get(row as u32);
        let current_row = binding.dyn_ref::<Array>().unwrap();
        let current_val = current_row.get(col as u32).as_f64().unwrap() as i32;

        if current_val == target {
            let result = Array::new();
            result.push(&JsValue::from(row));
            result.push(&JsValue::from(col));
            return result;
        } else if current_val > target {
            if col == 0 {
                break;
            }
            col -= 1;
        } else {
            row += 1;
            if row >= rows {
                break;
            }
        }
    }

    Array::new() // Not found
}

/// Performance benchmark for searching algorithms
#[wasm_bindgen]
pub fn benchmark_search(algorithm: &str, arr: Vec<i32>, target: i32) -> f64 {
    let start = js_sys::Date::now();

    match algorithm {
        "linear" => {
            linear_search(&arr, target);
        }
        "binary" => {
            binary_search(&arr, target);
        }
        "interpolation" => {
            interpolation_search(&arr, target);
        }
        "jump" => {
            jump_search(&arr, target);
        }
        "exponential" => {
            exponential_search(&arr, target);
        }
        "ternary" => {
            ternary_search(&arr, target);
        }
        "fibonacci" => {
            fibonacci_search(&arr, target);
        }
        _ => {}
    }

    js_sys::Date::now() - start
}

/// Compare multiple searching algorithms
#[wasm_bindgen]
pub fn compare_search_algorithms(arr: Vec<i32>, target: i32) -> Array {
    let algorithms = [
        "linear", "binary", "interpolation", "jump",
        "exponential", "ternary", "fibonacci"
    ];

    let mut results = Vec::new();

    for &algo in &algorithms {
        let time = benchmark_search(algo, arr.clone(), target);
        let result = Array::new();
        result.push(&JsValue::from(algo));
        result.push(&JsValue::from(time));
        results.push(JsValue::from(result));
    }

    results.iter().cloned().collect()
}

/// Utility functions

/// Check if array is sorted (required for some search algorithms)
#[wasm_bindgen]
pub fn is_sorted_for_search(arr: &[i32]) -> bool {
    for i in 1..arr.len() {
        if arr[i] < arr[i - 1] {
            return false;
        }
    }
    true
}

/// Generate test cases for searching
#[wasm_bindgen]
pub fn generate_search_test_array(size: usize, max_value: i32) -> Array {
    let mut arr: Vec<i32> = (0..size).map(|i| (i as f64 * max_value as f64 / size as f64) as i32).collect();

    // Add some randomness while keeping it mostly sorted
    for i in 0..arr.len() {
        let noise = (js_sys::Math::random() * 3.0) as i32 - 1; // -1, 0, or 1
        arr[i] = (arr[i] + noise).max(0).min(max_value);
    }

    arr.sort(); // Ensure it's sorted for binary search algorithms
    arr.iter().map(|&x| JsValue::from(x)).collect()
}
use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::HashMap;

/// Fibonacci with memoization
#[wasm_bindgen]
pub fn fibonacci_memo(n: usize) -> u64 {
    fn fib_helper(n: usize, memo: &mut HashMap<usize, u64>) -> u64 {
        if let Some(&result) = memo.get(&n) {
            return result;
        }

        let result = match n {
            0 => 0,
            1 => 1,
            _ => fib_helper(n - 1, memo) + fib_helper(n - 2, memo),
        };

        memo.insert(n, result);
        result
    }

    let mut memo = HashMap::new();
    fib_helper(n, &mut memo)
}

/// 0/1 Knapsack Problem
#[wasm_bindgen]
pub fn knapsack_01(weights: &Array, values: &Array, capacity: usize) -> Array {
    let n = weights.length() as usize;
    if n == 0 || n != values.length() as usize {
        let result = Array::new();
        result.push(&JsValue::from(0));
        result.push(&Array::new());
        return result;
    }

    // Convert JS arrays to Rust vectors
    let weights: Vec<usize> = (0..n)
        .map(|i| weights.get(i as u32).as_f64().unwrap() as usize)
        .collect();
    let values: Vec<usize> = (0..n)
        .map(|i| values.get(i as u32).as_f64().unwrap() as usize)
        .collect();

    let mut dp = vec![vec![0; capacity + 1]; n + 1];

    // Fill the DP table
    for i in 1..=n {
        for w in 1..=capacity {
            if weights[i - 1] <= w {
                dp[i][w] = std::cmp::max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack to find selected items
    let mut selected = vec![false; n];
    let mut w = capacity;
    for i in (1..=n).rev() {
        if dp[i][w] != dp[i - 1][w] {
            selected[i - 1] = true;
            w -= weights[i - 1];
        }
    }

    let result = Array::new();
    result.push(&JsValue::from(dp[n][capacity]));

    let selected_array: Array = selected.iter().map(|&x| JsValue::from(x)).collect();
    result.push(&JsValue::from(selected_array));

    result
}

/// Longest Common Subsequence
#[wasm_bindgen]
pub fn longest_common_subsequence(text1: &str, text2: &str) -> Array {
    let chars1: Vec<char> = text1.chars().collect();
    let chars2: Vec<char> = text2.chars().collect();
    let m = chars1.len();
    let n = chars2.len();

    let mut dp = vec![vec![0; n + 1]; m + 1];

    // Fill DP table
    for i in 1..=m {
        for j in 1..=n {
            if chars1[i - 1] == chars2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::cmp::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find LCS
    let mut lcs = String::new();
    let mut i = m;
    let mut j = n;

    while i > 0 && j > 0 {
        if chars1[i - 1] == chars2[j - 1] {
            lcs.push(chars1[i - 1]);
            i -= 1;
            j -= 1;
        } else if dp[i - 1][j] > dp[i][j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }

    lcs = lcs.chars().rev().collect();

    let result = Array::new();
    result.push(&JsValue::from(dp[m][n]));
    result.push(&JsValue::from(lcs));
    result
}

/// Coin Change Problem (minimum coins)
#[wasm_bindgen]
pub fn coin_change_min(coins: &Array, amount: usize) -> Array {
    let coin_values: Vec<usize> = (0..coins.length())
        .map(|i| coins.get(i).as_f64().unwrap() as usize)
        .collect();

    let mut dp = vec![usize::MAX; amount + 1];
    let mut coin_used = vec![0; amount + 1];
    dp[0] = 0;

    for i in 1..=amount {
        for &coin in &coin_values {
            if coin <= i && dp[i - coin] != usize::MAX && dp[i - coin] + 1 < dp[i] {
                dp[i] = dp[i - coin] + 1;
                coin_used[i] = coin;
            }
        }
    }

    let result = Array::new();

    if dp[amount] == usize::MAX {
        result.push(&JsValue::from(-1));
        result.push(&Array::new());
        return result;
    }

    // Reconstruct solution
    let mut coins_used = Vec::new();
    let mut remaining = amount;
    while remaining > 0 {
        let coin = coin_used[remaining];
        coins_used.push(coin);
        remaining -= coin;
    }

    result.push(&JsValue::from(dp[amount]));
    let coins_array: Array = coins_used.iter().map(|&x| JsValue::from(x)).collect();
    result.push(&JsValue::from(coins_array));
    result
}

/// Edit Distance (Levenshtein Distance)
#[wasm_bindgen]
pub fn edit_distance(word1: &str, word2: &str) -> usize {
    let chars1: Vec<char> = word1.chars().collect();
    let chars2: Vec<char> = word2.chars().collect();
    let m = chars1.len();
    let n = chars2.len();

    let mut dp = vec![vec![0; n + 1]; m + 1];

    // Initialize base cases
    for i in 0..=m {
        dp[i][0] = i;
    }
    for j in 0..=n {
        dp[0][j] = j;
    }

    // Fill DP table
    for i in 1..=m {
        for j in 1..=n {
            if chars1[i - 1] == chars2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + std::cmp::min(
                    std::cmp::min(dp[i - 1][j], dp[i][j - 1]),
                    dp[i - 1][j - 1]
                );
            }
        }
    }

    dp[m][n]
}

/// Longest Increasing Subsequence
#[wasm_bindgen]
pub fn longest_increasing_subsequence(arr: &Array) -> Array {
    let nums: Vec<i32> = (0..arr.length())
        .map(|i| arr.get(i).as_f64().unwrap() as i32)
        .collect();

    let n = nums.len();
    if n == 0 {
        let result = Array::new();
        result.push(&JsValue::from(0));
        result.push(&Array::new());
        return result;
    }

    let mut dp = vec![1; n];
    let mut parent = vec![-1; n];

    for i in 1..n {
        for j in 0..i {
            if nums[j] < nums[i] && dp[j] + 1 > dp[i] {
                dp[i] = dp[j] + 1;
                parent[i] = j as i32;
            }
        }
    }

    // Find the maximum length and its ending position
    let mut max_length = 1;
    let mut max_index = 0;
    for i in 0..n {
        if dp[i] > max_length {
            max_length = dp[i];
            max_index = i;
        }
    }

    // Reconstruct the LIS
    let mut lis = Vec::new();
    let mut current = max_index as i32;
    while current != -1 {
        lis.push(nums[current as usize]);
        current = parent[current as usize];
    }
    lis.reverse();

    let result = Array::new();
    result.push(&JsValue::from(max_length));
    let lis_array: Array = lis.iter().map(|&x| JsValue::from(x)).collect();
    result.push(&JsValue::from(lis_array));
    result
}

/// Maximum Subarray Sum (Kadane's Algorithm)
#[wasm_bindgen]
pub fn maximum_subarray_sum(arr: &Array) -> Array {
    let nums: Vec<i32> = (0..arr.length())
        .map(|i| arr.get(i).as_f64().unwrap() as i32)
        .collect();

    if nums.is_empty() {
        let result = Array::new();
        result.push(&JsValue::from(0));
        result.push(&Array::new());
        return result;
    }

    let mut max_sum = nums[0];
    let mut current_sum = nums[0];
    let mut start = 0;
    let mut end = 0;
    let mut temp_start = 0;

    for i in 1..nums.len() {
        if current_sum < 0 {
            current_sum = nums[i];
            temp_start = i;
        } else {
            current_sum += nums[i];
        }

        if current_sum > max_sum {
            max_sum = current_sum;
            start = temp_start;
            end = i;
        }
    }

    let result = Array::new();
    result.push(&JsValue::from(max_sum));

    let subarray: Array = nums[start..=end].iter().map(|&x| JsValue::from(x)).collect();
    result.push(&JsValue::from(subarray));
    result
}

/// House Robber Problem
#[wasm_bindgen]
pub fn house_robber(houses: &Array) -> usize {
    let nums: Vec<usize> = (0..houses.length())
        .map(|i| houses.get(i).as_f64().unwrap() as usize)
        .collect();

    let n = nums.len();
    if n == 0 {
        return 0;
    }
    if n == 1 {
        return nums[0];
    }

    let mut dp = vec![0; n];
    dp[0] = nums[0];
    dp[1] = std::cmp::max(nums[0], nums[1]);

    for i in 2..n {
        dp[i] = std::cmp::max(dp[i - 1], dp[i - 2] + nums[i]);
    }

    dp[n - 1]
}

/// Climbing Stairs Problem
#[wasm_bindgen]
pub fn climbing_stairs(n: usize) -> u64 {
    if n <= 2 {
        return n as u64;
    }

    let mut dp = vec![0; n + 1];
    dp[1] = 1;
    dp[2] = 2;

    for i in 3..=n {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    dp[n]
}

/// Unique Paths in Grid
#[wasm_bindgen]
pub fn unique_paths(m: usize, n: usize) -> u64 {
    let mut dp = vec![vec![1; n]; m];

    for i in 1..m {
        for j in 1..n {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    dp[m - 1][n - 1]
}

/// Word Break Problem
#[wasm_bindgen]
pub fn word_break(s: &str, word_dict: &Array) -> bool {
    let words: Vec<String> = (0..word_dict.length())
        .map(|i| word_dict.get(i).as_string().unwrap())
        .collect();

    let n = s.len();
    let mut dp = vec![false; n + 1];
    dp[0] = true;

    for i in 1..=n {
        for word in &words {
            let word_len = word.len();
            if word_len <= i && dp[i - word_len] && &s[i - word_len..i] == word {
                dp[i] = true;
                break;
            }
        }
    }

    dp[n]
}

/// Palindrome Partitioning (minimum cuts)
#[wasm_bindgen]
pub fn min_palindrome_cuts(s: &str) -> usize {
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();

    if n <= 1 {
        return 0;
    }

    // Check if substring is palindrome
    let mut is_palindrome = vec![vec![false; n]; n];

    // Single characters are palindromes
    for i in 0..n {
        is_palindrome[i][i] = true;
    }

    // Check for palindromes of length 2
    for i in 0..n - 1 {
        is_palindrome[i][i + 1] = chars[i] == chars[i + 1];
    }

    // Check for palindromes of length 3 and more
    for len in 3..=n {
        for i in 0..=n - len {
            let j = i + len - 1;
            is_palindrome[i][j] = chars[i] == chars[j] && is_palindrome[i + 1][j - 1];
        }
    }

    // DP for minimum cuts
    let mut cuts = vec![0; n];

    for i in 1..n {
        if is_palindrome[0][i] {
            cuts[i] = 0;
        } else {
            cuts[i] = i; // Maximum possible cuts
            for j in 1..=i {
                if is_palindrome[j][i] {
                    cuts[i] = std::cmp::min(cuts[i], cuts[j - 1] + 1);
                }
            }
        }
    }

    cuts[n - 1]
}

/// Matrix Chain Multiplication
#[wasm_bindgen]
pub fn matrix_chain_multiplication(dimensions: &Array) -> usize {
    let dims: Vec<usize> = (0..dimensions.length())
        .map(|i| dimensions.get(i).as_f64().unwrap() as usize)
        .collect();

    let n = dims.len();
    if n < 2 {
        return 0;
    }

    let matrix_count = n - 1;
    let mut dp = vec![vec![0; matrix_count]; matrix_count];

    for len in 2..=matrix_count {
        for i in 0..=matrix_count - len {
            let j = i + len - 1;
            dp[i][j] = usize::MAX;

            for k in i..j {
                let cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = std::cmp::min(dp[i][j], cost);
            }
        }
    }

    dp[0][matrix_count - 1]
}
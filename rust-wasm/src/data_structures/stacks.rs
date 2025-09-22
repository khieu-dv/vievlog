use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Stack implementation using Vec
#[wasm_bindgen]
pub struct Stack {
    items: Vec<i32>,
}

#[wasm_bindgen]
impl Stack {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Stack {
        Stack {
            items: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn with_capacity(capacity: usize) -> Stack {
        Stack {
            items: Vec::with_capacity(capacity),
        }
    }

    #[wasm_bindgen]
    pub fn push(&mut self, item: i32) {
        self.items.push(item);
    }

    #[wasm_bindgen]
    pub fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<i32> {
        self.items.last().copied()
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
        // Return stack with top element at the end (for visualization)
        self.items.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn from_array(arr: &Array) -> Stack {
        let mut stack = Stack::new();
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                stack.push(val as i32);
            }
        }
        stack
    }

    #[wasm_bindgen]
    pub fn clone_stack(&self) -> Stack {
        Stack {
            items: self.items.clone(),
        }
    }
}

/// String Stack for text operations
#[wasm_bindgen]
pub struct StringStack {
    items: Vec<String>,
}

#[wasm_bindgen]
impl StringStack {
    #[wasm_bindgen(constructor)]
    pub fn new() -> StringStack {
        StringStack {
            items: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn push(&mut self, item: &str) {
        self.items.push(item.to_string());
    }

    #[wasm_bindgen]
    pub fn pop(&mut self) -> Option<String> {
        self.items.pop()
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<String> {
        self.items.last().cloned()
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
        self.items.iter().map(|s| JsValue::from(s)).collect()
    }
}

/// Min Stack - maintains minimum element efficiently
#[wasm_bindgen]
pub struct MinStack {
    main_stack: Vec<i32>,
    min_stack: Vec<i32>,
}

#[wasm_bindgen]
impl MinStack {
    #[wasm_bindgen(constructor)]
    pub fn new() -> MinStack {
        MinStack {
            main_stack: Vec::new(),
            min_stack: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn push(&mut self, item: i32) {
        self.main_stack.push(item);

        if self.min_stack.is_empty() || item <= *self.min_stack.last().unwrap() {
            self.min_stack.push(item);
        }
    }

    #[wasm_bindgen]
    pub fn pop(&mut self) -> Option<i32> {
        if let Some(item) = self.main_stack.pop() {
            if Some(item) == self.min_stack.last().copied() {
                self.min_stack.pop();
            }
            Some(item)
        } else {
            None
        }
    }

    #[wasm_bindgen]
    pub fn peek(&self) -> Option<i32> {
        self.main_stack.last().copied()
    }

    #[wasm_bindgen]
    pub fn get_min(&self) -> Option<i32> {
        self.min_stack.last().copied()
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.main_stack.is_empty()
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.main_stack.len()
    }

    #[wasm_bindgen]
    pub fn to_array(&self) -> Array {
        self.main_stack.iter().map(|&x| JsValue::from(x)).collect()
    }
}

/// Stack utilities and algorithms

/// Check if parentheses are balanced
#[wasm_bindgen]
pub fn is_balanced_parentheses(expression: &str) -> bool {
    let mut stack = Vec::new();
    let opening = ['(', '[', '{'];
    let closing = [')', ']', '}'];
    let pairs = [(')', '('), (']', '['), ('}', '{')];

    for ch in expression.chars() {
        if opening.contains(&ch) {
            stack.push(ch);
        } else if closing.contains(&ch) {
            if stack.is_empty() {
                return false;
            }

            let top = stack.pop().unwrap();
            let mut matched = false;
            for (close, open) in &pairs {
                if ch == *close && top == *open {
                    matched = true;
                    break;
                }
            }

            if !matched {
                return false;
            }
        }
    }

    stack.is_empty()
}

/// Evaluate postfix expression
#[wasm_bindgen]
pub fn evaluate_postfix(expression: &str) -> Result<i32, JsValue> {
    let mut stack = Vec::new();
    let tokens: Vec<&str> = expression.split_whitespace().collect();

    for token in tokens {
        if let Ok(num) = token.parse::<i32>() {
            stack.push(num);
        } else {
            if stack.len() < 2 {
                return Err(JsValue::from_str("Invalid expression"));
            }

            let b = stack.pop().unwrap();
            let a = stack.pop().unwrap();

            let result = match token {
                "+" => a + b,
                "-" => a - b,
                "*" => a * b,
                "/" => {
                    if b == 0 {
                        return Err(JsValue::from_str("Division by zero"));
                    }
                    a / b
                }
                "%" => a % b,
                _ => return Err(JsValue::from_str("Unknown operator")),
            };

            stack.push(result);
        }
    }

    if stack.len() == 1 {
        Ok(stack[0])
    } else {
        Err(JsValue::from_str("Invalid expression"))
    }
}

/// Convert infix to postfix notation
#[wasm_bindgen]
pub fn infix_to_postfix(expression: &str) -> String {
    let mut stack = Vec::new();
    let mut result = Vec::new();
    let tokens: Vec<&str> = expression.split_whitespace().collect();

    let precedence = |op: &str| -> i32 {
        match op {
            "+" | "-" => 1,
            "*" | "/" | "%" => 2,
            "^" => 3,
            _ => 0,
        }
    };

    let is_operator = |token: &str| -> bool {
        matches!(token, "+" | "-" | "*" | "/" | "%" | "^")
    };

    for token in tokens {
        if token.parse::<i32>().is_ok() {
            result.push(token.to_string());
        } else if token == "(" {
            stack.push(token.to_string());
        } else if token == ")" {
            while let Some(top) = stack.pop() {
                if top == "(" {
                    break;
                }
                result.push(top);
            }
        } else if is_operator(token) {
            while let Some(top) = stack.last() {
                if top == "(" || precedence(top) < precedence(token) {
                    break;
                }
                result.push(stack.pop().unwrap());
            }
            stack.push(token.to_string());
        }
    }

    while let Some(op) = stack.pop() {
        result.push(op);
    }

    result.join(" ")
}

/// Reverse a string using stack
#[wasm_bindgen]
pub fn reverse_string(input: &str) -> String {
    let mut stack = Vec::new();

    for ch in input.chars() {
        stack.push(ch);
    }

    let mut result = String::new();
    while let Some(ch) = stack.pop() {
        result.push(ch);
    }

    result
}

/// Check if a string is palindrome using stack
#[wasm_bindgen]
pub fn is_palindrome_stack(input: &str) -> bool {
    let cleaned: String = input.chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_lowercase().next().unwrap())
        .collect();

    let mut stack = Vec::new();
    let chars: Vec<char> = cleaned.chars().collect();
    let len = chars.len();

    // Push first half to stack
    for i in 0..len / 2 {
        stack.push(chars[i]);
    }

    // Compare second half with stack
    let start = if len % 2 == 0 { len / 2 } else { len / 2 + 1 };

    for i in start..len {
        if let Some(ch) = stack.pop() {
            if ch != chars[i] {
                return false;
            }
        }
    }

    true
}

/// Next Greater Element using stack
#[wasm_bindgen]
pub fn next_greater_elements(arr: Vec<i32>) -> Array {
    let n = arr.len();
    let mut result = vec![-1; n];
    let mut stack = Vec::new();

    for i in 0..n {
        while let Some(&top_idx) = stack.last() {
            if arr[top_idx] < arr[i] {
                result[top_idx] = arr[i];
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i);
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Stock span problem using stack
#[wasm_bindgen]
pub fn calculate_stock_spans(prices: Vec<i32>) -> Array {
    let n = prices.len();
    let mut spans = vec![1; n];
    let mut stack = Vec::new();

    for i in 0..n {
        while let Some(&top_idx) = stack.last() {
            if prices[top_idx] <= prices[i] {
                stack.pop();
            } else {
                break;
            }
        }

        spans[i] = if stack.is_empty() {
            i + 1
        } else {
            i - stack.last().unwrap()
        };

        stack.push(i);
    }

    spans.iter().map(|&x| JsValue::from(x)).collect()
}

/// Largest rectangle in histogram using stack
#[wasm_bindgen]
pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
    let mut stack = Vec::new();
    let mut max_area = 0;
    let n = heights.len();

    for i in 0..=n {
        let current_height = if i == n { 0 } else { heights[i] };

        while let Some(&top_idx) = stack.last() {
            if heights[top_idx] > current_height {
                let height = heights[top_idx];
                stack.pop();

                let width = if stack.is_empty() {
                    i
                } else {
                    i - stack.last().unwrap() - 1
                };

                max_area = max_area.max(height * width as i32);
            } else {
                break;
            }
        }

        stack.push(i);
    }

    max_area
}

/// Performance benchmark for stack operations
#[wasm_bindgen]
pub fn benchmark_stack_operations(operation: &str, iterations: usize) -> f64 {
    let start = js_sys::Date::now();

    match operation {
        "push" => {
            let mut stack = Stack::new();
            for i in 0..iterations {
                stack.push(i as i32);
            }
        }
        "pop" => {
            let mut stack = Stack::new();
            // Pre-populate
            for i in 0..iterations {
                stack.push(i as i32);
            }
            // Benchmark pops
            let start_pop = js_sys::Date::now();
            for _ in 0..iterations {
                stack.pop();
            }
            return js_sys::Date::now() - start_pop;
        }
        "peek" => {
            let mut stack = Stack::new();
            for i in 0..iterations {
                stack.push(i as i32);
            }
            // Benchmark peeks
            let start_peek = js_sys::Date::now();
            for _ in 0..iterations {
                stack.peek();
            }
            return js_sys::Date::now() - start_peek;
        }
        _ => {}
    }

    js_sys::Date::now() - start
}
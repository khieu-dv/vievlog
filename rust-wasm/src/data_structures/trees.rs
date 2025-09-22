use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Binary Tree Node
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

    #[wasm_bindgen]
    pub fn set_value(&mut self, value: i32) {
        self.value = value;
    }
}

/// Binary Search Tree
#[wasm_bindgen]
pub struct BinarySearchTree {
    root: Option<Box<TreeNode>>,
    size: usize,
}

#[wasm_bindgen]
impl BinarySearchTree {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BinarySearchTree {
        BinarySearchTree { root: None, size: 0 }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, value: i32) {
        if self.search(value) {
            return; // Don't insert duplicates
        }
        self.root = Self::insert_recursive(self.root.take(), value);
        self.size += 1;
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
    pub fn remove(&mut self, value: i32) -> bool {
        let (new_root, removed) = Self::remove_recursive(self.root.take(), value);
        self.root = new_root;
        if removed {
            self.size -= 1;
        }
        removed
    }

    fn remove_recursive(node: Option<Box<TreeNode>>, value: i32) -> (Option<Box<TreeNode>>, bool) {
        match node {
            None => (None, false),
            Some(mut node) => {
                if value < node.value {
                    let (new_left, removed) = Self::remove_recursive(node.left.take(), value);
                    node.left = new_left;
                    (Some(node), removed)
                } else if value > node.value {
                    let (new_right, removed) = Self::remove_recursive(node.right.take(), value);
                    node.right = new_right;
                    (Some(node), removed)
                } else {
                    // Node to remove found
                    match (node.left.take(), node.right.take()) {
                        (None, None) => (None, true),
                        (Some(left), None) => (Some(left), true),
                        (None, Some(right)) => (Some(right), true),
                        (Some(left), Some(right)) => {
                            // Find inorder successor (leftmost in right subtree)
                            let (min_value, new_right) = Self::extract_min(Some(right));
                            node.value = min_value;
                            node.left = Some(left);
                            node.right = new_right;
                            (Some(node), true)
                        }
                    }
                }
            }
        }
    }

    fn extract_min(node: Option<Box<TreeNode>>) -> (i32, Option<Box<TreeNode>>) {
        match node {
            None => panic!("extract_min called on empty tree"),
            Some(mut node) => {
                if node.left.is_none() {
                    (node.value, node.right.take())
                } else {
                    let (min_value, new_left) = Self::extract_min(node.left.take());
                    node.left = new_left;
                    (min_value, Some(node))
                }
            }
        }
    }

    #[wasm_bindgen]
    pub fn find_min(&self) -> Option<i32> {
        Self::find_min_recursive(&self.root)
    }

    fn find_min_recursive(node: &Option<Box<TreeNode>>) -> Option<i32> {
        match node {
            None => None,
            Some(node) => {
                if node.left.is_none() {
                    Some(node.value)
                } else {
                    Self::find_min_recursive(&node.left)
                }
            }
        }
    }

    #[wasm_bindgen]
    pub fn find_max(&self) -> Option<i32> {
        Self::find_max_recursive(&self.root)
    }

    fn find_max_recursive(node: &Option<Box<TreeNode>>) -> Option<i32> {
        match node {
            None => None,
            Some(node) => {
                if node.right.is_none() {
                    Some(node.value)
                } else {
                    Self::find_max_recursive(&node.right)
                }
            }
        }
    }

    #[wasm_bindgen]
    pub fn height(&self) -> i32 {
        Self::height_recursive(&self.root)
    }

    fn height_recursive(node: &Option<Box<TreeNode>>) -> i32 {
        match node {
            None => -1,
            Some(node) => {
                let left_height = Self::height_recursive(&node.left);
                let right_height = Self::height_recursive(&node.right);
                1 + left_height.max(right_height)
            }
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.root.is_none()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.root = None;
        self.size = 0;
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

    #[wasm_bindgen]
    pub fn preorder_traversal(&self) -> Array {
        let mut result = Vec::new();
        Self::preorder_recursive(&self.root, &mut result);
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    fn preorder_recursive(node: &Option<Box<TreeNode>>, result: &mut Vec<i32>) {
        if let Some(node) = node {
            result.push(node.value);
            Self::preorder_recursive(&node.left, result);
            Self::preorder_recursive(&node.right, result);
        }
    }

    #[wasm_bindgen]
    pub fn postorder_traversal(&self) -> Array {
        let mut result = Vec::new();
        Self::postorder_recursive(&self.root, &mut result);
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    fn postorder_recursive(node: &Option<Box<TreeNode>>, result: &mut Vec<i32>) {
        if let Some(node) = node {
            Self::postorder_recursive(&node.left, result);
            Self::postorder_recursive(&node.right, result);
            result.push(node.value);
        }
    }

    #[wasm_bindgen]
    pub fn level_order_traversal(&self) -> Array {
        if self.root.is_none() {
            return Array::new();
        }

        let mut result = Vec::new();
        let mut queue = std::collections::VecDeque::new();
        queue.push_back(&self.root);

        while let Some(node_option) = queue.pop_front() {
            if let Some(node) = node_option {
                result.push(node.value);
                queue.push_back(&node.left);
                queue.push_back(&node.right);
            }
        }

        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn is_valid_bst(&self) -> bool {
        Self::is_valid_bst_recursive(&self.root, None, None)
    }

    fn is_valid_bst_recursive(node: &Option<Box<TreeNode>>, min: Option<i32>, max: Option<i32>) -> bool {
        match node {
            None => true,
            Some(node) => {
                if let Some(min_val) = min {
                    if node.value <= min_val {
                        return false;
                    }
                }
                if let Some(max_val) = max {
                    if node.value >= max_val {
                        return false;
                    }
                }
                Self::is_valid_bst_recursive(&node.left, min, Some(node.value)) &&
                Self::is_valid_bst_recursive(&node.right, Some(node.value), max)
            }
        }
    }

    #[wasm_bindgen]
    pub fn from_array(arr: &Array) -> BinarySearchTree {
        let mut tree = BinarySearchTree::new();
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                tree.insert(val as i32);
            }
        }
        tree
    }
}

/// AVL Tree (Self-balancing binary search tree)
#[wasm_bindgen]
pub struct AVLTree {
    root: Option<Box<AVLNode>>,
    size: usize,
}

struct AVLNode {
    value: i32,
    height: i32,
    left: Option<Box<AVLNode>>,
    right: Option<Box<AVLNode>>,
}

impl AVLNode {
    fn new(value: i32) -> Self {
        AVLNode {
            value,
            height: 1,
            left: None,
            right: None,
        }
    }

    fn update_height(&mut self) {
        let left_height = self.left.as_ref().map_or(0, |n| n.height);
        let right_height = self.right.as_ref().map_or(0, |n| n.height);
        self.height = 1 + left_height.max(right_height);
    }

    fn balance_factor(&self) -> i32 {
        let left_height = self.left.as_ref().map_or(0, |n| n.height);
        let right_height = self.right.as_ref().map_or(0, |n| n.height);
        left_height - right_height
    }
}

#[wasm_bindgen]
impl AVLTree {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AVLTree {
        AVLTree { root: None, size: 0 }
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, value: i32) {
        let (new_root, inserted) = Self::insert_recursive(self.root.take(), value);
        self.root = new_root;
        if inserted {
            self.size += 1;
        }
    }

    fn insert_recursive(node: Option<Box<AVLNode>>, value: i32) -> (Option<Box<AVLNode>>, bool) {
        match node {
            None => (Some(Box::new(AVLNode::new(value))), true),
            Some(mut node) => {
                let inserted = if value < node.value {
                    let (new_left, inserted) = Self::insert_recursive(node.left.take(), value);
                    node.left = new_left;
                    inserted
                } else if value > node.value {
                    let (new_right, inserted) = Self::insert_recursive(node.right.take(), value);
                    node.right = new_right;
                    inserted
                } else {
                    false // Value already exists
                };

                if inserted {
                    node.update_height();
                    let balanced_node = Self::balance(node);
                    (Some(balanced_node), true)
                } else {
                    (Some(node), false)
                }
            }
        }
    }

    fn balance(mut node: Box<AVLNode>) -> Box<AVLNode> {
        let balance_factor = node.balance_factor();

        // Left heavy
        if balance_factor > 1 {
            if let Some(ref left) = node.left {
                if left.balance_factor() < 0 {
                    // Left-Right case
                    node.left = Some(Self::rotate_left(node.left.take().unwrap()));
                }
            }
            // Left-Left case
            return Self::rotate_right(node);
        }

        // Right heavy
        if balance_factor < -1 {
            if let Some(ref right) = node.right {
                if right.balance_factor() > 0 {
                    // Right-Left case
                    node.right = Some(Self::rotate_right(node.right.take().unwrap()));
                }
            }
            // Right-Right case
            return Self::rotate_left(node);
        }

        node
    }

    fn rotate_left(mut node: Box<AVLNode>) -> Box<AVLNode> {
        let mut new_root = node.right.take().unwrap();
        node.right = new_root.left.take();
        node.update_height();
        new_root.left = Some(node);
        new_root.update_height();
        new_root
    }

    fn rotate_right(mut node: Box<AVLNode>) -> Box<AVLNode> {
        let mut new_root = node.left.take().unwrap();
        node.left = new_root.right.take();
        node.update_height();
        new_root.right = Some(node);
        new_root.update_height();
        new_root
    }

    #[wasm_bindgen]
    pub fn search(&self, value: i32) -> bool {
        Self::search_recursive(&self.root, value)
    }

    fn search_recursive(node: &Option<Box<AVLNode>>, value: i32) -> bool {
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
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn height(&self) -> i32 {
        self.root.as_ref().map_or(0, |n| n.height)
    }

    #[wasm_bindgen]
    pub fn inorder_traversal(&self) -> Array {
        let mut result = Vec::new();
        Self::inorder_recursive(&self.root, &mut result);
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    fn inorder_recursive(node: &Option<Box<AVLNode>>, result: &mut Vec<i32>) {
        if let Some(node) = node {
            Self::inorder_recursive(&node.left, result);
            result.push(node.value);
            Self::inorder_recursive(&node.right, result);
        }
    }
}
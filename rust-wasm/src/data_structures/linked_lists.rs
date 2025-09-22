use wasm_bindgen::prelude::*;
use js_sys::Array;

/// Linked List Node
struct ListNode {
    value: i32,
    next: Option<Box<ListNode>>,
}

/// Singly Linked List
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
    pub fn push_back(&mut self, value: i32) {
        let new_node = Box::new(ListNode {
            value,
            next: None,
        });

        if self.head.is_none() {
            self.head = Some(new_node);
        } else {
            let mut current = self.head.as_mut().unwrap();
            while current.next.is_some() {
                current = current.next.as_mut().unwrap();
            }
            current.next = Some(new_node);
        }
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
    pub fn pop_back(&mut self) -> Option<i32> {
        match self.head.as_mut() {
            None => None,
            Some(node) if node.next.is_none() => {
                let value = node.value;
                self.head = None;
                self.size -= 1;
                Some(value)
            }
            Some(_) => {
                let mut current = self.head.as_mut().unwrap();
                while current.next.as_ref().unwrap().next.is_some() {
                    current = current.next.as_mut().unwrap();
                }
                let value = current.next.as_ref().unwrap().value;
                current.next = None;
                self.size -= 1;
                Some(value)
            }
        }
    }

    #[wasm_bindgen]
    pub fn get(&self, index: usize) -> Option<i32> {
        if index >= self.size {
            return None;
        }

        let mut current = &self.head;
        for _ in 0..index {
            current = &current.as_ref()?.next;
        }
        current.as_ref().map(|node| node.value)
    }

    #[wasm_bindgen]
    pub fn insert(&mut self, index: usize, value: i32) -> bool {
        if index > self.size {
            return false;
        }

        if index == 0 {
            self.push_front(value);
            return true;
        }

        let mut current = self.head.as_mut().unwrap();
        for _ in 0..index - 1 {
            current = current.next.as_mut().unwrap();
        }

        let new_node = Box::new(ListNode {
            value,
            next: current.next.take(),
        });
        current.next = Some(new_node);
        self.size += 1;
        true
    }

    #[wasm_bindgen]
    pub fn remove(&mut self, index: usize) -> Option<i32> {
        if index >= self.size {
            return None;
        }

        if index == 0 {
            return self.pop_front();
        }

        let mut current = self.head.as_mut().unwrap();
        for _ in 0..index - 1 {
            current = current.next.as_mut().unwrap();
        }

        let removed_node = current.next.take()?;
        current.next = removed_node.next;
        self.size -= 1;
        Some(removed_node.value)
    }

    #[wasm_bindgen]
    pub fn contains(&self, value: i32) -> bool {
        let mut current = &self.head;
        while let Some(node) = current {
            if node.value == value {
                return true;
            }
            current = &node.next;
        }
        false
    }

    #[wasm_bindgen]
    pub fn index_of(&self, value: i32) -> Option<usize> {
        let mut current = &self.head;
        let mut index = 0;
        while let Some(node) = current {
            if node.value == value {
                return Some(index);
            }
            current = &node.next;
            index += 1;
        }
        None
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.head.is_none()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.head = None;
        self.size = 0;
    }

    #[wasm_bindgen]
    pub fn reverse(&mut self) {
        let mut prev = None;
        let mut current = self.head.take();

        while let Some(mut node) = current {
            let next = node.next.take();
            node.next = prev;
            prev = Some(node);
            current = next;
        }

        self.head = prev;
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

    #[wasm_bindgen]
    pub fn from_array(arr: &Array) -> LinkedList {
        let mut list = LinkedList::new();
        for i in 0..arr.length() {
            if let Some(val) = arr.get(i).as_f64() {
                list.push_back(val as i32);
            }
        }
        list
    }
}

/// Doubly Linked List Node
struct DoublyListNode {
    value: i32,
    next: Option<Box<DoublyListNode>>,
    prev: *mut DoublyListNode,
}

/// Doubly Linked List
#[wasm_bindgen]
pub struct DoublyLinkedList {
    head: Option<Box<DoublyListNode>>,
    tail: *mut DoublyListNode,
    size: usize,
}

#[wasm_bindgen]
impl DoublyLinkedList {
    #[wasm_bindgen(constructor)]
    pub fn new() -> DoublyLinkedList {
        DoublyLinkedList {
            head: None,
            tail: std::ptr::null_mut(),
            size: 0,
        }
    }

    #[wasm_bindgen]
    pub fn push_front(&mut self, value: i32) {
        let mut new_node = Box::new(DoublyListNode {
            value,
            next: self.head.take(),
            prev: std::ptr::null_mut(),
        });

        let node_ptr = new_node.as_mut() as *mut DoublyListNode;

        if let Some(ref mut head) = new_node.next {
            head.prev = node_ptr;
        } else {
            self.tail = node_ptr;
        }

        self.head = Some(new_node);
        self.size += 1;
    }

    #[wasm_bindgen]
    pub fn push_back(&mut self, value: i32) {
        let mut new_node = Box::new(DoublyListNode {
            value,
            next: None,
            prev: self.tail,
        });

        let node_ptr = new_node.as_mut() as *mut DoublyListNode;

        if !self.tail.is_null() {
            unsafe {
                (*self.tail).next = Some(new_node);
            }
        } else {
            self.head = Some(new_node);
        }

        self.tail = node_ptr;
        self.size += 1;
    }

    #[wasm_bindgen]
    pub fn pop_front(&mut self) -> Option<i32> {
        self.head.take().map(|mut node| {
            if let Some(ref mut new_head) = node.next {
                new_head.prev = std::ptr::null_mut();
                self.head = node.next.take();
            } else {
                self.tail = std::ptr::null_mut();
            }
            self.size -= 1;
            node.value
        })
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.size
    }

    #[wasm_bindgen]
    pub fn is_empty(&self) -> bool {
        self.head.is_none()
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
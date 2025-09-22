"use client";

import { useState } from "react";
import {
  Binary,
  GitBranch,
  Layout,
  List,
  Network,
  Search,
  Shuffle,
  SortAsc,
  TreePine,
  Activity
} from "lucide-react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

// Import Rust WASM functions (will be implemented later)
// import init, {
//   create_vector,
//   vector_push,
//   create_binary_tree,
//   tree_insert,
//   bubble_sort,
//   quick_sort,
//   binary_search,
//   linear_search
// } from "rust-wasm/pkg/vievlog_rust";

interface TabProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const tabs: TabProps[] = [
  {
    id: "arrays",
    title: "Arrays & Vectors",
    icon: Layout,
    content: <ArraysContent />
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    icon: List,
    content: <LinkedListsContent />
  },
  {
    id: "trees",
    title: "Trees",
    icon: TreePine,
    content: <TreesContent />
  },
  {
    id: "graphs",
    title: "Graphs",
    icon: Network,
    content: <GraphsContent />
  },
  {
    id: "sorting",
    title: "Sorting",
    icon: SortAsc,
    content: <SortingContent />
  },
  {
    id: "searching",
    title: "Searching",
    icon: Search,
    content: <SearchingContent />
  }
];

function ArraysContent() {
  const [vector, setVector] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setVector([...vector, value]);
      setInputValue("");
    }
  };

  const handlePop = () => {
    setVector(vector.slice(0, -1));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Dynamic Arrays (Vectors)
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Arrays are contiguous collections of elements. Vectors are dynamic arrays that can grow and shrink at runtime.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Interactive Vector:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={handlePush}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Push
              </button>
              <button
                onClick={handlePop}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Pop
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {vector.map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 border rounded text-center"
                >
                  {value}
                </div>
              ))}
              {vector.length === 0 && (
                <div className="text-gray-500 italic">Empty vector</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Vector operations in Rust
let mut vec = Vec::new();
vec.push(1);
vec.push(2);
vec.push(3);
let last = vec.pop(); // Returns Option<T>

// Access by index
let first = vec[0];
let second = vec.get(1); // Returns Option<&T>

// Iteration
for item in &vec {
    println!("{}", item);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedListsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <List className="h-5 w-5" />
          Linked Lists
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A linked list is a linear data structure where elements are stored in nodes, and each node contains data and a reference to the next node.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Visual Representation:</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="border-2 border-blue-500 p-2 rounded">
                Data: 1 | Next: →
              </div>
              <span>→</span>
              <div className="border-2 border-blue-500 p-2 rounded">
                Data: 2 | Next: →
              </div>
              <span>→</span>
              <div className="border-2 border-blue-500 p-2 rounded">
                Data: 3 | Next: NULL
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`#[derive(Debug)]
struct Node<T> {
    data: T,
    next: Option<Box<Node<T>>>,
}

#[derive(Debug)]
struct LinkedList<T> {
    head: Option<Box<Node<T>>>,
    size: usize,
}

impl<T> LinkedList<T> {
    fn new() -> Self {
        LinkedList { head: None, size: 0 }
    }

    fn push_front(&mut self, data: T) {
        let new_node = Box::new(Node {
            data,
            next: self.head.take(),
        });
        self.head = Some(new_node);
        self.size += 1;
    }

    fn pop_front(&mut self) -> Option<T> {
        self.head.take().map(|node| {
            self.head = node.next;
            self.size -= 1;
            node.data
        })
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreesContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TreePine className="h-5 w-5" />
          Binary Trees
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Binary Search Tree Properties:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Left child value ≤ Parent value</li>
              <li>Right child value ≥ Parent value</li>
              <li>Both left and right subtrees are also BSTs</li>
              <li>In-order traversal gives sorted sequence</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`#[derive(Debug)]
struct TreeNode<T> {
    value: T,
    left: Option<Box<TreeNode<T>>>,
    right: Option<Box<TreeNode<T>>>,
}

impl<T: Ord> TreeNode<T> {
    fn new(value: T) -> Self {
        TreeNode {
            value,
            left: None,
            right: None,
        }
    }

    fn insert(&mut self, value: T) {
        if value <= self.value {
            match &mut self.left {
                Some(left) => left.insert(value),
                None => self.left = Some(Box::new(TreeNode::new(value))),
            }
        } else {
            match &mut self.right {
                Some(right) => right.insert(value),
                None => self.right = Some(Box::new(TreeNode::new(value))),
            }
        }
    }

    fn search(&self, value: &T) -> bool {
        match value.cmp(&self.value) {
            std::cmp::Ordering::Equal => true,
            std::cmp::Ordering::Less => {
                self.left.as_ref().map_or(false, |left| left.search(value))
            }
            std::cmp::Ordering::Greater => {
                self.right.as_ref().map_or(false, |right| right.search(value))
            }
        }
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Graphs
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A graph is a collection of nodes (vertices) connected by edges. Graphs can represent networks, relationships, and many real-world problems.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Graph Types:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Directed Graph:</strong> Edges have direction (A → B)
              </div>
              <div>
                <strong>Undirected Graph:</strong> Edges are bidirectional (A ↔ B)
              </div>
              <div>
                <strong>Weighted Graph:</strong> Edges have associated weights/costs
              </div>
              <div>
                <strong>Unweighted Graph:</strong> All edges have equal weight
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementation (Adjacency List):</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`use std::collections::HashMap;

#[derive(Debug)]
struct Graph<T> {
    adjacency_list: HashMap<T, Vec<T>>,
}

impl<T: Clone + Eq + std::hash::Hash> Graph<T> {
    fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    fn add_vertex(&mut self, vertex: T) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    fn add_edge(&mut self, from: T, to: T) {
        self.adjacency_list
            .entry(from.clone())
            .or_insert(Vec::new())
            .push(to.clone());

        // For undirected graph, add reverse edge
        self.adjacency_list
            .entry(to)
            .or_insert(Vec::new())
            .push(from);
    }

    fn get_neighbors(&self, vertex: &T) -> Option<&Vec<T>> {
        self.adjacency_list.get(vertex)
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortingContent() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);

  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    setSorting(false);
  };

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SortAsc className="h-5 w-5" />
          Sorting Algorithms
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Sorting algorithms arrange elements in a specific order. Here are some common sorting algorithms with their implementations.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Interactive Bubble Sort:</h4>
            <div className="flex gap-2 mb-3">
              <button
                onClick={bubbleSort}
                disabled={sorting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {sorting ? "Sorting..." : "Start Bubble Sort"}
              </button>
              <button
                onClick={resetArray}
                disabled={sorting}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {array.map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900 border rounded text-center"
                  style={{
                    height: `${20 + value}px`,
                    minWidth: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementations:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Bubble Sort - O(n²)
fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

// Quick Sort - O(n log n) average
fn quick_sort<T: Ord>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }
    let pivot = partition(arr);
    quick_sort(&mut arr[0..pivot]);
    quick_sort(&mut arr[pivot + 1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
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

// Merge Sort - O(n log n) always
fn merge_sort<T: Ord + Clone>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }

    let mid = arr.len() / 2;
    merge_sort(&mut arr[0..mid]);
    merge_sort(&mut arr[mid..]);

    let mut temp = arr.to_vec();
    merge(&arr[0..mid], &arr[mid..], &mut temp);
    arr.copy_from_slice(&temp);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchingContent() {
  const [searchArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string>("");

  const binarySearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) return;

    let left = 0;
    let right = searchArray.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (searchArray[mid] === target) {
        setSearchResult(`Found ${target} at index ${mid}`);
        return;
      } else if (searchArray[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    setSearchResult(`${target} not found in array`);
  };

  const linearSearch = () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) return;

    for (let i = 0; i < searchArray.length; i++) {
      if (searchArray[i] === target) {
        setSearchResult(`Found ${target} at index ${i} (Linear Search)`);
        return;
      }
    }
    setSearchResult(`${target} not found in array (Linear Search)`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Searching Algorithms
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Searching algorithms find the position of a target value within a data structure.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Interactive Search:</h4>
            <div className="mb-3">
              <p className="text-sm mb-2">Sorted Array: {searchArray.join(", ")}</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter number to search"
                  className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                />
                <button
                  onClick={binarySearch}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Binary Search
                </button>
                <button
                  onClick={linearSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Linear Search
                </button>
              </div>
              {searchResult && (
                <div className="mt-2 p-2 bg-gray-200 dark:bg-slate-600 rounded text-sm">
                  {searchResult}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Rust Implementations:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Binary Search - O(log n) - requires sorted array
fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len().saturating_sub(1);

    while left <= right {
        let mid = left + (right - left) / 2;

        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => {
                if mid == 0 { break; }
                right = mid - 1;
            }
        }
    }
    None
}

// Linear Search - O(n) - works on unsorted arrays
fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (index, item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

// Using built-in methods
fn search_examples() {
    let arr = vec![1, 3, 5, 7, 9];

    // Binary search (built-in)
    let result = arr.binary_search(&5);
    println!("{:?}", result); // Ok(2)

    // Linear search using iterator
    let pos = arr.iter().position(|&x| x == 5);
    println!("{:?}", pos); // Some(2)
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataStructuresPage() {
  const [activeTab, setActiveTab] = useState("arrays");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Binary className="h-8 w-8 text-blue-500" />
            Data Structures & Algorithms
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Interactive examples and Rust implementations of fundamental data structures and algorithms.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>

        {/* Performance Comparison */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Algorithm Complexity Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Algorithm</th>
                  <th className="text-left py-2">Best Case</th>
                  <th className="text-left py-2">Average Case</th>
                  <th className="text-left py-2">Worst Case</th>
                  <th className="text-left py-2">Space</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-b">
                  <td className="py-2 font-medium">Bubble Sort</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Quick Sort</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n²)</td>
                  <td className="py-2">O(log n)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Merge Sort</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n log n)</td>
                  <td className="py-2">O(n)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Binary Search</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(log n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Linear Search</td>
                  <td className="py-2">O(1)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
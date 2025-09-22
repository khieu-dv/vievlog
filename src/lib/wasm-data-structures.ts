import init, {
  // Data Structures
  RustVector,
  StaticArray,
  LinkedList,
  DoublyLinkedList,
  BinarySearchTree,
  AVLTree,
  Graph,
  WeightedGraph,
  HashTable,
  SimpleHashMap,
  IntHashMap,
  Stack,
  StringStack,
  MinStack,
  Queue,
  CircularQueue,
  PriorityQueue,
  Deque,
  QueueUsingStacks,
  BinaryHeap,
  PriorityQueueHeap,
  MedianFinder,

  // Sorting Algorithms
  bubble_sort,
  selection_sort,
  insertion_sort,
  quick_sort,
  merge_sort,
  heap_sort,
  counting_sort,
  radix_sort,
  shell_sort,
  cocktail_sort,

  // Searching Algorithms
  linear_search,
  binary_search,
  interpolation_search,
  jump_search,
  exponential_search,
  ternary_search,
  fibonacci_search,
  find_first_occurrence,
  find_last_occurrence,
  count_occurrences,
  search_rotated_array,

  // Graph Algorithms
  dijkstra_shortest_path,
  bfs_graph_traversal,
  dfs_graph_traversal,
  topological_sort,
  has_cycle_directed,
  strongly_connected_components,
  minimum_spanning_tree_kruskal,

  // Dynamic Programming
  fibonacci_memo,
  knapsack_01,
  longest_common_subsequence,
  coin_change_min,
  edit_distance,
  longest_increasing_subsequence,
  maximum_subarray_sum,
  house_robber,
  climbing_stairs,
  unique_paths,

  // Utility Functions
  is_balanced_parentheses,
  evaluate_postfix,
  infix_to_postfix,
  find_k_largest,
  find_k_smallest,
  benchmark_sort,
  benchmark_search,
  benchmark_hash_operations,
  benchmark_stack_operations,
  benchmark_queue_operations,
  benchmark_heap_operations,
} from '../../rust-wasm/pkg/vievlog_rust.js';

let wasmModule: any = null;

export async function initWasm() {
  if (!wasmModule) {
    wasmModule = await init();
  }
  return wasmModule;
}

// Data Structure Wrappers with better TypeScript integration
export class WasmVector {
  private vector: any;

  constructor() {
    this.vector = new RustVector();
  }

  push(value: number): void {
    this.vector.push(value);
  }

  pop(): number | null {
    return this.vector.pop();
  }

  get(index: number): number | null {
    return this.vector.get(index);
  }

  set(index: number, value: number): boolean {
    return this.vector.set(index, value);
  }

  length(): number {
    return this.vector.len();
  }

  toArray(): number[] {
    const jsArray = this.vector.to_array();
    return Array.from(jsArray).map(x => Number(x));
  }

  static fromArray(arr: number[]): WasmVector {
    const vector = new WasmVector();
    for (const val of arr) {
      vector.push(val);
    }
    return vector;
  }
}

export class WasmLinkedList {
  private list: any;

  constructor() {
    this.list = new LinkedList();
  }

  pushFront(value: number): void {
    this.list.push_front(value);
  }

  pushBack(value: number): void {
    this.list.push_back(value);
  }

  popFront(): number | null {
    return this.list.pop_front();
  }

  popBack(): number | null {
    return this.list.pop_back();
  }

  get(index: number): number | null {
    return this.list.get(index);
  }

  length(): number {
    return this.list.len();
  }

  toArray(): number[] {
    const jsArray = this.list.to_array();
    return Array.from(jsArray).map(x => Number(x));
  }
}

export class WasmBST {
  private tree: any;

  constructor() {
    this.tree = new BinarySearchTree();
  }

  insert(value: number): void {
    this.tree.insert(value);
  }

  search(value: number): boolean {
    return this.tree.search(value);
  }

  remove(value: number): boolean {
    return this.tree.remove(value);
  }

  findMin(): number | null {
    return this.tree.find_min();
  }

  findMax(): number | null {
    return this.tree.find_max();
  }

  height(): number {
    return this.tree.height();
  }

  inorderTraversal(): number[] {
    const jsArray = this.tree.inorder_traversal();
    return Array.from(jsArray).map(x => Number(x));
  }

  preorderTraversal(): number[] {
    const jsArray = this.tree.preorder_traversal();
    return Array.from(jsArray).map(x => Number(x));
  }

  postorderTraversal(): number[] {
    const jsArray = this.tree.postorder_traversal();
    return Array.from(jsArray).map(x => Number(x));
  }

  length(): number {
    return this.tree.len();
  }

  clear(): void {
    this.tree.clear();
  }
}

export class WasmGraph {
  private graph: any;

  constructor(isDirected: boolean = false) {
    this.graph = new Graph(isDirected);
  }

  addVertex(vertex: number): void {
    this.graph.add_vertex(vertex);
  }

  addEdge(from: number, to: number): void {
    this.graph.add_edge(from, to);
  }

  removeVertex(vertex: number): boolean {
    return this.graph.remove_vertex(vertex);
  }

  removeEdge(from: number, to: number): boolean {
    return this.graph.remove_edge(from, to);
  }

  hasVertex(vertex: number): boolean {
    return this.graph.has_vertex(vertex);
  }

  hasEdge(from: number, to: number): boolean {
    return this.graph.has_edge(from, to);
  }

  getNeighbors(vertex: number): number[] {
    const jsArray = this.graph.get_neighbors(vertex);
    return Array.from(jsArray).map(x => Number(x));
  }

  getVertices(): number[] {
    const jsArray = this.graph.get_vertices();
    return Array.from(jsArray).map(x => Number(x));
  }

  dfsTraversal(start: number): number[] {
    const jsArray = this.graph.dfs_traversal(start);
    return Array.from(jsArray).map(x => Number(x));
  }

  bfsTraversal(start: number): number[] {
    const jsArray = this.graph.bfs_traversal(start);
    return Array.from(jsArray).map(x => Number(x));
  }

  hasPath(from: number, to: number): boolean {
    return this.graph.has_path(from, to);
  }

  shortestPath(from: number, to: number): number[] {
    const jsArray = this.graph.shortest_path(from, to);
    return Array.from(jsArray).map(x => Number(x));
  }
}

export class WasmHashTable {
  private table: any;

  constructor(capacity: number = 16) {
    this.table = new HashTable(capacity);
  }

  insert(key: string, value: string): boolean {
    return this.table.insert(key, value);
  }

  get(key: string): string | null {
    return this.table.get(key);
  }

  remove(key: string): string | null {
    return this.table.remove(key);
  }

  containsKey(key: string): boolean {
    return this.table.contains_key(key);
  }

  length(): number {
    return this.table.len();
  }

  capacity(): number {
    return this.table.capacity();
  }

  loadFactor(): number {
    return this.table.load_factor();
  }

  keys(): string[] {
    const jsArray = this.table.keys();
    return Array.from(jsArray).map(x => String(x));
  }

  values(): string[] {
    const jsArray = this.table.values();
    return Array.from(jsArray).map(x => String(x));
  }
}

export class WasmStack {
  private stack: any;

  constructor() {
    this.stack = new Stack();
  }

  push(value: number): void {
    this.stack.push(value);
  }

  pop(): number | null {
    return this.stack.pop();
  }

  peek(): number | null {
    return this.stack.peek();
  }

  isEmpty(): boolean {
    return this.stack.is_empty();
  }

  length(): number {
    return this.stack.len();
  }

  toArray(): number[] {
    const jsArray = this.stack.to_array();
    return Array.from(jsArray).map(x => Number(x));
  }
}

export class WasmQueue {
  private queue: any;

  constructor() {
    this.queue = new Queue();
  }

  enqueue(value: number): void {
    this.queue.enqueue(value);
  }

  dequeue(): number | null {
    return this.queue.dequeue();
  }

  front(): number | null {
    return this.queue.front();
  }

  back(): number | null {
    return this.queue.back();
  }

  isEmpty(): boolean {
    return this.queue.is_empty();
  }

  length(): number {
    return this.queue.len();
  }

  toArray(): number[] {
    const jsArray = this.queue.to_array();
    return Array.from(jsArray).map(x => Number(x));
  }
}

export class WasmHeap {
  private heap: any;

  constructor(isMaxHeap: boolean = true) {
    this.heap = new BinaryHeap(isMaxHeap);
  }

  insert(value: number): void {
    this.heap.insert(value);
  }

  extract(): number | null {
    return this.heap.extract();
  }

  peek(): number | null {
    return this.heap.peek();
  }

  isEmpty(): boolean {
    return this.heap.is_empty();
  }

  length(): number {
    return this.heap.len();
  }

  height(): number {
    return this.heap.height();
  }

  isMaxHeap(): boolean {
    return this.heap.is_max_heap();
  }

  toArray(): number[] {
    const jsArray = this.heap.to_array();
    return Array.from(jsArray).map(x => Number(x));
  }
}

// Algorithm Wrappers
export const WasmSorting = {
  bubbleSort: (arr: number[]): number[] => {
    const jsArray = bubble_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  selectionSort: (arr: number[]): number[] => {
    const jsArray = selection_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  insertionSort: (arr: number[]): number[] => {
    const jsArray = insertion_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  quickSort: (arr: number[]): number[] => {
    const jsArray = quick_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  mergeSort: (arr: number[]): number[] => {
    const jsArray = merge_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  heapSort: (arr: number[]): number[] => {
    const jsArray = heap_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  countingSort: (arr: number[]): number[] => {
    const jsArray = counting_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  radixSort: (arr: number[]): number[] => {
    const jsArray = radix_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  shellSort: (arr: number[]): number[] => {
    const jsArray = shell_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },

  cocktailSort: (arr: number[]): number[] => {
    const jsArray = cocktail_sort(new Int32Array(arr));
    return Array.from(jsArray).map(x => Number(x));
  },
};

export const WasmSearching = {
  linearSearch: (arr: number[], target: number): number => {
    const result = linear_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  binarySearch: (arr: number[], target: number): number => {
    const result = binary_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  interpolationSearch: (arr: number[], target: number): number => {
    const result = interpolation_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  jumpSearch: (arr: number[], target: number): number => {
    const result = jump_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  exponentialSearch: (arr: number[], target: number): number => {
    const result = exponential_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  ternarySearch: (arr: number[], target: number): number => {
    const result = ternary_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  fibonacciSearch: (arr: number[], target: number): number => {
    const result = fibonacci_search(new Int32Array(arr), target);
    return result ?? -1;
  },

  findFirstOccurrence: (arr: number[], target: number): number => {
    const result = find_first_occurrence(new Int32Array(arr), target);
    return result ?? -1;
  },

  findLastOccurrence: (arr: number[], target: number): number => {
    const result = find_last_occurrence(new Int32Array(arr), target);
    return result ?? -1;
  },

  countOccurrences: (arr: number[], target: number): number => {
    return count_occurrences(new Int32Array(arr), target);
  },

  searchRotatedArray: (arr: number[], target: number): number => {
    const result = search_rotated_array(new Int32Array(arr), target);
    return result ?? -1;
  },
};

export const WasmDynamicProgramming = {
  fibonacci: (n: number): bigint => {
    return fibonacci_memo(n);
  },

  knapsack: (weights: number[], values: number[], capacity: number): { maxValue: number; selectedItems: boolean[] } => {
    const result = knapsack_01(weights, values, capacity);
    const maxValue = Number(result[0]);
    const selectedItems = Array.from(result[1]).map(x => Boolean(x));
    return { maxValue, selectedItems };
  },

  longestCommonSubsequence: (text1: string, text2: string): { length: number; sequence: string } => {
    const result = longest_common_subsequence(text1, text2);
    return {
      length: Number(result[0]),
      sequence: String(result[1])
    };
  },

  coinChange: (coins: number[], amount: number): { minCoins: number; coinsUsed: number[] } => {
    const result = coin_change_min(coins, amount);
    const minCoins = Number(result[0]);
    const coinsUsed = Array.from(result[1]).map(x => Number(x));
    return { minCoins, coinsUsed };
  },

  editDistance: (word1: string, word2: string): number => {
    return edit_distance(word1, word2);
  },

  longestIncreasingSubsequence: (arr: number[]): { length: number; sequence: number[] } => {
    const result = longest_increasing_subsequence(arr);
    return {
      length: Number(result[0]),
      sequence: Array.from(result[1]).map(x => Number(x))
    };
  },

  maximumSubarraySum: (arr: number[]): { maxSum: number; subarray: number[] } => {
    const result = maximum_subarray_sum(arr);
    return {
      maxSum: Number(result[0]),
      subarray: Array.from(result[1]).map(x => Number(x))
    };
  },

  houseRobber: (houses: number[]): number => {
    return house_robber(houses);
  },

  climbingStairs: (n: number): bigint => {
    return climbing_stairs(n);
  },

  uniquePaths: (m: number, n: number): bigint => {
    return unique_paths(m, n);
  },
};

export const WasmUtils = {
  isBalancedParentheses: (expression: string): boolean => {
    return is_balanced_parentheses(expression);
  },

  evaluatePostfix: (expression: string): number => {
    try {
      return evaluate_postfix(expression);
    } catch (error) {
      throw new Error(`Invalid postfix expression: ${error}`);
    }
  },

  infixToPostfix: (expression: string): string => {
    return infix_to_postfix(expression);
  },

  findKLargest: (arr: number[], k: number): number[] => {
    const result = find_k_largest(new Int32Array(arr), k);
    return Array.from(result).map(x => Number(x));
  },

  findKSmallest: (arr: number[], k: number): number[] => {
    const result = find_k_smallest(new Int32Array(arr), k);
    return Array.from(result).map(x => Number(x));
  },

  benchmarkSort: (algorithm: string, arr: number[]): number => {
    return benchmark_sort(algorithm, new Int32Array(arr));
  },

  benchmarkSearch: (algorithm: string, arr: number[], target: number): number => {
    return benchmark_search(algorithm, new Int32Array(arr), target);
  },

  benchmarkHashOperations: (operation: string, iterations: number): number => {
    return benchmark_hash_operations(operation, iterations);
  },

  benchmarkStackOperations: (operation: string, iterations: number): number => {
    return benchmark_stack_operations(operation, iterations);
  },

  benchmarkQueueOperations: (operation: string, iterations: number): number => {
    return benchmark_queue_operations(operation, iterations);
  },

  benchmarkHeapOperations: (operation: string, iterations: number, isMaxHeap: boolean): number => {
    return benchmark_heap_operations(operation, iterations, isMaxHeap);
  },
};
/**
 * Comprehensive Rust WASM Helper for NextJS
 * Provides easy-to-use interfaces for all WASM modules
 */

import * as wasm from '../wasm/rust/vievlog_rust.js';

const {
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
  bucket_sort,
  benchmark_sort,
  compare_sorting_algorithms,

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
  find_peak_element,
  search_rotated_array,
  find_min_rotated_array,
  search_2d_matrix,
  benchmark_search,
  compare_search_algorithms,

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

  word_break,
  min_palindrome_cuts,



  // Heap Operations
  find_k_largest,
  find_k_smallest,
  heap_sort_heaps,
  is_heap,
  merge_k_sorted_arrays,
  benchmark_heap_operations,

  // String Algorithms



  // Utility Functions
  is_balanced_parentheses,
  evaluate_postfix,
  infix_to_postfix,
  benchmark_hash_operations,
  benchmark_stack_operations,
  benchmark_queue_operations,

  // Image Processing (Bevy)
  bevy_process_image,
  bevy_process_image_multi,
  bevy_create_animated_effect,
  bevy_get_effect_presets,
  bevy_apply_preset,
  bevy_process_rgba_image,
  bevy_resize_image,
} = wasm;

// Types for better TypeScript support
export interface WasmInitialized {
  dataStructures: DataStructureManager;
  algorithms: AlgorithmManager;
  imageProcessing: ImageProcessingManager;
  benchmarks: BenchmarkManager;
}

export interface SortResult {
  sorted_array: number[];
  comparisons: number;
  swaps: number;
  time_ms: number;
}

export interface SearchResult {
  found: boolean;
  index?: number;
  steps: number;
  time_ms: number;
}

export interface GraphPath {
  path: number[];
  distance: number;
}

export interface ImageProcessingResult {
  processed_data: Uint8Array;
  processing_time_ms: number;
}

// Main WASM Manager Class
class RustWasmManager {
  private static instance: RustWasmManager;
  private initialized = false;
  private wasmModule: any = null;

  public static getInstance(): RustWasmManager {
    if (!RustWasmManager.instance) {
      RustWasmManager.instance = new RustWasmManager();
    }
    return RustWasmManager.instance;
  }

  async init(): Promise<WasmInitialized> {
    if (this.initialized) {
      return this.getManagers();
    }

    if (typeof window === 'undefined') {
      throw new Error('WASM can only be initialized in browser environment');
    }

    try {

      this.initialized = true;
      console.log('🦀 Rust WASM initialized successfully!');

      return this.getManagers();
    } catch (error) {
      console.error('Failed to initialize Rust WASM:', error);
      throw error;
    }
  }

  private getManagers(): WasmInitialized {
    return {
      dataStructures: new DataStructureManager(),
      algorithms: new AlgorithmManager(),
      imageProcessing: new ImageProcessingManager(),
      benchmarks: new BenchmarkManager(),
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Data Structure Manager
export class DataStructureManager {
  // Vector operations
  createVector(): any {
    return new RustVector();
  }

  createStaticArray(size: number): any {
    return new StaticArray(size);
  }

  // Linked Lists
  createLinkedList(): any {
    return new LinkedList();
  }

  createDoublyLinkedList(): any {
    return new DoublyLinkedList();
  }

  // Trees
  createBST(): any {
    return new BinarySearchTree();
  }

  createAVLTree(): any {
    return new AVLTree();
  }

  // Graphs
  createGraph(is_directed: boolean): any {
    try {
      console.log("Creating Graph with is_directed:", is_directed);
      const graph = new Graph(is_directed);
      console.log("Graph created:", graph);
      console.log("Graph prototype:", Object.getPrototypeOf(graph));
      console.log("Graph methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(graph)));
      return graph;
    } catch (error) {
      console.error("Error creating Graph:", error);
      throw error;
    }
  }

  createWeightedGraph(is_directed: boolean): any {
    return new WeightedGraph(is_directed);
  }

  // Hash Tables
  createHashTable(capacity: number): any {
    return new HashTable(capacity);
  }

  createHashMap(): any {
    return new SimpleHashMap();
  }

  createIntHashMap(): any {
    return new IntHashMap();
  }

  // Stacks
  createStack(): any {
    return new Stack();
  }

  createStringStack(): any {
    return new StringStack();
  }

  createMinStack(): any {
    return new MinStack();
  }

  // Queues
  createQueue(): any {
    return new Queue();
  }

  createCircularQueue(capacity: number): any {
    return new CircularQueue(capacity);
  }

  createPriorityQueue(): any {
    return new PriorityQueue();
  }

  createDeque(): any {
    return new Deque();
  }

  createQueueUsingStacks(): any {
    return new QueueUsingStacks();
  }

  // Heaps
  createBinaryHeap(isMaxHeap: boolean = false): any {
    return new BinaryHeap(isMaxHeap);
  }

  createPriorityQueueHeap(isMaxPriority: boolean = false): any {
    return new PriorityQueueHeap(isMaxPriority);
  }

  createMedianFinder(): any {
    return new MedianFinder();
  }
}

// Algorithm Manager
export class AlgorithmManager {
  // Sorting algorithms
  sorting = {
    bubbleSort: (arr: number[]) => bubble_sort(new Int32Array(arr)),
    selectionSort: (arr: number[]) => selection_sort(new Int32Array(arr)),
    insertionSort: (arr: number[]) => insertion_sort(new Int32Array(arr)),
    quickSort: (arr: number[]) => quick_sort(new Int32Array(arr)),
    mergeSort: (arr: number[]) => merge_sort(new Int32Array(arr)),
    heapSort: (arr: number[]) => heap_sort(new Int32Array(arr)),
    countingSort: (arr: number[]) => counting_sort(new Int32Array(arr)),
    radixSort: (arr: number[]) => radix_sort(new Int32Array(arr)),
    shellSort: (arr: number[]) => shell_sort(new Int32Array(arr)),
    cocktailSort: (arr: number[]) => cocktail_sort(new Int32Array(arr)),
    bucketSort: (arr: number[], bucket_count: number) => bucket_sort(new Float64Array(arr), bucket_count),
  };

  // Searching algorithms
  searching = {
    linearSearch: (arr: number[], target: number) => linear_search(new Int32Array(arr), target),
    binarySearch: (arr: number[], target: number) => binary_search(new Int32Array(arr), target),
    interpolationSearch: (arr: number[], target: number) => interpolation_search(new Int32Array(arr), target),
    jumpSearch: (arr: number[], target: number) => jump_search(new Int32Array(arr), target),
    exponentialSearch: (arr: number[], target: number) => exponential_search(new Int32Array(arr), target),
    ternarySearch: (arr: number[], target: number) => ternary_search(new Int32Array(arr), target),
    fibonacciSearch: (arr: number[], target: number) => fibonacci_search(new Int32Array(arr), target),
    findFirstOccurrence: (arr: number[], target: number) => find_first_occurrence(new Int32Array(arr), target),
    findLastOccurrence: (arr: number[], target: number) => find_last_occurrence(new Int32Array(arr), target),
    countOccurrences: (arr: number[], target: number) => count_occurrences(new Int32Array(arr), target),
    findPeakElement: (arr: number[]) => find_peak_element(new Int32Array(arr)),
    searchRotatedArray: (arr: number[], target: number) => search_rotated_array(new Int32Array(arr), target),
    findMinRotatedArray: (arr: number[]) => find_min_rotated_array(new Int32Array(arr)),
    search2DMatrix: (matrix: any[], target: number) => search_2d_matrix(matrix, target),
  };

  // Graph algorithms
  graph = {
    dijkstraShortestPath: (vertices: any[], edges: any[], start: number, end: number) =>
      dijkstra_shortest_path(vertices, edges, start, end),
    bfsTraversal: (adjacencyList: any[], start: number) =>
      bfs_graph_traversal(adjacencyList, start),
    dfsTraversal: (adjacencyList: any[], start: number) =>
      dfs_graph_traversal(adjacencyList, start),
    topologicalSort: (vertices: any[], edges: any[]) =>
      topological_sort(vertices, edges),
    hasCycleDirected: (vertices: any[], edges: any[]) =>
      has_cycle_directed(vertices, edges),
    stronglyConnectedComponents: (vertices: any[], edges: any[]) =>
      strongly_connected_components(vertices, edges),
    minimumSpanningTreeKruskal: (vertices: any[], edges: any[]) =>
      minimum_spanning_tree_kruskal(vertices, edges),
  };

  // Dynamic programming
  dynamicProgramming = {
    fibonacciMemo: (n: number) => fibonacci_memo(n),
    knapsack01: (weights: number[], values: number[], capacity: number) =>
      knapsack_01(weights, values, capacity),
    longestCommonSubsequence: (str1: string, str2: string) =>
      longest_common_subsequence(str1, str2),
    coinChangeMin: (coins: number[], amount: number) =>
      coin_change_min(coins, amount),
    editDistance: (str1: string, str2: string) =>
      edit_distance(str1, str2),
    longestIncreasingSubsequence: (arr: number[]) =>
      longest_increasing_subsequence(arr),
    maximumSubarraySum: (arr: number[]) =>
      maximum_subarray_sum(arr),
    houseRobber: (houses: number[]) =>
      house_robber(houses),
    climbingStairs: (n: number) =>
      climbing_stairs(n),
    uniquePaths: (m: number, n: number) =>
      unique_paths(m, n),

    wordBreak: (s: string, wordDict: string[]) =>
      word_break(s, wordDict),
    minPalindromeCuts: (s: string) =>
      min_palindrome_cuts(s),


  };

  // Heap operations
  heap = {
    findKLargest: (arr: number[], k: number) => find_k_largest(new Int32Array(arr), k),
    findKSmallest: (arr: number[], k: number) => find_k_smallest(new Int32Array(arr), k),
    heapSortHeaps: (arr: number[]) => heap_sort_heaps(new Int32Array(arr)),
    isHeap: (arr: number[], isMaxHeap: boolean) => is_heap(new Int32Array(arr), isMaxHeap),
    mergeKSortedArrays: (arrays: any[]) => merge_k_sorted_arrays(arrays),
  };

  // String algorithms
  string = {
  };

  // Utility functions
  utils = {
    isBalancedParentheses: (s: string) => is_balanced_parentheses(s),
    evaluatePostfix: (expression: string) => evaluate_postfix(expression),
    infixToPostfix: (expression: string) => infix_to_postfix(expression),
  };
}

// Image Processing Manager
export class ImageProcessingManager {
  // Single effect processing
  processImage(imageData: Uint8Array, effectType: string, intensity: number): Uint8Array {
    return bevy_process_image(imageData, effectType, intensity);
  }

  // RGBA processing (more reliable)
  processRGBAImage(rgbaData: Uint8Array, width: number, height: number, effectType: string, intensity: number): Uint8Array {
    return bevy_process_rgba_image(rgbaData, width, height, effectType, intensity);
  }

  // Multiple effects
  processImageMulti(imageData: Uint8Array, effects: Array<[string, number]>): Uint8Array {
    const effectsJson = JSON.stringify(effects);
    return bevy_process_image_multi(imageData, effectsJson);
  }

  // Resize
  resizeImage(rgbaData: Uint8Array, oldWidth: number, oldHeight: number, newWidth: number, newHeight: number): Uint8Array {
    return bevy_resize_image(rgbaData, oldWidth, oldHeight, newWidth, newHeight);
  }

  // Animation
  createAnimatedEffect(imageData: Uint8Array, effectType: string, frames: number, intensity: number): any[] {
    return Array.from(bevy_create_animated_effect(imageData, effectType, frames, intensity));
  }

  // Presets
  getEffectPresets(): object {
    return bevy_get_effect_presets();
  }

  applyPreset(imageData: Uint8Array, presetName: string): Uint8Array {
    return bevy_apply_preset(imageData, presetName);
  }

  // Common effects with type safety
  effects = {
    blur: (data: Uint8Array, width: number, height: number, intensity: number = 1.0) =>
      this.processRGBAImage(data, width, height, "blur", intensity),
    brightness: (data: Uint8Array, width: number, height: number, factor: number = 1.2) =>
      this.processRGBAImage(data, width, height, "brightness", factor),
    contrast: (data: Uint8Array, width: number, height: number, factor: number = 1.2) =>
      this.processRGBAImage(data, width, height, "contrast", factor),
    saturation: (data: Uint8Array, width: number, height: number, factor: number = 1.2) =>
      this.processRGBAImage(data, width, height, "saturation", factor),
    grayscale: (data: Uint8Array, width: number, height: number) =>
      this.processRGBAImage(data, width, height, "grayscale", 1.0),
    sepia: (data: Uint8Array, width: number, height: number) =>
      this.processRGBAImage(data, width, height, "sepia", 1.0),
    vignette: (data: Uint8Array, width: number, height: number, strength: number = 0.5) =>
      this.processRGBAImage(data, width, height, "vignette", strength),
    filmGrain: (data: Uint8Array, width: number, height: number, intensity: number = 0.3) =>
      this.processRGBAImage(data, width, height, "film_grain", intensity),
    lightLeak: (data: Uint8Array, width: number, height: number, intensity: number = 0.3) =>
      this.processRGBAImage(data, width, height, "light_leak", intensity),
  };
}

// Benchmark Manager
export class BenchmarkManager {
  sorting = {
    benchmark: (algorithm: string, arr: number[]) => benchmark_sort(algorithm, new Int32Array(arr)),
    compare: (arr: number[]) => compare_sorting_algorithms(new Int32Array(arr)),
  };

  searching = {
    benchmark: (algorithm: string, arr: number[], target: number) => benchmark_search(algorithm, new Int32Array(arr), target),
    compare: (arr: number[], target: number) => compare_search_algorithms(new Int32Array(arr), target),
  };

  dataStructures = {
    hash: (operation: string, iterations: number) => benchmark_hash_operations(operation, iterations),
    stack: (operation: string, iterations: number) => benchmark_stack_operations(operation, iterations),
    queue: (operation: string, iterations: number) => benchmark_queue_operations(operation, iterations),
    heap: (operation: string, iterations: number, isMaxHeap: boolean) =>
      benchmark_heap_operations(operation, iterations, isMaxHeap),
  };
}

// Global instance and hooks
const rustWasmManager = RustWasmManager.getInstance();

// React Hook for easy usage
export function useRustWasm() {
  return {
    init: () => rustWasmManager.init(),
    isInitialized: () => rustWasmManager.isInitialized(),
  };
}

// Direct access functions for convenience
export async function initRustWasm(): Promise<WasmInitialized> {
  return await rustWasmManager.init();
}

export function isRustWasmInitialized(): boolean {
  return rustWasmManager.isInitialized();
}

// Export the manager for advanced usage
export { RustWasmManager };

// Type declarations
declare global {
  interface Window {
    rustWasm: any;
  }
}
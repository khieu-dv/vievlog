/* tslint:disable */
/* eslint-disable */
export function main(): void;
/**
 * Process image with Bevy ECS system
 */
export function bevy_process_image(image_data: Uint8Array, effect_type: string, intensity: number): Uint8Array;
/**
 * Apply multiple effects in sequence
 */
export function bevy_process_image_multi(image_data: Uint8Array, effects_json: string): Uint8Array;
/**
 * Create animated effect sequence
 */
export function bevy_create_animated_effect(image_data: Uint8Array, effect_type: string, frames: number, intensity: number): Array<any>;
/**
 * Get available effect presets
 */
export function bevy_get_effect_presets(): object;
/**
 * Apply preset effect combination
 */
export function bevy_apply_preset(image_data: Uint8Array, preset_name: string): Uint8Array;
/**
 * Process RGBA image data directly (no decoding needed)
 */
export function bevy_process_rgba_image(rgba_data: Uint8Array, width: number, height: number, effect_type: string, intensity: number): Uint8Array;
/**
 * Simple image resize function
 */
export function bevy_resize_image(rgba_data: Uint8Array, old_width: number, old_height: number, new_width: number, new_height: number): Uint8Array;
/**
 * Dijkstra's shortest path algorithm
 */
export function dijkstra_shortest_path(vertices: Array<any>, edges: Array<any>, start: number, end: number): Array<any>;
/**
 * Breadth-First Search
 */
export function bfs_graph_traversal(adjacency_list: Array<any>, start: number): Array<any>;
/**
 * Depth-First Search
 */
export function dfs_graph_traversal(adjacency_list: Array<any>, start: number): Array<any>;
/**
 * Topological Sort (Kahn's algorithm)
 */
export function topological_sort(vertices: Array<any>, edges: Array<any>): Array<any>;
/**
 * Detect cycle in directed graph
 */
export function has_cycle_directed(vertices: Array<any>, edges: Array<any>): boolean;
/**
 * Find strongly connected components (Kosaraju's algorithm)
 */
export function strongly_connected_components(vertices: Array<any>, edges: Array<any>): Array<any>;
/**
 * Minimum Spanning Tree - Kruskal's algorithm
 */
export function minimum_spanning_tree_kruskal(vertices: Array<any>, edges: Array<any>): Array<any>;
/**
 * Heap Sort implementation from heaps module
 */
export function heap_sort_heaps(arr: Int32Array): Array<any>;
/**
 * K Largest Elements
 */
export function find_k_largest(arr: Int32Array, k: number): Array<any>;
/**
 * K Smallest Elements
 */
export function find_k_smallest(arr: Int32Array, k: number): Array<any>;
/**
 * Check if array represents a valid heap
 */
export function is_heap(arr: Int32Array, is_max_heap: boolean): boolean;
/**
 * Merge K Sorted Arrays using heap
 */
export function merge_k_sorted_arrays(arrays: Array<any>): Array<any>;
/**
 * Performance benchmark for heap operations
 */
export function benchmark_heap_operations(operation: string, iterations: number, is_max_heap: boolean): number;
/**
 * Stack utilities and algorithms
 * Check if parentheses are balanced
 */
export function is_balanced_parentheses(expression: string): boolean;
/**
 * Evaluate postfix expression
 */
export function evaluate_postfix(expression: string): number;
/**
 * Convert infix to postfix notation
 */
export function infix_to_postfix(expression: string): string;
/**
 * Reverse a string using stack
 */
export function reverse_string(input: string): string;
/**
 * Check if a string is palindrome using stack
 */
export function is_palindrome_stack(input: string): boolean;
/**
 * Next Greater Element using stack
 */
export function next_greater_elements(arr: Int32Array): Array<any>;
/**
 * Stock span problem using stack
 */
export function calculate_stock_spans(prices: Int32Array): Array<any>;
/**
 * Largest rectangle in histogram using stack
 */
export function largest_rectangle_area(heights: Int32Array): number;
/**
 * Performance benchmark for stack operations
 */
export function benchmark_stack_operations(operation: string, iterations: number): number;
/**
 * Hash function utilities
 */
export function hash_string(input: string): bigint;
export function hash_string_with_modulo(input: string, modulo: number): number;
/**
 * Simple hash function for demonstration
 */
export function simple_hash(input: string, table_size: number): number;
/**
 * Performance test: hash operations
 */
export function benchmark_hash_operations(operation: string, iterations: number): number;
/**
 * Fibonacci with memoization
 */
export function fibonacci_memo(n: number): bigint;
/**
 * 0/1 Knapsack Problem
 */
export function knapsack_01(weights: Array<any>, values: Array<any>, capacity: number): Array<any>;
/**
 * Longest Common Subsequence
 */
export function longest_common_subsequence(text1: string, text2: string): Array<any>;
/**
 * Coin Change Problem (minimum coins)
 */
export function coin_change_min(coins: Array<any>, amount: number): Array<any>;
/**
 * Edit Distance (Levenshtein Distance)
 */
export function edit_distance(word1: string, word2: string): number;
/**
 * Longest Increasing Subsequence
 */
export function longest_increasing_subsequence(arr: Array<any>): Array<any>;
/**
 * Maximum Subarray Sum (Kadane's Algorithm)
 */
export function maximum_subarray_sum(arr: Array<any>): Array<any>;
/**
 * House Robber Problem
 */
export function house_robber(houses: Array<any>): number;
/**
 * Climbing Stairs Problem
 */
export function climbing_stairs(n: number): bigint;
/**
 * Unique Paths in Grid
 */
export function unique_paths(m: number, n: number): bigint;
/**
 * Word Break Problem
 */
export function word_break(s: string, word_dict: Array<any>): boolean;
/**
 * Palindrome Partitioning (minimum cuts)
 */
export function min_palindrome_cuts(s: string): number;
/**
 * Matrix Chain Multiplication
 */
export function matrix_chain_multiplication(dimensions: Array<any>): number;
/**
 * Generate video frames with Ken Burns effect (pan and zoom)
 */
export function bevy_generate_ken_burns(rgba_data: Uint8Array, width: number, height: number, frames: number, zoom_factor: number, pan_x: number, pan_y: number): Array<any>;
/**
 * Generate transition frames between two images
 */
export function bevy_generate_transition(rgba_data1: Uint8Array, rgba_data2: Uint8Array, width: number, height: number, frames: number, transition_type: string): Array<any>;
/**
 * Generate slideshow from multiple images with effects
 */
export function bevy_generate_slideshow(images_data: Array<any>, frames_per_image: number, transition_frames: number, transition_type: string): Array<any>;
/**
 * Generate parallax scrolling effect
 */
export function bevy_generate_parallax(bg_data: Uint8Array, fg_data: Uint8Array, width: number, height: number, frames: number, scroll_speed: number): Array<any>;
/**
 * Bubble Sort - O(n²) time complexity
 */
export function bubble_sort(arr: Int32Array): Array<any>;
/**
 * Bubble Sort with step tracking
 */
export function bubble_sort_with_steps(arr: Int32Array): Array<any>;
/**
 * Selection Sort - O(n²) time complexity
 */
export function selection_sort(arr: Int32Array): Array<any>;
/**
 * Insertion Sort - O(n²) time complexity, good for small arrays
 */
export function insertion_sort(arr: Int32Array): Array<any>;
/**
 * Quick Sort - O(n log n) average, O(n²) worst case
 */
export function quick_sort(arr: Int32Array): Array<any>;
/**
 * Merge Sort - O(n log n) time complexity, stable
 */
export function merge_sort(arr: Int32Array): Array<any>;
/**
 * Heap Sort - O(n log n) time complexity, in-place
 */
export function heap_sort(arr: Int32Array): Array<any>;
/**
 * Counting Sort - O(n + k) time complexity for small ranges
 */
export function counting_sort(arr: Int32Array): Array<any>;
/**
 * Radix Sort - O(d * (n + k)) where d is number of digits
 */
export function radix_sort(arr: Int32Array): Array<any>;
/**
 * Bucket Sort - O(n + k) average case
 */
export function bucket_sort(arr: Float64Array, bucket_count: number): Array<any>;
/**
 * Shell Sort - O(n^1.5) average case
 */
export function shell_sort(arr: Int32Array): Array<any>;
/**
 * Cocktail Shaker Sort (Bidirectional Bubble Sort)
 */
export function cocktail_sort(arr: Int32Array): Array<any>;
/**
 * Utility functions for sorting analysis
 * Check if array is sorted
 */
export function is_sorted(arr: Int32Array): boolean;
/**
 * Generate different types of test arrays
 */
export function generate_random_array(size: number, max_value: number): Array<any>;
export function generate_sorted_array(size: number): Array<any>;
export function generate_reverse_sorted_array(size: number): Array<any>;
export function generate_nearly_sorted_array(size: number, swap_count: number): Array<any>;
/**
 * Performance benchmark for sorting algorithms
 */
export function benchmark_sort(algorithm: string, arr: Int32Array): number;
/**
 * Compare multiple sorting algorithms
 */
export function compare_sorting_algorithms(arr: Int32Array): Array<any>;
/**
 * Queue algorithms and utilities
 * Breadth-First Search using queue
 */
export function bfs_traversal(adj_list: Array<any>, start: number): Array<any>;
/**
 * Level order traversal of binary tree
 */
export function level_order_traversal(tree_array: Array<any>): Array<any>;
/**
 * Sliding window maximum using deque
 */
export function sliding_window_maximum(arr: Int32Array, window_size: number): Array<any>;
/**
 * First negative integer in every window
 */
export function first_negative_in_window(arr: Int32Array, window_size: number): Array<any>;
/**
 * Performance benchmark for queue operations
 */
export function benchmark_queue_operations(operation: string, iterations: number): number;
/**
 * Utility functions for array operations
 */
export function array_sum(arr: Int32Array): number;
export function array_max(arr: Int32Array): number | undefined;
export function array_min(arr: Int32Array): number | undefined;
export function array_reverse(arr: Int32Array): Array<any>;
export function array_slice(arr: Int32Array, start: number, end: number): Array<any>;
/**
 * Linear Search - O(n) time complexity
 */
export function linear_search(arr: Int32Array, target: number): number | undefined;
/**
 * Linear Search with step tracking
 */
export function linear_search_with_steps(arr: Int32Array, target: number): Array<any>;
/**
 * Binary Search - O(log n) time complexity, requires sorted array
 */
export function binary_search(arr: Int32Array, target: number): number | undefined;
/**
 * Binary Search with step tracking
 */
export function binary_search_with_steps(arr: Int32Array, target: number): Array<any>;
/**
 * Interpolation Search - O(log log n) for uniformly distributed data
 */
export function interpolation_search(arr: Int32Array, target: number): number | undefined;
/**
 * Jump Search - O(√n) time complexity
 */
export function jump_search(arr: Int32Array, target: number): number | undefined;
/**
 * Exponential Search - O(log n) time complexity
 */
export function exponential_search(arr: Int32Array, target: number): number | undefined;
/**
 * Ternary Search - O(log₃ n) time complexity
 */
export function ternary_search(arr: Int32Array, target: number): number | undefined;
/**
 * Fibonacci Search - O(log n) time complexity
 */
export function fibonacci_search(arr: Int32Array, target: number): number | undefined;
/**
 * Find first occurrence of target in sorted array with duplicates
 */
export function find_first_occurrence(arr: Int32Array, target: number): number | undefined;
/**
 * Find last occurrence of target in sorted array with duplicates
 */
export function find_last_occurrence(arr: Int32Array, target: number): number | undefined;
/**
 * Count occurrences of target in sorted array
 */
export function count_occurrences(arr: Int32Array, target: number): number;
/**
 * Find peak element in array (element that is greater than its neighbors)
 */
export function find_peak_element(arr: Int32Array): number | undefined;
/**
 * Search in rotated sorted array
 */
export function search_rotated_array(arr: Int32Array, target: number): number | undefined;
/**
 * Find minimum element in rotated sorted array
 */
export function find_min_rotated_array(arr: Int32Array): number | undefined;
/**
 * Search for target in 2D matrix (sorted row-wise and column-wise)
 */
export function search_2d_matrix(matrix: Array<any>, target: number): Array<any>;
/**
 * Performance benchmark for searching algorithms
 */
export function benchmark_search(algorithm: string, arr: Int32Array, target: number): number;
/**
 * Compare multiple searching algorithms
 */
export function compare_search_algorithms(arr: Int32Array, target: number): Array<any>;
/**
 * Utility functions
 * Check if array is sorted (required for some search algorithms)
 */
export function is_sorted_for_search(arr: Int32Array): boolean;
/**
 * Generate test cases for searching
 */
export function generate_search_test_array(size: number, max_value: number): Array<any>;
/**
 * Get all available effect presets
 */
export function bevy_get_all_presets(): Array<any>;
/**
 * Get preset configuration as JSON string
 */
export function bevy_get_preset_config(preset_name: string): string;
/**
 * Apply professional cinematic preset
 */
export function bevy_apply_cinematic_preset(image_data: Uint8Array, preset_name: string, intensity: number): Uint8Array;
/**
 * Create effect suggestion based on image analysis
 */
export function bevy_suggest_effects(rgba_data: Uint8Array, width: number, height: number): Array<any>;
/**
 * Create effect preview thumbnails for all presets
 */
export function bevy_create_preset_previews(image_data: Uint8Array, thumbnail_width: number, thumbnail_height: number): object;
/**
 * Batch process multiple images with same effect
 */
export function bevy_batch_process_preset(images_array: Array<any>, preset_name: string, intensity: number): Array<any>;
/**
 * Create animated preset sequence
 */
export function bevy_animate_preset(image_data: Uint8Array, preset_name: string, frames: number, max_intensity: number): Array<any>;
/**
 * Get effect performance metrics
 */
export function bevy_get_performance_metrics(): object;
/**
 * AVL Tree (Self-balancing binary search tree)
 */
export class AVLTree {
  free(): void;
  constructor();
  insert(value: number): void;
  search(value: number): boolean;
  len(): number;
  height(): number;
  inorder_traversal(): Array<any>;
}
/**
 * Binary Heap implementation (Min-Heap by default)
 */
export class BinaryHeap {
  free(): void;
  constructor(is_max_heap: boolean);
  static with_capacity(capacity: number, is_max_heap: boolean): BinaryHeap;
  insert(item: number): void;
  extract(): number | undefined;
  peek(): number | undefined;
  is_empty(): boolean;
  len(): number;
  capacity(): number;
  clear(): void;
  is_max_heap(): boolean;
  change_heap_type(is_max_heap: boolean): void;
  build_heap(arr: Int32Array): void;
  to_array(): Array<any>;
  static from_array(arr: Array<any>, is_max_heap: boolean): BinaryHeap;
  is_valid_heap(): boolean;
  get_parent(index: number): number | undefined;
  get_left_child(index: number): number | undefined;
  get_right_child(index: number): number | undefined;
  height(): number;
}
/**
 * Binary Search Tree
 */
export class BinarySearchTree {
  free(): void;
  constructor();
  insert(value: number): void;
  search(value: number): boolean;
  remove(value: number): boolean;
  find_min(): number | undefined;
  find_max(): number | undefined;
  height(): number;
  len(): number;
  is_empty(): boolean;
  clear(): void;
  inorder_traversal(): Array<any>;
  preorder_traversal(): Array<any>;
  postorder_traversal(): Array<any>;
  level_order_traversal(): Array<any>;
  is_valid_bst(): boolean;
  static from_array(arr: Array<any>): BinarySearchTree;
}
/**
 * Circular Queue with fixed capacity
 */
export class CircularQueue {
  free(): void;
  constructor(capacity: number);
  enqueue(item: number): boolean;
  dequeue(): number | undefined;
  front(): number | undefined;
  rear(): number | undefined;
  is_empty(): boolean;
  is_full(): boolean;
  len(): number;
  capacity(): number;
  clear(): void;
  get_front_index(): number;
  get_rear_index(): number;
  to_array(): Array<any>;
  get_raw_data(): Array<any>;
}
/**
 * Deque (Double-ended queue)
 */
export class Deque {
  free(): void;
  constructor();
  push_front(item: number): void;
  push_back(item: number): void;
  pop_front(): number | undefined;
  pop_back(): number | undefined;
  front(): number | undefined;
  back(): number | undefined;
  is_empty(): boolean;
  len(): number;
  clear(): void;
  to_array(): Array<any>;
}
/**
 * Doubly Linked List
 */
export class DoublyLinkedList {
  free(): void;
  constructor();
  push_front(value: number): void;
  push_back(value: number): void;
  pop_front(): number | undefined;
  len(): number;
  is_empty(): boolean;
  to_array(): Array<any>;
}
/**
 * Graph using adjacency list representation
 */
export class Graph {
  free(): void;
  constructor(is_directed: boolean);
  add_vertex(vertex: number): void;
  add_edge(from: number, to: number): void;
  remove_vertex(vertex: number): boolean;
  remove_edge(from: number, to: number): boolean;
  has_vertex(vertex: number): boolean;
  has_edge(from: number, to: number): boolean;
  get_neighbors(vertex: number): Array<any>;
  get_vertices(): Array<any>;
  vertex_count(): number;
  edge_count(): number;
  degree(vertex: number): number | undefined;
  dfs_traversal(start: number): Array<any>;
  bfs_traversal(start: number): Array<any>;
  has_path(from: number, to: number): boolean;
  shortest_path(from: number, to: number): Array<any>;
  is_connected(): boolean;
  has_cycle(): boolean;
  topological_sort(): Array<any>;
}
/**
 * Hash Table with chaining collision resolution
 */
export class HashTable {
  free(): void;
  constructor(capacity: number);
  insert(key: string, value: string): boolean;
  get(key: string): string | undefined;
  remove(key: string): string | undefined;
  contains_key(key: string): boolean;
  len(): number;
  capacity(): number;
  is_empty(): boolean;
  clear(): void;
  load_factor(): number;
  keys(): Array<any>;
  values(): Array<any>;
  entries(): Array<any>;
  bucket_sizes(): Array<any>;
  max_bucket_size(): number;
}
/**
 * Integer HashMap for performance testing
 */
export class IntHashMap {
  free(): void;
  constructor();
  insert(key: number, value: number): number | undefined;
  get(key: number): number | undefined;
  remove(key: number): number | undefined;
  contains_key(key: number): boolean;
  len(): number;
  is_empty(): boolean;
  clear(): void;
  keys(): Array<any>;
  values(): Array<any>;
  entries(): Array<any>;
  static from_arrays(keys: Array<any>, values: Array<any>): IntHashMap;
}
/**
 * Singly Linked List
 */
export class LinkedList {
  free(): void;
  constructor();
  push_front(value: number): void;
  push_back(value: number): void;
  pop_front(): number | undefined;
  pop_back(): number | undefined;
  get(index: number): number | undefined;
  insert(index: number, value: number): boolean;
  remove(index: number): number | undefined;
  contains(value: number): boolean;
  index_of(value: number): number | undefined;
  len(): number;
  is_empty(): boolean;
  clear(): void;
  reverse(): void;
  to_array(): Array<any>;
  static from_array(arr: Array<any>): LinkedList;
}
/**
 * Median Finder using two heaps
 */
export class MedianFinder {
  free(): void;
  constructor();
  add_number(num: number): void;
  find_median(): number;
  len(): number;
  is_empty(): boolean;
}
/**
 * Min Stack - maintains minimum element efficiently
 */
export class MinStack {
  free(): void;
  constructor();
  push(item: number): void;
  pop(): number | undefined;
  peek(): number | undefined;
  get_min(): number | undefined;
  is_empty(): boolean;
  len(): number;
  to_array(): Array<any>;
}
/**
 * Priority Queue (Min-Heap based)
 */
export class PriorityQueue {
  free(): void;
  constructor();
  enqueue(value: number, priority: number): void;
  dequeue(): number | undefined;
  peek(): number | undefined;
  peek_priority(): number | undefined;
  is_empty(): boolean;
  len(): number;
  clear(): void;
  to_array(): Array<any>;
}
/**
 * Priority Queue using Binary Heap
 */
export class PriorityQueueHeap {
  free(): void;
  constructor(is_max_priority: boolean);
  enqueue(item: number): void;
  dequeue(): number | undefined;
  peek(): number | undefined;
  is_empty(): boolean;
  len(): number;
  to_array(): Array<any>;
}
/**
 * Queue implementation using VecDeque
 */
export class Queue {
  free(): void;
  constructor();
  static with_capacity(capacity: number): Queue;
  enqueue(item: number): void;
  dequeue(): number | undefined;
  front(): number | undefined;
  back(): number | undefined;
  is_empty(): boolean;
  len(): number;
  capacity(): number;
  clear(): void;
  contains(item: number): boolean;
  to_array(): Array<any>;
  static from_array(arr: Array<any>): Queue;
}
/**
 * Queue using two stacks
 */
export class QueueUsingStacks {
  free(): void;
  constructor();
  enqueue(item: number): void;
  dequeue(): number | undefined;
  front(): number | undefined;
  is_empty(): boolean;
  len(): number;
}
/**
 * Dynamic Array/Vector Implementation
 */
export class RustVector {
  free(): void;
  constructor();
  static with_capacity(capacity: number): RustVector;
  push(value: number): void;
  pop(): number | undefined;
  get(index: number): number | undefined;
  set(index: number, value: number): boolean;
  insert(index: number, value: number): boolean;
  remove(index: number): number | undefined;
  len(): number;
  capacity(): number;
  is_empty(): boolean;
  clear(): void;
  reverse(): void;
  to_array(): Array<any>;
  static from_array(arr: Array<any>): RustVector;
  contains(value: number): boolean;
  index_of(value: number): number | undefined;
  extend(other: RustVector): void;
  clone_vector(): RustVector;
}
/**
 * Simple HashMap wrapper for string-to-string mappings
 */
export class SimpleHashMap {
  free(): void;
  constructor();
  insert(key: string, value: string): string | undefined;
  get(key: string): string | undefined;
  remove(key: string): string | undefined;
  contains_key(key: string): boolean;
  len(): number;
  is_empty(): boolean;
  clear(): void;
  keys(): Array<any>;
  values(): Array<any>;
  entries(): Array<any>;
}
/**
 * Stack implementation using Vec
 */
export class Stack {
  free(): void;
  constructor();
  static with_capacity(capacity: number): Stack;
  push(item: number): void;
  pop(): number | undefined;
  peek(): number | undefined;
  is_empty(): boolean;
  len(): number;
  capacity(): number;
  clear(): void;
  contains(item: number): boolean;
  to_array(): Array<any>;
  static from_array(arr: Array<any>): Stack;
  clone_stack(): Stack;
}
/**
 * Static Array with fixed size
 */
export class StaticArray {
  free(): void;
  constructor(size: number);
  get(index: number): number | undefined;
  set(index: number, value: number): boolean;
  len(): number;
  fill(value: number): void;
  to_array(): Array<any>;
}
/**
 * String Stack for text operations
 */
export class StringStack {
  free(): void;
  constructor();
  push(item: string): void;
  pop(): string | undefined;
  peek(): string | undefined;
  is_empty(): boolean;
  len(): number;
  clear(): void;
  to_array(): Array<any>;
}
/**
 * Binary Tree Node
 */
export class TreeNode {
  free(): void;
  constructor(value: number);
  get_value(): number;
  set_value(value: number): void;
}
/**
 * Weighted Graph for algorithms like Dijkstra
 */
export class WeightedGraph {
  free(): void;
  constructor(is_directed: boolean);
  add_vertex(vertex: number): void;
  add_edge(from: number, to: number, weight: number): void;
  dijkstra(start: number): Array<any>;
  shortest_path_with_weights(from: number, to: number): Array<any>;
  get_vertices(): Array<any>;
  get_edges(): Array<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly main: () => void;
  readonly bevy_process_image: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly bevy_process_image_multi: (a: number, b: number, c: number, d: number) => [number, number];
  readonly bevy_create_animated_effect: (a: number, b: number, c: number, d: number, e: number, f: number) => any;
  readonly bevy_get_effect_presets: () => any;
  readonly bevy_apply_preset: (a: number, b: number, c: number, d: number) => [number, number];
  readonly bevy_process_rgba_image: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
  readonly bevy_resize_image: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly dijkstra_shortest_path: (a: any, b: any, c: number, d: number) => any;
  readonly bfs_graph_traversal: (a: any, b: number) => any;
  readonly dfs_graph_traversal: (a: any, b: number) => any;
  readonly topological_sort: (a: any, b: any) => any;
  readonly has_cycle_directed: (a: any, b: any) => number;
  readonly strongly_connected_components: (a: any, b: any) => any;
  readonly minimum_spanning_tree_kruskal: (a: any, b: any) => any;
  readonly __wbg_linkedlist_free: (a: number, b: number) => void;
  readonly linkedlist_push_front: (a: number, b: number) => void;
  readonly linkedlist_push_back: (a: number, b: number) => void;
  readonly linkedlist_pop_front: (a: number) => number;
  readonly linkedlist_pop_back: (a: number) => number;
  readonly linkedlist_get: (a: number, b: number) => number;
  readonly linkedlist_insert: (a: number, b: number, c: number) => number;
  readonly linkedlist_remove: (a: number, b: number) => number;
  readonly linkedlist_contains: (a: number, b: number) => number;
  readonly linkedlist_index_of: (a: number, b: number) => number;
  readonly linkedlist_len: (a: number) => number;
  readonly linkedlist_is_empty: (a: number) => number;
  readonly linkedlist_clear: (a: number) => void;
  readonly linkedlist_reverse: (a: number) => void;
  readonly linkedlist_to_array: (a: number) => any;
  readonly linkedlist_from_array: (a: any) => number;
  readonly __wbg_doublylinkedlist_free: (a: number, b: number) => void;
  readonly doublylinkedlist_new: () => number;
  readonly doublylinkedlist_push_front: (a: number, b: number) => void;
  readonly doublylinkedlist_push_back: (a: number, b: number) => void;
  readonly doublylinkedlist_pop_front: (a: number) => number;
  readonly doublylinkedlist_len: (a: number) => number;
  readonly doublylinkedlist_is_empty: (a: number) => number;
  readonly doublylinkedlist_to_array: (a: number) => any;
  readonly __wbg_binaryheap_free: (a: number, b: number) => void;
  readonly binaryheap_new: (a: number) => number;
  readonly binaryheap_with_capacity: (a: number, b: number) => number;
  readonly binaryheap_insert: (a: number, b: number) => void;
  readonly binaryheap_extract: (a: number) => number;
  readonly binaryheap_peek: (a: number) => number;
  readonly binaryheap_is_empty: (a: number) => number;
  readonly binaryheap_len: (a: number) => number;
  readonly binaryheap_capacity: (a: number) => number;
  readonly binaryheap_clear: (a: number) => void;
  readonly binaryheap_is_max_heap: (a: number) => number;
  readonly binaryheap_change_heap_type: (a: number, b: number) => void;
  readonly binaryheap_build_heap: (a: number, b: number, c: number) => void;
  readonly binaryheap_to_array: (a: number) => any;
  readonly binaryheap_from_array: (a: any, b: number) => number;
  readonly binaryheap_is_valid_heap: (a: number) => number;
  readonly binaryheap_get_parent: (a: number, b: number) => number;
  readonly binaryheap_get_left_child: (a: number, b: number) => number;
  readonly binaryheap_get_right_child: (a: number, b: number) => number;
  readonly binaryheap_height: (a: number) => number;
  readonly heap_sort_heaps: (a: number, b: number) => any;
  readonly priorityqueueheap_peek: (a: number) => number;
  readonly priorityqueueheap_is_empty: (a: number) => number;
  readonly priorityqueueheap_len: (a: number) => number;
  readonly priorityqueueheap_to_array: (a: number) => any;
  readonly __wbg_medianfinder_free: (a: number, b: number) => void;
  readonly medianfinder_new: () => number;
  readonly medianfinder_add_number: (a: number, b: number) => void;
  readonly medianfinder_find_median: (a: number) => number;
  readonly medianfinder_len: (a: number) => number;
  readonly medianfinder_is_empty: (a: number) => number;
  readonly find_k_largest: (a: number, b: number, c: number) => any;
  readonly find_k_smallest: (a: number, b: number, c: number) => any;
  readonly is_heap: (a: number, b: number, c: number) => number;
  readonly merge_k_sorted_arrays: (a: any) => any;
  readonly benchmark_heap_operations: (a: number, b: number, c: number, d: number) => number;
  readonly stack_with_capacity: (a: number) => number;
  readonly stack_push: (a: number, b: number) => void;
  readonly stack_peek: (a: number) => number;
  readonly stack_from_array: (a: any) => number;
  readonly __wbg_stringstack_free: (a: number, b: number) => void;
  readonly stringstack_push: (a: number, b: number, c: number) => void;
  readonly stringstack_pop: (a: number) => [number, number];
  readonly stringstack_peek: (a: number) => [number, number];
  readonly stringstack_is_empty: (a: number) => number;
  readonly stringstack_len: (a: number) => number;
  readonly stringstack_clear: (a: number) => void;
  readonly stringstack_to_array: (a: number) => any;
  readonly __wbg_minstack_free: (a: number, b: number) => void;
  readonly minstack_new: () => number;
  readonly minstack_push: (a: number, b: number) => void;
  readonly minstack_pop: (a: number) => number;
  readonly minstack_peek: (a: number) => number;
  readonly minstack_get_min: (a: number) => number;
  readonly minstack_is_empty: (a: number) => number;
  readonly minstack_len: (a: number) => number;
  readonly minstack_to_array: (a: number) => any;
  readonly is_balanced_parentheses: (a: number, b: number) => number;
  readonly evaluate_postfix: (a: number, b: number) => [number, number, number];
  readonly infix_to_postfix: (a: number, b: number) => [number, number];
  readonly reverse_string: (a: number, b: number) => [number, number];
  readonly is_palindrome_stack: (a: number, b: number) => number;
  readonly next_greater_elements: (a: number, b: number) => any;
  readonly calculate_stock_spans: (a: number, b: number) => any;
  readonly largest_rectangle_area: (a: number, b: number) => number;
  readonly benchmark_stack_operations: (a: number, b: number, c: number) => number;
  readonly __wbg_hashtable_free: (a: number, b: number) => void;
  readonly hashtable_new: (a: number) => number;
  readonly hashtable_insert: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly hashtable_get: (a: number, b: number, c: number) => [number, number];
  readonly hashtable_remove: (a: number, b: number, c: number) => [number, number];
  readonly hashtable_contains_key: (a: number, b: number, c: number) => number;
  readonly hashtable_len: (a: number) => number;
  readonly hashtable_capacity: (a: number) => number;
  readonly hashtable_is_empty: (a: number) => number;
  readonly hashtable_clear: (a: number) => void;
  readonly hashtable_load_factor: (a: number) => number;
  readonly hashtable_keys: (a: number) => any;
  readonly hashtable_values: (a: number) => any;
  readonly hashtable_entries: (a: number) => any;
  readonly hashtable_bucket_sizes: (a: number) => any;
  readonly hashtable_max_bucket_size: (a: number) => number;
  readonly __wbg_simplehashmap_free: (a: number, b: number) => void;
  readonly simplehashmap_insert: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly simplehashmap_get: (a: number, b: number, c: number) => [number, number];
  readonly simplehashmap_remove: (a: number, b: number, c: number) => [number, number];
  readonly simplehashmap_contains_key: (a: number, b: number, c: number) => number;
  readonly simplehashmap_len: (a: number) => number;
  readonly simplehashmap_is_empty: (a: number) => number;
  readonly simplehashmap_clear: (a: number) => void;
  readonly simplehashmap_keys: (a: number) => any;
  readonly simplehashmap_values: (a: number) => any;
  readonly simplehashmap_entries: (a: number) => any;
  readonly __wbg_inthashmap_free: (a: number, b: number) => void;
  readonly inthashmap_new: () => number;
  readonly inthashmap_insert: (a: number, b: number, c: number) => number;
  readonly inthashmap_get: (a: number, b: number) => number;
  readonly inthashmap_remove: (a: number, b: number) => number;
  readonly inthashmap_contains_key: (a: number, b: number) => number;
  readonly inthashmap_len: (a: number) => number;
  readonly inthashmap_is_empty: (a: number) => number;
  readonly inthashmap_clear: (a: number) => void;
  readonly inthashmap_keys: (a: number) => any;
  readonly inthashmap_values: (a: number) => any;
  readonly inthashmap_entries: (a: number) => any;
  readonly inthashmap_from_arrays: (a: any, b: any) => number;
  readonly hash_string: (a: number, b: number) => bigint;
  readonly hash_string_with_modulo: (a: number, b: number, c: number) => number;
  readonly simple_hash: (a: number, b: number, c: number) => number;
  readonly benchmark_hash_operations: (a: number, b: number, c: number) => number;
  readonly __wbg_treenode_free: (a: number, b: number) => void;
  readonly treenode_new: (a: number) => number;
  readonly treenode_get_value: (a: number) => number;
  readonly treenode_set_value: (a: number, b: number) => void;
  readonly __wbg_binarysearchtree_free: (a: number, b: number) => void;
  readonly binarysearchtree_insert: (a: number, b: number) => void;
  readonly binarysearchtree_search: (a: number, b: number) => number;
  readonly binarysearchtree_remove: (a: number, b: number) => number;
  readonly binarysearchtree_find_min: (a: number) => number;
  readonly binarysearchtree_find_max: (a: number) => number;
  readonly binarysearchtree_height: (a: number) => number;
  readonly binarysearchtree_len: (a: number) => number;
  readonly binarysearchtree_is_empty: (a: number) => number;
  readonly binarysearchtree_clear: (a: number) => void;
  readonly binarysearchtree_inorder_traversal: (a: number) => any;
  readonly binarysearchtree_preorder_traversal: (a: number) => any;
  readonly binarysearchtree_postorder_traversal: (a: number) => any;
  readonly binarysearchtree_level_order_traversal: (a: number) => any;
  readonly binarysearchtree_is_valid_bst: (a: number) => number;
  readonly binarysearchtree_from_array: (a: any) => number;
  readonly __wbg_avltree_free: (a: number, b: number) => void;
  readonly avltree_new: () => number;
  readonly avltree_insert: (a: number, b: number) => void;
  readonly avltree_search: (a: number, b: number) => number;
  readonly avltree_len: (a: number) => number;
  readonly avltree_height: (a: number) => number;
  readonly avltree_inorder_traversal: (a: number) => any;
  readonly fibonacci_memo: (a: number) => bigint;
  readonly knapsack_01: (a: any, b: any, c: number) => any;
  readonly longest_common_subsequence: (a: number, b: number, c: number, d: number) => any;
  readonly coin_change_min: (a: any, b: number) => any;
  readonly edit_distance: (a: number, b: number, c: number, d: number) => number;
  readonly longest_increasing_subsequence: (a: any) => any;
  readonly maximum_subarray_sum: (a: any) => any;
  readonly house_robber: (a: any) => number;
  readonly climbing_stairs: (a: number) => bigint;
  readonly unique_paths: (a: number, b: number) => bigint;
  readonly word_break: (a: number, b: number, c: any) => number;
  readonly min_palindrome_cuts: (a: number, b: number) => number;
  readonly matrix_chain_multiplication: (a: any) => number;
  readonly bevy_generate_ken_burns: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => any;
  readonly bevy_generate_transition: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => any;
  readonly bevy_generate_slideshow: (a: any, b: number, c: number, d: number, e: number) => any;
  readonly bevy_generate_parallax: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => any;
  readonly bubble_sort: (a: number, b: number) => any;
  readonly bubble_sort_with_steps: (a: number, b: number) => any;
  readonly selection_sort: (a: number, b: number) => any;
  readonly insertion_sort: (a: number, b: number) => any;
  readonly quick_sort: (a: number, b: number) => any;
  readonly merge_sort: (a: number, b: number) => any;
  readonly heap_sort: (a: number, b: number) => any;
  readonly counting_sort: (a: number, b: number) => any;
  readonly radix_sort: (a: number, b: number) => any;
  readonly bucket_sort: (a: number, b: number, c: number) => any;
  readonly shell_sort: (a: number, b: number) => any;
  readonly cocktail_sort: (a: number, b: number) => any;
  readonly is_sorted: (a: number, b: number) => number;
  readonly generate_random_array: (a: number, b: number) => any;
  readonly generate_sorted_array: (a: number) => any;
  readonly generate_reverse_sorted_array: (a: number) => any;
  readonly generate_nearly_sorted_array: (a: number, b: number) => any;
  readonly benchmark_sort: (a: number, b: number, c: number, d: number) => number;
  readonly compare_sorting_algorithms: (a: number, b: number) => any;
  readonly queue_with_capacity: (a: number) => number;
  readonly queue_enqueue: (a: number, b: number) => void;
  readonly queue_contains: (a: number, b: number) => number;
  readonly queue_from_array: (a: any) => number;
  readonly __wbg_circularqueue_free: (a: number, b: number) => void;
  readonly circularqueue_new: (a: number) => number;
  readonly circularqueue_enqueue: (a: number, b: number) => number;
  readonly circularqueue_dequeue: (a: number) => number;
  readonly circularqueue_front: (a: number) => number;
  readonly circularqueue_rear: (a: number) => number;
  readonly circularqueue_is_empty: (a: number) => number;
  readonly circularqueue_is_full: (a: number) => number;
  readonly circularqueue_len: (a: number) => number;
  readonly circularqueue_capacity: (a: number) => number;
  readonly circularqueue_clear: (a: number) => void;
  readonly circularqueue_get_front_index: (a: number) => number;
  readonly circularqueue_get_rear_index: (a: number) => number;
  readonly circularqueue_to_array: (a: number) => any;
  readonly circularqueue_get_raw_data: (a: number) => any;
  readonly __wbg_priorityqueue_free: (a: number, b: number) => void;
  readonly priorityqueue_new: () => number;
  readonly priorityqueue_enqueue: (a: number, b: number, c: number) => void;
  readonly priorityqueue_dequeue: (a: number) => number;
  readonly priorityqueue_peek: (a: number) => number;
  readonly priorityqueue_peek_priority: (a: number) => number;
  readonly priorityqueue_is_empty: (a: number) => number;
  readonly priorityqueue_len: (a: number) => number;
  readonly priorityqueue_clear: (a: number) => void;
  readonly priorityqueue_to_array: (a: number) => any;
  readonly deque_new: () => number;
  readonly deque_push_front: (a: number, b: number) => void;
  readonly deque_push_back: (a: number, b: number) => void;
  readonly deque_pop_front: (a: number) => number;
  readonly deque_pop_back: (a: number) => number;
  readonly deque_front: (a: number) => number;
  readonly deque_back: (a: number) => number;
  readonly deque_is_empty: (a: number) => number;
  readonly deque_len: (a: number) => number;
  readonly deque_clear: (a: number) => void;
  readonly deque_to_array: (a: number) => any;
  readonly bfs_traversal: (a: any, b: number) => any;
  readonly level_order_traversal: (a: any) => any;
  readonly sliding_window_maximum: (a: number, b: number, c: number) => any;
  readonly first_negative_in_window: (a: number, b: number, c: number) => any;
  readonly queueusingstacks_enqueue: (a: number, b: number) => void;
  readonly queueusingstacks_dequeue: (a: number) => number;
  readonly queueusingstacks_front: (a: number) => number;
  readonly queueusingstacks_is_empty: (a: number) => number;
  readonly queueusingstacks_len: (a: number) => number;
  readonly benchmark_queue_operations: (a: number, b: number, c: number) => number;
  readonly __wbg_rustvector_free: (a: number, b: number) => void;
  readonly rustvector_with_capacity: (a: number) => number;
  readonly rustvector_push: (a: number, b: number) => void;
  readonly rustvector_pop: (a: number) => number;
  readonly rustvector_get: (a: number, b: number) => number;
  readonly rustvector_set: (a: number, b: number, c: number) => number;
  readonly rustvector_insert: (a: number, b: number, c: number) => number;
  readonly rustvector_remove: (a: number, b: number) => number;
  readonly rustvector_len: (a: number) => number;
  readonly rustvector_capacity: (a: number) => number;
  readonly rustvector_is_empty: (a: number) => number;
  readonly rustvector_clear: (a: number) => void;
  readonly rustvector_reverse: (a: number) => void;
  readonly rustvector_to_array: (a: number) => any;
  readonly rustvector_from_array: (a: any) => number;
  readonly rustvector_contains: (a: number, b: number) => number;
  readonly rustvector_index_of: (a: number, b: number) => number;
  readonly rustvector_extend: (a: number, b: number) => void;
  readonly rustvector_clone_vector: (a: number) => number;
  readonly staticarray_new: (a: number) => number;
  readonly staticarray_get: (a: number, b: number) => number;
  readonly staticarray_set: (a: number, b: number, c: number) => number;
  readonly staticarray_len: (a: number) => number;
  readonly staticarray_fill: (a: number, b: number) => void;
  readonly staticarray_to_array: (a: number) => any;
  readonly array_sum: (a: number, b: number) => number;
  readonly array_max: (a: number, b: number) => number;
  readonly array_min: (a: number, b: number) => number;
  readonly array_reverse: (a: number, b: number) => any;
  readonly array_slice: (a: number, b: number, c: number, d: number) => any;
  readonly linear_search: (a: number, b: number, c: number) => number;
  readonly linear_search_with_steps: (a: number, b: number, c: number) => any;
  readonly binary_search: (a: number, b: number, c: number) => number;
  readonly binary_search_with_steps: (a: number, b: number, c: number) => any;
  readonly interpolation_search: (a: number, b: number, c: number) => number;
  readonly jump_search: (a: number, b: number, c: number) => number;
  readonly exponential_search: (a: number, b: number, c: number) => number;
  readonly ternary_search: (a: number, b: number, c: number) => number;
  readonly fibonacci_search: (a: number, b: number, c: number) => number;
  readonly find_first_occurrence: (a: number, b: number, c: number) => number;
  readonly find_last_occurrence: (a: number, b: number, c: number) => number;
  readonly count_occurrences: (a: number, b: number, c: number) => number;
  readonly find_peak_element: (a: number, b: number) => number;
  readonly search_rotated_array: (a: number, b: number, c: number) => number;
  readonly find_min_rotated_array: (a: number, b: number) => number;
  readonly search_2d_matrix: (a: any, b: number) => any;
  readonly benchmark_search: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly compare_search_algorithms: (a: number, b: number, c: number) => any;
  readonly generate_search_test_array: (a: number, b: number) => any;
  readonly __wbg_graph_free: (a: number, b: number) => void;
  readonly graph_new: (a: number) => number;
  readonly graph_add_vertex: (a: number, b: number) => void;
  readonly graph_add_edge: (a: number, b: number, c: number) => void;
  readonly graph_remove_vertex: (a: number, b: number) => number;
  readonly graph_remove_edge: (a: number, b: number, c: number) => number;
  readonly graph_has_vertex: (a: number, b: number) => number;
  readonly graph_has_edge: (a: number, b: number, c: number) => number;
  readonly graph_get_neighbors: (a: number, b: number) => any;
  readonly graph_get_vertices: (a: number) => any;
  readonly graph_vertex_count: (a: number) => number;
  readonly graph_edge_count: (a: number) => number;
  readonly graph_degree: (a: number, b: number) => number;
  readonly graph_dfs_traversal: (a: number, b: number) => any;
  readonly graph_bfs_traversal: (a: number, b: number) => any;
  readonly graph_has_path: (a: number, b: number, c: number) => number;
  readonly graph_shortest_path: (a: number, b: number, c: number) => any;
  readonly graph_is_connected: (a: number) => number;
  readonly graph_has_cycle: (a: number) => number;
  readonly graph_topological_sort: (a: number) => any;
  readonly __wbg_weightedgraph_free: (a: number, b: number) => void;
  readonly weightedgraph_add_vertex: (a: number, b: number) => void;
  readonly weightedgraph_add_edge: (a: number, b: number, c: number, d: number) => void;
  readonly weightedgraph_dijkstra: (a: number, b: number) => any;
  readonly weightedgraph_shortest_path_with_weights: (a: number, b: number, c: number) => any;
  readonly weightedgraph_get_vertices: (a: number) => any;
  readonly weightedgraph_get_edges: (a: number) => any;
  readonly bevy_get_all_presets: () => any;
  readonly bevy_get_preset_config: (a: number, b: number) => [number, number];
  readonly bevy_apply_cinematic_preset: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly bevy_suggest_effects: (a: number, b: number, c: number, d: number) => any;
  readonly bevy_create_preset_previews: (a: number, b: number, c: number, d: number) => any;
  readonly bevy_batch_process_preset: (a: any, b: number, c: number, d: number) => any;
  readonly bevy_animate_preset: (a: number, b: number, c: number, d: number, e: number, f: number) => any;
  readonly bevy_get_performance_metrics: () => any;
  readonly linkedlist_new: () => number;
  readonly binarysearchtree_new: () => number;
  readonly weightedgraph_new: (a: number) => number;
  readonly queue_new: () => number;
  readonly stringstack_new: () => number;
  readonly stack_new: () => number;
  readonly rustvector_new: () => number;
  readonly __wbg_queueusingstacks_free: (a: number, b: number) => void;
  readonly queue_clear: (a: number) => void;
  readonly __wbg_priorityqueueheap_free: (a: number, b: number) => void;
  readonly __wbg_queue_free: (a: number, b: number) => void;
  readonly __wbg_stack_free: (a: number, b: number) => void;
  readonly __wbg_staticarray_free: (a: number, b: number) => void;
  readonly stack_pop: (a: number) => number;
  readonly queueusingstacks_new: () => number;
  readonly priorityqueueheap_new: (a: number) => number;
  readonly priorityqueueheap_dequeue: (a: number) => number;
  readonly queue_dequeue: (a: number) => number;
  readonly simplehashmap_new: () => number;
  readonly is_sorted_for_search: (a: number, b: number) => number;
  readonly stack_capacity: (a: number) => number;
  readonly priorityqueueheap_enqueue: (a: number, b: number) => void;
  readonly stack_clear: (a: number) => void;
  readonly queue_to_array: (a: number) => any;
  readonly queue_len: (a: number) => number;
  readonly queue_is_empty: (a: number) => number;
  readonly queue_back: (a: number) => number;
  readonly queue_front: (a: number) => number;
  readonly stack_to_array: (a: number) => any;
  readonly stack_is_empty: (a: number) => number;
  readonly stack_len: (a: number) => number;
  readonly stack_contains: (a: number, b: number) => number;
  readonly stack_clone_stack: (a: number) => number;
  readonly __wbg_deque_free: (a: number, b: number) => void;
  readonly queue_capacity: (a: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_6: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h357b077c0154e0d6: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;

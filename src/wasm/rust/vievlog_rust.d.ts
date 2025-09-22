/* tslint:disable */
/* eslint-disable */
export function main(): void;
export function bubble_sort(arr: Int32Array): void;
export function bubble_sort_array(arr: Int32Array): Array<any>;
export function quick_sort_array(arr: Int32Array): Array<any>;
export function merge_sort_array(arr: Int32Array): Array<any>;
export function binary_search(arr: Int32Array, target: number): number | undefined;
export function binary_search_array(arr: Int32Array, target: number): any;
export function linear_search(arr: Int32Array, target: number): number | undefined;
export function linear_search_array(arr: Int32Array, target: number): any;
export function generate_random_array(size: number, max_value: number): Array<any>;
export function generate_sorted_array(size: number): Array<any>;
export function benchmark_sort(algorithm: string, arr: Int32Array): number;
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
export class BinarySearchTree {
  free(): void;
  constructor();
  insert(value: number): void;
  search(value: number): boolean;
  inorder_traversal(): Array<any>;
}
export class Graph {
  free(): void;
  constructor();
  add_vertex(vertex: number): void;
  add_edge(from: number, to: number): void;
  add_undirected_edge(vertex1: number, vertex2: number): void;
  get_neighbors(vertex: number): Array<any>;
  get_vertices(): Array<any>;
}
export class LinkedList {
  free(): void;
  constructor();
  push_front(value: number): void;
  pop_front(): number | undefined;
  len(): number;
  to_array(): Array<any>;
}
export class ListNode {
  private constructor();
  free(): void;
}
export class RustVector {
  free(): void;
  constructor();
  push(value: number): void;
  pop(): number | undefined;
  get(index: number): number | undefined;
  len(): number;
  to_array(): Array<any>;
}
export class TreeNode {
  free(): void;
  constructor(value: number);
  get_value(): number;
}

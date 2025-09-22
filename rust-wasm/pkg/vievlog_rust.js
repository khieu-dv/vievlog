let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

export function main() {
    wasm.main();
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Process image with Bevy ECS system
 * @param {Uint8Array} image_data
 * @param {string} effect_type
 * @param {number} intensity
 * @returns {Uint8Array}
 */
export function bevy_process_image(image_data, effect_type, intensity) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(effect_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_process_image(ptr0, len0, ptr1, len1, intensity);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Apply multiple effects in sequence
 * @param {Uint8Array} image_data
 * @param {string} effects_json
 * @returns {Uint8Array}
 */
export function bevy_process_image_multi(image_data, effects_json) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(effects_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_process_image_multi(ptr0, len0, ptr1, len1);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Create animated effect sequence
 * @param {Uint8Array} image_data
 * @param {string} effect_type
 * @param {number} frames
 * @param {number} intensity
 * @returns {Array<any>}
 */
export function bevy_create_animated_effect(image_data, effect_type, frames, intensity) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(effect_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_create_animated_effect(ptr0, len0, ptr1, len1, frames, intensity);
    return ret;
}

/**
 * Get available effect presets
 * @returns {object}
 */
export function bevy_get_effect_presets() {
    const ret = wasm.bevy_get_effect_presets();
    return ret;
}

/**
 * Apply preset effect combination
 * @param {Uint8Array} image_data
 * @param {string} preset_name
 * @returns {Uint8Array}
 */
export function bevy_apply_preset(image_data, preset_name) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(preset_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_apply_preset(ptr0, len0, ptr1, len1);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Process RGBA image data directly (no decoding needed)
 * @param {Uint8Array} rgba_data
 * @param {number} width
 * @param {number} height
 * @param {string} effect_type
 * @param {number} intensity
 * @returns {Uint8Array}
 */
export function bevy_process_rgba_image(rgba_data, width, height, effect_type, intensity) {
    const ptr0 = passArray8ToWasm0(rgba_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(effect_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_process_rgba_image(ptr0, len0, width, height, ptr1, len1, intensity);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Simple image resize function
 * @param {Uint8Array} rgba_data
 * @param {number} old_width
 * @param {number} old_height
 * @param {number} new_width
 * @param {number} new_height
 * @returns {Uint8Array}
 */
export function bevy_resize_image(rgba_data, old_width, old_height, new_width, new_height) {
    const ptr0 = passArray8ToWasm0(rgba_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_resize_image(ptr0, len0, old_width, old_height, new_width, new_height);
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * Dijkstra's shortest path algorithm
 * @param {Array<any>} vertices
 * @param {Array<any>} edges
 * @param {number} start
 * @param {number} end
 * @returns {Array<any>}
 */
export function dijkstra_shortest_path(vertices, edges, start, end) {
    const ret = wasm.dijkstra_shortest_path(vertices, edges, start, end);
    return ret;
}

/**
 * Breadth-First Search
 * @param {Array<any>} adjacency_list
 * @param {number} start
 * @returns {Array<any>}
 */
export function bfs_graph_traversal(adjacency_list, start) {
    const ret = wasm.bfs_graph_traversal(adjacency_list, start);
    return ret;
}

/**
 * Depth-First Search
 * @param {Array<any>} adjacency_list
 * @param {number} start
 * @returns {Array<any>}
 */
export function dfs_graph_traversal(adjacency_list, start) {
    const ret = wasm.dfs_graph_traversal(adjacency_list, start);
    return ret;
}

/**
 * Topological Sort (Kahn's algorithm)
 * @param {Array<any>} vertices
 * @param {Array<any>} edges
 * @returns {Array<any>}
 */
export function topological_sort(vertices, edges) {
    const ret = wasm.topological_sort(vertices, edges);
    return ret;
}

/**
 * Detect cycle in directed graph
 * @param {Array<any>} vertices
 * @param {Array<any>} edges
 * @returns {boolean}
 */
export function has_cycle_directed(vertices, edges) {
    const ret = wasm.has_cycle_directed(vertices, edges);
    return ret !== 0;
}

/**
 * Find strongly connected components (Kosaraju's algorithm)
 * @param {Array<any>} vertices
 * @param {Array<any>} edges
 * @returns {Array<any>}
 */
export function strongly_connected_components(vertices, edges) {
    const ret = wasm.strongly_connected_components(vertices, edges);
    return ret;
}

/**
 * Minimum Spanning Tree - Kruskal's algorithm
 * @param {Array<any>} vertices
 * @param {Array<any>} edges
 * @returns {Array<any>}
 */
export function minimum_spanning_tree_kruskal(vertices, edges) {
    const ret = wasm.minimum_spanning_tree_kruskal(vertices, edges);
    return ret;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Heap Sort implementation from heaps module
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function heap_sort_heaps(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.heap_sort_heaps(ptr0, len0);
    return ret;
}

/**
 * K Largest Elements
 * @param {Int32Array} arr
 * @param {number} k
 * @returns {Array<any>}
 */
export function find_k_largest(arr, k) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_k_largest(ptr0, len0, k);
    return ret;
}

/**
 * K Smallest Elements
 * @param {Int32Array} arr
 * @param {number} k
 * @returns {Array<any>}
 */
export function find_k_smallest(arr, k) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_k_smallest(ptr0, len0, k);
    return ret;
}

/**
 * Check if array represents a valid heap
 * @param {Int32Array} arr
 * @param {boolean} is_max_heap
 * @returns {boolean}
 */
export function is_heap(arr, is_max_heap) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_heap(ptr0, len0, is_max_heap);
    return ret !== 0;
}

/**
 * Merge K Sorted Arrays using heap
 * @param {Array<any>} arrays
 * @returns {Array<any>}
 */
export function merge_k_sorted_arrays(arrays) {
    const ret = wasm.merge_k_sorted_arrays(arrays);
    return ret;
}

/**
 * Performance benchmark for heap operations
 * @param {string} operation
 * @param {number} iterations
 * @param {boolean} is_max_heap
 * @returns {number}
 */
export function benchmark_heap_operations(operation, iterations, is_max_heap) {
    const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_heap_operations(ptr0, len0, iterations, is_max_heap);
    return ret;
}

/**
 * Stack utilities and algorithms
 * Check if parentheses are balanced
 * @param {string} expression
 * @returns {boolean}
 */
export function is_balanced_parentheses(expression) {
    const ptr0 = passStringToWasm0(expression, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_balanced_parentheses(ptr0, len0);
    return ret !== 0;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * Evaluate postfix expression
 * @param {string} expression
 * @returns {number}
 */
export function evaluate_postfix(expression) {
    const ptr0 = passStringToWasm0(expression, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.evaluate_postfix(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * Convert infix to postfix notation
 * @param {string} expression
 * @returns {string}
 */
export function infix_to_postfix(expression) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(expression, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.infix_to_postfix(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Reverse a string using stack
 * @param {string} input
 * @returns {string}
 */
export function reverse_string(input) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.reverse_string(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Check if a string is palindrome using stack
 * @param {string} input
 * @returns {boolean}
 */
export function is_palindrome_stack(input) {
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_palindrome_stack(ptr0, len0);
    return ret !== 0;
}

/**
 * Next Greater Element using stack
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function next_greater_elements(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.next_greater_elements(ptr0, len0);
    return ret;
}

/**
 * Stock span problem using stack
 * @param {Int32Array} prices
 * @returns {Array<any>}
 */
export function calculate_stock_spans(prices) {
    const ptr0 = passArray32ToWasm0(prices, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.calculate_stock_spans(ptr0, len0);
    return ret;
}

/**
 * Largest rectangle in histogram using stack
 * @param {Int32Array} heights
 * @returns {number}
 */
export function largest_rectangle_area(heights) {
    const ptr0 = passArray32ToWasm0(heights, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.largest_rectangle_area(ptr0, len0);
    return ret;
}

/**
 * Performance benchmark for stack operations
 * @param {string} operation
 * @param {number} iterations
 * @returns {number}
 */
export function benchmark_stack_operations(operation, iterations) {
    const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_stack_operations(ptr0, len0, iterations);
    return ret;
}

/**
 * Hash function utilities
 * @param {string} input
 * @returns {bigint}
 */
export function hash_string(input) {
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.hash_string(ptr0, len0);
    return BigInt.asUintN(64, ret);
}

/**
 * @param {string} input
 * @param {number} modulo
 * @returns {number}
 */
export function hash_string_with_modulo(input, modulo) {
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.hash_string_with_modulo(ptr0, len0, modulo);
    return ret >>> 0;
}

/**
 * Simple hash function for demonstration
 * @param {string} input
 * @param {number} table_size
 * @returns {number}
 */
export function simple_hash(input, table_size) {
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.simple_hash(ptr0, len0, table_size);
    return ret >>> 0;
}

/**
 * Performance test: hash operations
 * @param {string} operation
 * @param {number} iterations
 * @returns {number}
 */
export function benchmark_hash_operations(operation, iterations) {
    const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_hash_operations(ptr0, len0, iterations);
    return ret;
}

/**
 * Fibonacci with memoization
 * @param {number} n
 * @returns {bigint}
 */
export function fibonacci_memo(n) {
    const ret = wasm.fibonacci_memo(n);
    return BigInt.asUintN(64, ret);
}

/**
 * 0/1 Knapsack Problem
 * @param {Array<any>} weights
 * @param {Array<any>} values
 * @param {number} capacity
 * @returns {Array<any>}
 */
export function knapsack_01(weights, values, capacity) {
    const ret = wasm.knapsack_01(weights, values, capacity);
    return ret;
}

/**
 * Longest Common Subsequence
 * @param {string} text1
 * @param {string} text2
 * @returns {Array<any>}
 */
export function longest_common_subsequence(text1, text2) {
    const ptr0 = passStringToWasm0(text1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(text2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.longest_common_subsequence(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * Coin Change Problem (minimum coins)
 * @param {Array<any>} coins
 * @param {number} amount
 * @returns {Array<any>}
 */
export function coin_change_min(coins, amount) {
    const ret = wasm.coin_change_min(coins, amount);
    return ret;
}

/**
 * Edit Distance (Levenshtein Distance)
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 */
export function edit_distance(word1, word2) {
    const ptr0 = passStringToWasm0(word1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(word2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.edit_distance(ptr0, len0, ptr1, len1);
    return ret >>> 0;
}

/**
 * Longest Increasing Subsequence
 * @param {Array<any>} arr
 * @returns {Array<any>}
 */
export function longest_increasing_subsequence(arr) {
    const ret = wasm.longest_increasing_subsequence(arr);
    return ret;
}

/**
 * Maximum Subarray Sum (Kadane's Algorithm)
 * @param {Array<any>} arr
 * @returns {Array<any>}
 */
export function maximum_subarray_sum(arr) {
    const ret = wasm.maximum_subarray_sum(arr);
    return ret;
}

/**
 * House Robber Problem
 * @param {Array<any>} houses
 * @returns {number}
 */
export function house_robber(houses) {
    const ret = wasm.house_robber(houses);
    return ret >>> 0;
}

/**
 * Climbing Stairs Problem
 * @param {number} n
 * @returns {bigint}
 */
export function climbing_stairs(n) {
    const ret = wasm.climbing_stairs(n);
    return BigInt.asUintN(64, ret);
}

/**
 * Unique Paths in Grid
 * @param {number} m
 * @param {number} n
 * @returns {bigint}
 */
export function unique_paths(m, n) {
    const ret = wasm.unique_paths(m, n);
    return BigInt.asUintN(64, ret);
}

/**
 * Word Break Problem
 * @param {string} s
 * @param {Array<any>} word_dict
 * @returns {boolean}
 */
export function word_break(s, word_dict) {
    const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.word_break(ptr0, len0, word_dict);
    return ret !== 0;
}

/**
 * Palindrome Partitioning (minimum cuts)
 * @param {string} s
 * @returns {number}
 */
export function min_palindrome_cuts(s) {
    const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.min_palindrome_cuts(ptr0, len0);
    return ret >>> 0;
}

/**
 * Matrix Chain Multiplication
 * @param {Array<any>} dimensions
 * @returns {number}
 */
export function matrix_chain_multiplication(dimensions) {
    const ret = wasm.matrix_chain_multiplication(dimensions);
    return ret >>> 0;
}

/**
 * Generate video frames with Ken Burns effect (pan and zoom)
 * @param {Uint8Array} rgba_data
 * @param {number} width
 * @param {number} height
 * @param {number} frames
 * @param {number} zoom_factor
 * @param {number} pan_x
 * @param {number} pan_y
 * @returns {Array<any>}
 */
export function bevy_generate_ken_burns(rgba_data, width, height, frames, zoom_factor, pan_x, pan_y) {
    const ptr0 = passArray8ToWasm0(rgba_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_generate_ken_burns(ptr0, len0, width, height, frames, zoom_factor, pan_x, pan_y);
    return ret;
}

/**
 * Generate transition frames between two images
 * @param {Uint8Array} rgba_data1
 * @param {Uint8Array} rgba_data2
 * @param {number} width
 * @param {number} height
 * @param {number} frames
 * @param {string} transition_type
 * @returns {Array<any>}
 */
export function bevy_generate_transition(rgba_data1, rgba_data2, width, height, frames, transition_type) {
    const ptr0 = passArray8ToWasm0(rgba_data1, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(rgba_data2, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(transition_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_generate_transition(ptr0, len0, ptr1, len1, width, height, frames, ptr2, len2);
    return ret;
}

/**
 * Generate slideshow from multiple images with effects
 * @param {Array<any>} images_data
 * @param {number} frames_per_image
 * @param {number} transition_frames
 * @param {string} transition_type
 * @returns {Array<any>}
 */
export function bevy_generate_slideshow(images_data, frames_per_image, transition_frames, transition_type) {
    const ptr0 = passStringToWasm0(transition_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_generate_slideshow(images_data, frames_per_image, transition_frames, ptr0, len0);
    return ret;
}

/**
 * Generate parallax scrolling effect
 * @param {Uint8Array} bg_data
 * @param {Uint8Array} fg_data
 * @param {number} width
 * @param {number} height
 * @param {number} frames
 * @param {number} scroll_speed
 * @returns {Array<any>}
 */
export function bevy_generate_parallax(bg_data, fg_data, width, height, frames, scroll_speed) {
    const ptr0 = passArray8ToWasm0(bg_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(fg_data, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_generate_parallax(ptr0, len0, ptr1, len1, width, height, frames, scroll_speed);
    return ret;
}

/**
 * Bubble Sort - O(n²) time complexity
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function bubble_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bubble_sort(ptr0, len0);
    return ret;
}

/**
 * Bubble Sort with step tracking
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function bubble_sort_with_steps(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bubble_sort_with_steps(ptr0, len0);
    return ret;
}

/**
 * Selection Sort - O(n²) time complexity
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function selection_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.selection_sort(ptr0, len0);
    return ret;
}

/**
 * Insertion Sort - O(n²) time complexity, good for small arrays
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function insertion_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.insertion_sort(ptr0, len0);
    return ret;
}

/**
 * Quick Sort - O(n log n) average, O(n²) worst case
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function quick_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.quick_sort(ptr0, len0);
    return ret;
}

/**
 * Merge Sort - O(n log n) time complexity, stable
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function merge_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.merge_sort(ptr0, len0);
    return ret;
}

/**
 * Heap Sort - O(n log n) time complexity, in-place
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function heap_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.heap_sort(ptr0, len0);
    return ret;
}

/**
 * Counting Sort - O(n + k) time complexity for small ranges
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function counting_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.counting_sort(ptr0, len0);
    return ret;
}

/**
 * Radix Sort - O(d * (n + k)) where d is number of digits
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function radix_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.radix_sort(ptr0, len0);
    return ret;
}

let cachedFloat64ArrayMemory0 = null;

function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Bucket Sort - O(n + k) average case
 * @param {Float64Array} arr
 * @param {number} bucket_count
 * @returns {Array<any>}
 */
export function bucket_sort(arr, bucket_count) {
    const ptr0 = passArrayF64ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bucket_sort(ptr0, len0, bucket_count);
    return ret;
}

/**
 * Shell Sort - O(n^1.5) average case
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function shell_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.shell_sort(ptr0, len0);
    return ret;
}

/**
 * Cocktail Shaker Sort (Bidirectional Bubble Sort)
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function cocktail_sort(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.cocktail_sort(ptr0, len0);
    return ret;
}

/**
 * Utility functions for sorting analysis
 * Check if array is sorted
 * @param {Int32Array} arr
 * @returns {boolean}
 */
export function is_sorted(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_sorted(ptr0, len0);
    return ret !== 0;
}

/**
 * Generate different types of test arrays
 * @param {number} size
 * @param {number} max_value
 * @returns {Array<any>}
 */
export function generate_random_array(size, max_value) {
    const ret = wasm.generate_random_array(size, max_value);
    return ret;
}

/**
 * @param {number} size
 * @returns {Array<any>}
 */
export function generate_sorted_array(size) {
    const ret = wasm.generate_sorted_array(size);
    return ret;
}

/**
 * @param {number} size
 * @returns {Array<any>}
 */
export function generate_reverse_sorted_array(size) {
    const ret = wasm.generate_reverse_sorted_array(size);
    return ret;
}

/**
 * @param {number} size
 * @param {number} swap_count
 * @returns {Array<any>}
 */
export function generate_nearly_sorted_array(size, swap_count) {
    const ret = wasm.generate_nearly_sorted_array(size, swap_count);
    return ret;
}

/**
 * Performance benchmark for sorting algorithms
 * @param {string} algorithm
 * @param {Int32Array} arr
 * @returns {number}
 */
export function benchmark_sort(algorithm, arr) {
    const ptr0 = passStringToWasm0(algorithm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_sort(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * Compare multiple sorting algorithms
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function compare_sorting_algorithms(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compare_sorting_algorithms(ptr0, len0);
    return ret;
}

/**
 * Queue algorithms and utilities
 * Breadth-First Search using queue
 * @param {Array<any>} adj_list
 * @param {number} start
 * @returns {Array<any>}
 */
export function bfs_traversal(adj_list, start) {
    const ret = wasm.bfs_traversal(adj_list, start);
    return ret;
}

/**
 * Level order traversal of binary tree
 * @param {Array<any>} tree_array
 * @returns {Array<any>}
 */
export function level_order_traversal(tree_array) {
    const ret = wasm.level_order_traversal(tree_array);
    return ret;
}

/**
 * Sliding window maximum using deque
 * @param {Int32Array} arr
 * @param {number} window_size
 * @returns {Array<any>}
 */
export function sliding_window_maximum(arr, window_size) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sliding_window_maximum(ptr0, len0, window_size);
    return ret;
}

/**
 * First negative integer in every window
 * @param {Int32Array} arr
 * @param {number} window_size
 * @returns {Array<any>}
 */
export function first_negative_in_window(arr, window_size) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.first_negative_in_window(ptr0, len0, window_size);
    return ret;
}

/**
 * Performance benchmark for queue operations
 * @param {string} operation
 * @param {number} iterations
 * @returns {number}
 */
export function benchmark_queue_operations(operation, iterations) {
    const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_queue_operations(ptr0, len0, iterations);
    return ret;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * Utility functions for array operations
 * @param {Int32Array} arr
 * @returns {number}
 */
export function array_sum(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.array_sum(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} arr
 * @returns {number | undefined}
 */
export function array_max(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.array_max(ptr0, len0);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * @param {Int32Array} arr
 * @returns {number | undefined}
 */
export function array_min(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.array_min(ptr0, len0);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function array_reverse(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.array_reverse(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} arr
 * @param {number} start
 * @param {number} end
 * @returns {Array<any>}
 */
export function array_slice(arr, start, end) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.array_slice(ptr0, len0, start, end);
    return ret;
}

/**
 * Linear Search - O(n) time complexity
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function linear_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.linear_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Linear Search with step tracking
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {Array<any>}
 */
export function linear_search_with_steps(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.linear_search_with_steps(ptr0, len0, target);
    return ret;
}

/**
 * Binary Search - O(log n) time complexity, requires sorted array
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function binary_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.binary_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Binary Search with step tracking
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {Array<any>}
 */
export function binary_search_with_steps(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.binary_search_with_steps(ptr0, len0, target);
    return ret;
}

/**
 * Interpolation Search - O(log log n) for uniformly distributed data
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function interpolation_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.interpolation_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Jump Search - O(√n) time complexity
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function jump_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.jump_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Exponential Search - O(log n) time complexity
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function exponential_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.exponential_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Ternary Search - O(log₃ n) time complexity
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function ternary_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.ternary_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Fibonacci Search - O(log n) time complexity
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function fibonacci_search(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fibonacci_search(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Find first occurrence of target in sorted array with duplicates
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function find_first_occurrence(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_first_occurrence(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Find last occurrence of target in sorted array with duplicates
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function find_last_occurrence(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_last_occurrence(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Count occurrences of target in sorted array
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number}
 */
export function count_occurrences(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.count_occurrences(ptr0, len0, target);
    return ret >>> 0;
}

/**
 * Find peak element in array (element that is greater than its neighbors)
 * @param {Int32Array} arr
 * @returns {number | undefined}
 */
export function find_peak_element(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_peak_element(ptr0, len0);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Search in rotated sorted array
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number | undefined}
 */
export function search_rotated_array(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.search_rotated_array(ptr0, len0, target);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Find minimum element in rotated sorted array
 * @param {Int32Array} arr
 * @returns {number | undefined}
 */
export function find_min_rotated_array(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.find_min_rotated_array(ptr0, len0);
    return ret === 0x100000001 ? undefined : ret;
}

/**
 * Search for target in 2D matrix (sorted row-wise and column-wise)
 * @param {Array<any>} matrix
 * @param {number} target
 * @returns {Array<any>}
 */
export function search_2d_matrix(matrix, target) {
    const ret = wasm.search_2d_matrix(matrix, target);
    return ret;
}

/**
 * Performance benchmark for searching algorithms
 * @param {string} algorithm
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {number}
 */
export function benchmark_search(algorithm, arr, target) {
    const ptr0 = passStringToWasm0(algorithm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.benchmark_search(ptr0, len0, ptr1, len1, target);
    return ret;
}

/**
 * Compare multiple searching algorithms
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {Array<any>}
 */
export function compare_search_algorithms(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compare_search_algorithms(ptr0, len0, target);
    return ret;
}

/**
 * Utility functions
 * Check if array is sorted (required for some search algorithms)
 * @param {Int32Array} arr
 * @returns {boolean}
 */
export function is_sorted_for_search(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_sorted(ptr0, len0);
    return ret !== 0;
}

/**
 * Generate test cases for searching
 * @param {number} size
 * @param {number} max_value
 * @returns {Array<any>}
 */
export function generate_search_test_array(size, max_value) {
    const ret = wasm.generate_search_test_array(size, max_value);
    return ret;
}

/**
 * Get all available effect presets
 * @returns {Array<any>}
 */
export function bevy_get_all_presets() {
    const ret = wasm.bevy_get_all_presets();
    return ret;
}

/**
 * Get preset configuration as JSON string
 * @param {string} preset_name
 * @returns {string}
 */
export function bevy_get_preset_config(preset_name) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(preset_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.bevy_get_preset_config(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Apply professional cinematic preset
 * @param {Uint8Array} image_data
 * @param {string} preset_name
 * @param {number} intensity
 * @returns {Uint8Array}
 */
export function bevy_apply_cinematic_preset(image_data, preset_name, intensity) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(preset_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_apply_cinematic_preset(ptr0, len0, ptr1, len1, intensity);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Create effect suggestion based on image analysis
 * @param {Uint8Array} rgba_data
 * @param {number} width
 * @param {number} height
 * @returns {Array<any>}
 */
export function bevy_suggest_effects(rgba_data, width, height) {
    const ptr0 = passArray8ToWasm0(rgba_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_suggest_effects(ptr0, len0, width, height);
    return ret;
}

/**
 * Create effect preview thumbnails for all presets
 * @param {Uint8Array} image_data
 * @param {number} thumbnail_width
 * @param {number} thumbnail_height
 * @returns {object}
 */
export function bevy_create_preset_previews(image_data, thumbnail_width, thumbnail_height) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_create_preset_previews(ptr0, len0, thumbnail_width, thumbnail_height);
    return ret;
}

/**
 * Batch process multiple images with same effect
 * @param {Array<any>} images_array
 * @param {string} preset_name
 * @param {number} intensity
 * @returns {Array<any>}
 */
export function bevy_batch_process_preset(images_array, preset_name, intensity) {
    const ptr0 = passStringToWasm0(preset_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_batch_process_preset(images_array, ptr0, len0, intensity);
    return ret;
}

/**
 * Create animated preset sequence
 * @param {Uint8Array} image_data
 * @param {string} preset_name
 * @param {number} frames
 * @param {number} max_intensity
 * @returns {Array<any>}
 */
export function bevy_animate_preset(image_data, preset_name, frames, max_intensity) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(preset_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bevy_animate_preset(ptr0, len0, ptr1, len1, frames, max_intensity);
    return ret;
}

/**
 * Get effect performance metrics
 * @returns {object}
 */
export function bevy_get_performance_metrics() {
    const ret = wasm.bevy_get_performance_metrics();
    return ret;
}

function __wbg_adapter_26(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h357b077c0154e0d6(arg0, arg1);
}

const AVLTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_avltree_free(ptr >>> 0, 1));
/**
 * AVL Tree (Self-balancing binary search tree)
 */
export class AVLTree {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AVLTreeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_avltree_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.avltree_new();
        this.__wbg_ptr = ret >>> 0;
        AVLTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} value
     */
    insert(value) {
        wasm.avltree_insert(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     * @returns {boolean}
     */
    search(value) {
        const ret = wasm.avltree_search(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.avltree_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    height() {
        const ret = wasm.avltree_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    inorder_traversal() {
        const ret = wasm.avltree_inorder_traversal(this.__wbg_ptr);
        return ret;
    }
}

const BinaryHeapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_binaryheap_free(ptr >>> 0, 1));
/**
 * Binary Heap implementation (Min-Heap by default)
 */
export class BinaryHeap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BinaryHeap.prototype);
        obj.__wbg_ptr = ptr;
        BinaryHeapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BinaryHeapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_binaryheap_free(ptr, 0);
    }
    /**
     * @param {boolean} is_max_heap
     */
    constructor(is_max_heap) {
        const ret = wasm.binaryheap_new(is_max_heap);
        this.__wbg_ptr = ret >>> 0;
        BinaryHeapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} capacity
     * @param {boolean} is_max_heap
     * @returns {BinaryHeap}
     */
    static with_capacity(capacity, is_max_heap) {
        const ret = wasm.binaryheap_with_capacity(capacity, is_max_heap);
        return BinaryHeap.__wrap(ret);
    }
    /**
     * @param {number} item
     */
    insert(item) {
        wasm.binaryheap_insert(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    extract() {
        const ret = wasm.binaryheap_extract(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek() {
        const ret = wasm.binaryheap_peek(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.binaryheap_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.binaryheap_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.binaryheap_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.binaryheap_clear(this.__wbg_ptr);
    }
    /**
     * @returns {boolean}
     */
    is_max_heap() {
        const ret = wasm.binaryheap_is_max_heap(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} is_max_heap
     */
    change_heap_type(is_max_heap) {
        wasm.binaryheap_change_heap_type(this.__wbg_ptr, is_max_heap);
    }
    /**
     * @param {Int32Array} arr
     */
    build_heap(arr) {
        const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.binaryheap_build_heap(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.binaryheap_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @param {boolean} is_max_heap
     * @returns {BinaryHeap}
     */
    static from_array(arr, is_max_heap) {
        const ret = wasm.binaryheap_from_array(arr, is_max_heap);
        return BinaryHeap.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_valid_heap() {
        const ret = wasm.binaryheap_is_valid_heap(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get_parent(index) {
        const ret = wasm.binaryheap_get_parent(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get_left_child(index) {
        const ret = wasm.binaryheap_get_left_child(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get_right_child(index) {
        const ret = wasm.binaryheap_get_right_child(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    height() {
        const ret = wasm.binaryheap_height(this.__wbg_ptr);
        return ret;
    }
}

const BinarySearchTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_binarysearchtree_free(ptr >>> 0, 1));
/**
 * Binary Search Tree
 */
export class BinarySearchTree {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BinarySearchTree.prototype);
        obj.__wbg_ptr = ptr;
        BinarySearchTreeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BinarySearchTreeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_binarysearchtree_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.avltree_new();
        this.__wbg_ptr = ret >>> 0;
        BinarySearchTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} value
     */
    insert(value) {
        wasm.binarysearchtree_insert(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     * @returns {boolean}
     */
    search(value) {
        const ret = wasm.binarysearchtree_search(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @param {number} value
     * @returns {boolean}
     */
    remove(value) {
        const ret = wasm.binarysearchtree_remove(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @returns {number | undefined}
     */
    find_min() {
        const ret = wasm.binarysearchtree_find_min(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    find_max() {
        const ret = wasm.binarysearchtree_find_max(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    height() {
        const ret = wasm.binarysearchtree_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.binarysearchtree_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.binarysearchtree_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.binarysearchtree_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    inorder_traversal() {
        const ret = wasm.binarysearchtree_inorder_traversal(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    preorder_traversal() {
        const ret = wasm.binarysearchtree_preorder_traversal(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    postorder_traversal() {
        const ret = wasm.binarysearchtree_postorder_traversal(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    level_order_traversal() {
        const ret = wasm.binarysearchtree_level_order_traversal(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    is_valid_bst() {
        const ret = wasm.binarysearchtree_is_valid_bst(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {Array<any>} arr
     * @returns {BinarySearchTree}
     */
    static from_array(arr) {
        const ret = wasm.binarysearchtree_from_array(arr);
        return BinarySearchTree.__wrap(ret);
    }
}

const CircularQueueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_circularqueue_free(ptr >>> 0, 1));
/**
 * Circular Queue with fixed capacity
 */
export class CircularQueue {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CircularQueueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_circularqueue_free(ptr, 0);
    }
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        const ret = wasm.circularqueue_new(capacity);
        this.__wbg_ptr = ret >>> 0;
        CircularQueueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} item
     * @returns {boolean}
     */
    enqueue(item) {
        const ret = wasm.circularqueue_enqueue(this.__wbg_ptr, item);
        return ret !== 0;
    }
    /**
     * @returns {number | undefined}
     */
    dequeue() {
        const ret = wasm.circularqueue_dequeue(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    front() {
        const ret = wasm.circularqueue_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    rear() {
        const ret = wasm.circularqueue_rear(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.circularqueue_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_full() {
        const ret = wasm.circularqueue_is_full(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.circularqueue_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.circularqueue_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.circularqueue_clear(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get_front_index() {
        const ret = wasm.circularqueue_get_front_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_rear_index() {
        const ret = wasm.circularqueue_get_rear_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.circularqueue_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get_raw_data() {
        const ret = wasm.circularqueue_get_raw_data(this.__wbg_ptr);
        return ret;
    }
}

const DequeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_deque_free(ptr >>> 0, 1));
/**
 * Deque (Double-ended queue)
 */
export class Deque {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DequeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_deque_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.deque_new();
        this.__wbg_ptr = ret >>> 0;
        DequeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} item
     */
    push_front(item) {
        wasm.deque_push_front(this.__wbg_ptr, item);
    }
    /**
     * @param {number} item
     */
    push_back(item) {
        wasm.deque_push_back(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    pop_front() {
        const ret = wasm.deque_pop_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    pop_back() {
        const ret = wasm.deque_pop_back(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    front() {
        const ret = wasm.deque_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    back() {
        const ret = wasm.deque_back(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.deque_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.deque_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.deque_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.deque_to_array(this.__wbg_ptr);
        return ret;
    }
}

const DoublyLinkedListFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_doublylinkedlist_free(ptr >>> 0, 1));
/**
 * Doubly Linked List
 */
export class DoublyLinkedList {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DoublyLinkedListFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_doublylinkedlist_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.doublylinkedlist_new();
        this.__wbg_ptr = ret >>> 0;
        DoublyLinkedListFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} value
     */
    push_front(value) {
        wasm.doublylinkedlist_push_front(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    push_back(value) {
        wasm.doublylinkedlist_push_back(this.__wbg_ptr, value);
    }
    /**
     * @returns {number | undefined}
     */
    pop_front() {
        const ret = wasm.doublylinkedlist_pop_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.doublylinkedlist_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.doublylinkedlist_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.doublylinkedlist_to_array(this.__wbg_ptr);
        return ret;
    }
}

const GraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_graph_free(ptr >>> 0, 1));
/**
 * Graph using adjacency list representation
 */
export class Graph {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GraphFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_graph_free(ptr, 0);
    }
    /**
     * @param {boolean} is_directed
     */
    constructor(is_directed) {
        const ret = wasm.graph_new(is_directed);
        this.__wbg_ptr = ret >>> 0;
        GraphFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} vertex
     */
    add_vertex(vertex) {
        wasm.graph_add_vertex(this.__wbg_ptr, vertex);
    }
    /**
     * @param {number} from
     * @param {number} to
     */
    add_edge(from, to) {
        wasm.graph_add_edge(this.__wbg_ptr, from, to);
    }
    /**
     * @param {number} vertex
     * @returns {boolean}
     */
    remove_vertex(vertex) {
        const ret = wasm.graph_remove_vertex(this.__wbg_ptr, vertex);
        return ret !== 0;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @returns {boolean}
     */
    remove_edge(from, to) {
        const ret = wasm.graph_remove_edge(this.__wbg_ptr, from, to);
        return ret !== 0;
    }
    /**
     * @param {number} vertex
     * @returns {boolean}
     */
    has_vertex(vertex) {
        const ret = wasm.graph_has_vertex(this.__wbg_ptr, vertex);
        return ret !== 0;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @returns {boolean}
     */
    has_edge(from, to) {
        const ret = wasm.graph_has_edge(this.__wbg_ptr, from, to);
        return ret !== 0;
    }
    /**
     * @param {number} vertex
     * @returns {Array<any>}
     */
    get_neighbors(vertex) {
        const ret = wasm.graph_get_neighbors(this.__wbg_ptr, vertex);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get_vertices() {
        const ret = wasm.graph_get_vertices(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    vertex_count() {
        const ret = wasm.graph_vertex_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    edge_count() {
        const ret = wasm.graph_edge_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} vertex
     * @returns {number | undefined}
     */
    degree(vertex) {
        const ret = wasm.graph_degree(this.__wbg_ptr, vertex);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} start
     * @returns {Array<any>}
     */
    dfs_traversal(start) {
        const ret = wasm.graph_dfs_traversal(this.__wbg_ptr, start);
        return ret;
    }
    /**
     * @param {number} start
     * @returns {Array<any>}
     */
    bfs_traversal(start) {
        const ret = wasm.graph_bfs_traversal(this.__wbg_ptr, start);
        return ret;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @returns {boolean}
     */
    has_path(from, to) {
        const ret = wasm.graph_has_path(this.__wbg_ptr, from, to);
        return ret !== 0;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @returns {Array<any>}
     */
    shortest_path(from, to) {
        const ret = wasm.graph_shortest_path(this.__wbg_ptr, from, to);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    is_connected() {
        const ret = wasm.graph_is_connected(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    has_cycle() {
        const ret = wasm.graph_has_cycle(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Array<any>}
     */
    topological_sort() {
        const ret = wasm.graph_topological_sort(this.__wbg_ptr);
        return ret;
    }
}

const HashTableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hashtable_free(ptr >>> 0, 1));
/**
 * Hash Table with chaining collision resolution
 */
export class HashTable {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashTableFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hashtable_free(ptr, 0);
    }
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        const ret = wasm.hashtable_new(capacity);
        this.__wbg_ptr = ret >>> 0;
        HashTableFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    insert(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.hashtable_insert(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    get(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hashtable_get(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    remove(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hashtable_remove(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
    contains_key(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hashtable_contains_key(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.hashtable_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.hashtable_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.hashtable_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.hashtable_clear(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    load_factor() {
        const ret = wasm.hashtable_load_factor(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.hashtable_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    values() {
        const ret = wasm.hashtable_values(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    entries() {
        const ret = wasm.hashtable_entries(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    bucket_sizes() {
        const ret = wasm.hashtable_bucket_sizes(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    max_bucket_size() {
        const ret = wasm.hashtable_max_bucket_size(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const IntHashMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_inthashmap_free(ptr >>> 0, 1));
/**
 * Integer HashMap for performance testing
 */
export class IntHashMap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IntHashMap.prototype);
        obj.__wbg_ptr = ptr;
        IntHashMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntHashMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_inthashmap_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.inthashmap_new();
        this.__wbg_ptr = ret >>> 0;
        IntHashMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} key
     * @param {number} value
     * @returns {number | undefined}
     */
    insert(key, value) {
        const ret = wasm.inthashmap_insert(this.__wbg_ptr, key, value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} key
     * @returns {number | undefined}
     */
    get(key) {
        const ret = wasm.inthashmap_get(this.__wbg_ptr, key);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} key
     * @returns {number | undefined}
     */
    remove(key) {
        const ret = wasm.inthashmap_remove(this.__wbg_ptr, key);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} key
     * @returns {boolean}
     */
    contains_key(key) {
        const ret = wasm.inthashmap_contains_key(this.__wbg_ptr, key);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.inthashmap_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.inthashmap_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.inthashmap_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.inthashmap_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    values() {
        const ret = wasm.inthashmap_values(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    entries() {
        const ret = wasm.inthashmap_entries(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} keys
     * @param {Array<any>} values
     * @returns {IntHashMap}
     */
    static from_arrays(keys, values) {
        const ret = wasm.inthashmap_from_arrays(keys, values);
        return IntHashMap.__wrap(ret);
    }
}

const LinkedListFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_linkedlist_free(ptr >>> 0, 1));
/**
 * Singly Linked List
 */
export class LinkedList {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LinkedList.prototype);
        obj.__wbg_ptr = ptr;
        LinkedListFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LinkedListFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_linkedlist_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.avltree_new();
        this.__wbg_ptr = ret >>> 0;
        LinkedListFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} value
     */
    push_front(value) {
        wasm.linkedlist_push_front(this.__wbg_ptr, value);
    }
    /**
     * @param {number} value
     */
    push_back(value) {
        wasm.linkedlist_push_back(this.__wbg_ptr, value);
    }
    /**
     * @returns {number | undefined}
     */
    pop_front() {
        const ret = wasm.linkedlist_pop_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    pop_back() {
        const ret = wasm.linkedlist_pop_back(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get(index) {
        const ret = wasm.linkedlist_get(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @param {number} value
     * @returns {boolean}
     */
    insert(index, value) {
        const ret = wasm.linkedlist_insert(this.__wbg_ptr, index, value);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    remove(index) {
        const ret = wasm.linkedlist_remove(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} value
     * @returns {boolean}
     */
    contains(value) {
        const ret = wasm.linkedlist_contains(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    index_of(value) {
        const ret = wasm.linkedlist_index_of(this.__wbg_ptr, value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.linkedlist_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.linkedlist_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.linkedlist_clear(this.__wbg_ptr);
    }
    reverse() {
        wasm.linkedlist_reverse(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.linkedlist_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @returns {LinkedList}
     */
    static from_array(arr) {
        const ret = wasm.linkedlist_from_array(arr);
        return LinkedList.__wrap(ret);
    }
}

const MedianFinderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_medianfinder_free(ptr >>> 0, 1));
/**
 * Median Finder using two heaps
 */
export class MedianFinder {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MedianFinderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_medianfinder_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.medianfinder_new();
        this.__wbg_ptr = ret >>> 0;
        MedianFinderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} num
     */
    add_number(num) {
        wasm.medianfinder_add_number(this.__wbg_ptr, num);
    }
    /**
     * @returns {number}
     */
    find_median() {
        const ret = wasm.medianfinder_find_median(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.medianfinder_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.medianfinder_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
}

const MinStackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_minstack_free(ptr >>> 0, 1));
/**
 * Min Stack - maintains minimum element efficiently
 */
export class MinStack {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MinStackFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_minstack_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.minstack_new();
        this.__wbg_ptr = ret >>> 0;
        MinStackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} item
     */
    push(item) {
        wasm.minstack_push(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    pop() {
        const ret = wasm.minstack_pop(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek() {
        const ret = wasm.minstack_peek(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get_min() {
        const ret = wasm.minstack_get_min(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.minstack_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.minstack_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.minstack_to_array(this.__wbg_ptr);
        return ret;
    }
}

const PriorityQueueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_priorityqueue_free(ptr >>> 0, 1));
/**
 * Priority Queue (Min-Heap based)
 */
export class PriorityQueue {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PriorityQueueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_priorityqueue_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.priorityqueue_new();
        this.__wbg_ptr = ret >>> 0;
        PriorityQueueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} value
     * @param {number} priority
     */
    enqueue(value, priority) {
        wasm.priorityqueue_enqueue(this.__wbg_ptr, value, priority);
    }
    /**
     * @returns {number | undefined}
     */
    dequeue() {
        const ret = wasm.priorityqueue_dequeue(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek() {
        const ret = wasm.priorityqueue_peek(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek_priority() {
        const ret = wasm.priorityqueue_peek_priority(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.priorityqueue_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.priorityqueue_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.priorityqueue_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.priorityqueue_to_array(this.__wbg_ptr);
        return ret;
    }
}

const PriorityQueueHeapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_priorityqueueheap_free(ptr >>> 0, 1));
/**
 * Priority Queue using Binary Heap
 */
export class PriorityQueueHeap {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PriorityQueueHeapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_priorityqueueheap_free(ptr, 0);
    }
    /**
     * @param {boolean} is_max_priority
     */
    constructor(is_max_priority) {
        const ret = wasm.binaryheap_new(is_max_priority);
        this.__wbg_ptr = ret >>> 0;
        PriorityQueueHeapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} item
     */
    enqueue(item) {
        wasm.binaryheap_insert(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    dequeue() {
        const ret = wasm.binaryheap_extract(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek() {
        const ret = wasm.priorityqueueheap_peek(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.priorityqueueheap_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.priorityqueueheap_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.priorityqueueheap_to_array(this.__wbg_ptr);
        return ret;
    }
}

const QueueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_queue_free(ptr >>> 0, 1));
/**
 * Queue implementation using VecDeque
 */
export class Queue {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Queue.prototype);
        obj.__wbg_ptr = ptr;
        QueueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queue_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.deque_new();
        this.__wbg_ptr = ret >>> 0;
        QueueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} capacity
     * @returns {Queue}
     */
    static with_capacity(capacity) {
        const ret = wasm.queue_with_capacity(capacity);
        return Queue.__wrap(ret);
    }
    /**
     * @param {number} item
     */
    enqueue(item) {
        wasm.queue_enqueue(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    dequeue() {
        const ret = wasm.deque_pop_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    front() {
        const ret = wasm.deque_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    back() {
        const ret = wasm.deque_back(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.deque_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.deque_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.binaryheap_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.deque_clear(this.__wbg_ptr);
    }
    /**
     * @param {number} item
     * @returns {boolean}
     */
    contains(item) {
        const ret = wasm.queue_contains(this.__wbg_ptr, item);
        return ret !== 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.queue_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @returns {Queue}
     */
    static from_array(arr) {
        const ret = wasm.queue_from_array(arr);
        return Queue.__wrap(ret);
    }
}

const QueueUsingStacksFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_queueusingstacks_free(ptr >>> 0, 1));
/**
 * Queue using two stacks
 */
export class QueueUsingStacks {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueueUsingStacksFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queueusingstacks_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.minstack_new();
        this.__wbg_ptr = ret >>> 0;
        QueueUsingStacksFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} item
     */
    enqueue(item) {
        wasm.queueusingstacks_enqueue(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    dequeue() {
        const ret = wasm.queueusingstacks_dequeue(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    front() {
        const ret = wasm.queueusingstacks_front(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.queueusingstacks_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.queueusingstacks_len(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const RustVectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rustvector_free(ptr >>> 0, 1));
/**
 * Dynamic Array/Vector Implementation
 */
export class RustVector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RustVector.prototype);
        obj.__wbg_ptr = ptr;
        RustVectorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RustVectorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rustvector_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.priorityqueue_new();
        this.__wbg_ptr = ret >>> 0;
        RustVectorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} capacity
     * @returns {RustVector}
     */
    static with_capacity(capacity) {
        const ret = wasm.rustvector_with_capacity(capacity);
        return RustVector.__wrap(ret);
    }
    /**
     * @param {number} value
     */
    push(value) {
        wasm.rustvector_push(this.__wbg_ptr, value);
    }
    /**
     * @returns {number | undefined}
     */
    pop() {
        const ret = wasm.rustvector_pop(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get(index) {
        const ret = wasm.rustvector_get(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @param {number} value
     * @returns {boolean}
     */
    set(index, value) {
        const ret = wasm.rustvector_set(this.__wbg_ptr, index, value);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @param {number} value
     * @returns {boolean}
     */
    insert(index, value) {
        const ret = wasm.rustvector_insert(this.__wbg_ptr, index, value);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    remove(index) {
        const ret = wasm.rustvector_remove(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.rustvector_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.rustvector_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.rustvector_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.rustvector_clear(this.__wbg_ptr);
    }
    reverse() {
        wasm.rustvector_reverse(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.rustvector_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @returns {RustVector}
     */
    static from_array(arr) {
        const ret = wasm.rustvector_from_array(arr);
        return RustVector.__wrap(ret);
    }
    /**
     * @param {number} value
     * @returns {boolean}
     */
    contains(value) {
        const ret = wasm.rustvector_contains(this.__wbg_ptr, value);
        return ret !== 0;
    }
    /**
     * @param {number} value
     * @returns {number | undefined}
     */
    index_of(value) {
        const ret = wasm.rustvector_index_of(this.__wbg_ptr, value);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {RustVector} other
     */
    extend(other) {
        _assertClass(other, RustVector);
        wasm.rustvector_extend(this.__wbg_ptr, other.__wbg_ptr);
    }
    /**
     * @returns {RustVector}
     */
    clone_vector() {
        const ret = wasm.rustvector_clone_vector(this.__wbg_ptr);
        return RustVector.__wrap(ret);
    }
}

const SimpleHashMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_simplehashmap_free(ptr >>> 0, 1));
/**
 * Simple HashMap wrapper for string-to-string mappings
 */
export class SimpleHashMap {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SimpleHashMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_simplehashmap_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.inthashmap_new();
        this.__wbg_ptr = ret >>> 0;
        SimpleHashMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} key
     * @param {string} value
     * @returns {string | undefined}
     */
    insert(key, value) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.simplehashmap_insert(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        let v3;
        if (ret[0] !== 0) {
            v3 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v3;
    }
    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    get(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.simplehashmap_get(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} key
     * @returns {string | undefined}
     */
    remove(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.simplehashmap_remove(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v2;
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
    contains_key(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.simplehashmap_contains_key(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.simplehashmap_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.simplehashmap_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    clear() {
        wasm.simplehashmap_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.simplehashmap_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    values() {
        const ret = wasm.simplehashmap_values(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    entries() {
        const ret = wasm.simplehashmap_entries(this.__wbg_ptr);
        return ret;
    }
}

const StackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stack_free(ptr >>> 0, 1));
/**
 * Stack implementation using Vec
 */
export class Stack {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Stack.prototype);
        obj.__wbg_ptr = ptr;
        StackFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StackFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stack_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.priorityqueue_new();
        this.__wbg_ptr = ret >>> 0;
        StackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} capacity
     * @returns {Stack}
     */
    static with_capacity(capacity) {
        const ret = wasm.stack_with_capacity(capacity);
        return Stack.__wrap(ret);
    }
    /**
     * @param {number} item
     */
    push(item) {
        wasm.stack_push(this.__wbg_ptr, item);
    }
    /**
     * @returns {number | undefined}
     */
    pop() {
        const ret = wasm.rustvector_pop(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    peek() {
        const ret = wasm.stack_peek(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.rustvector_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.rustvector_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    capacity() {
        const ret = wasm.rustvector_capacity(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.rustvector_clear(this.__wbg_ptr);
    }
    /**
     * @param {number} item
     * @returns {boolean}
     */
    contains(item) {
        const ret = wasm.rustvector_contains(this.__wbg_ptr, item);
        return ret !== 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.stack_to_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Array<any>} arr
     * @returns {Stack}
     */
    static from_array(arr) {
        const ret = wasm.stack_from_array(arr);
        return Stack.__wrap(ret);
    }
    /**
     * @returns {Stack}
     */
    clone_stack() {
        const ret = wasm.rustvector_clone_vector(this.__wbg_ptr);
        return Stack.__wrap(ret);
    }
}

const StaticArrayFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_staticarray_free(ptr >>> 0, 1));
/**
 * Static Array with fixed size
 */
export class StaticArray {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StaticArrayFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_staticarray_free(ptr, 0);
    }
    /**
     * @param {number} size
     */
    constructor(size) {
        const ret = wasm.staticarray_new(size);
        this.__wbg_ptr = ret >>> 0;
        StaticArrayFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} index
     * @returns {number | undefined}
     */
    get(index) {
        const ret = wasm.staticarray_get(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} index
     * @param {number} value
     * @returns {boolean}
     */
    set(index, value) {
        const ret = wasm.staticarray_set(this.__wbg_ptr, index, value);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.staticarray_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} value
     */
    fill(value) {
        wasm.staticarray_fill(this.__wbg_ptr, value);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.staticarray_to_array(this.__wbg_ptr);
        return ret;
    }
}

const StringStackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stringstack_free(ptr >>> 0, 1));
/**
 * String Stack for text operations
 */
export class StringStack {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StringStackFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stringstack_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.priorityqueue_new();
        this.__wbg_ptr = ret >>> 0;
        StringStackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} item
     */
    push(item) {
        const ptr0 = passStringToWasm0(item, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stringstack_push(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string | undefined}
     */
    pop() {
        const ret = wasm.stringstack_pop(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {string | undefined}
     */
    peek() {
        const ret = wasm.stringstack_peek(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.stringstack_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
        const ret = wasm.stringstack_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    clear() {
        wasm.stringstack_clear(this.__wbg_ptr);
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.stringstack_to_array(this.__wbg_ptr);
        return ret;
    }
}

const TreeNodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_treenode_free(ptr >>> 0, 1));
/**
 * Binary Tree Node
 */
export class TreeNode {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TreeNodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_treenode_free(ptr, 0);
    }
    /**
     * @param {number} value
     */
    constructor(value) {
        const ret = wasm.treenode_new(value);
        this.__wbg_ptr = ret >>> 0;
        TreeNodeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get_value() {
        const ret = wasm.treenode_get_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set_value(value) {
        wasm.treenode_set_value(this.__wbg_ptr, value);
    }
}

const WeightedGraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_weightedgraph_free(ptr >>> 0, 1));
/**
 * Weighted Graph for algorithms like Dijkstra
 */
export class WeightedGraph {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WeightedGraphFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_weightedgraph_free(ptr, 0);
    }
    /**
     * @param {boolean} is_directed
     */
    constructor(is_directed) {
        const ret = wasm.graph_new(is_directed);
        this.__wbg_ptr = ret >>> 0;
        WeightedGraphFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} vertex
     */
    add_vertex(vertex) {
        wasm.weightedgraph_add_vertex(this.__wbg_ptr, vertex);
    }
    /**
     * @param {number} from
     * @param {number} to
     * @param {number} weight
     */
    add_edge(from, to, weight) {
        wasm.weightedgraph_add_edge(this.__wbg_ptr, from, to, weight);
    }
    /**
     * @param {number} start
     * @returns {Array<any>}
     */
    dijkstra(start) {
        const ret = wasm.weightedgraph_dijkstra(this.__wbg_ptr, start);
        return ret;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @returns {Array<any>}
     */
    shortest_path_with_weights(from, to) {
        const ret = wasm.weightedgraph_shortest_path_with_weights(this.__wbg_ptr, from, to);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get_vertices() {
        const ret = wasm.weightedgraph_get_vertices(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get_edges() {
        const ret = wasm.weightedgraph_get_edges(this.__wbg_ptr);
        return ret;
    }
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_a1a27a0dfa70165d = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_fbe8be8bf6436ce5 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_get_92470be87867c2e5 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_a131a44bd1eb6979 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_9a05796038b7a8f6 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_ca460677bc155827 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_68f3f67bad1729c1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_5f090bed72bd4f89 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_keys_42062809bf87339e = function(arg0) {
        const ret = Object.keys(arg0);
        return ret;
    };
    imports.wbg.__wbg_length_ab6d22b5ead75c72 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_f00ec12454a5d9fd = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_log_f78eba8c45ffc259 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_new_07b483f72211fd66 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_58353953ad2097cc = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_e52b3efaaa774f96 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newfromslice_7c05ab1297cb2d88 = function(arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_ff528e72d35de39a = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithlength_08f872dc1e3ada2e = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_now_eb0821f3bd9f6529 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
        const ret = arg0.performance;
        return ret;
    };
    imports.wbg.__wbg_push_73fd7b5550ebf707 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_random_210bb7fbfa33591d = function() {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbg_setTimeout_906fea9a7279f446 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.setTimeout(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_c43293f93a35998a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_fe4e79d1ed3b0e9b = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_487c52c58d65314d = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_ee9704f328b6b291 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_78c9e3071b912620 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_a093d21393777366 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper421 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 217, __wbg_adapter_26);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('vievlog_rust_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

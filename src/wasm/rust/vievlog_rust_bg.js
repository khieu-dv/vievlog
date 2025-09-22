let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


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

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });
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

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

const cachedTextEncoder = new lTextEncoder('utf-8');

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
 * @param {Int32Array} arr
 */
export function bubble_sort(arr) {
    var ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.bubble_sort(ptr0, len0, arr);
}

/**
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function bubble_sort_array(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.bubble_sort_array(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function quick_sort_array(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.quick_sort_array(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} arr
 * @returns {Array<any>}
 */
export function merge_sort_array(arr) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.merge_sort_array(ptr0, len0);
    return ret;
}

/**
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
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {any}
 */
export function binary_search_array(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.binary_search_array(ptr0, len0, target);
    return ret;
}

/**
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
 * @param {Int32Array} arr
 * @param {number} target
 * @returns {any}
 */
export function linear_search_array(arr, target) {
    const ptr0 = passArray32ToWasm0(arr, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.linear_search_array(ptr0, len0, target);
    return ret;
}

/**
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

function __wbg_adapter_26(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h357b077c0154e0d6(arg0, arg1);
}

const BinarySearchTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_binarysearchtree_free(ptr >>> 0, 1));

export class BinarySearchTree {

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
        const ret = wasm.binarysearchtree_new();
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
     * @returns {Array<any>}
     */
    inorder_traversal() {
        const ret = wasm.binarysearchtree_inorder_traversal(this.__wbg_ptr);
        return ret;
    }
}

const GraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_graph_free(ptr >>> 0, 1));

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
    constructor() {
        const ret = wasm.graph_new();
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
     * @param {number} vertex1
     * @param {number} vertex2
     */
    add_undirected_edge(vertex1, vertex2) {
        wasm.graph_add_undirected_edge(this.__wbg_ptr, vertex1, vertex2);
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
}

const LinkedListFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_linkedlist_free(ptr >>> 0, 1));

export class LinkedList {

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
        const ret = wasm.linkedlist_new();
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
     * @returns {number | undefined}
     */
    pop_front() {
        const ret = wasm.linkedlist_pop_front(this.__wbg_ptr);
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
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.linkedlist_to_array(this.__wbg_ptr);
        return ret;
    }
}

const ListNodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_listnode_free(ptr >>> 0, 1));

export class ListNode {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ListNodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_listnode_free(ptr, 0);
    }
}

const RustVectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rustvector_free(ptr >>> 0, 1));

export class RustVector {

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
        const ret = wasm.rustvector_new();
        this.__wbg_ptr = ret >>> 0;
        RustVectorFinalization.register(this, this.__wbg_ptr, this);
        return this;
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
     * @returns {number}
     */
    len() {
        const ret = wasm.rustvector_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Array<any>}
     */
    to_array() {
        const ret = wasm.rustvector_to_array(this.__wbg_ptr);
        return ret;
    }
}

const TreeNodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_treenode_free(ptr >>> 0, 1));

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
}

export function __wbg_buffer_a1a27a0dfa70165d(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_call_fbe8be8bf6436ce5() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
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

export function __wbg_get_92470be87867c2e5() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_a131a44bd1eb6979(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_instanceof_Object_9a05796038b7a8f6(arg0) {
    let result;
    try {
        result = arg0 instanceof Object;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_ca460677bc155827(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_68f3f67bad1729c1(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_keys_42062809bf87339e(arg0) {
    const ret = Object.keys(arg0);
    return ret;
};

export function __wbg_length_ab6d22b5ead75c72(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_f00ec12454a5d9fd(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_log_f78eba8c45ffc259(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbg_new_07b483f72211fd66() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_58353953ad2097cc() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_e52b3efaaa774f96(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_newfromslice_7c05ab1297cb2d88(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newnoargs_ff528e72d35de39a(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithlength_08f872dc1e3ada2e(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_now_2c95c9de01293173(arg0) {
    const ret = arg0.now();
    return ret;
};

export function __wbg_now_eb0821f3bd9f6529() {
    const ret = Date.now();
    return ret;
};

export function __wbg_performance_7a3ffd0b17f663ad(arg0) {
    const ret = arg0.performance;
    return ret;
};

export function __wbg_push_73fd7b5550ebf707(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_random_210bb7fbfa33591d() {
    const ret = Math.random();
    return ret;
};

export function __wbg_setTimeout_906fea9a7279f446() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.setTimeout(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_set_c43293f93a35998a() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_set_fe4e79d1ed3b0e9b(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_487c52c58d65314d() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_ee9704f328b6b291() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_78c9e3071b912620() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_a093d21393777366() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_closure_wrapper379(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 217, __wbg_adapter_26);
    return ret;
};

export function __wbindgen_copy_to_typed_array(arg0, arg1, arg2) {
    new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};


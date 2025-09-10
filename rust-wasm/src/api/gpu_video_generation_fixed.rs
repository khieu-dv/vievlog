use wasm_bindgen::prelude::*;
use base64::{Engine as _, engine::general_purpose};
use image::{ImageFormat, DynamicImage};
use std::io::Cursor;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ( $( $t:tt )* ) => {
        log(&format!( $( $t )* ))
    }
}

#[wasm_bindgen]
pub fn gpu_status_check() -> String {
    "GPU rendering module loaded successfully. Use generate_enhanced_video_frames() for cinematic effects.".to_string()
}

#[wasm_bindgen]
pub fn get_cinematic_effects() -> js_sys::Array {
    let effects = js_sys::Array::new();
    let cinematic_effects = [
        "cinematic_zoom_in",
        "dramatic_zoom_out", 
        "epic_pan_left",
        "epic_pan_right",
        "parallax_zoom",
        "film_grain_vintage",
        "light_leak_golden",
        "chromatic_aberration",
        "bokeh_blur",
        "lens_flare",
        "vignette_fade"
    ];
    
    for effect in &cinematic_effects {
        effects.push(&JsValue::from_str(effect));
    }
    
    effects
}
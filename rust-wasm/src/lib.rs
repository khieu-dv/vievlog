use wasm_bindgen::prelude::*;

// Declare modules
pub mod api;
pub mod graphics;

// Re-export image processing and video generation functions
pub use api::image_processing::*;
pub use api::video_generation::*;
pub use api::gpu_video_simple::*;
pub use api::gpu_video_generation_fixed::*;
pub use api::smart_enhancement::*;
pub use api::ultra_smooth_transitions::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! console_log {
    ( $( $t:tt )* ) => {
        log(&format!( $( $t )* ))
    }
}

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
    // Set panic hook for better error messages
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
    
    console_log!("[main] VieVlog Rust WASM initialized!");
}

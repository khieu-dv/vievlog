use wasm_bindgen::prelude::*;

// Declare modules
pub mod api;

// Re-export all public items
pub use api::basic::*;
pub use api::data_processing::*;
pub use api::image_processing::*;
pub use api::models::*;
pub use api::performance::*;
pub use api::text_analysis::*;
pub use api::utils::*;

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

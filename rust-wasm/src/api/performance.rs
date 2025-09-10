use wasm_bindgen::prelude::*;
use js_sys::Date;

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
pub fn heavy_computation(iterations: u32) -> f64 {
    let start = Date::now();
    let mut result = 0.0;
    for i in 0..iterations {
        result += (i as f64).sin().cos().tan();
    }
    let end = Date::now();
    console_log!("Heavy computation took {} ms", end - start);
    result
}

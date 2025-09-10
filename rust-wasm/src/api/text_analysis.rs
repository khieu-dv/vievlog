use wasm_bindgen::prelude::*;
use serde_json;

#[wasm_bindgen]
pub fn analyze_text(text: &str) -> JsValue {
    let word_count = text.split_whitespace().count();
    let char_count = text.chars().count();
    let line_count = text.lines().count();
    let reading_time_minutes = (word_count as f64 / 200.0).ceil() as u32;
    let analysis = serde_json::json!({
        "wordCount": word_count,
        "charCount": char_count,
        "lineCount": line_count,
        "readingTimeMinutes": reading_time_minutes
    });
    JsValue::from_str(&analysis.to_string())
}

use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use std::collections::HashMap;
use crate::bevy_image_processor::bevy_process_image_multi;

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

/// Advanced effects manager using Bevy ECS
#[derive(Resource)]
pub struct EffectsLibrary {
    presets: HashMap<String, String>,
}

impl Default for EffectsLibrary {
    fn default() -> Self {
        let mut presets = HashMap::new();
        
        // Professional cinematic presets
        presets.insert("cinematic_dark".to_string(), 
            r#"[["contrast", 1.3], ["brightness", 0.85], ["vignette", 0.4], ["film_grain", 0.15]]"#.to_string());
        
        presets.insert("golden_hour".to_string(),
            r#"[["brightness", 1.2], ["saturation", 1.3], ["light_leak", 0.25]]"#.to_string());
        
        presets.insert("cyberpunk".to_string(),
            r#"[["contrast", 1.4], ["saturation", 1.6], ["film_grain", 0.1]]"#.to_string());
        
        presets.insert("vintage_film".to_string(),
            r#"[["sepia", 1.0], ["vignette", 0.5], ["film_grain", 0.4], ["contrast", 0.9]]"#.to_string());
        
        presets.insert("dreamy_soft".to_string(),
            r#"[["blur", 0.4], ["brightness", 1.15], ["saturation", 1.25], ["light_leak", 0.15]]"#.to_string());
        
        presets.insert("horror_dark".to_string(),
            r#"[["grayscale", 1.0], ["contrast", 1.6], ["brightness", 0.6], ["vignette", 0.7]]"#.to_string());
        
        presets.insert("neon_glow".to_string(),
            r#"[["contrast", 1.5], ["saturation", 1.8], ["brightness", 1.1]]"#.to_string());
        
        presets.insert("arctic_cold".to_string(),
            r#"[["brightness", 1.05], ["contrast", 1.15], ["saturation", 0.8]]"#.to_string());
        
        presets.insert("warm_sunset".to_string(),
            r#"[["brightness", 1.1], ["saturation", 1.4], ["light_leak", 0.3]]"#.to_string());
        
        presets.insert("black_white_dramatic".to_string(),
            r#"[["grayscale", 1.0], ["contrast", 1.8], ["vignette", 0.3]]"#.to_string());
        
        Self { presets }
    }
}

/// Get all available effect presets
#[wasm_bindgen]
pub fn bevy_get_all_presets() -> js_sys::Array {
    let presets = EffectsLibrary::default();
    let preset_names = js_sys::Array::new();
    
    for preset_name in presets.presets.keys() {
        preset_names.push(&JsValue::from_str(preset_name));
    }
    
    console_log!("Available presets: {}", preset_names.length());
    preset_names
}

/// Get preset configuration as JSON string
#[wasm_bindgen]
pub fn bevy_get_preset_config(preset_name: &str) -> String {
    let presets = EffectsLibrary::default();
    
    match presets.presets.get(preset_name) {
        Some(config) => config.clone(),
        None => {
            console_log!("Preset '{}' not found", preset_name);
            "[]".to_string()
        }
    }
}

/// Apply professional cinematic preset
#[wasm_bindgen]
pub fn bevy_apply_cinematic_preset(image_data: &[u8], preset_name: &str, intensity: f32) -> Vec<u8> {
    let presets = EffectsLibrary::default();
    
    let preset_config = match presets.presets.get(preset_name) {
        Some(config) => config,
        None => {
            console_log!("Unknown preset: {}", preset_name);
            return Vec::new();
        }
    };
    
    // Adjust intensity of all effects in the preset
    let adjusted_config = adjust_preset_intensity(preset_config, intensity);
    
    let result = bevy_process_image_multi(image_data, &adjusted_config);
    
    if !result.is_empty() {
        console_log!("Applied '{}' preset with intensity {}", preset_name, intensity);
    }
    
    result
}

/// Create effect suggestion based on image analysis
#[wasm_bindgen]
pub fn bevy_suggest_effects(rgba_data: &[u8], width: u32, height: u32) -> js_sys::Array {
    let suggestions = js_sys::Array::new();
    
    // Analyze image characteristics
    let (avg_brightness, avg_saturation, contrast_level) = analyze_image(rgba_data, width, height);
    
    console_log!("Image analysis - Brightness: {:.2}, Saturation: {:.2}, Contrast: {:.2}", 
                avg_brightness, avg_saturation, contrast_level);
    
    // Suggest effects based on analysis
    if avg_brightness < 0.3 {
        suggestions.push(&JsValue::from_str("cinematic_dark"));
        suggestions.push(&JsValue::from_str("horror_dark"));
        suggestions.push(&JsValue::from_str("neon_glow"));
    } else if avg_brightness > 0.7 {
        suggestions.push(&JsValue::from_str("golden_hour"));
        suggestions.push(&JsValue::from_str("dreamy_soft"));
        suggestions.push(&JsValue::from_str("warm_sunset"));
    } else {
        suggestions.push(&JsValue::from_str("cyberpunk"));
        suggestions.push(&JsValue::from_str("arctic_cold"));
        suggestions.push(&JsValue::from_str("vintage_film"));
    }
    
    if avg_saturation < 0.3 {
        suggestions.push(&JsValue::from_str("vintage_film"));
        suggestions.push(&JsValue::from_str("black_white_dramatic"));
    } else if avg_saturation > 0.7 {
        suggestions.push(&JsValue::from_str("neon_glow"));
        suggestions.push(&JsValue::from_str("cyberpunk"));
    }
    
    if contrast_level < 0.4 {
        suggestions.push(&JsValue::from_str("cinematic_dark"));
        suggestions.push(&JsValue::from_str("black_white_dramatic"));
    }
    
    console_log!("Suggested {} effects", suggestions.length());
    suggestions
}

/// Create effect preview thumbnails for all presets
#[wasm_bindgen]
pub fn bevy_create_preset_previews(
    image_data: &[u8], 
    thumbnail_width: u32, 
    thumbnail_height: u32
) -> js_sys::Object {
    let presets = EffectsLibrary::default();
    let previews = js_sys::Object::new();
    
    // First resize image to thumbnail size (simplified)
    let thumbnail_data = create_thumbnail(image_data, thumbnail_width, thumbnail_height);
    
    for (preset_name, preset_config) in presets.presets.iter() {
        let preview_data = bevy_process_image_multi(&thumbnail_data, preset_config);
        
        if !preview_data.is_empty() {
            // Convert to base64 data URL
            let base64_data = base64::Engine::encode(
                &base64::engine::general_purpose::STANDARD, 
                &preview_data
            );
            let data_url = format!("data:image/png;base64,{}", base64_data);
            
            js_sys::Reflect::set(
                &previews,
                &JsValue::from_str(preset_name),
                &JsValue::from_str(&data_url),
            ).unwrap();
        }
    }
    
    console_log!("Created {} preset previews", js_sys::Object::keys(&previews).length());
    previews
}

/// Batch process multiple images with same effect
#[wasm_bindgen]
pub fn bevy_batch_process_preset(
    images_array: js_sys::Array,
    preset_name: &str,
    intensity: f32,
) -> js_sys::Array {
    let results = js_sys::Array::new();
    let start_time = js_sys::Date::now();
    
    let presets = EffectsLibrary::default();
    let preset_config = match presets.presets.get(preset_name) {
        Some(config) => adjust_preset_intensity(config, intensity),
        None => {
            console_log!("Unknown preset: {}", preset_name);
            return results;
        }
    };
    
    for i in 0..images_array.length() {
        if let Some(uint8_array) = images_array.get(i).dyn_ref::<js_sys::Uint8Array>() {
            let image_data = uint8_array.to_vec();
            let processed = bevy_process_image_multi(&image_data, &preset_config);
            
            if !processed.is_empty() {
                let result_array = js_sys::Uint8Array::from(&processed[..]);
                results.push(&result_array);
            } else {
                // Push empty array for failed processing
                let empty_array = js_sys::Uint8Array::new_with_length(0);
                results.push(&empty_array);
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Batch processed {} images with '{}' in {}ms", 
                results.length(), preset_name, end_time - start_time);
    results
}

/// Create animated preset sequence
#[wasm_bindgen]
pub fn bevy_animate_preset(
    image_data: &[u8],
    preset_name: &str,
    frames: u32,
    max_intensity: f32,
) -> js_sys::Array {
    let presets = EffectsLibrary::default();
    
    let preset_config = match presets.presets.get(preset_name) {
        Some(config) => config,
        None => {
            console_log!("Unknown preset: {}", preset_name);
            return js_sys::Array::new();
        }
    };
    
    let animated_frames = js_sys::Array::new();
    
    for i in 0..frames {
        let progress = i as f32 / (frames - 1) as f32;
        let current_intensity = max_intensity * progress;
        
        let adjusted_config = adjust_preset_intensity(preset_config, current_intensity);
        let frame_data = bevy_process_image_multi(image_data, &adjusted_config);
        
        if !frame_data.is_empty() {
            let base64_data = base64::Engine::encode(
                &base64::engine::general_purpose::STANDARD, 
                &frame_data
            );
            let data_url = format!("data:image/png;base64,{}", base64_data);
            animated_frames.push(&JsValue::from_str(&data_url));
        }
    }
    
    console_log!("Generated {} animated frames for '{}' preset", frames, preset_name);
    animated_frames
}

/// Get effect performance metrics
#[wasm_bindgen]
pub fn bevy_get_performance_metrics() -> js_sys::Object {
    let metrics = js_sys::Object::new();
    
    // Simulated metrics (in real implementation, get from Bevy systems)
    js_sys::Reflect::set(
        &metrics,
        &JsValue::from_str("average_frame_time"),
        &JsValue::from_f64(16.67), // 60 FPS
    ).unwrap();
    
    js_sys::Reflect::set(
        &metrics,
        &JsValue::from_str("effects_processed"),
        &JsValue::from_f64(100.0),
    ).unwrap();
    
    js_sys::Reflect::set(
        &metrics,
        &JsValue::from_str("memory_usage_mb"),
        &JsValue::from_f64(25.5),
    ).unwrap();
    
    metrics
}

// Helper functions

fn adjust_preset_intensity(preset_config: &str, intensity: f32) -> String {
    // Parse JSON and adjust all effect intensities
    if let Ok(mut effects) = serde_json::from_str::<Vec<(String, f32)>>(preset_config) {
        for (_, effect_intensity) in effects.iter_mut() {
            *effect_intensity *= intensity;
        }
        
        serde_json::to_string(&effects).unwrap_or_else(|_| preset_config.to_string())
    } else {
        preset_config.to_string()
    }
}

fn analyze_image(rgba_data: &[u8], width: u32, height: u32) -> (f32, f32, f32) {
    let pixel_count = width * height;
    let mut total_brightness = 0.0;
    let mut total_saturation = 0.0;
    let mut brightness_values = Vec::new();
    
    for i in 0..pixel_count as usize {
        let idx = i * 4;
        if idx + 3 < rgba_data.len() {
            let r = rgba_data[idx] as f32 / 255.0;
            let g = rgba_data[idx + 1] as f32 / 255.0;
            let b = rgba_data[idx + 2] as f32 / 255.0;
            
            // Calculate brightness (luminance)
            let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            total_brightness += brightness;
            brightness_values.push(brightness);
            
            // Calculate saturation
            let max_rgb = r.max(g).max(b);
            let min_rgb = r.min(g).min(b);
            let saturation = if max_rgb > 0.0 { (max_rgb - min_rgb) / max_rgb } else { 0.0 };
            total_saturation += saturation;
        }
    }
    
    let avg_brightness = total_brightness / pixel_count as f32;
    let avg_saturation = total_saturation / pixel_count as f32;
    
    // Calculate contrast (standard deviation of brightness)
    let brightness_variance: f32 = brightness_values.iter()
        .map(|&b| (b - avg_brightness).powi(2))
        .sum::<f32>() / pixel_count as f32;
    let contrast_level = brightness_variance.sqrt();
    
    (avg_brightness, avg_saturation, contrast_level)
}

fn create_thumbnail(image_data: &[u8], width: u32, height: u32) -> Vec<u8> {
    // Simplified thumbnail creation - assume input is already RGBA
    // In real implementation, decode image first, then resize
    
    // For now, just return original data (would normally resize here)
    if image_data.len() == (width * height * 4) as usize {
        image_data.to_vec()
    } else {
        // Create a placeholder thumbnail
        vec![128u8; (width * height * 4) as usize]
    }
}
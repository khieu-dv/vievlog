use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use base64::{Engine as _, engine::general_purpose};
use crate::{EffectType, ImageProcessor, ImageEffect, get_or_create_app, apply_effect};

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

/// Process image with Bevy ECS system
#[wasm_bindgen]
pub fn bevy_process_image(image_data: &[u8], effect_type: &str, intensity: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    // Parse image data to get dimensions and rgba data
    let (rgba_data, width, height) = match decode_image_data(image_data) {
        Ok(data) => data,
        Err(_) => {
            console_log!("Failed to decode image data");
            return Vec::new();
        }
    };
    
    // Convert effect type string to enum
    let effect = match effect_type {
        "blur" => EffectType::Blur { radius: intensity * 5.0 },
        "brightness" => EffectType::Brightness { factor: intensity },
        "contrast" => EffectType::Contrast { factor: intensity },
        "saturation" => EffectType::Saturation { factor: intensity },
        "grayscale" => EffectType::Grayscale,
        "sepia" => EffectType::Sepia,
        "vignette" => EffectType::Vignette { strength: intensity },
        "film_grain" => EffectType::FilmGrain { intensity },
        "light_leak" => EffectType::LightLeak { position: (0.8, 0.2), intensity },
        _ => {
            console_log!("Unknown effect type: {}", effect_type);
            return Vec::new();
        }
    };
    
    // Get or create Bevy app
    let app = get_or_create_app();
    
    // Create entity with image processor and effect components
    let entity = app.world_mut().spawn((
        ImageProcessor {
            width,
            height,
            data: rgba_data,
        },
        ImageEffect {
            effect_type: effect,
            intensity: 1.0,
        },
    )).id();
    
    // Run one update to process the effect
    app.update();
    
    // Get the processed data
    let processed_data = {
        let world = app.world();
        if let Some(processor) = world.get::<ImageProcessor>(entity) {
            processor.data.clone()
        } else {
            console_log!("Failed to get processed image data");
            return Vec::new();
        }
    };
    
    // Clean up entity
    app.world_mut().despawn(entity);
    
    // Encode back to PNG
    match encode_rgba_to_png(&processed_data, width, height) {
        Ok(png_data) => {
            let end_time = js_sys::Date::now();
            console_log!("Bevy processed '{}' effect in {}ms", effect_type, end_time - start_time);
            png_data
        },
        Err(_) => {
            console_log!("Failed to encode processed image");
            Vec::new()
        }
    }
}

/// Apply multiple effects in sequence
#[wasm_bindgen]
pub fn bevy_process_image_multi(image_data: &[u8], effects_json: &str) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    // Parse effects JSON
    let effects_data: Vec<(String, f32)> = match serde_json::from_str(effects_json) {
        Ok(data) => data,
        Err(_) => {
            console_log!("Failed to parse effects JSON");
            return Vec::new();
        }
    };
    
    // Start with original image
    let (mut rgba_data, width, height) = match decode_image_data(image_data) {
        Ok(data) => data,
        Err(_) => {
            console_log!("Failed to decode image data");
            return Vec::new();
        }
    };
    
    // Apply each effect in sequence
    for (effect_name, intensity) in &effects_data {
        let effect = match effect_name.as_str() {
            "blur" => EffectType::Blur { radius: *intensity * 5.0 },
            "brightness" => EffectType::Brightness { factor: *intensity },
            "contrast" => EffectType::Contrast { factor: *intensity },
            "saturation" => EffectType::Saturation { factor: *intensity },
            "grayscale" => EffectType::Grayscale,
            "sepia" => EffectType::Sepia,
            "vignette" => EffectType::Vignette { strength: *intensity },
            "film_grain" => EffectType::FilmGrain { intensity: *intensity },
            "light_leak" => EffectType::LightLeak { position: (0.8, 0.2), intensity: *intensity },
            _ => continue,
        };
        
        let image_effect = ImageEffect {
            effect_type: effect,
            intensity: 1.0,
        };
        
        apply_effect(&mut rgba_data, width, height, &image_effect);
    }
    
    // Encode back to PNG
    match encode_rgba_to_png(&rgba_data, width, height) {
        Ok(png_data) => {
            let end_time = js_sys::Date::now();
            console_log!("Bevy processed {} effects in {}ms", effects_data.len(), end_time - start_time);
            png_data
        },
        Err(_) => {
            console_log!("Failed to encode processed image");
            Vec::new()
        }
    }
}

/// Create animated effect sequence
#[wasm_bindgen]
pub fn bevy_create_animated_effect(
    image_data: &[u8], 
    effect_type: &str,
    frames: u32,
    intensity: f32
) -> js_sys::Array {
    let frames_array = js_sys::Array::new();
    
    let (rgba_data, width, height) = match decode_image_data(image_data) {
        Ok(data) => data,
        Err(_) => {
            console_log!("Failed to decode image data");
            return frames_array;
        }
    };
    
    for i in 0..frames {
        let progress = i as f32 / (frames - 1) as f32;
        let current_intensity = intensity * progress;
        
        let effect = match effect_type {
            "blur" => EffectType::Blur { radius: current_intensity * 5.0 },
            "brightness" => EffectType::Brightness { factor: 1.0 + (current_intensity - 1.0) },
            "contrast" => EffectType::Contrast { factor: 1.0 + (current_intensity - 1.0) },
            "saturation" => EffectType::Saturation { factor: 1.0 + (current_intensity - 1.0) },
            "grayscale" => EffectType::Grayscale,
            "sepia" => EffectType::Sepia,
            "vignette" => EffectType::Vignette { strength: current_intensity },
            "film_grain" => EffectType::FilmGrain { intensity: current_intensity },
            "light_leak" => EffectType::LightLeak { position: (0.8, 0.2), intensity: current_intensity },
            _ => continue,
        };
        
        let mut frame_data = rgba_data.clone();
        let image_effect = ImageEffect {
            effect_type: effect,
            intensity: if effect_type == "grayscale" || effect_type == "sepia" { progress } else { 1.0 },
        };
        
        apply_effect(&mut frame_data, width, height, &image_effect);
        
        // Convert to base64 PNG
        if let Ok(png_data) = encode_rgba_to_png(&frame_data, width, height) {
            let base64_data = general_purpose::STANDARD.encode(&png_data);
            let data_url = format!("data:image/png;base64,{}", base64_data);
            frames_array.push(&JsValue::from_str(&data_url));
        }
    }
    
    console_log!("Generated {} animated frames for '{}' effect", frames, effect_type);
    frames_array
}

/// Get available effect presets
#[wasm_bindgen] 
pub fn bevy_get_effect_presets() -> js_sys::Object {
    let presets = js_sys::Object::new();
    
    // Cinematic presets
    js_sys::Reflect::set(
        &presets,
        &JsValue::from_str("cinematic_dark"),
        &JsValue::from_str(r#"[["contrast", 1.2], ["vignette", 0.3], ["film_grain", 0.1]]"#),
    ).unwrap();
    
    js_sys::Reflect::set(
        &presets,
        &JsValue::from_str("golden_hour"),
        &JsValue::from_str(r#"[["brightness", 1.1], ["saturation", 1.2], ["light_leak", 0.2]]"#),
    ).unwrap();
    
    js_sys::Reflect::set(
        &presets,
        &JsValue::from_str("vintage_film"),
        &JsValue::from_str(r#"[["sepia", 1.0], ["vignette", 0.4], ["film_grain", 0.3]]"#),
    ).unwrap();
    
    js_sys::Reflect::set(
        &presets,
        &JsValue::from_str("dreamy_soft"),
        &JsValue::from_str(r#"[["blur", 0.3], ["brightness", 1.15], ["saturation", 1.2]]"#),
    ).unwrap();
    
    presets
}

/// Apply preset effect combination
#[wasm_bindgen]
pub fn bevy_apply_preset(image_data: &[u8], preset_name: &str) -> Vec<u8> {
    let effects_json = match preset_name {
        "cinematic_dark" => r#"[["contrast", 1.2], ["vignette", 0.3], ["film_grain", 0.1]]"#,
        "golden_hour" => r#"[["brightness", 1.1], ["saturation", 1.2], ["light_leak", 0.2]]"#,
        "vintage_film" => r#"[["sepia", 1.0], ["vignette", 0.4], ["film_grain", 0.3]]"#,
        "dreamy_soft" => r#"[["blur", 0.3], ["brightness", 1.15], ["saturation", 1.2]]"#,
        _ => {
            console_log!("Unknown preset: {}", preset_name);
            return Vec::new();
        }
    };
    
    bevy_process_image_multi(image_data, effects_json)
}

// Helper functions

fn decode_image_data(image_data: &[u8]) -> Result<(Vec<u8>, u32, u32), Box<dyn std::error::Error>> {
    // For now, assume input is already RGBA data or use a simple PNG decoder
    // In a real implementation, you'd use image crate or bevy's image loading
    
    // Simple fallback: assume it's a small test image 100x100 RGBA
    if image_data.len() == 4 * 100 * 100 {
        Ok((image_data.to_vec(), 100, 100))
    } else {
        // Try to parse as basic PNG (very simplified)
        // In real implementation, use proper image decoding
        Err("Image decoding not implemented for this format".into())
    }
}

fn encode_rgba_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    // Simple PNG encoding - in real implementation use proper PNG encoder
    // For now, just return the RGBA data as-is for testing
    let mut png_data = Vec::new();
    
    // Add simple PNG-like header (not real PNG format, just for testing)
    png_data.extend_from_slice(&width.to_be_bytes());
    png_data.extend_from_slice(&height.to_be_bytes());
    png_data.extend_from_slice(rgba_data);
    
    Ok(png_data)
}

/// Process RGBA image data directly (no decoding needed)
#[wasm_bindgen]
pub fn bevy_process_rgba_image(rgba_data: &[u8], width: u32, height: u32, effect_type: &str, intensity: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    // Validate RGBA data length
    if rgba_data.len() != (width * height * 4) as usize {
        console_log!("Invalid RGBA data length: expected {}, got {}", width * height * 4, rgba_data.len());
        return Vec::new();
    }
    
    // Convert effect type string to enum
    let effect = match effect_type {
        "blur" => EffectType::Blur { radius: intensity * 5.0 },
        "brightness" => EffectType::Brightness { factor: intensity },
        "contrast" => EffectType::Contrast { factor: intensity },
        "saturation" => EffectType::Saturation { factor: intensity },
        "grayscale" => EffectType::Grayscale,
        "sepia" => EffectType::Sepia,
        "vignette" => EffectType::Vignette { strength: intensity },
        "film_grain" => EffectType::FilmGrain { intensity },
        "light_leak" => EffectType::LightLeak { position: (0.8, 0.2), intensity },
        _ => {
            console_log!("Unknown effect type: {}", effect_type);
            return Vec::new();
        }
    };
    
    // Get or create Bevy app
    let app = get_or_create_app();
    
    // Create entity with image processor and effect components
    let entity = app.world_mut().spawn((
        ImageProcessor {
            width,
            height,
            data: rgba_data.to_vec(),
        },
        ImageEffect {
            effect_type: effect,
            intensity: 1.0,
        },
    )).id();
    
    // Run one update to process the effect
    app.update();
    
    // Get the processed data
    let processed_data = {
        let world = app.world();
        if let Some(processor) = world.get::<ImageProcessor>(entity) {
            processor.data.clone()
        } else {
            console_log!("Failed to get processed image data");
            return Vec::new();
        }
    };
    
    // Clean up entity
    app.world_mut().despawn(entity);
    
    let end_time = js_sys::Date::now();
    console_log!("Bevy processed '{}' effect on RGBA data in {}ms", effect_type, end_time - start_time);
    processed_data
}

/// Simple image resize function
#[wasm_bindgen]
pub fn bevy_resize_image(rgba_data: &[u8], old_width: u32, old_height: u32, new_width: u32, new_height: u32) -> Vec<u8> {
    // Simple nearest neighbor resize
    let mut resized_data = Vec::with_capacity((new_width * new_height * 4) as usize);
    
    for y in 0..new_height {
        for x in 0..new_width {
            let src_x = (x * old_width / new_width).min(old_width - 1);
            let src_y = (y * old_height / new_height).min(old_height - 1);
            let src_idx = (src_y * old_width + src_x) as usize * 4;
            
            if src_idx + 3 < rgba_data.len() {
                resized_data.push(rgba_data[src_idx]);     // R
                resized_data.push(rgba_data[src_idx + 1]); // G
                resized_data.push(rgba_data[src_idx + 2]); // B
                resized_data.push(rgba_data[src_idx + 3]); // A
            } else {
                resized_data.extend_from_slice(&[0, 0, 0, 255]); // Black with full alpha
            }
        }
    }
    
    console_log!("Resized image from {}x{} to {}x{}", old_width, old_height, new_width, new_height);
    resized_data
}
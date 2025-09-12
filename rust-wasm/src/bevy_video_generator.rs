use wasm_bindgen::prelude::*;
use bevy::prelude::*;
use base64::{Engine as _, engine::general_purpose};
use crate::{TransitionType, EasingType};

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

/// Generate video frames with Ken Burns effect (pan and zoom)
#[wasm_bindgen]
pub fn bevy_generate_ken_burns(
    rgba_data: &[u8],
    width: u32,
    height: u32,
    frames: u32,
    zoom_factor: f32,
    pan_x: f32,
    pan_y: f32,
) -> js_sys::Array {
    let frames_array = js_sys::Array::new();
    let start_time = js_sys::Date::now();
    
    for i in 0..frames {
        let progress = i as f32 / (frames - 1) as f32;
        let eased_progress = EasingType::EaseInOutCubic.apply(progress);
        
        // Apply Ken Burns effect
        let frame_data = apply_ken_burns_effect(
            rgba_data,
            width,
            height,
            eased_progress,
            zoom_factor,
            pan_x,
            pan_y,
        );
        
        // Create Canvas-compatible format with dimensions
        let rgba_base64 = general_purpose::STANDARD.encode(&frame_data);
        let data_url = format!("rgba:{}x{}:{}", width, height, rgba_base64);
        frames_array.push(&JsValue::from_str(&data_url));
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated {} Ken Burns frames in {}ms", frames, end_time - start_time);
    frames_array
}

/// Generate transition frames between two images
#[wasm_bindgen]
pub fn bevy_generate_transition(
    rgba_data1: &[u8],
    rgba_data2: &[u8],
    width: u32,
    height: u32,
    frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    let frames_array = js_sys::Array::new();
    let start_time = js_sys::Date::now();
    
    let transition = match transition_type {
        "crossfade" => TransitionType::Crossfade,
        "slide_left" => TransitionType::SlideLeft,
        "slide_right" => TransitionType::SlideRight,
        "slide_up" => TransitionType::SlideUp,
        "slide_down" => TransitionType::SlideDown,
        "zoom_in" => TransitionType::ZoomIn,
        "zoom_out" => TransitionType::ZoomOut,
        "dissolve" => TransitionType::Dissolve,
        "wipe" => TransitionType::Wipe,
        "iris" => TransitionType::Iris,
        _ => TransitionType::Crossfade,
    };
    
    for i in 0..frames {
        let progress = i as f32 / (frames - 1) as f32;
        let eased_progress = EasingType::EaseInOutCubic.apply(progress);
        
        let frame_data = apply_transition_effect(
            rgba_data1,
            rgba_data2,
            width,
            height,
            eased_progress,
            &transition,
        );
        
        // Create Canvas-compatible format with dimensions
        let rgba_base64 = general_purpose::STANDARD.encode(&frame_data);
        let data_url = format!("rgba:{}x{}:{}", width, height, rgba_base64);
        frames_array.push(&JsValue::from_str(&data_url));
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated {} transition frames in {}ms", frames, end_time - start_time);
    frames_array
}

/// Generate slideshow from multiple images with effects
#[wasm_bindgen]
pub fn bevy_generate_slideshow(
    images_data: js_sys::Array,
    frames_per_image: u32,
    transition_frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    let all_frames = js_sys::Array::new();
    let start_time = js_sys::Date::now();
    
    // Extract image data from JS array
    let mut images: Vec<(Vec<u8>, u32, u32)> = Vec::new();
    for i in 0..images_data.length() {
        if let Some(image_obj) = images_data.get(i).dyn_ref::<js_sys::Object>() {
            // Assume each object has { data: Uint8Array, width: number, height: number }
            if let (Ok(data_val), Ok(width_val), Ok(height_val)) = (
                js_sys::Reflect::get(image_obj, &JsValue::from_str("data")),
                js_sys::Reflect::get(image_obj, &JsValue::from_str("width")),
                js_sys::Reflect::get(image_obj, &JsValue::from_str("height")),
            ) {
                if let (Some(uint8_array), Some(width), Some(height)) = (
                    data_val.dyn_ref::<js_sys::Uint8Array>(),
                    width_val.as_f64(),
                    height_val.as_f64(),
                ) {
                    images.push((uint8_array.to_vec(), width as u32, height as u32));
                }
            }
        }
    }
    
    if images.is_empty() {
        console_log!("No valid images provided");
        return all_frames;
    }
    
    // Generate frames for each image with motion effects
    for (idx, (rgba_data, width, height)) in images.iter().enumerate() {
        // Add motion effect to current image
        let motion_frames = generate_motion_effect_frames(
            rgba_data,
            *width,
            *height,
            frames_per_image,
            idx,
        );
        
        // Add motion frames to result
        for frame in motion_frames {
            all_frames.push(&frame);
        }
        
        // Add transition to next image (if not last)
        if idx < images.len() - 1 {
            let (next_rgba, next_width, next_height) = &images[idx + 1];
            
            // Ensure both images have same dimensions
            let (img1_data, img2_data) = if width == next_width && height == next_height {
                (rgba_data.clone(), next_rgba.clone())
            } else {
                // Simple resize (in real implementation, use proper scaling)
                let target_width = (*width).min(*next_width);
                let target_height = (*height).min(*next_height);
                (
                    simple_resize(rgba_data, *width, *height, target_width, target_height),
                    simple_resize(next_rgba, *next_width, *next_height, target_width, target_height),
                )
            };
            
            let transition_frames_result = bevy_generate_transition(
                &img1_data,
                &img2_data,
                (*width).min(*next_width),
                (*height).min(*next_height),
                transition_frames,
                transition_type,
            );
            
            // Add transition frames
            for i in 0..transition_frames_result.length() {
                all_frames.push(&transition_frames_result.get(i));
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!(
        "Generated slideshow with {} total frames in {}ms", 
        all_frames.length(), 
        end_time - start_time
    );
    all_frames
}

/// Generate parallax scrolling effect
#[wasm_bindgen]
pub fn bevy_generate_parallax(
    bg_data: &[u8],
    fg_data: &[u8],
    width: u32,
    height: u32,
    frames: u32,
    scroll_speed: f32,
) -> js_sys::Array {
    let frames_array = js_sys::Array::new();
    let start_time = js_sys::Date::now();
    
    for i in 0..frames {
        let progress = i as f32 / frames as f32;
        
        let frame_data = apply_parallax_effect(
            bg_data,
            fg_data,
            width,
            height,
            progress,
            scroll_speed,
        );
        
        // Create Canvas-compatible format with dimensions
        let rgba_base64 = general_purpose::STANDARD.encode(&frame_data);
        let data_url = format!("rgba:{}x{}:{}", width, height, rgba_base64);
        frames_array.push(&JsValue::from_str(&data_url));
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated {} parallax frames in {}ms", frames, end_time - start_time);
    frames_array
}

// Helper functions

fn apply_ken_burns_effect(
    rgba_data: &[u8],
    width: u32,
    height: u32,
    progress: f32,
    zoom_factor: f32,
    pan_x: f32,
    pan_y: f32,
) -> Vec<u8> {
    // Calculate current zoom and pan
    let current_zoom = 1.0 + (zoom_factor - 1.0) * progress;
    let current_pan_x = pan_x * progress;
    let current_pan_y = pan_y * progress;
    
    // Apply zoom and pan transformation
    let mut result_data = Vec::with_capacity(rgba_data.len());
    
    for y in 0..height {
        for x in 0..width {
            // Transform coordinates
            let src_x = ((x as f32 - current_pan_x) / current_zoom) as i32;
            let src_y = ((y as f32 - current_pan_y) / current_zoom) as i32;
            
            // Sample from source image
            if src_x >= 0 && src_x < width as i32 && src_y >= 0 && src_y < height as i32 {
                let src_idx = (src_y as u32 * width + src_x as u32) as usize * 4;
                if src_idx + 3 < rgba_data.len() {
                    result_data.extend_from_slice(&rgba_data[src_idx..src_idx + 4]);
                } else {
                    result_data.extend_from_slice(&[0, 0, 0, 255]);
                }
            } else {
                // Outside bounds - use black
                result_data.extend_from_slice(&[0, 0, 0, 255]);
            }
        }
    }
    
    result_data
}

fn apply_transition_effect(
    rgba_data1: &[u8],
    rgba_data2: &[u8],
    width: u32,
    height: u32,
    progress: f32,
    transition: &TransitionType,
) -> Vec<u8> {
    let mut result_data = Vec::with_capacity(rgba_data1.len());
    
    match transition {
        TransitionType::Crossfade => {
            // Simple alpha blending
            for i in 0..(width * height) as usize {
                let idx = i * 4;
                if idx + 3 < rgba_data1.len() && idx + 3 < rgba_data2.len() {
                    let alpha = progress;
                    let r = (rgba_data1[idx] as f32 * (1.0 - alpha) + rgba_data2[idx] as f32 * alpha) as u8;
                    let g = (rgba_data1[idx + 1] as f32 * (1.0 - alpha) + rgba_data2[idx + 1] as f32 * alpha) as u8;
                    let b = (rgba_data1[idx + 2] as f32 * (1.0 - alpha) + rgba_data2[idx + 2] as f32 * alpha) as u8;
                    let a = (rgba_data1[idx + 3] as f32 * (1.0 - alpha) + rgba_data2[idx + 3] as f32 * alpha) as u8;
                    
                    result_data.extend_from_slice(&[r, g, b, a]);
                }
            }
        },
        TransitionType::SlideLeft => {
            let offset = (progress * width as f32) as i32;
            
            for y in 0..height {
                for x in 0..width {
                    let shifted_x = x as i32 + offset;
                    
                    if shifted_x < width as i32 {
                        // Sample from image 1
                        let idx = (y * width + shifted_x as u32) as usize * 4;
                        if idx + 3 < rgba_data1.len() {
                            result_data.extend_from_slice(&rgba_data1[idx..idx + 4]);
                        } else {
                            result_data.extend_from_slice(&[0, 0, 0, 255]);
                        }
                    } else {
                        // Sample from image 2
                        let src_x = shifted_x - width as i32;
                        let idx = (y * width + src_x as u32) as usize * 4;
                        if idx + 3 < rgba_data2.len() {
                            result_data.extend_from_slice(&rgba_data2[idx..idx + 4]);
                        } else {
                            result_data.extend_from_slice(&[0, 0, 0, 255]);
                        }
                    }
                }
            }
        },
        TransitionType::Dissolve => {
            // Random dissolve effect
            for i in 0..(width * height) as usize {
                let idx = i * 4;
                if idx + 3 < rgba_data1.len() && idx + 3 < rgba_data2.len() {
                    // Simple pseudo-random based on position
                    let random = ((i as f32 * 12.9898).sin() * 43758.5453).fract();
                    
                    if random < progress {
                        result_data.extend_from_slice(&rgba_data2[idx..idx + 4]);
                    } else {
                        result_data.extend_from_slice(&rgba_data1[idx..idx + 4]);
                    }
                }
            }
        },
        _ => {
            // Fallback to crossfade for other transitions
            return apply_transition_effect(rgba_data1, rgba_data2, width, height, progress, &TransitionType::Crossfade);
        }
    }
    
    result_data
}

fn generate_motion_effect_frames(
    rgba_data: &[u8],
    width: u32,
    height: u32,
    frames: u32,
    image_index: usize,
) -> Vec<JsValue> {
    let mut motion_frames = Vec::new();
    
    // Different motion effects for variety
    let effects = ["zoom_in", "zoom_out", "pan_left", "pan_right", "pan_up", "pan_down"];
    let effect = effects[image_index % effects.len()];
    
    for i in 0..frames {
        let progress = i as f32 / frames as f32;
        let eased_progress = EasingType::EaseInOutSine.apply(progress);
        
        let frame_data = match effect {
            "zoom_in" => apply_ken_burns_effect(rgba_data, width, height, eased_progress, 1.2, 0.0, 0.0),
            "zoom_out" => apply_ken_burns_effect(rgba_data, width, height, 1.0 - eased_progress, 1.3, 0.0, 0.0),
            "pan_left" => apply_ken_burns_effect(rgba_data, width, height, eased_progress, 1.15, -20.0, 0.0),
            "pan_right" => apply_ken_burns_effect(rgba_data, width, height, eased_progress, 1.15, 20.0, 0.0),
            "pan_up" => apply_ken_burns_effect(rgba_data, width, height, eased_progress, 1.15, 0.0, -15.0),
            "pan_down" => apply_ken_burns_effect(rgba_data, width, height, eased_progress, 1.15, 0.0, 15.0),
            _ => rgba_data.to_vec(),
        };
        
        // Create a simple Canvas-compatible ImageData structure
        // Format: "rgba:{width}x{height}:{base64_rgba_data}"
        let rgba_base64 = general_purpose::STANDARD.encode(&frame_data);
        let data_url = format!("rgba:{}x{}:{}", width, height, rgba_base64);
        motion_frames.push(JsValue::from_str(&data_url));
    }
    
    motion_frames
}

fn apply_parallax_effect(
    bg_data: &[u8],
    fg_data: &[u8],
    width: u32,
    height: u32,
    progress: f32,
    scroll_speed: f32,
) -> Vec<u8> {
    let mut result_data = Vec::with_capacity(bg_data.len());
    
    let bg_offset = (progress * scroll_speed * width as f32) as i32;
    let fg_offset = (progress * scroll_speed * 2.0 * width as f32) as i32;
    
    for y in 0..height {
        for x in 0..width {
            // Sample background with scrolling
            let bg_x = ((x as i32 + bg_offset) % width as i32) as u32;
            let bg_idx = (y * width + bg_x) as usize * 4;
            
            // Sample foreground with faster scrolling
            let fg_x = ((x as i32 + fg_offset) % width as i32) as u32;
            let fg_idx = (y * width + fg_x) as usize * 4;
            
            if bg_idx + 3 < bg_data.len() && fg_idx + 3 < fg_data.len() {
                // Alpha blend foreground over background
                let fg_alpha = fg_data[fg_idx + 3] as f32 / 255.0;
                let bg_alpha = 1.0 - fg_alpha;
                
                let r = (bg_data[bg_idx] as f32 * bg_alpha + fg_data[fg_idx] as f32 * fg_alpha) as u8;
                let g = (bg_data[bg_idx + 1] as f32 * bg_alpha + fg_data[fg_idx + 1] as f32 * fg_alpha) as u8;
                let b = (bg_data[bg_idx + 2] as f32 * bg_alpha + fg_data[fg_idx + 2] as f32 * fg_alpha) as u8;
                let a = 255u8;
                
                result_data.extend_from_slice(&[r, g, b, a]);
            } else if bg_idx + 3 < bg_data.len() {
                result_data.extend_from_slice(&bg_data[bg_idx..bg_idx + 4]);
            } else {
                result_data.extend_from_slice(&[0, 0, 0, 255]);
            }
        }
    }
    
    result_data
}

fn simple_resize(
    rgba_data: &[u8],
    old_width: u32,
    old_height: u32,
    new_width: u32,
    new_height: u32,
) -> Vec<u8> {
    let mut resized_data = Vec::with_capacity((new_width * new_height * 4) as usize);
    
    for y in 0..new_height {
        for x in 0..new_width {
            let src_x = (x * old_width / new_width).min(old_width - 1);
            let src_y = (y * old_height / new_height).min(old_height - 1);
            let src_idx = (src_y * old_width + src_x) as usize * 4;
            
            if src_idx + 3 < rgba_data.len() {
                resized_data.extend_from_slice(&rgba_data[src_idx..src_idx + 4]);
            } else {
                resized_data.extend_from_slice(&[0, 0, 0, 255]);
            }
        }
    }
    
    resized_data
}
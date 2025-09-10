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

// Enhanced transition effects using CPU processing but optimized algorithms
#[wasm_bindgen]
pub fn generate_enhanced_video_frames(
    images_data: js_sys::Array,
    frames_per_image: u32,
    transition_frames: u32,
    effect_type: &str,
    intensity: f32,
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    let all_frames = js_sys::Array::new();
    
    console_log!("Generating enhanced video with {} images using effect: {}", images_data.length(), effect_type);
    
    let mut processed_images = Vec::new();
    
    // Load all images
    for i in 0..images_data.length() {
        let img_data = images_data.get(i);
        if let Some(uint8_array) = img_data.dyn_ref::<js_sys::Uint8Array>() {
            let data = uint8_array.to_vec();
            match image::load_from_memory(&data) {
                Ok(img) => processed_images.push(img),
                Err(_) => {
                    console_log!("Failed to load image {}", i);
                    continue;
                }
            }
        }
    }
    
    if processed_images.is_empty() {
        console_log!("No valid images to process");
        return all_frames;
    }
    
    // Resize all images to the same dimensions
    let (target_width, target_height) = (processed_images[0].width(), processed_images[0].height());
    for img in &mut processed_images {
        *img = img.resize_exact(target_width, target_height, image::imageops::FilterType::Lanczos3);
    }
    
    // Enhanced effects list
    let enhanced_effects = [
        "cinematic_zoom_in", "dramatic_zoom_out", "epic_pan_left", "epic_pan_right",
        "pan_up_mystical", "pan_down_cinematic", "parallax_zoom", "lens_distortion",
        "vignette_fade", "film_grain_vintage", "light_leak_golden", "bokeh_blur",
        "cross_dissolve", "slide_elegant", "tilt_shift", "chromatic_aberration"
    ];
    
    for (idx, img) in processed_images.iter().enumerate() {
        // Select enhanced effect
        let effect_index = (idx * 7 + 3) % enhanced_effects.len();
        let selected_effect = enhanced_effects[effect_index];
        
        console_log!("Image {} using enhanced effect: {}", idx, selected_effect);
        
        // Generate frames with enhanced motion effects
        for frame_idx in 0..frames_per_image {
            let progress = frame_idx as f32 / frames_per_image as f32;
            let enhanced_img = apply_enhanced_motion_effect(img, progress, selected_effect, intensity);
            
            // Convert to base64
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match enhanced_img.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let base64_data = general_purpose::STANDARD.encode(&output);
                    all_frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
                },
                Err(_) => {
                    console_log!("Failed to encode frame {} of image {}", frame_idx, idx);
                }
            }
        }
        
        // Add enhanced transition frames
        if idx < processed_images.len() - 1 {
            let transition_frames_array = generate_enhanced_transition_frames(
                img,
                &processed_images[idx + 1],
                transition_frames,
                effect_type,
                intensity
            );
            
            // Add transition frames to the main array
            for i in 0..transition_frames_array.length() {
                all_frames.push(&transition_frames_array.get(i));
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated {} enhanced frames in {}ms", all_frames.length(), end_time - start_time);
    
    all_frames
}

fn apply_enhanced_motion_effect(img: &DynamicImage, progress: f32, effect_type: &str, intensity: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    
    match effect_type {
        "cinematic_zoom_in" => {
            let zoom_factor = 1.0 + (0.25 * ease_in_out_cubic(progress) * intensity);
            apply_enhanced_zoom(img, zoom_factor, width, height)
        },
        "dramatic_zoom_out" => {
            let zoom_factor = 1.4 - (0.4 * ease_out_quad(progress) * intensity);
            apply_enhanced_zoom(img, zoom_factor, width, height)
        },
        "epic_pan_left" => {
            apply_enhanced_pan(img, progress, "left", intensity, width, height)
        },
        "epic_pan_right" => {
            apply_enhanced_pan(img, progress, "right", intensity, width, height)
        },
        "parallax_zoom" => {
            apply_parallax_effect(img, progress, intensity, width, height)
        },
        "film_grain_vintage" => {
            apply_film_grain_effect(img, progress, intensity, width, height)
        },
        "light_leak_golden" => {
            apply_light_leak_effect(img, progress, intensity, width, height)
        },
        "chromatic_aberration" => {
            apply_chromatic_aberration(img, progress, intensity, width, height)
        },
        _ => img.clone()
    }
}

// Enhanced easing functions
fn ease_in_out_cubic(t: f32) -> f32 {
    if t < 0.5 {
        4.0 * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powf(3.0) / 2.0
    }
}

fn ease_out_quad(t: f32) -> f32 {
    1.0 - (1.0 - t) * (1.0 - t)
}

fn apply_enhanced_zoom(img: &DynamicImage, zoom_factor: f32, orig_width: u32, orig_height: u32) -> DynamicImage {
    let new_width = (orig_width as f32 * zoom_factor) as u32;
    let new_height = (orig_height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    if zoom_factor > 1.0 {
        let crop_x = (new_width - orig_width) / 2;
        let crop_y = (new_height - orig_height) / 2;
        resized.crop_imm(crop_x, crop_y, orig_width, orig_height)
    } else {
        let pad_x = (orig_width - new_width) / 2;
        let pad_y = (orig_height - new_height) / 2;
        let mut padded = image::ImageBuffer::new(orig_width, orig_height);
        
        for pixel in padded.pixels_mut() {
            *pixel = image::Rgba([0, 0, 0, 255]);
        }
        
        image::imageops::overlay(&mut padded, &resized, pad_x as i64, pad_y as i64);
        DynamicImage::ImageRgba8(padded)
    }
}

fn apply_enhanced_pan(img: &DynamicImage, progress: f32, direction: &str, intensity: f32, orig_width: u32, orig_height: u32) -> DynamicImage {
    let zoom_factor = 1.2 + (intensity * 0.1);
    let new_width = (orig_width as f32 * zoom_factor) as u32;
    let new_height = (orig_height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    let ease_progress = ease_in_out_cubic(progress);
    let (crop_x, crop_y) = match direction {
        "left" => {
            let max_move = new_width - orig_width;
            (((max_move as f32) * ease_progress * intensity) as u32, (new_height - orig_height) / 2)
        },
        "right" => {
            let max_move = new_width - orig_width;
            (((max_move as f32) * (1.0 - ease_progress) * intensity) as u32, (new_height - orig_height) / 2)
        },
        _ => ((new_width - orig_width) / 2, (new_height - orig_height) / 2)
    };
    
    resized.crop_imm(crop_x, crop_y, orig_width, orig_height)
}

fn apply_parallax_effect(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.15 * progress * intensity);
    let mut result = apply_enhanced_zoom(img, zoom_factor, width, height);
    
    // Add brightness variation for parallax depth
    let brightness_factor = 1.0 + (0.1 * (progress * std::f32::consts::PI * 2.0).sin() * intensity);
    apply_brightness_adjustment(&mut result, brightness_factor)
}

fn apply_film_grain_effect(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let grain_intensity = 12.0 * intensity;
    
    // Enhanced grain with time-based variation
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let seed = (x * 31 + y * 17 + (progress * 1000.0) as u32) as f32;
        let noise = (seed.sin() * 43758.5453).fract() - 0.5;
        let grain = (noise * grain_intensity) as i16;
        
        pixel[0] = (pixel[0] as i16 + grain).clamp(0, 255) as u8;
        pixel[1] = (pixel[1] as i16 + grain).clamp(0, 255) as u8;
        pixel[2] = (pixel[2] as i16 + grain).clamp(0, 255) as u8;
    }
    
    // Enhanced vintage color grading
    for pixel in rgba_img.pixels_mut() {
        pixel[0] = ((pixel[0] as f32 * 1.08).min(255.0)) as u8;
        pixel[1] = ((pixel[1] as f32 * 0.96).min(255.0)) as u8;
        pixel[2] = ((pixel[2] as f32 * 0.82).min(255.0)) as u8;
    }
    
    let zoom_factor = 1.0 + (0.08 * ease_in_out_cubic(progress) * intensity);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_enhanced_zoom(&result, zoom_factor, width, height)
}

fn apply_light_leak_effect(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let leak_strength = progress * 0.5 * intensity;
    
    // Enhanced light leak with multiple sources
    let leak_positions = [
        (width as f32 * 0.85, height as f32 * 0.15),
        (width as f32 * 0.1, height as f32 * 0.6),
        (width as f32 * 0.5, height as f32 * 0.1),
    ];
    
    for (leak_x, leak_y) in leak_positions.iter() {
        for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
            let dx = (x as f32 - leak_x).abs();
            let dy = (y as f32 - leak_y).abs();
            let distance = (dx * dx + dy * dy).sqrt();
            let max_distance = (width as f32 + height as f32) / 4.0;
            
            if distance < max_distance {
                let leak_factor = (1.0 - distance / max_distance) * leak_strength * 0.6;
                let golden_tint = (255.0 * leak_factor) as u8;
                
                pixel[0] = (pixel[0] as u16 + golden_tint as u16).min(255) as u8;
                pixel[1] = (pixel[1] as u16 + (golden_tint as f32 * 0.8) as u16).min(255) as u8;
                pixel[2] = (pixel[2] as u16 + (golden_tint as f32 * 0.3) as u16).min(255) as u8;
            }
        }
    }
    
    let zoom_factor = 1.0 + (0.12 * progress * intensity);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_enhanced_zoom(&result, zoom_factor, width, height)
}

fn apply_chromatic_aberration(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let original_img = img.to_rgba8();
    let mut rgba_img = img.to_rgba8();
    let aberration_strength = 3.0 * intensity * progress;
    
    if aberration_strength > 0.5 {
        let center_x = width as f32 / 2.0;
        let center_y = height as f32 / 2.0;
        
        for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
            let dx = x as f32 - center_x;
            let dy = y as f32 - center_y;
            let distance = (dx * dx + dy * dy).sqrt();
            let max_distance = (width as f32 + height as f32) / 4.0;
            
            let aberration_factor = (distance / max_distance) * aberration_strength;
            let r_offset = (aberration_factor * 1.5) as i32;
            let b_offset = -(aberration_factor * 1.2) as i32;
            
            // Sample red channel with offset
            let r_x = (x as i32 + r_offset).clamp(0, width as i32 - 1) as u32;
            let r_y = y;
            if let Some(r_pixel) = original_img.get_pixel_checked(r_x, r_y) {
                pixel[0] = r_pixel[0];
            }
            
            // Sample blue channel with offset
            let b_x = (x as i32 + b_offset).clamp(0, width as i32 - 1) as u32;
            let b_y = y;
            if let Some(b_pixel) = original_img.get_pixel_checked(b_x, b_y) {
                pixel[2] = b_pixel[2];
            }
        }
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

fn apply_brightness_adjustment(img: &mut DynamicImage, factor: f32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    for pixel in rgba_img.pixels_mut() {
        pixel[0] = ((pixel[0] as f32 * factor).min(255.0)) as u8;
        pixel[1] = ((pixel[1] as f32 * factor).min(255.0)) as u8;
        pixel[2] = ((pixel[2] as f32 * factor).min(255.0)) as u8;
    }
    DynamicImage::ImageRgba8(rgba_img)
}

fn generate_enhanced_transition_frames(
    img1: &DynamicImage,
    img2: &DynamicImage,
    transition_frames: u32,
    transition_type: &str,
    intensity: f32
) -> js_sys::Array {
    let frames = js_sys::Array::new();
    
    for i in 0..transition_frames {
        let progress = i as f32 / (transition_frames - 1) as f32;
        
        let frame = match transition_type {
            "enhanced_crossfade" => {
                enhanced_crossfade(img1, img2, progress, intensity)
            },
            "cinematic_dissolve" => {
                cinematic_dissolve(img1, img2, progress, intensity)
            },
            _ => {
                // Default enhanced crossfade
                enhanced_crossfade(img1, img2, progress, intensity)
            }
        };
        
        let mut output = Vec::new();
        let mut cursor = Cursor::new(&mut output);
        
        if frame.write_to(&mut cursor, ImageFormat::Png).is_ok() {
            let base64_data = general_purpose::STANDARD.encode(&output);
            frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
        }
    }
    
    frames
}

fn enhanced_crossfade(img1: &DynamicImage, img2: &DynamicImage, progress: f32, intensity: f32) -> DynamicImage {
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    
    let (width, height) = (rgba1.width(), rgba1.height());
    let mut blended = image::ImageBuffer::new(width, height);
    
    let eased_progress = ease_in_out_cubic(progress);
    
    for (x, y, pixel) in blended.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Enhanced blending with luminance consideration
        let lum1 = (p1[0] as f32 * 0.299 + p1[1] as f32 * 0.587 + p1[2] as f32 * 0.114) / 255.0;
        let lum2 = (p2[0] as f32 * 0.299 + p2[1] as f32 * 0.587 + p2[2] as f32 * 0.114) / 255.0;
        
        let adjusted_progress = eased_progress + (lum2 - lum1) * 0.1 * intensity;
        let final_progress = adjusted_progress.clamp(0.0, 1.0);
        
        let r = (p1[0] as f32 * (1.0 - final_progress) + p2[0] as f32 * final_progress) as u8;
        let g = (p1[1] as f32 * (1.0 - final_progress) + p2[1] as f32 * final_progress) as u8;
        let b = (p1[2] as f32 * (1.0 - final_progress) + p2[2] as f32 * final_progress) as u8;
        let a = (p1[3] as f32 * (1.0 - final_progress) + p2[3] as f32 * final_progress) as u8;
        
        *pixel = image::Rgba([r, g, b, a]);
    }
    
    DynamicImage::ImageRgba8(blended)
}

fn cinematic_dissolve(img1: &DynamicImage, img2: &DynamicImage, progress: f32, intensity: f32) -> DynamicImage {
    // More sophisticated dissolve with noise-based transition
    let result = enhanced_crossfade(img1, img2, progress, intensity);
    
    // Add subtle noise-based dissolve pattern
    let mut rgba_img = result.to_rgba8();
    let img2_rgba = img2.to_rgba8();
    let noise_scale = 50.0;
    
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let noise_x = x as f32 / noise_scale;
        let noise_y = y as f32 / noise_scale;
        let noise = ((noise_x.sin() * 43758.5453).fract() + (noise_y.cos() * 12.9898).fract()) / 2.0;
        
        let threshold = progress + (noise - 0.5) * 0.2 * intensity;
        
        if threshold > 0.5 {
            let p2 = img2_rgba.get_pixel(x, y);
            *pixel = *p2;
        }
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

#[wasm_bindgen]
pub fn get_enhanced_effects_list() -> js_sys::Array {
    let effects = js_sys::Array::new();
    let enhanced_effects = [
        "cinematic_zoom_in",
        "dramatic_zoom_out", 
        "epic_pan_left",
        "epic_pan_right",
        "parallax_zoom",
        "film_grain_vintage",
        "light_leak_golden",
        "chromatic_aberration"
    ];
    
    for effect in &enhanced_effects {
        effects.push(&JsValue::from_str(effect));
    }
    
    effects
}
use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageBuffer, Rgba, GenericImageView};
use std::f32::consts::PI;
use base64::{Engine as _, engine::general_purpose};

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

/// Ultra smooth transition generator with advanced interpolation
#[wasm_bindgen]
pub fn generate_ultra_smooth_transition(
    img1_data: &[u8],
    img2_data: &[u8],
    transition_frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    
    console_log!("🎭 Generating ultra smooth {} transition with {} frames", transition_type, transition_frames);
    
    let img1 = match image::load_from_memory(img1_data) {
        Ok(img) => img,
        Err(_) => {
            console_log!("❌ Failed to load first image");
            return js_sys::Array::new();
        }
    };
    
    let img2 = match image::load_from_memory(img2_data) {
        Ok(img) => img,
        Err(_) => {
            console_log!("❌ Failed to load second image");
            return js_sys::Array::new();
        }
    };
    
    let frames = create_ultra_smooth_transition(&img1, &img2, transition_frames, transition_type);
    let js_frames = js_sys::Array::new();
    
    for frame in frames {
        let base64_frame = encode_frame_to_base64(&frame);
        js_frames.push(&JsValue::from_str(&base64_frame));
    }
    
    let processing_time = js_sys::Date::now() - start_time;
    console_log!("✨ Ultra smooth transition generated in {:.1}ms", processing_time);
    
    js_frames
}

/// Advanced easing functions for natural motion
pub fn ease_in_out_quartic(t: f32) -> f32 {
    if t < 0.5 {
        8.0 * t * t * t * t
    } else {
        1.0 - 8.0 * (1.0 - t).powf(4.0)
    }
}

pub fn ease_in_out_sine(t: f32) -> f32 {
    -(((t * PI).cos()) - 1.0) / 2.0
}

pub fn ease_in_out_expo(t: f32) -> f32 {
    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else if t < 0.5 {
        2.0f32.powf(20.0 * t - 10.0) / 2.0
    } else {
        (2.0 - 2.0f32.powf(-20.0 * t + 10.0)) / 2.0
    }
}

pub fn ease_in_out_elastic(t: f32) -> f32 {
    let c5 = (2.0 * PI) / 4.5;
    
    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else if t < 0.5 {
        -(2.0f32.powf(20.0 * t - 10.0) * ((20.0 * t - 11.125) * c5).sin()) / 2.0
    } else {
        (2.0f32.powf(-20.0 * t + 10.0) * ((20.0 * t - 11.125) * c5).sin()) / 2.0 + 1.0
    }
}

/// Create ultra smooth transition with advanced interpolation
fn create_ultra_smooth_transition(
    img1: &DynamicImage,
    img2: &DynamicImage,
    frame_count: u32,
    transition_type: &str,
) -> Vec<DynamicImage> {
    let mut frames = Vec::new();
    
    // Ensure both images have the same dimensions
    let (width, height) = img1.dimensions();
    let img2_resized = img2.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    
    for frame_idx in 0..frame_count {
        let raw_progress = frame_idx as f32 / (frame_count - 1) as f32;
        
        let frame = match transition_type {
            "ultra_crossfade" => create_ultra_crossfade(img1, &img2_resized, raw_progress),
            "morph_blend" => create_morph_blend(img1, &img2_resized, raw_progress),
            "optical_flow" => create_optical_flow_transition(img1, &img2_resized, raw_progress),
            "luminance_morph" => create_luminance_morph(img1, &img2_resized, raw_progress),
            "gradient_dissolve" => create_gradient_dissolve(img1, &img2_resized, raw_progress),
            "wave_transition" => create_wave_transition(img1, &img2_resized, raw_progress),
            "spiral_morph" => create_spiral_morph(img1, &img2_resized, raw_progress),
            _ => create_ultra_crossfade(img1, &img2_resized, raw_progress),
        };
        
        frames.push(frame);
    }
    
    frames
}

/// Ultra smooth crossfade with perceptual blending
fn create_ultra_crossfade(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    // Use advanced easing for more natural transition
    let progress = ease_in_out_quartic(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Advanced perceptual blending với gamma correction
        let blend_perceptual = |a: u8, b: u8, t: f32| -> u8 {
            // Convert to linear space
            let a_linear = (a as f32 / 255.0).powf(2.2);
            let b_linear = (b as f32 / 255.0).powf(2.2);
            
            // Blend in linear space
            let blended_linear = a_linear * (1.0 - t) + b_linear * t;
            
            // Convert back to sRGB
            (blended_linear.powf(1.0 / 2.2) * 255.0).clamp(0.0, 255.0) as u8
        };
        
        *pixel = Rgba([
            blend_perceptual(p1[0], p2[0], progress),
            blend_perceptual(p1[1], p2[1], progress),
            blend_perceptual(p1[2], p2[2], progress),
            ((p1[3] as f32 * (1.0 - progress) + p2[3] as f32 * progress)) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Morphing blend transition với feature matching
fn create_morph_blend(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_sine(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        // Calculate distance from center for radial morphing effect
        let dx = x as f32 - center_x;
        let dy = y as f32 - center_y;
        let distance = (dx * dx + dy * dy).sqrt();
        let max_distance = (center_x * center_x + center_y * center_y).sqrt();
        let normalized_distance = (distance / max_distance).min(1.0);
        
        // Apply distance-based timing offset for wave effect
        let time_offset = normalized_distance * 0.5;
        let local_progress = (progress + time_offset).min(1.0);
        
        // Advanced blending với spatial variation
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Luminance-aware blending
        let lum1 = 0.299 * p1[0] as f32 + 0.587 * p1[1] as f32 + 0.114 * p1[2] as f32;
        let lum2 = 0.299 * p2[0] as f32 + 0.587 * p2[1] as f32 + 0.114 * p2[2] as f32;
        let lum_factor = 1.0 + (lum1 - lum2).abs() / 255.0 * 0.1;
        
        let adjusted_progress = (local_progress * lum_factor).min(1.0);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - adjusted_progress) + p2[0] as f32 * adjusted_progress) as u8,
            (p1[1] as f32 * (1.0 - adjusted_progress) + p2[1] as f32 * adjusted_progress) as u8,
            (p1[2] as f32 * (1.0 - adjusted_progress) + p2[2] as f32 * adjusted_progress) as u8,
            (p1[3] as f32 * (1.0 - adjusted_progress) + p2[3] as f32 * adjusted_progress) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Optical flow-inspired transition
fn create_optical_flow_transition(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_expo(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        // Calculate optical flow-like displacement
        let flow_x = (progress * 10.0 * ((y as f32 / height as f32) * PI).sin()) as i32;
        let flow_y = (progress * 5.0 * ((x as f32 / width as f32) * PI * 2.0).cos()) as i32;
        
        // Sample with flow displacement
        let src_x1 = (x as i32 - flow_x).max(0).min(width as i32 - 1) as u32;
        let src_y1 = (y as i32 - flow_y).max(0).min(height as i32 - 1) as u32;
        let src_x2 = (x as i32 + flow_x).max(0).min(width as i32 - 1) as u32;
        let src_y2 = (y as i32 + flow_y).max(0).min(height as i32 - 1) as u32;
        
        let p1 = rgba1.get_pixel(src_x1, src_y1);
        let p2 = rgba2.get_pixel(src_x2, src_y2);
        
        // Blend with flow-based weighting
        let flow_strength = (flow_x.abs() + flow_y.abs()) as f32 / 15.0;
        let blend_factor = progress + flow_strength * 0.1;
        let clamped_blend = blend_factor.clamp(0.0, 1.0);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - clamped_blend) + p2[0] as f32 * clamped_blend) as u8,
            (p1[1] as f32 * (1.0 - clamped_blend) + p2[1] as f32 * clamped_blend) as u8,
            (p1[2] as f32 * (1.0 - clamped_blend) + p2[2] as f32 * clamped_blend) as u8,
            (p1[3] as f32 * (1.0 - clamped_blend) + p2[3] as f32 * clamped_blend) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Luminance-based morphing
fn create_luminance_morph(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_elastic(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Calculate luminance for adaptive blending
        let lum1 = (0.299 * p1[0] as f32 + 0.587 * p1[1] as f32 + 0.114 * p1[2] as f32) / 255.0;
        let lum2 = (0.299 * p2[0] as f32 + 0.587 * p2[1] as f32 + 0.114 * p2[2] as f32) / 255.0;
        
        // Luminance-guided transition timing
        let lum_avg = (lum1 + lum2) / 2.0;
        let lum_diff = (lum1 - lum2).abs();
        
        // Areas with high luminance difference transition faster
        let adapted_progress = progress + (lum_diff * 0.3 - 0.15);
        let clamped_progress = adapted_progress.clamp(0.0, 1.0);
        
        // Color-preserving blend
        let preserve_factor = 1.0 - lum_avg * 0.2; // Preserve colors in darker areas
        let final_progress = clamped_progress * preserve_factor + progress * (1.0 - preserve_factor);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - final_progress) + p2[0] as f32 * final_progress) as u8,
            (p1[1] as f32 * (1.0 - final_progress) + p2[1] as f32 * final_progress) as u8,
            (p1[2] as f32 * (1.0 - final_progress) + p2[2] as f32 * final_progress) as u8,
            (p1[3] as f32 * (1.0 - final_progress) + p2[3] as f32 * final_progress) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Gradient-based dissolve
fn create_gradient_dissolve(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_sine(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        // Multi-directional gradient
        let grad_x = x as f32 / width as f32;
        let grad_y = y as f32 / height as f32;
        let grad_radial = ((x as f32 - width as f32 / 2.0).powf(2.0) + 
                          (y as f32 - height as f32 / 2.0).powf(2.0)).sqrt() / 
                         (width as f32 / 2.0);
        
        // Combine gradients for complex dissolve pattern
        let combined_grad = (grad_x + grad_y + grad_radial) / 3.0;
        let dissolve_threshold = progress + (combined_grad - 0.5) * 0.3;
        
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        if dissolve_threshold < 0.2 {
            *pixel = *p1;
        } else if dissolve_threshold > 0.8 {
            *pixel = *p2;
        } else {
            // Smooth transition zone
            let local_progress = (dissolve_threshold - 0.2) / 0.6;
            *pixel = Rgba([
                (p1[0] as f32 * (1.0 - local_progress) + p2[0] as f32 * local_progress) as u8,
                (p1[1] as f32 * (1.0 - local_progress) + p2[1] as f32 * local_progress) as u8,
                (p1[2] as f32 * (1.0 - local_progress) + p2[2] as f32 * local_progress) as u8,
                (p1[3] as f32 * (1.0 - local_progress) + p2[3] as f32 * local_progress) as u8,
            ]);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Wave-based transition
fn create_wave_transition(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_quartic(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        // Create wave patterns
        let wave1 = ((x as f32 / width as f32 * PI * 4.0) + (progress * PI * 2.0)).sin();
        let wave2 = ((y as f32 / height as f32 * PI * 3.0) + (progress * PI * 1.5)).cos();
        let wave_combined = (wave1 + wave2) / 2.0;
        
        // Wave-modulated progress
        let wave_progress = progress + wave_combined * 0.2;
        let clamped_progress = wave_progress.clamp(0.0, 1.0);
        
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - clamped_progress) + p2[0] as f32 * clamped_progress) as u8,
            (p1[1] as f32 * (1.0 - clamped_progress) + p2[1] as f32 * clamped_progress) as u8,
            (p1[2] as f32 * (1.0 - clamped_progress) + p2[2] as f32 * clamped_progress) as u8,
            (p1[3] as f32 * (1.0 - clamped_progress) + p2[3] as f32 * clamped_progress) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Spiral morphing transition
fn create_spiral_morph(img1: &DynamicImage, img2: &DynamicImage, raw_progress: f32) -> DynamicImage {
    let progress = ease_in_out_expo(raw_progress);
    
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    let (width, height) = rgba1.dimensions();
    let mut result = ImageBuffer::new(width, height);
    
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let dx = x as f32 - center_x;
        let dy = y as f32 - center_y;
        
        // Calculate polar coordinates
        let radius = (dx * dx + dy * dy).sqrt();
        let angle = dy.atan2(dx);
        
        // Create spiral effect
        let max_radius = (width as f32 + height as f32) / 4.0;
        let normalized_radius = (radius / max_radius).min(1.0);
        
        let spiral_offset = normalized_radius * 3.0 * PI + angle;
        let spiral_progress = progress + (spiral_offset / (6.0 * PI)) * 0.5;
        let clamped_progress = spiral_progress.clamp(0.0, 1.0);
        
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - clamped_progress) + p2[0] as f32 * clamped_progress) as u8,
            (p1[1] as f32 * (1.0 - clamped_progress) + p2[1] as f32 * clamped_progress) as u8,
            (p1[2] as f32 * (1.0 - clamped_progress) + p2[2] as f32 * clamped_progress) as u8,
            (p1[3] as f32 * (1.0 - clamped_progress) + p2[3] as f32 * clamped_progress) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

/// Encode frame to base64 for JavaScript
fn encode_frame_to_base64(img: &DynamicImage) -> String {
    let mut buffer = std::io::Cursor::new(Vec::new());
    match img.write_to(&mut buffer, image::ImageFormat::Png) {
        Ok(_) => {
            let bytes = buffer.into_inner();
            format!("data:image/png;base64,{}", base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &bytes))
        }
        Err(_) => String::new(),
    }
}
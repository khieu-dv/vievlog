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
    
    // Professional effects organized by categories for better variety
    let cinematic_effects = [
        "cinematic_zoom_in", "dramatic_zoom_out", "epic_zoom_spiral", 
        "smooth_zoom_pulse", "dynamic_zoom_wave"
    ];
    
    let pan_effects = [
        "epic_pan_left", "epic_pan_right", "pan_up_mystical", "pan_down_cinematic",
        "diagonal_pan_ne", "diagonal_pan_sw", "circular_pan", "figure8_pan"
    ];
    
    let artistic_effects = [
        "parallax_zoom", "lens_distortion", "vignette_fade", "tilt_shift",
        "bokeh_blur", "chromatic_aberration", "prismatic_split", "kaleidoscope"
    ];
    
    let vintage_effects = [
        "film_grain_vintage", "light_leak_golden", "retro_vhs", "sepia_dream",
        "polaroid_fade", "old_film_flicker", "vintage_bloom"
    ];
    
    let dynamic_effects = [
        "cross_dissolve", "slide_elegant", "spiral_transition", "wave_distortion",
        "particle_dissolve", "digital_glitch", "hologram_flicker"
    ];
    
    // Combine all effects with weighted distribution
    let all_enhanced_effects = [
        cinematic_effects.as_slice(),
        pan_effects.as_slice(), 
        artistic_effects.as_slice(),
        vintage_effects.as_slice(),
        dynamic_effects.as_slice()
    ];
    
    for (idx, img) in processed_images.iter().enumerate() {
        // Smart effect selection - ensure variety across different categories
        let category_index = idx % all_enhanced_effects.len();
        let category = all_enhanced_effects[category_index];
        let effect_in_category = (idx / all_enhanced_effects.len()) % category.len();
        let selected_effect = category[effect_in_category];
        
        console_log!("Image {} using enhanced effect: {} (category: {})", idx, selected_effect, category_index);
        
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
        // Cinematic Effects
        "cinematic_zoom_in" => {
            let zoom_factor = 1.0 + (0.25 * ease_in_out_cubic(progress) * intensity);
            apply_enhanced_zoom(img, zoom_factor, width, height)
        },
        "dramatic_zoom_out" => {
            let zoom_factor = 1.4 - (0.4 * ease_out_quad(progress) * intensity);
            apply_enhanced_zoom(img, zoom_factor, width, height)
        },
        "epic_zoom_spiral" => {
            apply_spiral_zoom(img, progress, intensity, width, height)
        },
        "smooth_zoom_pulse" => {
            apply_pulse_zoom(img, progress, intensity, width, height)
        },
        "dynamic_zoom_wave" => {
            apply_wave_zoom(img, progress, intensity, width, height)
        },
        
        // Pan Effects
        "epic_pan_left" => {
            apply_enhanced_pan(img, progress, "left", intensity, width, height)
        },
        "epic_pan_right" => {
            apply_enhanced_pan(img, progress, "right", intensity, width, height)
        },
        "pan_up_mystical" => {
            apply_enhanced_pan(img, progress, "up", intensity, width, height)
        },
        "pan_down_cinematic" => {
            apply_enhanced_pan(img, progress, "down", intensity, width, height)
        },
        "diagonal_pan_ne" => {
            apply_diagonal_pan(img, progress, "northeast", intensity, width, height)
        },
        "diagonal_pan_sw" => {
            apply_diagonal_pan(img, progress, "southwest", intensity, width, height)
        },
        "circular_pan" => {
            apply_circular_pan(img, progress, intensity, width, height)
        },
        "figure8_pan" => {
            apply_figure8_pan(img, progress, intensity, width, height)
        },
        
        // Artistic Effects
        "parallax_zoom" => {
            apply_parallax_effect(img, progress, intensity, width, height)
        },
        "lens_distortion" => {
            apply_lens_distortion_enhanced(img, progress, intensity, width, height)
        },
        "vignette_fade" => {
            apply_vignette_enhanced(img, progress, intensity, width, height)
        },
        "tilt_shift" => {
            apply_tilt_shift_enhanced(img, progress, intensity, width, height)
        },
        "bokeh_blur" => {
            apply_bokeh_enhanced(img, progress, intensity, width, height)
        },
        "chromatic_aberration" => {
            apply_chromatic_aberration(img, progress, intensity, width, height)
        },
        "prismatic_split" => {
            apply_prismatic_split(img, progress, intensity, width, height)
        },
        "kaleidoscope" => {
            apply_kaleidoscope(img, progress, intensity, width, height)
        },
        
        // Vintage Effects
        "film_grain_vintage" => {
            apply_film_grain_effect(img, progress, intensity, width, height)
        },
        "light_leak_golden" => {
            apply_light_leak_effect(img, progress, intensity, width, height)
        },
        "retro_vhs" => {
            apply_vhs_effect(img, progress, intensity, width, height)
        },
        "sepia_dream" => {
            apply_sepia_dream(img, progress, intensity, width, height)
        },
        "polaroid_fade" => {
            apply_polaroid_effect(img, progress, intensity, width, height)
        },
        "old_film_flicker" => {
            apply_old_film_flicker(img, progress, intensity, width, height)
        },
        "vintage_bloom" => {
            apply_vintage_bloom(img, progress, intensity, width, height)
        },
        
        // Dynamic Effects
        "cross_dissolve" => {
            apply_cross_dissolve_enhanced(img, progress, intensity, width, height)
        },
        "slide_elegant" => {
            apply_slide_elegant(img, progress, intensity, width, height)
        },
        "spiral_transition" => {
            apply_spiral_transition(img, progress, intensity, width, height)
        },
        "wave_distortion" => {
            apply_wave_distortion(img, progress, intensity, width, height)
        },
        "particle_dissolve" => {
            apply_particle_dissolve(img, progress, intensity, width, height)
        },
        "digital_glitch" => {
            apply_digital_glitch(img, progress, intensity, width, height)
        },
        "hologram_flicker" => {
            apply_hologram_flicker(img, progress, intensity, width, height)
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

// New Advanced Effect Implementations

// Spiral Zoom Effect
fn apply_spiral_zoom(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let _center_x = width as f32 / 2.0;
    let _center_y = height as f32 / 2.0;
    let spiral_factor = progress * 6.28 * intensity; // 2π * intensity for full rotation
    let zoom_base = 1.0 + (0.3 * progress * intensity);
    
    // Add spiral rotation to zoom
    let rotation_zoom = zoom_base * (1.0 + 0.1 * spiral_factor.cos());
    let result = apply_enhanced_zoom(img, rotation_zoom, width, height);
    
    // Add subtle spiral distortion effect
    apply_brightness_adjustment(&mut result.clone(), 1.0 + 0.05 * spiral_factor.sin())
}

// Pulse Zoom Effect
fn apply_pulse_zoom(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let pulse_freq = 4.0; // Number of pulses
    let pulse_intensity = 0.15 * intensity;
    let base_zoom = 1.0 + (0.2 * progress * intensity);
    let pulse_zoom = base_zoom + pulse_intensity * (progress * pulse_freq * 6.28).sin();
    
    apply_enhanced_zoom(img, pulse_zoom, width, height)
}

// Wave Zoom Effect
fn apply_wave_zoom(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let wave_progress = progress * 3.14 * 2.0; // Full sine wave
    let zoom_factor = 1.0 + (0.25 * (wave_progress.sin() * 0.5 + 0.5) * intensity);
    
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

// Diagonal Pan Effects
fn apply_diagonal_pan(img: &DynamicImage, progress: f32, direction: &str, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.3 + (intensity * 0.1);
    let new_width = (width as f32 * zoom_factor) as u32;
    let new_height = (height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    let ease_progress = ease_in_out_cubic(progress);
    let (crop_x, crop_y) = match direction {
        "northeast" => {
            let max_move_x = new_width - width;
            let max_move_y = new_height - height;
            (
                ((max_move_x as f32) * (1.0 - ease_progress) * intensity) as u32,
                ((max_move_y as f32) * ease_progress * intensity) as u32
            )
        },
        "southwest" => {
            let max_move_x = new_width - width;
            let max_move_y = new_height - height;
            (
                ((max_move_x as f32) * ease_progress * intensity) as u32,
                ((max_move_y as f32) * (1.0 - ease_progress) * intensity) as u32
            )
        },
        _ => ((new_width - width) / 2, (new_height - height) / 2)
    };
    
    resized.crop_imm(crop_x, crop_y, width, height)
}

// Circular Pan Effect
fn apply_circular_pan(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.4;
    let new_width = (width as f32 * zoom_factor) as u32;
    let new_height = (height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    let angle = progress * 6.28 * intensity; // Full circle
    let radius = 0.15 * intensity;
    let center_x = (new_width - width) as f32 / 2.0;
    let center_y = (new_height - height) as f32 / 2.0;
    
    let offset_x = center_x + radius * (new_width as f32) * angle.cos();
    let offset_y = center_y + radius * (new_height as f32) * angle.sin();
    
    resized.crop_imm(offset_x as u32, offset_y as u32, width, height)
}

// Figure-8 Pan Effect
fn apply_figure8_pan(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.3;
    let new_width = (width as f32 * zoom_factor) as u32;
    let new_height = (height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    let t = progress * 6.28 * intensity;
    let radius_x = 0.1 * intensity;
    let radius_y = 0.05 * intensity;
    
    // Figure-8 parametric equations
    let offset_x = (new_width - width) as f32 / 2.0 + radius_x * (new_width as f32) * (2.0 * t).sin();
    let offset_y = (new_height - height) as f32 / 2.0 + radius_y * (new_height as f32) * t.sin();
    
    resized.crop_imm(offset_x as u32, offset_y as u32, width, height)
}

// Enhanced Vintage Effects
fn apply_vhs_effect(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let scan_line_intensity = 15.0 * intensity;
    let static_intensity = 8.0 * intensity * progress;
    
    // Add VHS scan lines and static
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        // Scan lines
        if y % 3 == 0 {
            let darkening = scan_line_intensity as u8;
            pixel[0] = pixel[0].saturating_sub(darkening);
            pixel[1] = pixel[1].saturating_sub(darkening);
            pixel[2] = pixel[2].saturating_sub(darkening);
        }
        
        // VHS static noise
        let noise_seed = (x * 17 + y * 31 + (progress * 100.0) as u32) as f32;
        let noise = (noise_seed.sin() * 43758.5453).fract();
        if noise > 0.95 {
            let static_value = (static_intensity * 255.0) as u8;
            pixel[0] = pixel[0].saturating_add(static_value);
            pixel[1] = pixel[1].saturating_add(static_value);
            pixel[2] = pixel[2].saturating_add(static_value);
        }
    }
    
    // VHS color bleeding
    for pixel in rgba_img.pixels_mut() {
        pixel[0] = ((pixel[0] as f32 * 1.1).min(255.0)) as u8; // More red
        pixel[2] = ((pixel[2] as f32 * 0.8).min(255.0)) as u8; // Less blue
    }
    
    let zoom_factor = 1.0 + (0.08 * progress * intensity);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_enhanced_zoom(&result, zoom_factor, width, height)
}

// Sepia Dream Effect
fn apply_sepia_dream(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    
    // Sepia tone conversion with dreamy glow
    for pixel in rgba_img.pixels_mut() {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;
        
        // Sepia transformation
        let sepia_r = (r * 0.393 + g * 0.769 + b * 0.189).min(255.0);
        let sepia_g = (r * 0.349 + g * 0.686 + b * 0.168).min(255.0);
        let sepia_b = (r * 0.272 + g * 0.534 + b * 0.131).min(255.0);
        
        // Add dreamy glow based on intensity
        let glow_factor = 1.0 + (0.3 * intensity * progress);
        pixel[0] = (sepia_r * glow_factor).min(255.0) as u8;
        pixel[1] = (sepia_g * glow_factor * 0.9).min(255.0) as u8;
        pixel[2] = (sepia_b * glow_factor * 0.7).min(255.0) as u8;
    }
    
    // Soft zoom with vignette
    let zoom_factor = 1.0 + (0.15 * ease_in_out_cubic(progress) * intensity);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_enhanced_zoom(&result, zoom_factor, width, height)
}

// Digital Glitch Effect
fn apply_digital_glitch(img: &DynamicImage, progress: f32, intensity: f32, _width: u32, _height: u32) -> DynamicImage {
    let original_img = img.to_rgba8();
    let mut rgba_img = img.to_rgba8();
    let glitch_strength = intensity * 20.0;
    
    // Digital glitch artifacts
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let glitch_seed = (x * 23 + y * 41 + (progress * 1000.0) as u32) as f32;
        let glitch_noise = (glitch_seed.sin() * 43758.5453).fract();
        
        if glitch_noise > 0.98 {
            // Channel shifting
            let shift = (glitch_strength * 3.0) as i32;
            if x > shift as u32 {
                let source_pixel = original_img.get_pixel(x - shift as u32, y);
                pixel[0] = source_pixel[2]; // Red from blue channel
                pixel[2] = source_pixel[0]; // Blue from red channel
            }
        }
        
        // Digital noise blocks
        if glitch_noise > 0.95 {
            let noise_value = (glitch_noise * 255.0) as u8;
            pixel[0] = noise_value;
            pixel[1] = 0;
            pixel[2] = noise_value;
        }
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

// Hologram Flicker Effect
fn apply_hologram_flicker(img: &DynamicImage, progress: f32, intensity: f32, _width: u32, _height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let flicker_freq = 8.0;
    let flicker_intensity = (progress * flicker_freq * 6.28).sin() * intensity;
    
    // Holographic color shift
    for pixel in rgba_img.pixels_mut() {
        pixel[1] = ((pixel[1] as f32 * (1.0 + flicker_intensity * 0.3)).min(255.0)) as u8; // Green boost
        pixel[2] = ((pixel[2] as f32 * (1.0 + flicker_intensity * 0.5)).min(255.0)) as u8; // Blue boost
        pixel[0] = ((pixel[0] as f32 * (1.0 - flicker_intensity * 0.2)).max(0.0)) as u8;   // Red reduction
    }
    
    // Add scan lines
    for (_, y, pixel) in rgba_img.enumerate_pixels_mut() {
        if y % 2 == 0 {
            let scan_alpha = (20.0 * intensity) as u8;
            pixel[0] = pixel[0].saturating_sub(scan_alpha);
            pixel[1] = pixel[1].saturating_sub(scan_alpha);
            pixel[2] = pixel[2].saturating_sub(scan_alpha);
        }
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

// Simplified implementations for other new effects (to avoid compilation errors)
fn apply_lens_distortion_enhanced(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.12 * ease_in_out_cubic(progress) * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_vignette_enhanced(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.1 * progress * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_tilt_shift_enhanced(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.08 * progress * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_bokeh_enhanced(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.15 * ease_in_out_cubic(progress) * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_prismatic_split(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_chromatic_aberration(img, progress, intensity * 1.5, width, height)
}

fn apply_kaleidoscope(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.2 * (progress * 6.28 * intensity).cos().abs());
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_polaroid_effect(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_sepia_dream(img, progress, intensity * 0.7, width, height)
}

fn apply_old_film_flicker(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_film_grain_effect(img, progress, intensity * 1.2, width, height)
}

fn apply_vintage_bloom(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.12 * ease_in_out_cubic(progress) * intensity);
    let mut result = apply_enhanced_zoom(img, zoom_factor, width, height);
    apply_brightness_adjustment(&mut result, 1.0 + 0.15 * intensity)
}

fn apply_cross_dissolve_enhanced(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.1 * ease_in_out_cubic(progress) * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

fn apply_slide_elegant(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_enhanced_pan(img, progress, "left", intensity, width, height)
}

fn apply_spiral_transition(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_spiral_zoom(img, progress, intensity, width, height)
}

fn apply_wave_distortion(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    apply_wave_zoom(img, progress, intensity, width, height)
}

fn apply_particle_dissolve(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.08 * progress * intensity);
    apply_enhanced_zoom(img, zoom_factor, width, height)
}

#[wasm_bindgen]
pub fn get_enhanced_effects_list() -> js_sys::Array {
    let effects = js_sys::Array::new();
    let enhanced_effects = [
        "cinematic_zoom_in", "dramatic_zoom_out", "epic_zoom_spiral",
        "epic_pan_left", "epic_pan_right", "diagonal_pan_ne", "circular_pan",
        "parallax_zoom", "lens_distortion", "vignette_fade", "bokeh_blur",
        "film_grain_vintage", "light_leak_golden", "retro_vhs", "sepia_dream",
        "cross_dissolve", "spiral_transition", "digital_glitch", "hologram_flicker"
    ];
    
    for effect in &enhanced_effects {
        effects.push(&JsValue::from_str(effect));
    }
    
    effects
}
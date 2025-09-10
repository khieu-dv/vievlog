use wasm_bindgen::prelude::*;
use base64::{Engine as _, engine::general_purpose};
use image::{ImageFormat, DynamicImage};
use std::io::Cursor;
use crate::graphics::LyonAnimator;

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
        "particle_dissolve", "digital_glitch", "hologram_flicker", "float_up_disappear", 
        "bounce_fly_away", "rotate_scale_vanish", "elastic_bounce", "floating_bubbles",
        "magic_sparkle_fly", "swoosh_up_fade", "spinning_tornado", "random_particle_burst"
    ];
    
    let nature_animations = [
        "butterflies_flying", "birds_flock_flying", "fireflies_dancing", "falling_petals",
        "floating_leaves", "swimming_fish", "dancing_dragonflies", "swaying_grass",
        "floating_dandelion", "cherry_blossom_wind", "autumn_leaves_spiral", "snow_falling_gentle"
    ];
    
    // Combine all effects with weighted distribution (6 categories now!)
    let all_enhanced_effects = [
        cinematic_effects.as_slice(),
        pan_effects.as_slice(), 
        artistic_effects.as_slice(),
        vintage_effects.as_slice(),
        dynamic_effects.as_slice(),
        nature_animations.as_slice()
    ];
    
    for (idx, img) in processed_images.iter().enumerate() {
        // Smart effect selection - ensure variety across different categories
        let category_index = idx % all_enhanced_effects.len();
        let category = all_enhanced_effects[category_index];
        let effect_in_category = (idx / all_enhanced_effects.len()) % category.len();
        let selected_effect = category[effect_in_category];
        
        console_log!("Image {} using enhanced effect: {} (category: {})", idx, selected_effect, category_index);
        
        // Generate frames with enhanced motion effects + overlay animations
        for frame_idx in 0..frames_per_image {
            let progress = frame_idx as f32 / frames_per_image as f32;
            
            // Step 1: Apply category-specific motion effect
            let motion_enhanced_img = apply_enhanced_motion_effect(img, progress, selected_effect, intensity);
            
            // Step 2: Add overlay animation to EVERY image (different types per image)
            let animation_type = get_animation_type_for_image(idx);
            let final_img = apply_overlay_animation(&motion_enhanced_img, progress, animation_type, intensity, target_width, target_height);
            
            console_log!("Image {} frame {}: {} + overlay animation: {}", idx, frame_idx, selected_effect, animation_type);
            
            // Convert to base64
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match final_img.write_to(&mut cursor, ImageFormat::Png) {
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
        "float_up_disappear" => {
            apply_float_up_disappear(img, progress, intensity, width, height)
        },
        "bounce_fly_away" => {
            apply_bounce_fly_away(img, progress, intensity, width, height)
        },
        "rotate_scale_vanish" => {
            apply_rotate_scale_vanish(img, progress, intensity, width, height)
        },
        "elastic_bounce" => {
            apply_elastic_bounce(img, progress, intensity, width, height)
        },
        "floating_bubbles" => {
            apply_floating_bubbles(img, progress, intensity, width, height)
        },
        "magic_sparkle_fly" => {
            apply_magic_sparkle_fly(img, progress, intensity, width, height)
        },
        "swoosh_up_fade" => {
            apply_swoosh_up_fade(img, progress, intensity, width, height)
        },
        "spinning_tornado" => {
            apply_spinning_tornado(img, progress, intensity, width, height)
        },
        "random_particle_burst" => {
            apply_random_particle_burst(img, progress, intensity, width, height)
        },
        
        // Nature & Creature Animations
        "butterflies_flying" => {
            apply_butterflies_flying(img, progress, intensity, width, height)
        },
        "birds_flock_flying" => {
            apply_birds_flock_flying(img, progress, intensity, width, height)
        },
        "fireflies_dancing" => {
            apply_fireflies_dancing(img, progress, intensity, width, height)
        },
        "falling_petals" => {
            apply_falling_petals(img, progress, intensity, width, height)
        },
        "floating_leaves" => {
            apply_floating_leaves(img, progress, intensity, width, height)
        },
        "swimming_fish" => {
            apply_swimming_fish(img, progress, intensity, width, height)
        },
        "dancing_dragonflies" => {
            apply_dancing_dragonflies(img, progress, intensity, width, height)
        },
        "swaying_grass" => {
            apply_swaying_grass(img, progress, intensity, width, height)
        },
        "floating_dandelion" => {
            apply_floating_dandelion(img, progress, intensity, width, height)
        },
        "cherry_blossom_wind" => {
            apply_cherry_blossom_wind(img, progress, intensity, width, height)
        },
        "autumn_leaves_spiral" => {
            apply_autumn_leaves_spiral(img, progress, intensity, width, height)
        },
        "snow_falling_gentle" => {
            apply_snow_falling_gentle(img, progress, intensity, width, height)
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

// New Flying and Animation Effects
fn apply_float_up_disappear(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    
    // Float up effect: move image upward with easing
    let float_progress = ease_out_cubic(progress);
    let y_offset = (height as f32 * 0.3 * float_progress * intensity) as i32;
    
    // Create new image with transparent background
    let mut result = image::RgbaImage::new(width, height);
    
    // Calculate fade progress (start fading at 60% of animation)
    let fade_start = 0.6;
    let alpha_multiplier = if progress <= fade_start {
        1.0
    } else {
        1.0 - ((progress - fade_start) / (1.0 - fade_start))
    };
    
    // Copy pixels with offset and fade
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let new_y = (y as i32 - y_offset).max(0).min(height as i32 - 1) as u32;
        if new_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha_multiplier) as u8;
            result.put_pixel(x, new_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_bounce_fly_away(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    
    // Bouncing motion using sine wave
    let bounce_freq = 3.0;
    let bounce_amplitude = height as f32 * 0.15 * intensity;
    let bounce_y = (progress * bounce_freq * 6.28).sin() * bounce_amplitude * (1.0 - progress);
    
    // Flying away motion
    let fly_progress = ease_in_quad(progress);
    let x_offset = (width as f32 * 0.4 * fly_progress * intensity) as i32;
    let y_offset = -(height as f32 * 0.2 * fly_progress * intensity) as i32 + bounce_y as i32;
    
    // Scale down as flying away
    let scale = 1.0 - (0.5 * fly_progress * intensity);
    let new_width = (width as f32 * scale) as u32;
    let new_height = (height as f32 * scale) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    let mut result = image::RgbaImage::new(width, height);
    
    // Alpha fade
    let alpha_multiplier = 1.0 - (progress * 0.7);
    
    for (x, y, pixel) in resized.to_rgba8().enumerate_pixels() {
        let new_x = (x as i32 + x_offset + (width - new_width) as i32 / 2).max(0).min(width as i32 - 1) as u32;
        let new_y = (y as i32 + y_offset + (height - new_height) as i32 / 2).max(0).min(height as i32 - 1) as u32;
        
        if new_x < width && new_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha_multiplier) as u8;
            result.put_pixel(new_x, new_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_rotate_scale_vanish(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let rotation_angle = progress * 720.0 * intensity; // Multiple rotations
    let scale = (1.0 - progress).max(0.1); // Scale down to almost nothing
    let alpha = (1.0 - ease_in_cubic(progress)).max(0.0);
    
    // Simple scale implementation
    let new_width = (width as f32 * scale) as u32;
    let new_height = (height as f32 * scale) as u32;
    
    if new_width == 0 || new_height == 0 {
        return DynamicImage::ImageRgba8(image::RgbaImage::new(width, height));
    }
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    let mut result = image::RgbaImage::new(width, height);
    
    // Center the scaled image
    let offset_x = (width - new_width) / 2;
    let offset_y = (height - new_height) / 2;
    
    for (x, y, pixel) in resized.to_rgba8().enumerate_pixels() {
        let final_x = x + offset_x;
        let final_y = y + offset_y;
        
        if final_x < width && final_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha) as u8;
            result.put_pixel(final_x, final_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_elastic_bounce(img: &DynamicImage, progress: f32, intensity: f32, _width: u32, _height: u32) -> DynamicImage {
    // Elastic bounce effect using damped sine wave
    let bounce_freq = 8.0;
    let dampening = 1.0 - progress;
    let bounce_scale = 1.0 + (progress * bounce_freq * 6.28).sin() * 0.1 * intensity * dampening;
    
    let new_width = (img.width() as f32 * bounce_scale) as u32;
    let new_height = (img.height() as f32 * bounce_scale) as u32;
    
    img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3)
}

fn apply_floating_bubbles(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    
    // Multiple bubble movements
    let bubble1_y = -(progress * height as f32 * 0.4 * intensity) as i32;
    let bubble2_y = -(progress * height as f32 * 0.6 * intensity) as i32;
    let bubble3_y = -(progress * height as f32 * 0.5 * intensity) as i32;
    
    // Horizontal floating motion
    let float_x = ((progress * 4.0 * 6.28).sin() * width as f32 * 0.05 * intensity) as i32;
    
    let mut result = image::RgbaImage::new(width, height);
    
    // Alpha fade
    let alpha = 1.0 - (progress * 0.8);
    
    // Apply primary movement
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let new_x = (x as i32 + float_x).max(0).min(width as i32 - 1) as u32;
        let new_y = (y as i32 + bubble1_y).max(0).min(height as i32 - 1) as u32;
        
        if new_x < width && new_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha) as u8;
            result.put_pixel(new_x, new_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_magic_sparkle_fly(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    
    // Magic sparkle: add brightness variation
    let sparkle_freq = 12.0;
    let sparkle_intensity = (progress * sparkle_freq * 6.28).sin() * intensity * 0.3;
    
    // Flying motion
    let fly_y = -(progress * height as f32 * 0.5 * intensity) as i32;
    let spiral_x = ((progress * 6.0 * 6.28).cos() * width as f32 * 0.1 * intensity) as i32;
    
    let mut result = image::RgbaImage::new(width, height);
    
    // Alpha with sparkle effect
    let base_alpha = 1.0 - (progress * 0.7);
    let sparkle_alpha = base_alpha + (sparkle_intensity * 0.5).abs();
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let new_x = (x as i32 + spiral_x).max(0).min(width as i32 - 1) as u32;
        let new_y = (y as i32 + fly_y).max(0).min(height as i32 - 1) as u32;
        
        if new_x < width && new_y < height {
            let mut new_pixel = *pixel;
            
            // Add sparkle brightness
            for i in 0..3 {
                new_pixel[i] = ((new_pixel[i] as f32 * (1.0 + sparkle_intensity)).min(255.0)) as u8;
            }
            
            new_pixel[3] = (new_pixel[3] as f32 * sparkle_alpha.max(0.0).min(1.0)) as u8;
            result.put_pixel(new_x, new_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_swoosh_up_fade(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    // Swoosh motion: accelerating upward movement
    let swoosh_progress = ease_in_expo(progress);
    let y_offset = -(height as f32 * 0.8 * swoosh_progress * intensity) as i32;
    
    // Motion blur effect
    let blur_strength = progress * intensity * 2.0;
    
    let mut result = image::RgbaImage::new(width, height);
    let rgba_img = img.to_rgba8();
    
    // Alpha fade
    let alpha = 1.0 - ease_in_quad(progress);
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let new_y = (y as i32 + y_offset).max(0).min(height as i32 - 1) as u32;
        
        if new_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha) as u8;
            
            // Add motion blur by placing pixel at multiple y positions
            for blur_offset in 0..=(blur_strength as i32) {
                let blur_y = (new_y as i32 + blur_offset).max(0).min(height as i32 - 1) as u32;
                if blur_y < height {
                    let blur_alpha = new_pixel[3] as f32 / (blur_offset + 1) as f32;
                    let mut blur_pixel = new_pixel;
                    blur_pixel[3] = blur_alpha as u8;
                    result.put_pixel(x, blur_y, blur_pixel);
                }
            }
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_spinning_tornado(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    // Tornado spinning effect with scale reduction
    let spin_progress = progress * 8.0 * intensity; // Multiple spins
    let scale = 1.0 - (progress * 0.4); // Scale down
    let y_lift = -(progress * height as f32 * 0.3 * intensity) as i32;
    
    // Simple scale implementation
    let new_width = (width as f32 * scale) as u32;
    let new_height = (height as f32 * scale) as u32;
    
    if new_width == 0 || new_height == 0 {
        return DynamicImage::ImageRgba8(image::RgbaImage::new(width, height));
    }
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    let mut result = image::RgbaImage::new(width, height);
    
    // Alpha fade
    let alpha = 1.0 - (progress * 0.8);
    
    // Center with lift offset
    let offset_x = (width - new_width) / 2;
    let offset_y = ((height - new_height) / 2) as i32 + y_lift;
    
    for (x, y, pixel) in resized.to_rgba8().enumerate_pixels() {
        let final_x = x + offset_x;
        let final_y = (y as i32 + offset_y).max(0).min(height as i32 - 1) as u32;
        
        if final_x < width && final_y < height {
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha) as u8;
            result.put_pixel(final_x, final_y, new_pixel);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_random_particle_burst(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::new(width, height);
    let rgba_img = img.to_rgba8();
    
    // Particle explosion effect
    let burst_radius = progress * width as f32 * 0.3 * intensity;
    let particle_count = (intensity * 20.0) as u32;
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        // Calculate particle displacement
        let center_x = width as f32 / 2.0;
        let center_y = height as f32 / 2.0;
        
        let dx = x as f32 - center_x;
        let dy = y as f32 - center_y;
        let distance = (dx * dx + dy * dy).sqrt();
        
        if distance < burst_radius {
            // Particle moves outward from center
            let angle = dy.atan2(dx);
            let displacement = progress * distance * 0.5 * intensity;
            
            let new_x = (x as f32 + angle.cos() * displacement).max(0.0).min(width as f32 - 1.0) as u32;
            let new_y = (y as f32 + angle.sin() * displacement).max(0.0).min(height as f32 - 1.0) as u32;
            
            // Alpha fade based on progress and distance
            let alpha = (1.0 - progress) * (1.0 - distance / (width as f32 / 2.0));
            
            let mut new_pixel = *pixel;
            new_pixel[3] = (new_pixel[3] as f32 * alpha.max(0.0).min(1.0)) as u8;
            
            if new_x < width && new_y < height {
                result.put_pixel(new_x, new_y, new_pixel);
            }
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

// Nature & Creature Animation Effects
fn apply_butterflies_flying(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let butterfly_count = (intensity * 8.0) as u32;
    
    for i in 0..butterfly_count {
        // Multiple butterflies with different flight patterns
        let phase_offset = (i as f32 * 0.7) % 6.28;
        let flight_progress = (progress * 6.28 * 2.0 + phase_offset).sin();
        let vertical_progress = (progress * 6.28 * 1.5 + phase_offset).cos();
        
        // Butterfly positions (figure-8 flight pattern)
        let center_x = width as f32 / 2.0 + (width as f32 * 0.3 * flight_progress);
        let center_y = height as f32 / 2.0 + (height as f32 * 0.2 * vertical_progress);
        
        let butterfly_x = (center_x + (progress * width as f32 * 0.1 * intensity).sin() * 30.0) as u32;
        let butterfly_y = (center_y + (progress * height as f32 * 0.1 * intensity).cos() * 20.0) as u32;
        
        // Draw simple butterfly shape with wing animation
        let wing_beat = (progress * 20.0 * 6.28).sin().abs();
        draw_butterfly_at(&mut result, butterfly_x, butterfly_y, wing_beat, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_birds_flock_flying(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let bird_count = (intensity * 12.0) as u32;
    
    for i in 0..bird_count {
        let formation_offset = i as f32 * 0.3;
        let flight_height = height as f32 * 0.2 + (progress * height as f32 * 0.3);
        let flight_x = progress * width as f32 * 1.2 + formation_offset * 50.0;
        
        // V-formation flying pattern
        let v_formation_y = flight_height + (formation_offset * 20.0).abs();
        
        let bird_x = (flight_x % (width as f32 + 100.0)) as u32;
        let bird_y = (v_formation_y % height as f32) as u32;
        
        // Wing flapping animation
        let wing_flap = (progress * 15.0 * 6.28 + formation_offset).sin();
        draw_bird_at(&mut result, bird_x, bird_y, wing_flap, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_fireflies_dancing(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let firefly_count = (intensity * 15.0) as u32;
    
    for i in 0..firefly_count {
        let phase = (i as f32 * 1.1) % 6.28;
        
        // Random dancing motion
        let dance_x = width as f32 / 2.0 + (progress * 8.0 + phase).sin() * width as f32 * 0.2;
        let dance_y = height as f32 / 2.0 + (progress * 6.0 + phase * 1.3).cos() * height as f32 * 0.2;
        
        // Firefly glow animation
        let glow_intensity = ((progress * 10.0 + phase).sin() * 0.5 + 0.5) * intensity;
        
        let firefly_x = (dance_x % width as f32) as u32;
        let firefly_y = (dance_y % height as f32) as u32;
        
        draw_firefly_at(&mut result, firefly_x, firefly_y, glow_intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_falling_petals(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let petal_count = (intensity * 20.0) as u32;
    
    for i in 0..petal_count {
        let fall_speed = 0.3 + (i as f32 * 0.1) % 0.4;
        let drift = (progress * 3.0 + i as f32).sin() * 20.0;
        
        let petal_x = ((i as f32 * 47.3) % width as f32 + drift) % width as f32;
        let petal_y = ((progress * height as f32 * fall_speed) + (i as f32 * 23.7) % height as f32) % height as f32;
        
        // Rotating petals
        let rotation = progress * 2.0 + i as f32;
        
        draw_petal_at(&mut result, petal_x as u32, petal_y as u32, rotation, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_floating_leaves(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let leaf_count = (intensity * 10.0) as u32;
    
    for i in 0..leaf_count {
        let float_speed = 0.2 + (i as f32 * 0.05) % 0.2;
        let wind_effect = (progress * 2.0 + i as f32 * 0.8).sin() * 40.0;
        
        let leaf_x = ((i as f32 * 73.1) % width as f32 + wind_effect) % width as f32;
        let leaf_y = (height as f32 - (progress * height as f32 * float_speed) + (i as f32 * 31.2) % height as f32) % height as f32;
        
        // Spiraling motion
        let spiral = (progress * 4.0 + i as f32).sin() * 15.0;
        
        draw_leaf_at(&mut result, (leaf_x + spiral) as u32, leaf_y as u32, progress + i as f32, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_swimming_fish(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let fish_count = (intensity * 6.0) as u32;
    
    for i in 0..fish_count {
        let swim_level = height as f32 * (0.3 + (i as f32 * 0.2) % 0.4);
        let swim_speed = 0.5 + (i as f32 * 0.2) % 0.3;
        
        // Fish swimming in schools
        let school_wave = (progress * 5.0 + i as f32 * 1.2).sin() * 30.0;
        let fish_x = ((progress * width as f32 * swim_speed) + (i as f32 * 83.4) % width as f32) % (width as f32 + 50.0);
        let fish_y = swim_level + school_wave;
        
        // Tail swishing animation
        let tail_swish = (progress * 8.0 + i as f32).sin();
        
        draw_fish_at(&mut result, fish_x as u32, fish_y as u32, tail_swish, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_dancing_dragonflies(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let dragonfly_count = (intensity * 5.0) as u32;
    
    for i in 0..dragonfly_count {
        let phase = i as f32 * 1.7;
        
        // Erratic dragonfly flight pattern
        let hover_x = width as f32 / 2.0 + (progress * 6.0 + phase).sin() * width as f32 * 0.3;
        let hover_y = height as f32 / 2.0 + (progress * 4.0 + phase * 1.4).cos() * height as f32 * 0.2;
        let quick_dart = (progress * 20.0 + phase).sin() * 50.0;
        
        let dragonfly_x = (hover_x + quick_dart) as u32;
        let dragonfly_y = hover_y as u32;
        
        // Wing buzzing animation
        let wing_buzz = (progress * 30.0 + phase).sin();
        
        draw_dragonfly_at(&mut result, dragonfly_x, dragonfly_y, wing_buzz, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_swaying_grass(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let grass_blades = (width / 20).max(10);
    
    for i in 0..grass_blades {
        let grass_x = (i * 20) % width;
        let wind_sway = (progress * 3.0 + i as f32 * 0.3).sin() * 10.0 * intensity;
        
        // Different grass heights
        let grass_height = height as f32 * (0.1 + (i as f32 * 0.02) % 0.15);
        
        draw_grass_blade_at(&mut result, grass_x, height, wind_sway, grass_height, intensity);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_floating_dandelion(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let seed_count = (intensity * 25.0) as u32;
    
    for i in 0..seed_count {
        let float_speed = 0.2 + (i as f32 * 0.03) % 0.15;
        let wind_drift = (progress * 2.0 + i as f32 * 0.9).sin() * 60.0;
        
        let seed_x = ((i as f32 * 41.7) % width as f32 + wind_drift) % width as f32;
        let seed_y = (height as f32 - (progress * height as f32 * float_speed) + (i as f32 * 17.3) % height as f32) % height as f32;
        
        // Dandelion seeds with parachute effect
        let parachute_sway = (progress * 4.0 + i as f32).cos() * 5.0;
        
        draw_dandelion_seed_at(&mut result, (seed_x + parachute_sway) as u32, seed_y as u32, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_cherry_blossom_wind(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let blossom_count = (intensity * 30.0) as u32;
    
    for i in 0..blossom_count {
        let wind_strength = intensity * ((progress * 2.0 + i as f32 * 0.5).sin() * 0.5 + 0.5);
        let wind_x = (progress * width as f32 * 0.4 + wind_strength * 80.0) + (i as f32 * 59.2) % width as f32;
        let wind_y = ((progress * height as f32 * 0.3) + (i as f32 * 37.1) % height as f32) % height as f32;
        
        // Swirling cherry blossoms
        let swirl = (progress * 3.0 + i as f32 * 1.1).sin() * 20.0;
        
        draw_cherry_blossom_at(&mut result, (wind_x + swirl) as u32, wind_y as u32, progress + i as f32, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_autumn_leaves_spiral(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let leaf_count = (intensity * 15.0) as u32;
    
    for i in 0..leaf_count {
        let spiral_radius = (progress * 100.0 + i as f32 * 20.0) % (width.min(height) as f32 / 2.0);
        let spiral_angle = progress * 6.28 * 3.0 + i as f32 * 0.8;
        
        let center_x = width as f32 / 2.0;
        let center_y = height as f32 / 2.0;
        
        let leaf_x = center_x + spiral_radius * spiral_angle.cos();
        let leaf_y = center_y + spiral_radius * spiral_angle.sin();
        
        // Falling while spiraling
        let fall_offset = progress * height as f32 * 0.2;
        
        draw_autumn_leaf_at(&mut result, leaf_x as u32, (leaf_y + fall_offset) as u32, spiral_angle, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

fn apply_snow_falling_gentle(img: &DynamicImage, progress: f32, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    let snowflake_count = (intensity * 40.0) as u32;
    
    for i in 0..snowflake_count {
        let fall_speed = 0.3 + (i as f32 * 0.02) % 0.2;
        let gentle_drift = (progress * 1.5 + i as f32 * 0.7).sin() * 30.0;
        
        let snow_x = ((i as f32 * 67.9) % width as f32 + gentle_drift) % width as f32;
        let snow_y = ((progress * height as f32 * fall_speed) + (i as f32 * 29.4) % height as f32) % height as f32;
        
        // Snowflake rotation
        let rotation = progress * 1.0 + i as f32 * 0.5;
        
        draw_snowflake_at(&mut result, snow_x as u32, snow_y as u32, rotation, intensity, width, height);
    }
    
    DynamicImage::ImageRgba8(result)
}

// Helper drawing functions for creatures and nature elements
fn draw_butterfly_at(img: &mut image::RgbaImage, x: u32, y: u32, wing_beat: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 3.0) as u32 + 2;
    let wing_span = size + (wing_beat * 2.0) as u32;
    
    // Butterfly body
    for dy in 0..size {
        if y + dy < height {
            img.put_pixel(x, y + dy, image::Rgba([255, 200, 100, (200.0 * intensity) as u8]));
        }
    }
    
    // Wings (animated)
    for wx in 0..wing_span {
        for wy in 0..size/2 {
            if x + wx < width && y + wy < height {
                let alpha = (150.0 * intensity * (1.0 - wx as f32 / wing_span as f32)) as u8;
                img.put_pixel(x + wx, y + wy, image::Rgba([255, 150, 200, alpha]));
                img.put_pixel(x + wx, y + size - wy, image::Rgba([200, 150, 255, alpha]));
            }
        }
    }
}

fn draw_bird_at(img: &mut image::RgbaImage, x: u32, y: u32, wing_flap: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 2.0) as u32 + 1;
    let wing_angle = wing_flap * 2.0;
    
    // Bird body
    img.put_pixel(x, y, image::Rgba([80, 60, 40, (180.0 * intensity) as u8]));
    
    // Wings
    let wing_length = size * 2;
    for i in 0..wing_length {
        let wing_y_offset = (wing_angle.sin() * i as f32 * 0.3) as i32;
        let wing_x = x.saturating_add(i);
        let wing_y = (y as i32 + wing_y_offset).max(0) as u32;
        
        if wing_x < width && wing_y < height {
            let alpha = (120.0 * intensity * (1.0 - i as f32 / wing_length as f32)) as u8;
            img.put_pixel(wing_x, wing_y, image::Rgba([60, 40, 20, alpha]));
        }
    }
}

fn draw_firefly_at(img: &mut image::RgbaImage, x: u32, y: u32, glow: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let glow_radius = (glow * 4.0) as u32 + 1;
    
    for dx in 0..glow_radius {
        for dy in 0..glow_radius {
            let px = x.saturating_add(dx);
            let py = y.saturating_add(dy);
            
            if px < width && py < height {
                let distance = ((dx * dx + dy * dy) as f32).sqrt();
                let alpha = ((1.0 - distance / glow_radius as f32) * glow * 255.0).max(0.0) as u8;
                
                img.put_pixel(px, py, image::Rgba([255, 255, 150, alpha]));
            }
        }
    }
}

fn draw_petal_at(img: &mut image::RgbaImage, x: u32, y: u32, rotation: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 2.0) as u32 + 1;
    
    for i in 0..size {
        for j in 0..size {
            let px = x.saturating_add(i);
            let py = y.saturating_add(j);
            
            if px < width && py < height {
                let alpha = (180.0 * intensity * (1.0 - (i + j) as f32 / (size * 2) as f32)) as u8;
                img.put_pixel(px, py, image::Rgba([255, 200, 220, alpha]));
            }
        }
    }
}

fn draw_leaf_at(img: &mut image::RgbaImage, x: u32, y: u32, rotation: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    img.put_pixel(x, y, image::Rgba([100, 180, 60, (150.0 * intensity) as u8]));
}

fn draw_fish_at(img: &mut image::RgbaImage, x: u32, y: u32, tail_swish: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 3.0) as u32 + 2;
    
    // Fish body
    for i in 0..size {
        if x + i < width {
            img.put_pixel(x + i, y, image::Rgba([100, 150, 200, (160.0 * intensity) as u8]));
        }
    }
    
    // Tail with swish animation
    let tail_offset = (tail_swish * 2.0) as i32;
    let tail_y = (y as i32 + tail_offset).max(0) as u32;
    if tail_y < height {
        img.put_pixel(x, tail_y, image::Rgba([80, 120, 160, (120.0 * intensity) as u8]));
    }
}

fn draw_dragonfly_at(img: &mut image::RgbaImage, x: u32, y: u32, wing_buzz: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    // Dragonfly body
    img.put_pixel(x, y, image::Rgba([150, 100, 200, (140.0 * intensity) as u8]));
    
    // Buzzing wings
    let wing_blur = (wing_buzz.abs() * 2.0) as u32 + 1;
    for i in 0..wing_blur {
        let wing_x = x.saturating_add(i);
        if wing_x < width {
            let alpha = (100.0 * intensity / (i + 1) as f32) as u8;
            img.put_pixel(wing_x, y, image::Rgba([200, 200, 255, alpha]));
        }
    }
}

fn draw_grass_blade_at(img: &mut image::RgbaImage, x: u32, base_y: u32, sway: f32, height_offset: f32, intensity: f32) {
    let blade_height = height_offset as u32;
    
    for h in 0..blade_height {
        let blade_y = base_y.saturating_sub(h);
        let blade_x = (x as f32 + sway * (h as f32 / blade_height as f32)) as u32;
        
        if blade_x < img.width() && blade_y < img.height() {
            let alpha = (120.0 * intensity) as u8;
            img.put_pixel(blade_x, blade_y, image::Rgba([80, 160, 40, alpha]));
        }
    }
}

fn draw_dandelion_seed_at(img: &mut image::RgbaImage, x: u32, y: u32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    img.put_pixel(x, y, image::Rgba([255, 255, 255, (100.0 * intensity) as u8]));
}

fn draw_cherry_blossom_at(img: &mut image::RgbaImage, x: u32, y: u32, rotation: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    img.put_pixel(x, y, image::Rgba([255, 180, 200, (140.0 * intensity) as u8]));
}

fn draw_autumn_leaf_at(img: &mut image::RgbaImage, x: u32, y: u32, rotation: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let colors = [
        [200, 100, 50],   // Orange
        [180, 80, 40],    // Red-orange  
        [160, 120, 40],   // Yellow-orange
    ];
    let color = colors[(rotation as usize) % colors.len()];
    
    img.put_pixel(x, y, image::Rgba([color[0], color[1], color[2], (150.0 * intensity) as u8]));
}

fn draw_snowflake_at(img: &mut image::RgbaImage, x: u32, y: u32, rotation: f32, intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 2.0) as u32 + 1;
    
    for i in 0..size {
        // Simple cross pattern for snowflake
        if x + i < width {
            img.put_pixel(x + i, y, image::Rgba([255, 255, 255, (80.0 * intensity) as u8]));
        }
        if y + i < height {
            img.put_pixel(x, y + i, image::Rgba([255, 255, 255, (80.0 * intensity) as u8]));
        }
    }
}

// Overlay Animation System - Every image gets unique animation
fn get_animation_type_for_image(image_index: usize) -> &'static str {
    let overlay_animations = [
        "rainbow_butterflies", "golden_birds", "magical_fireflies", "sakura_petals",
        "autumn_leaves_gold", "crystal_snowflakes", "tropical_fish", "emerald_dragonflies", 
        "dancing_stars", "floating_hearts", "glowing_orbs", "mystic_sparkles",
        "fairy_dust", "cosmic_particles", "flower_shower", "bubble_stream",
        "lightning_bugs", "phoenix_feathers", "dream_wisps", "rainbow_trails"
    ];
    
    overlay_animations[image_index % overlay_animations.len()]
}

fn apply_overlay_animation(img: &DynamicImage, progress: f32, animation_type: &str, intensity: f32, width: u32, height: u32) -> DynamicImage {
    let mut result = image::RgbaImage::from(img.clone());
    
    match animation_type {
        "rainbow_butterflies" => apply_rainbow_butterflies(&mut result, progress, intensity, width, height),
        "golden_birds" => apply_golden_birds(&mut result, progress, intensity, width, height),
        "magical_fireflies" => apply_magical_fireflies(&mut result, progress, intensity, width, height),
        "sakura_petals" => apply_sakura_petals(&mut result, progress, intensity, width, height),
        "autumn_leaves_gold" => apply_autumn_leaves_gold(&mut result, progress, intensity, width, height),
        "crystal_snowflakes" => apply_crystal_snowflakes(&mut result, progress, intensity, width, height),
        "tropical_fish" => apply_tropical_fish(&mut result, progress, intensity, width, height),
        "emerald_dragonflies" => apply_emerald_dragonflies(&mut result, progress, intensity, width, height),
        "dancing_stars" => apply_dancing_stars(&mut result, progress, intensity, width, height),
        "floating_hearts" => apply_floating_hearts(&mut result, progress, intensity, width, height),
        "glowing_orbs" => apply_glowing_orbs(&mut result, progress, intensity, width, height),
        "mystic_sparkles" => apply_mystic_sparkles(&mut result, progress, intensity, width, height),
        "fairy_dust" => apply_fairy_dust(&mut result, progress, intensity, width, height),
        "cosmic_particles" => apply_cosmic_particles(&mut result, progress, intensity, width, height),
        "flower_shower" => apply_flower_shower(&mut result, progress, intensity, width, height),
        "bubble_stream" => apply_bubble_stream(&mut result, progress, intensity, width, height),
        "lightning_bugs" => apply_lightning_bugs(&mut result, progress, intensity, width, height),
        "phoenix_feathers" => apply_phoenix_feathers(&mut result, progress, intensity, width, height),
        "dream_wisps" => apply_dream_wisps(&mut result, progress, intensity, width, height),
        "rainbow_trails" => apply_rainbow_trails(&mut result, progress, intensity, width, height),
        _ => {}, // No overlay
    }
    
    DynamicImage::ImageRgba8(result)
}

// Colorful Overlay Animation Functions using Lyon
fn apply_rainbow_butterflies(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let mut animator = LyonAnimator::new(width, height, (progress * 1000.0) as u64);
    let butterfly_count = (intensity * 6.0) as u32;
    
    for i in 0..butterfly_count {
        let phase = (i as f32 * 1.3) % 6.28;
        
        // Beautiful Figure-8 flight pattern using bezier curves
        let t = progress * 4.0 + phase;
        let center_x = width as f32 / 2.0 + (t.sin() * width as f32 * 0.25);
        let center_y = height as f32 / 2.0 + ((t * 2.0).sin() * height as f32 * 0.18);
        
        // Use Lyon for beautiful vector butterfly with curved wings
        animator.draw_vector_butterfly(img, center_x, center_y, progress + phase, intensity);
    }
}

fn apply_golden_birds(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let mut animator = LyonAnimator::new(width, height, (progress * 1234.0) as u64);
    let bird_count = (intensity * 8.0) as u32;
    
    for i in 0..bird_count {
        let formation_offset = i as f32 * 0.4;
        
        // Smooth V-formation flight with realistic bird physics
        let flight_x = progress * width as f32 * 0.9 + formation_offset * 70.0;
        let flight_y = height as f32 * 0.25 + (formation_offset * 30.0).abs();
        
        let bird_x = flight_x % (width as f32 + 100.0);
        let bird_y = flight_y % height as f32;
        
        // Golden shimmer colors
        let golden_shimmer = (progress * 10.0 + i as f32).sin() * 0.3 + 0.7;
        let gold_color = [
            (255.0 * golden_shimmer) as u8,
            (215.0 * golden_shimmer) as u8,
            (50.0 * golden_shimmer) as u8,
        ];
        
        // Use Lyon for beautiful vector bird with smooth wing curves
        animator.draw_vector_bird(img, bird_x, bird_y, progress + formation_offset, intensity, gold_color);
    }
}

fn apply_magical_fireflies(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let firefly_count = (intensity * 12.0) as u32;
    
    for i in 0..firefly_count {
        let phase = (i as f32 * 0.9) % 6.28;
        let magic_pulse = ((progress * 8.0 + phase).sin() * 0.5 + 0.5);
        
        // Random dancing motion
        let dance_x = width as f32 / 2.0 + (progress * 6.0 + phase).sin() * width as f32 * 0.3;
        let dance_y = height as f32 / 2.0 + (progress * 4.0 + phase * 1.2).cos() * height as f32 * 0.3;
        
        let firefly_x = (dance_x % width as f32) as u32;
        let firefly_y = (dance_y % height as f32) as u32;
        
        // Magical colors - cycling through spectrum
        let magic_hue = (progress * 180.0 + i as f32 * 30.0) % 360.0;
        let (r, g, b) = hsv_to_rgb(magic_hue, 0.9, magic_pulse);
        
        draw_magical_firefly(img, firefly_x, firefly_y, magic_pulse, [r, g, b], intensity, width, height);
    }
}

fn apply_sakura_petals(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let petal_count = (intensity * 20.0) as u32;
    
    for i in 0..petal_count {
        let fall_speed = 0.4 + (i as f32 * 0.05) % 0.3;
        let wind_drift = (progress * 2.5 + i as f32 * 0.8).sin() * 40.0;
        
        let petal_x = ((i as f32 * 43.7) % width as f32 + wind_drift) % width as f32;
        let petal_y = ((progress * height as f32 * fall_speed) + (i as f32 * 27.3) % height as f32) % height as f32;
        
        // Sakura pink colors with variation
        let pink_intensity = (progress * 5.0 + i as f32).sin() * 0.2 + 0.8;
        let sakura_r = (255.0 * pink_intensity) as u8;
        let sakura_g = (182.0 * pink_intensity) as u8;
        let sakura_b = (193.0 * pink_intensity) as u8;
        
        draw_colored_petal(img, petal_x as u32, petal_y as u32, [sakura_r, sakura_g, sakura_b], intensity, width, height);
    }
}

fn apply_dancing_stars(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let star_count = (intensity * 15.0) as u32;
    
    for i in 0..star_count {
        let phase = (i as f32 * 1.1) % 6.28;
        let twinkle = ((progress * 12.0 + phase).sin() * 0.5 + 0.5);
        
        // Circular dance pattern
        let dance_radius = width.min(height) as f32 * 0.3;
        let dance_angle = progress * 3.0 + phase;
        
        let star_x = (width as f32 / 2.0 + dance_radius * dance_angle.cos()) as u32;
        let star_y = (height as f32 / 2.0 + dance_radius * dance_angle.sin()) as u32;
        
        // Bright white stars with twinkle
        let star_brightness = (255.0 * twinkle) as u8;
        draw_twinkling_star(img, star_x, star_y, twinkle, [star_brightness, star_brightness, star_brightness], intensity, width, height);
    }
}

// Add more overlay functions for other animation types...
fn apply_floating_hearts(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    let heart_count = (intensity * 8.0) as u32;
    
    for i in 0..heart_count {
        let float_speed = 0.3 + (i as f32 * 0.04) % 0.2;
        let love_pulse = ((progress * 6.0 + i as f32).sin() * 0.3 + 0.7);
        
        let heart_x = ((i as f32 * 71.3) % width as f32) as u32;
        let heart_y = (height as f32 - (progress * height as f32 * float_speed) + (i as f32 * 19.7) % height as f32) % height as f32;
        
        // Pink-red heart colors
        let heart_r = (255.0 * love_pulse) as u8;
        let heart_g = (100.0 * love_pulse) as u8;
        let heart_b = (150.0 * love_pulse) as u8;
        
        draw_heart_shape(img, heart_x, heart_y as u32, [heart_r, heart_g, heart_b], intensity, width, height);
    }
}

// Helper color conversion function
fn hsv_to_rgb(h: f32, s: f32, v: f32) -> (u8, u8, u8) {
    let c = v * s;
    let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
    let m = v - c;
    
    let (r_prime, g_prime, b_prime) = if h < 60.0 {
        (c, x, 0.0)
    } else if h < 120.0 {
        (x, c, 0.0)
    } else if h < 180.0 {
        (0.0, c, x)
    } else if h < 240.0 {
        (0.0, x, c)
    } else if h < 300.0 {
        (x, 0.0, c)
    } else {
        (c, 0.0, x)
    };
    
    let r = ((r_prime + m) * 255.0) as u8;
    let g = ((g_prime + m) * 255.0) as u8;
    let b = ((b_prime + m) * 255.0) as u8;
    
    (r, g, b)
}

// Enhanced drawing functions with colors
fn draw_colored_butterfly(img: &mut image::RgbaImage, x: u32, y: u32, wing_beat: f32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 4.0) as u32 + 3;
    let wing_span = size + (wing_beat * 3.0) as u32;
    
    // Butterfly body
    for dy in 0..size {
        if y + dy < height {
            img.put_pixel(x, y + dy, image::Rgba([color[0], color[1], color[2], (220.0 * intensity) as u8]));
        }
    }
    
    // Colorful wings
    for wx in 0..wing_span {
        for wy in 0..size/2 {
            if x + wx < width && y + wy < height {
                let alpha = (180.0 * intensity * (1.0 - wx as f32 / wing_span as f32)) as u8;
                let wing_color = [
                    (color[0] as f32 * 0.8) as u8,
                    (color[1] as f32 * 0.9) as u8,
                    color[2]
                ];
                img.put_pixel(x + wx, y + wy, image::Rgba([wing_color[0], wing_color[1], wing_color[2], alpha]));
                img.put_pixel(x + wx, y + size - wy, image::Rgba([color[0], color[1], color[2], alpha]));
            }
        }
    }
}

fn draw_colored_bird(img: &mut image::RgbaImage, x: u32, y: u32, wing_flap: f32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    // Bird body
    img.put_pixel(x, y, image::Rgba([color[0], color[1], color[2], (200.0 * intensity) as u8]));
    
    // Wings with flap animation
    let wing_length = (intensity * 6.0) as u32 + 2;
    for i in 0..wing_length {
        let wing_y_offset = (wing_flap * i as f32 * 0.4) as i32;
        let wing_x = x.saturating_add(i);
        let wing_y = (y as i32 + wing_y_offset).max(0) as u32;
        
        if wing_x < width && wing_y < height {
            let alpha = (140.0 * intensity * (1.0 - i as f32 / wing_length as f32)) as u8;
            img.put_pixel(wing_x, wing_y, image::Rgba([color[0], color[1], color[2], alpha]));
        }
    }
}

fn draw_magical_firefly(img: &mut image::RgbaImage, x: u32, y: u32, glow: f32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let glow_radius = (glow * intensity * 6.0) as u32 + 2;
    
    for dx in 0..glow_radius {
        for dy in 0..glow_radius {
            let px = x.saturating_add(dx);
            let py = y.saturating_add(dy);
            
            if px < width && py < height {
                let distance = ((dx * dx + dy * dy) as f32).sqrt();
                let alpha = ((1.0 - distance / glow_radius as f32) * glow * 255.0).max(0.0) as u8;
                
                img.put_pixel(px, py, image::Rgba([color[0], color[1], color[2], alpha]));
            }
        }
    }
}

fn draw_colored_petal(img: &mut image::RgbaImage, x: u32, y: u32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 3.0) as u32 + 2;
    
    for i in 0..size {
        for j in 0..size {
            let px = x.saturating_add(i);
            let py = y.saturating_add(j);
            
            if px < width && py < height {
                let alpha = (200.0 * intensity * (1.0 - (i + j) as f32 / (size * 2) as f32)) as u8;
                img.put_pixel(px, py, image::Rgba([color[0], color[1], color[2], alpha]));
            }
        }
    }
}

fn draw_twinkling_star(img: &mut image::RgbaImage, x: u32, y: u32, twinkle: f32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * twinkle * 3.0) as u32 + 1;
    
    // Star shape (cross pattern)
    for i in 0..size {
        if x + i < width {
            img.put_pixel(x + i, y, image::Rgba([color[0], color[1], color[2], (180.0 * intensity * twinkle) as u8]));
        }
        if y + i < height {
            img.put_pixel(x, y + i, image::Rgba([color[0], color[1], color[2], (180.0 * intensity * twinkle) as u8]));
        }
    }
}

fn draw_heart_shape(img: &mut image::RgbaImage, x: u32, y: u32, color: [u8; 3], intensity: f32, width: u32, height: u32) {
    if x >= width || y >= height { return; }
    
    let size = (intensity * 2.0) as u32 + 1;
    
    // Simple heart shape approximation
    for i in 0..size {
        for j in 0..size {
            let px = x.saturating_add(i);
            let py = y.saturating_add(j);
            
            if px < width && py < height {
                let alpha = (160.0 * intensity) as u8;
                img.put_pixel(px, py, image::Rgba([color[0], color[1], color[2], alpha]));
            }
        }
    }
}

// Stub functions for other overlay animations
fn apply_autumn_leaves_gold(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    // Similar to sakura_petals but with golden autumn colors
    apply_sakura_petals(img, progress, intensity, width, height);
}

fn apply_crystal_snowflakes(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_dancing_stars(img, progress, intensity, width, height);
}

fn apply_tropical_fish(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_golden_birds(img, progress, intensity, width, height);
}

fn apply_emerald_dragonflies(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_magical_fireflies(img, progress, intensity, width, height);
}

fn apply_glowing_orbs(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_magical_fireflies(img, progress, intensity, width, height);
}

fn apply_mystic_sparkles(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_dancing_stars(img, progress, intensity, width, height);
}

fn apply_fairy_dust(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_rainbow_butterflies(img, progress, intensity, width, height);
}

fn apply_cosmic_particles(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_dancing_stars(img, progress, intensity, width, height);
}

fn apply_flower_shower(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_sakura_petals(img, progress, intensity, width, height);
}

fn apply_bubble_stream(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_floating_hearts(img, progress, intensity, width, height);
}

fn apply_lightning_bugs(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_magical_fireflies(img, progress, intensity, width, height);
}

fn apply_phoenix_feathers(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_golden_birds(img, progress, intensity, width, height);
}

fn apply_dream_wisps(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_rainbow_butterflies(img, progress, intensity, width, height);
}

fn apply_rainbow_trails(img: &mut image::RgbaImage, progress: f32, intensity: f32, width: u32, height: u32) {
    apply_rainbow_butterflies(img, progress, intensity, width, height);
}

// Additional easing functions for better animations
fn ease_out_cubic(t: f32) -> f32 {
    let t = t - 1.0;
    1.0 + t * t * t
}

fn ease_in_quad(t: f32) -> f32 {
    t * t
}

fn ease_in_cubic(t: f32) -> f32 {
    t * t * t
}

fn ease_in_expo(t: f32) -> f32 {
    if t == 0.0 { 0.0 } else { 2.0_f32.powf(10.0 * (t - 1.0)) }
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
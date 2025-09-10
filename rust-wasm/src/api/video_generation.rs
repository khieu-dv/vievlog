use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageFormat, Rgba};
use std::io::Cursor;
use base64::{Engine as _, engine::general_purpose};

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct VideoGenerationResult {
    success: bool,
    message: String,
    frames_generated: u32,
    processing_time_ms: f64,
}

#[wasm_bindgen]
impl VideoGenerationResult {
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.message.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn frames_generated(&self) -> u32 {
        self.frames_generated
    }

    #[wasm_bindgen(getter)]
    pub fn processing_time_ms(&self) -> f64 {
        self.processing_time_ms
    }
}

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

// Helper function to blend two images for smooth transitions
fn blend_images(img1: &DynamicImage, img2: &DynamicImage, alpha: f32) -> DynamicImage {
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    
    let (width, height) = (rgba1.width(), rgba1.height());
    let mut blended = image::ImageBuffer::new(width, height);
    
    for (x, y, pixel) in blended.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        let r = (p1[0] as f32 * (1.0 - alpha) + p2[0] as f32 * alpha) as u8;
        let g = (p1[1] as f32 * (1.0 - alpha) + p2[1] as f32 * alpha) as u8;
        let b = (p1[2] as f32 * (1.0 - alpha) + p2[2] as f32 * alpha) as u8;
        let a = (p1[3] as f32 * (1.0 - alpha) + p2[3] as f32 * alpha) as u8;
        
        *pixel = Rgba([r, g, b, a]);
    }
    
    DynamicImage::ImageRgba8(blended)
}

// Apply advanced motion effects with cinematic quality
fn apply_motion_effect(img: &DynamicImage, progress: f32, effect_type: &str) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    
    match effect_type {
        "cinematic_zoom_in" => {
            // Cinematic zoom từ 100% đến 120% với slow motion curve
            let ease_progress = ease_in_out_cubic(progress);
            let zoom_factor = 1.0 + (0.2 * ease_progress);
            apply_zoom_with_ease(img, zoom_factor, width, height)
        },
        "dramatic_zoom_out" => {
            // Dramatic zoom từ 130% về 100% với slow start
            let ease_progress = ease_out_quad(progress);
            let zoom_factor = 1.3 - (0.3 * ease_progress);
            apply_zoom_with_ease(img, zoom_factor, width, height)
        },
        "epic_pan_left" => {
            // Epic pan với zoom và subtle tilt
            let zoom_factor = 1.2;
            let ease_progress = ease_in_out_cubic(progress);
            apply_epic_pan(img, zoom_factor, ease_progress, "left", width, height)
        },
        "epic_pan_right" => {
            let zoom_factor = 1.2;
            let ease_progress = ease_in_out_cubic(progress);
            apply_epic_pan(img, zoom_factor, ease_progress, "right", width, height)
        },
        "pan_up_mystical" => {
            let zoom_factor = 1.18;
            let ease_progress = ease_in_out_sine(progress);
            apply_epic_pan(img, zoom_factor, ease_progress, "up", width, height)
        },
        "pan_down_cinematic" => {
            let zoom_factor = 1.25;
            let ease_progress = ease_in_out_cubic(progress);
            apply_epic_pan(img, zoom_factor, ease_progress, "down", width, height)
        },
        "parallax_zoom" => {
            // Parallax effect với multi-layer zoom
            apply_parallax_effect(img, progress, width, height)
        },
        "lens_distortion" => {
            // Lens distortion với barrel effect
            apply_lens_distortion_effect(img, progress, width, height)
        },
        "vignette_fade" => {
            // Vignette fade với dramatic lighting
            apply_vignette_fade(img, progress, width, height)
        },
        "film_grain_vintage" => {
            // Film grain với vintage color grading
            apply_film_grain_effect(img, progress, width, height)
        },
        "light_leak_golden" => {
            // Light leak với golden hour effect
            apply_light_leak_effect(img, progress, width, height)
        },
        "bokeh_blur" => {
            // Bokeh blur với depth of field
            apply_bokeh_effect(img, progress, width, height)
        },
        "cross_dissolve" => {
            // Cross dissolve với luminance masking
            apply_cross_dissolve_single(img, progress, width, height)
        },
        "slide_elegant" => {
            // Elegant slide với motion blur
            apply_slide_effect(img, progress, width, height)
        },
        "tilt_shift" => {
            // Tilt shift với selective focus
            apply_tilt_shift_effect(img, progress, width, height)
        },
        _ => img.clone()
    }
}

// Easing functions for smooth animations
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

fn ease_in_out_sine(t: f32) -> f32 {
    -(std::f32::consts::PI * t).cos() - 1.0 / 2.0
}

// Advanced zoom với smooth easing
fn apply_zoom_with_ease(img: &DynamicImage, zoom_factor: f32, orig_width: u32, orig_height: u32) -> DynamicImage {
    let new_width = (orig_width as f32 * zoom_factor) as u32;
    let new_height = (orig_height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    if zoom_factor > 1.0 {
        // Crop from center
        let crop_x = (new_width - orig_width) / 2;
        let crop_y = (new_height - orig_height) / 2;
        resized.crop_imm(crop_x, crop_y, orig_width, orig_height)
    } else {
        // Pad with black background
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

// Epic pan với advanced movement
fn apply_epic_pan(img: &DynamicImage, zoom_factor: f32, progress: f32, direction: &str, orig_width: u32, orig_height: u32) -> DynamicImage {
    let new_width = (orig_width as f32 * zoom_factor) as u32;
    let new_height = (orig_height as f32 * zoom_factor) as u32;
    
    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);
    
    let (crop_x, crop_y) = match direction {
        "left" => {
            let max_move = new_width - orig_width;
            (((max_move as f32) * progress) as u32, (new_height - orig_height) / 2)
        },
        "right" => {
            let max_move = new_width - orig_width;
            (((max_move as f32) * (1.0 - progress)) as u32, (new_height - orig_height) / 2)
        },
        "up" => {
            let max_move = new_height - orig_height;
            ((new_width - orig_width) / 2, ((max_move as f32) * progress) as u32)
        },
        "down" => {
            let max_move = new_height - orig_height;
            ((new_width - orig_width) / 2, ((max_move as f32) * (1.0 - progress)) as u32)
        },
        _ => ((new_width - orig_width) / 2, (new_height - orig_height) / 2)
    };
    
    resized.crop_imm(crop_x, crop_y, orig_width, orig_height)
}

// Parallax effect
fn apply_parallax_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.15 * ease_in_out_sine(progress));
    let mut result = apply_zoom_with_ease(img, zoom_factor, width, height);
    
    // Add subtle brightness variation
    let brightness_factor = 1.0 + (0.1 * (progress * std::f32::consts::PI * 2.0).sin());
    apply_brightness_adjustment(&mut result, brightness_factor)
}

// Lens distortion effect
fn apply_lens_distortion_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.08 * ease_in_out_cubic(progress));
    apply_zoom_with_ease(img, zoom_factor, width, height)
}

// Vignette fade effect
fn apply_vignette_fade(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    let max_radius = ((width * width + height * height) as f32).sqrt() / 2.0;
    
    let vignette_strength = 0.3 + (0.2 * progress);
    
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let dx = x as f32 - center_x;
        let dy = y as f32 - center_y;
        let distance = (dx * dx + dy * dy).sqrt();
        let vignette_factor = 1.0 - (distance / max_radius * vignette_strength).min(0.6);
        
        pixel[0] = (pixel[0] as f32 * vignette_factor) as u8;
        pixel[1] = (pixel[1] as f32 * vignette_factor) as u8;
        pixel[2] = (pixel[2] as f32 * vignette_factor) as u8;
    }
    
    // Add zoom effect
    let zoom_factor = 1.0 + (0.1 * progress);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_zoom_with_ease(&result, zoom_factor, width, height)
}

// Film grain effect
fn apply_film_grain_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let grain_intensity = 8.0 + (5.0 * progress);
    
    // Simple pseudorandom grain
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let seed = (x * 31 + y * 17 + (progress * 1000.0) as u32) as f32;
        let noise = (seed.sin() * 43758.5453).fract() - 0.5;
        let grain = (noise * grain_intensity) as i16;
        
        pixel[0] = (pixel[0] as i16 + grain).clamp(0, 255) as u8;
        pixel[1] = (pixel[1] as i16 + grain).clamp(0, 255) as u8;
        pixel[2] = (pixel[2] as i16 + grain).clamp(0, 255) as u8;
    }
    
    // Add vintage color grading
    for pixel in rgba_img.pixels_mut() {
        // Warm up the image
        pixel[0] = ((pixel[0] as f32 * 1.05).min(255.0)) as u8; // More red
        pixel[1] = ((pixel[1] as f32 * 0.98).min(255.0)) as u8; // Slightly less green
        pixel[2] = ((pixel[2] as f32 * 0.85).min(255.0)) as u8; // Much less blue
    }
    
    let zoom_factor = 1.0 + (0.05 * ease_in_out_cubic(progress));
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_zoom_with_ease(&result, zoom_factor, width, height)
}

// Light leak effect
fn apply_light_leak_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let leak_strength = progress * 0.4;
    
    // Create light leak from corner
    let leak_x = (width as f32 * 0.8) as u32;
    let leak_y = (height as f32 * 0.2) as u32;
    
    for (x, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let dx = (x as i32 - leak_x as i32).abs() as f32;
        let dy = (y as i32 - leak_y as i32).abs() as f32;
        let distance = (dx * dx + dy * dy).sqrt();
        let max_distance = (width as f32 + height as f32) / 3.0;
        
        if distance < max_distance {
            let leak_factor = (1.0 - distance / max_distance) * leak_strength;
            let golden_tint = (255.0 * leak_factor) as u8;
            
            pixel[0] = (pixel[0] as u16 + golden_tint as u16).min(255) as u8;
            pixel[1] = (pixel[1] as u16 + (golden_tint as f32 * 0.8) as u16).min(255) as u8;
            pixel[2] = (pixel[2] as u16 + (golden_tint as f32 * 0.3) as u16).min(255) as u8;
        }
    }
    
    let zoom_factor = 1.0 + (0.12 * ease_in_out_sine(progress));
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_zoom_with_ease(&result, zoom_factor, width, height)
}

// Bokeh effect
fn apply_bokeh_effect(img: &DynamicImage, progress: f32, _width: u32, _height: u32) -> DynamicImage {
    // Simplified bokeh: slight blur with brightness boost
    let blur_radius = 0.5 + (1.5 * progress);
    let blurred = imageproc::filter::gaussian_blur_f32(&img.to_rgba8(), blur_radius);
    
    let mut result_img = blurred;
    // Boost highlights for bokeh effect
    for pixel in result_img.pixels_mut() {
        let avg = (pixel[0] as u16 + pixel[1] as u16 + pixel[2] as u16) / 3;
        if avg > 180 {
            let boost = 1.2;
            pixel[0] = ((pixel[0] as f32 * boost).min(255.0)) as u8;
            pixel[1] = ((pixel[1] as f32 * boost).min(255.0)) as u8;
            pixel[2] = ((pixel[2] as f32 * boost).min(255.0)) as u8;
        }
    }
    
    DynamicImage::ImageRgba8(result_img)
}

// Cross dissolve single image
fn apply_cross_dissolve_single(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.0 + (0.08 * ease_in_out_cubic(progress));
    let result = apply_zoom_with_ease(img, zoom_factor, width, height);
    
    // Add subtle fade effect
    let mut rgba_img = result.to_rgba8();
    let alpha_boost = 0.95 + (0.05 * (progress * std::f32::consts::PI).sin());
    
    for pixel in rgba_img.pixels_mut() {
        pixel[3] = (pixel[3] as f32 * alpha_boost) as u8;
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

// Slide effect
fn apply_slide_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let zoom_factor = 1.1 + (0.1 * ease_in_out_cubic(progress));
    apply_zoom_with_ease(img, zoom_factor, width, height)
}

// Tilt shift effect
fn apply_tilt_shift_effect(img: &DynamicImage, progress: f32, width: u32, height: u32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let focus_line = height / 2;
    let blur_strength = 1.0 + (2.0 * progress);
    
    // Apply selective blur based on distance from focus line
    for (_, y, pixel) in rgba_img.enumerate_pixels_mut() {
        let distance = (y as i32 - focus_line as i32).abs() as f32;
        let blur_factor = (distance / (height as f32 / 4.0)).min(1.0);
        
        if blur_factor > 0.3 {
            // Simple blur approximation
            let blur_amount = (blur_factor * blur_strength) as u8;
            pixel[0] = pixel[0].saturating_sub(blur_amount / 4);
            pixel[1] = pixel[1].saturating_sub(blur_amount / 4);
            pixel[2] = pixel[2].saturating_sub(blur_amount / 4);
        }
    }
    
    let zoom_factor = 1.0 + (0.06 * progress);
    let result = DynamicImage::ImageRgba8(rgba_img);
    apply_zoom_with_ease(&result, zoom_factor, width, height)
}

// Helper function for brightness adjustment
fn apply_brightness_adjustment(img: &mut DynamicImage, factor: f32) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    for pixel in rgba_img.pixels_mut() {
        pixel[0] = ((pixel[0] as f32 * factor).min(255.0)) as u8;
        pixel[1] = ((pixel[1] as f32 * factor).min(255.0)) as u8;
        pixel[2] = ((pixel[2] as f32 * factor).min(255.0)) as u8;
    }
    DynamicImage::ImageRgba8(rgba_img)
}

// Apply a fade transition effect
fn apply_fade_effect(img: &DynamicImage, progress: f32, fade_in: bool) -> DynamicImage {
    let mut rgba_img = img.to_rgba8();
    let alpha_multiplier = if fade_in { progress } else { 1.0 - progress };
    
    for pixel in rgba_img.pixels_mut() {
        pixel[3] = (pixel[3] as f32 * alpha_multiplier) as u8;
    }
    
    DynamicImage::ImageRgba8(rgba_img)
}

#[wasm_bindgen]
pub fn generate_transition_frames(
    image1_data: &[u8],
    image2_data: &[u8],
    transition_frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    let frames = js_sys::Array::new();
    
    console_log!("Starting transition generation: {} frames, type: {}", transition_frames, transition_type);
    
    let img1 = match image::load_from_memory(image1_data) {
        Ok(img) => img,
        Err(_) => {
            console_log!("Failed to load first image");
            return frames;
        }
    };
    
    let img2 = match image::load_from_memory(image2_data) {
        Ok(img) => img,
        Err(_) => {
            console_log!("Failed to load second image");
            return frames;
        }
    };
    
    // Resize both images to the same dimensions (use smaller dimensions)
    let (width, height) = (
        img1.width().min(img2.width()),
        img1.height().min(img2.height())
    );
    
    let img1_resized = img1.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    let img2_resized = img2.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    
    for i in 0..transition_frames {
        let progress = i as f32 / (transition_frames - 1) as f32;
        
        let frame = match transition_type {
            "crossfade" => {
                blend_images(&img1_resized, &img2_resized, progress)
            },
            "pan_left" => {
                if progress < 0.5 {
                    apply_motion_effect(&img1_resized, progress * 2.0, "pan_left")
                } else {
                    let fade_progress = (progress - 0.5) * 2.0;
                    blend_images(
                        &apply_motion_effect(&img1_resized, 1.0, "pan_left"),
                        &img2_resized,
                        fade_progress
                    )
                }
            },
            "pan_right" => {
                if progress < 0.5 {
                    apply_motion_effect(&img1_resized, progress * 2.0, "pan_right")
                } else {
                    let fade_progress = (progress - 0.5) * 2.0;
                    blend_images(
                        &apply_motion_effect(&img1_resized, 1.0, "pan_right"),
                        &img2_resized,
                        fade_progress
                    )
                }
            },
            "fade" => {
                if progress < 0.5 {
                    apply_fade_effect(&img1_resized, 1.0 - (progress * 2.0), false)
                } else {
                    apply_fade_effect(&img2_resized, (progress - 0.5) * 2.0, true)
                }
            },
            _ => {
                // Default: simple crossfade
                blend_images(&img1_resized, &img2_resized, progress)
            }
        };
        
        // Convert frame to base64
        let mut output = Vec::new();
        let mut cursor = Cursor::new(&mut output);
        
        match frame.write_to(&mut cursor, ImageFormat::Png) {
            Ok(_) => {
                let base64_data = general_purpose::STANDARD.encode(&output);
                frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
            },
            Err(_) => {
                console_log!("Failed to encode frame {}", i);
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated {} frames in {}ms", frames.length(), end_time - start_time);
    
    frames
}

#[wasm_bindgen]
pub fn generate_video_from_images(
    images_data: js_sys::Array,
    frames_per_image: u32,
    transition_frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    let all_frames = js_sys::Array::new();
    
    console_log!("Generating video from {} images", images_data.length());
    console_log!("Frames per image: {}, transition frames: {}", frames_per_image, transition_frames);
    
    let mut processed_images = Vec::new();
    
    // First, load and process all images
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
    
    // Determine target dimensions (use the first image's dimensions)
    let (target_width, target_height) = (processed_images[0].width(), processed_images[0].height());
    
    // Resize all images to the same dimensions
    for img in &mut processed_images {
        *img = img.resize_exact(target_width, target_height, image::imageops::FilterType::Lanczos3);
    }
    
    // Danh sách các hiệu ứng cinematic mới
    let motion_effects = [
        "cinematic_zoom_in", "dramatic_zoom_out", "epic_pan_left", "epic_pan_right",
        "pan_up_mystical", "pan_down_cinematic", "parallax_zoom", "lens_distortion",
        "vignette_fade", "film_grain_vintage", "light_leak_golden", "bokeh_blur",
        "cross_dissolve", "slide_elegant", "tilt_shift"
    ];

    for (idx, img) in processed_images.iter().enumerate() {
        // Chọn hiệu ứng ngẫu nhiên cho mỗi hình ảnh
        let effect_index = (idx * 7 + 3) % motion_effects.len(); // Pseudo-random selection
        let selected_effect = motion_effects[effect_index];
        
        console_log!("Image {} using effect: {}", idx, selected_effect);
        
        // Add frames for the current image với hiệu ứng chuyển động đã chọn
        for frame_idx in 0..frames_per_image {
            let progress = frame_idx as f32 / frames_per_image as f32;
            let motion_img = apply_motion_effect(img, progress, selected_effect);
            
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match motion_img.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let base64_data = general_purpose::STANDARD.encode(&output);
                    all_frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
                },
                Err(_) => {
                    console_log!("Failed to encode frame {} of image {}", frame_idx, idx);
                }
            }
        }
        
        // Add transition frames to the next image (if not the last image)
        if idx < processed_images.len() - 1 {
            let img1_data = {
                let mut output = Vec::new();
                let mut cursor = Cursor::new(&mut output);
                img.write_to(&mut cursor, ImageFormat::Png).unwrap();
                output
            };
            
            let img2_data = {
                let mut output = Vec::new();
                let mut cursor = Cursor::new(&mut output);
                processed_images[idx + 1].write_to(&mut cursor, ImageFormat::Png).unwrap();
                output
            };
            
            let transition_frames_array = generate_transition_frames(
                &img1_data,
                &img2_data,
                transition_frames,
                transition_type
            );
            
            // Add transition frames to the main array
            for i in 0..transition_frames_array.length() {
                all_frames.push(&transition_frames_array.get(i));
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("Generated total {} frames in {}ms", all_frames.length(), end_time - start_time);
    
    all_frames
}

#[wasm_bindgen]
pub fn create_video_preview(
    images_data: js_sys::Array,
    preview_frames: u32,
    transition_type: &str,
) -> js_sys::Array {
    console_log!("Creating video preview with {} frames", preview_frames);
    
    // For preview, use fewer frames per image và transition frames
    let frames_per_image = 15; // ~0.5 giây mỗi hình ở 30fps
    let transition_frames = 10; // ~0.3 giây transition
    
    generate_video_from_images(images_data, frames_per_image, transition_frames, transition_type)
}
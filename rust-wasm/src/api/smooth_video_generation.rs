use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageFormat, Rgba};
use std::io::Cursor;
use base64::{Engine as _, engine::general_purpose};
use fast_image_resize as fir;
use fast_image_resize::images::Image as FirImage;
use interpolation::{Ease, EaseFunction};
// use colorgrad::Gradient; // Unused for now
use crate::api::color_grading::{apply_cinematic_look, apply_warm_look, apply_cool_look};

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

// Professional video generation với chất lượng cao
#[wasm_bindgen]
pub fn generate_smooth_video_from_images(
    images_data: js_sys::Array,
    frames_per_image: u32,
    transition_frames: u32,
    video_quality: &str, // "high", "medium", "low"
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    let all_frames = js_sys::Array::new();
    
    console_log!("🎬 Generating smooth video from {} images (Quality: {})", images_data.length(), video_quality);
    
    let mut processed_images = Vec::new();
    
    // Load và xử lý tất cả hình ảnh
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
    
    // Xác định kích thước video tối ưu
    let (target_width, target_height) = determine_optimal_resolution(&processed_images, video_quality);
    console_log!("📐 Video resolution: {}x{}", target_width, target_height);
    
    // Resize tất cả hình ảnh với chất lượng cao
    let mut high_quality_images = Vec::new();
    for img in processed_images {
        let resized = high_quality_resize(&img, target_width, target_height);
        high_quality_images.push(resized);
    }
    
    // Tạo video với các hiệu ứng mượt mà
    for (idx, img) in high_quality_images.iter().enumerate() {
        console_log!("🎨 Processing image {} of {}", idx + 1, high_quality_images.len());
        
        // Tạo frames cho hình ảnh hiện tại với subtle motion
        let image_frames = create_smooth_image_sequence(img, frames_per_image, idx);
        for frame in image_frames {
            let base64_frame = encode_frame_to_base64(&frame);
            all_frames.push(&JsValue::from_str(&base64_frame));
        }
        
        // Tạo transition mượt mà đến hình tiếp theo
        if idx < high_quality_images.len() - 1 {
            let transition_frames_vec = create_smooth_transition(
                img,
                &high_quality_images[idx + 1],
                transition_frames,
                idx,
            );
            
            for frame in transition_frames_vec {
                let base64_frame = encode_frame_to_base64(&frame);
                all_frames.push(&JsValue::from_str(&base64_frame));
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("✅ Generated {} smooth frames in {}ms", all_frames.length(), end_time - start_time);
    
    all_frames
}

// Xác định độ phân giải tối ưu dựa trên chất lượng
fn determine_optimal_resolution(images: &[DynamicImage], quality: &str) -> (u32, u32) {
    let base_width = images[0].width();
    let base_height = images[0].height();
    
    match quality {
        "high" => {
            // Giữ nguyên độ phân giải cao
            (base_width, base_height)
        },
        "medium" => {
            // Scale down 75% for better performance
            ((base_width as f32 * 0.75) as u32, (base_height as f32 * 0.75) as u32)
        },
        "low" => {
            // Scale down 50% for fastest performance
            (base_width / 2, base_height / 2)
        },
        _ => (base_width, base_height)
    }
}

// Resize chất lượng cao với Lanczos3 từ image crate (tạm thời)
fn high_quality_resize(img: &DynamicImage, target_width: u32, target_height: u32) -> DynamicImage {
    if img.width() == target_width && img.height() == target_height {
        return img.clone();
    }
    
    // Sử dụng Lanczos3 của image crate cho tạm
    img.resize_exact(target_width, target_height, image::imageops::FilterType::Lanczos3)
}

// Tạo sequence mượt mà cho từng hình ảnh
fn create_smooth_image_sequence(img: &DynamicImage, frame_count: u32, image_index: usize) -> Vec<DynamicImage> {
    let mut frames = Vec::new();
    
    // Chọn hiệu ứng 3D động dựa trên index
    let effects = [
        "fly_up_3d", "rotate_circle_3d", "spiral_fly_3d", "flip_rotate_3d", 
        "orbit_3d", "bounce_fly_3d", "wave_rotate_3d", "perspective_zoom_3d"
    ];
    let selected_effect = effects[image_index % effects.len()];
    
    for frame_idx in 0..frame_count {
        let progress = frame_idx as f32 / (frame_count - 1) as f32;
        
        // Sử dụng easing mượt mà
        // Simple easing function tạm thời
        let eased_progress = ease_in_out_quad(progress);
        
        let frame = match selected_effect {
            "fly_up_3d" => apply_fly_up_3d(img, eased_progress),
            "rotate_circle_3d" => apply_rotate_circle_3d(img, eased_progress),
            "spiral_fly_3d" => apply_spiral_fly_3d(img, eased_progress),
            "flip_rotate_3d" => apply_flip_rotate_3d(img, eased_progress),
            "orbit_3d" => apply_orbit_3d(img, eased_progress),
            "bounce_fly_3d" => apply_bounce_fly_3d(img, eased_progress),
            "wave_rotate_3d" => apply_wave_rotate_3d(img, eased_progress),
            "perspective_zoom_3d" => apply_perspective_zoom_3d(img, eased_progress),
            _ => enhance_image_quality(img),
        };
        
        // Apply professional color grading based on image index
        let color_graded_frame = match image_index % 3 {
            0 => apply_cinematic_look(&frame),
            1 => apply_warm_look(&frame),
            _ => apply_cool_look(&frame),
        };
        
        frames.push(color_graded_frame);
    }
    
    frames
}

// Hiệu ứng zoom nhẹ nhàng
fn apply_gentle_zoom(img: &DynamicImage, progress: f32) -> DynamicImage {
    // Zoom từ 100% đến 105% rất nhẹ nhàng
    let zoom_factor = 1.0 + (0.05 * progress);
    apply_smooth_zoom(img, zoom_factor)
}

// Hiệu ứng pan tinh tế
fn apply_subtle_pan(img: &DynamicImage, progress: f32, direction_seed: usize) -> DynamicImage {
    let directions = ["left", "right", "up", "down"];
    let direction = directions[direction_seed % directions.len()];
    
    // Pan movement rất nhẹ (chỉ 3% của kích thước)
    let pan_amount = 0.03;
    apply_smooth_pan(img, progress, direction, pan_amount)
}

// Hiệu ứng thở nhẹ nhàng
fn apply_breath_effect(img: &DynamicImage, progress: f32) -> DynamicImage {
    // Tạo hiệu ứng thở bằng sine wave
    let breath_cycle = (progress * std::f32::consts::PI * 2.0).sin();
    let zoom_factor = 1.0 + (0.02 * breath_cycle); // Rất nhẹ
    apply_smooth_zoom(img, zoom_factor)
}

// Zoom mượt mà với Lanczos3
fn apply_smooth_zoom(img: &DynamicImage, zoom_factor: f32) -> DynamicImage {
    let (orig_width, orig_height) = (img.width(), img.height());
    
    if (zoom_factor - 1.0).abs() < 0.001 {
        return img.clone();
    }
    
    let new_width = (orig_width as f32 * zoom_factor) as u32;
    let new_height = (orig_height as f32 * zoom_factor) as u32;
    
    let resized = high_quality_resize(img, new_width, new_height);
    
    if zoom_factor > 1.0 {
        // Crop từ center
        let crop_x = (new_width - orig_width) / 2;
        let crop_y = (new_height - orig_height) / 2;
        resized.crop_imm(crop_x, crop_y, orig_width, orig_height)
    } else {
        // Pad with intelligent background
        create_padded_image(&resized, orig_width, orig_height)
    }
}

// Pan mượt mà
fn apply_smooth_pan(img: &DynamicImage, progress: f32, direction: &str, amount: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let zoom_factor = 1.0 + amount; // Slight zoom để có space cho pan
    
    let enlarged = high_quality_resize(img, 
        (width as f32 * zoom_factor) as u32, 
        (height as f32 * zoom_factor) as u32
    );
    
    let max_move = (width as f32 * amount) as u32;
    
    let (crop_x, crop_y) = match direction {
        "left" => ((max_move as f32 * progress) as u32, (enlarged.height() - height) / 2),
        "right" => ((max_move as f32 * (1.0 - progress)) as u32, (enlarged.height() - height) / 2),
        "up" => ((enlarged.width() - width) / 2, (max_move as f32 * progress) as u32),
        "down" => ((enlarged.width() - width) / 2, (max_move as f32 * (1.0 - progress)) as u32),
        _ => ((enlarged.width() - width) / 2, (enlarged.height() - height) / 2),
    };
    
    enlarged.crop_imm(crop_x, crop_y, width, height)
}

// Tạo transition mượt mà giữa 2 hình
fn create_smooth_transition(
    img1: &DynamicImage,
    img2: &DynamicImage,
    frame_count: u32,
    transition_index: usize,
) -> Vec<DynamicImage> {
    let mut frames = Vec::new();
    
    // Chọn transition type
    let transitions = ["crossfade", "gradient_wipe", "luminance_fade"];
    let transition_type = transitions[transition_index % transitions.len()];
    
    for frame_idx in 0..frame_count {
        let progress = frame_idx as f32 / (frame_count - 1) as f32;
        
        // Sử dụng easing curve mượt mà cho transition
        let eased_progress = ease_in_out_cubic(progress);
        
        let frame = match transition_type {
            "gradient_wipe" => create_gradient_wipe(img1, img2, eased_progress),
            "luminance_fade" => create_luminance_fade(img1, img2, eased_progress),
            _ => create_smooth_crossfade(img1, img2, eased_progress),
        };
        
        frames.push(frame);
    }
    
    frames
}

// Crossfade mượt mà với alpha blending chính xác
fn create_smooth_crossfade(img1: &DynamicImage, img2: &DynamicImage, alpha: f32) -> DynamicImage {
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    
    let (width, height) = (rgba1.width(), rgba1.height());
    let mut blended = image::ImageBuffer::new(width, height);
    
    for (x, y, pixel) in blended.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Gamma-corrected blending for better visual result
        let blend_gamma_corrected = |a: u8, b: u8, t: f32| -> u8 {
            let a_linear = (a as f32 / 255.0).powf(2.2);
            let b_linear = (b as f32 / 255.0).powf(2.2);
            let blended_linear = a_linear * (1.0 - t) + b_linear * t;
            (blended_linear.powf(1.0 / 2.2) * 255.0) as u8
        };
        
        *pixel = Rgba([
            blend_gamma_corrected(p1[0], p2[0], alpha),
            blend_gamma_corrected(p1[1], p2[1], alpha),
            blend_gamma_corrected(p1[2], p2[2], alpha),
            ((p1[3] as f32 * (1.0 - alpha) + p2[3] as f32 * alpha)) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(blended)
}

// Gradient wipe transition
fn create_gradient_wipe(img1: &DynamicImage, img2: &DynamicImage, progress: f32) -> DynamicImage {
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    
    let (width, height) = (rgba1.width(), rgba1.height());
    let mut result = image::ImageBuffer::new(width, height);
    
    // Tạo diagonal gradient
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let gradient_progress = (x as f32 + y as f32) / (width as f32 + height as f32);
        let adjusted_progress = (progress - gradient_progress + 0.5).clamp(0.0, 1.0);
        
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        if adjusted_progress < 0.001 {
            *pixel = *p1;
        } else if adjusted_progress > 0.999 {
            *pixel = *p2;
        } else {
            // Smooth blend
            *pixel = Rgba([
                (p1[0] as f32 * (1.0 - adjusted_progress) + p2[0] as f32 * adjusted_progress) as u8,
                (p1[1] as f32 * (1.0 - adjusted_progress) + p2[1] as f32 * adjusted_progress) as u8,
                (p1[2] as f32 * (1.0 - adjusted_progress) + p2[2] as f32 * adjusted_progress) as u8,
                (p1[3] as f32 * (1.0 - adjusted_progress) + p2[3] as f32 * adjusted_progress) as u8,
            ]);
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

// Luminance-based fade
fn create_luminance_fade(img1: &DynamicImage, img2: &DynamicImage, progress: f32) -> DynamicImage {
    let rgba1 = img1.to_rgba8();
    let rgba2 = img2.to_rgba8();
    
    let (width, height) = (rgba1.width(), rgba1.height());
    let mut result = image::ImageBuffer::new(width, height);
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let p1 = rgba1.get_pixel(x, y);
        let p2 = rgba2.get_pixel(x, y);
        
        // Calculate luminance để quyết định blend ratio
        let lum1 = 0.299 * p1[0] as f32 + 0.587 * p1[1] as f32 + 0.114 * p1[2] as f32;
        let lum2 = 0.299 * p2[0] as f32 + 0.587 * p2[1] as f32 + 0.114 * p2[2] as f32;
        
        let lum_diff = (lum1 - lum2).abs() / 255.0;
        let adjusted_progress = progress + (lum_diff * 0.2 - 0.1); // Slight luminance influence
        let clamped_progress = adjusted_progress.clamp(0.0, 1.0);
        
        *pixel = Rgba([
            (p1[0] as f32 * (1.0 - clamped_progress) + p2[0] as f32 * clamped_progress) as u8,
            (p1[1] as f32 * (1.0 - clamped_progress) + p2[1] as f32 * clamped_progress) as u8,
            (p1[2] as f32 * (1.0 - clamped_progress) + p2[2] as f32 * clamped_progress) as u8,
            (p1[3] as f32 * (1.0 - clamped_progress) + p2[3] as f32 * clamped_progress) as u8,
        ]);
    }
    
    DynamicImage::ImageRgba8(result)
}

// Enhanced image quality với subtle improvements
fn enhance_image_quality(img: &DynamicImage) -> DynamicImage {
    let mut rgba = img.to_rgba8();
    
    // Subtle sharpening và contrast enhancement
    for pixel in rgba.pixels_mut() {
        // Micro contrast boost
        let avg = (pixel[0] as u16 + pixel[1] as u16 + pixel[2] as u16) / 3;
        let contrast_factor = 1.02; // Very subtle
        
        for i in 0..3 {
            let diff = pixel[i] as f32 - avg as f32;
            let enhanced = avg as f32 + (diff * contrast_factor);
            pixel[i] = enhanced.clamp(0.0, 255.0) as u8;
        }
    }
    
    DynamicImage::ImageRgba8(rgba)
}

// Create padded image với intelligent background
fn create_padded_image(img: &DynamicImage, target_width: u32, target_height: u32) -> DynamicImage {
    let mut padded = image::ImageBuffer::new(target_width, target_height);
    let (img_width, img_height) = (img.width(), img.height());
    
    // Use edge pixels để tạo background tự nhiên
    let rgba_img = img.to_rgba8();
    let edge_color = rgba_img.get_pixel(0, 0); // Sample from corner
    
    // Fill background
    for pixel in padded.pixels_mut() {
        *pixel = *edge_color;
    }
    
    // Overlay image ở center
    let offset_x = (target_width - img_width) / 2;
    let offset_y = (target_height - img_height) / 2;
    
    image::imageops::overlay(&mut padded, img, offset_x as i64, offset_y as i64);
    DynamicImage::ImageRgba8(padded)
}

// Encode frame to base64 với optimization
fn encode_frame_to_base64(img: &DynamicImage) -> String {
    let mut output = Vec::new();
    let mut cursor = Cursor::new(&mut output);
    
    // Sử dụng PNG với compression tối ưu
    match img.write_to(&mut cursor, ImageFormat::Png) {
        Ok(_) => {
            let base64_data = general_purpose::STANDARD.encode(&output);
            format!("data:image/png;base64,{}", base64_data)
        },
        Err(_) => {
            // Fallback to JPEG nếu PNG failed
            let mut output_jpg = Vec::new();
            let mut cursor_jpg = Cursor::new(&mut output_jpg);
            let _ = img.write_to(&mut cursor_jpg, ImageFormat::Jpeg);
            let base64_data = general_purpose::STANDARD.encode(&output_jpg);
            format!("data:image/jpeg;base64,{}", base64_data)
        }
    }
}

// Video preview với quality thấp hơn cho tốc độ
#[wasm_bindgen]
pub fn create_smooth_video_preview(
    images_data: js_sys::Array,
    preview_duration_seconds: f32,
) -> js_sys::Array {
    console_log!("🎬 Creating smooth video preview ({} seconds)", preview_duration_seconds);
    
    // Calculate frames for preview
    let fps = 24; // Preview FPS
    let total_frames = (preview_duration_seconds * fps as f32) as u32;
    let frames_per_image = total_frames / images_data.length().max(1);
    let transition_frames = frames_per_image / 3; // 1/3 của thời gian cho transition
    
    generate_smooth_video_from_images(
        images_data,
        frames_per_image,
        transition_frames,
        "medium", // Medium quality cho preview
    )
}

// Simple easing functions
fn ease_in_out_quad(t: f32) -> f32 {
    if t < 0.5 {
        2.0 * t * t
    } else {
        1.0 - 2.0 * (1.0 - t) * (1.0 - t)
    }
}

fn ease_in_out_cubic(t: f32) -> f32 {
    if t < 0.5 {
        4.0 * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powf(3.0) / 2.0
    }
}

// Advanced 3D Effects for Dynamic Frame Display

// 1. Bay lên 3D với perspective
fn apply_fly_up_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Tạo perspective transform bay lên
    let fly_height = progress * height as f32 * 0.8; // Bay lên 80% chiều cao
    let scale_factor = 1.0 - (progress * 0.6); // Thu nhỏ khi bay xa
    let perspective_y = -fly_height;
    let rotation_x = progress * 15.0; // Xoay nhẹ về phía sau
    
    apply_3d_transform(
        &rgba_img, 
        width, 
        height, 
        0.0, 
        perspective_y, 
        scale_factor, 
        rotation_x, 
        0.0, 
        0.0
    )
}

// 2. Quay vòng tròn 3D
fn apply_rotate_circle_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Quay vòng tròn với perspective
    let angle = progress * std::f32::consts::PI * 4.0; // 2 vòng hoàn chỉnh
    let radius = width.min(height) as f32 * 0.3;
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    
    let orbit_x = angle.cos() * radius;
    let orbit_y = angle.sin() * radius * 0.6; // Ellipse cho 3D effect
    let rotation_z = angle * 180.0 / std::f32::consts::PI;
    let scale_factor = 0.7 + 0.3 * (angle.cos() * 0.5 + 0.5); // Scale theo depth
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        orbit_x,
        orbit_y,
        scale_factor,
        0.0,
        0.0,
        rotation_z
    )
}

// 3. Bay xoắn ốc 3D
fn apply_spiral_fly_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Xoắn ốc bay lên với rotation
    let spiral_angle = progress * std::f32::consts::PI * 6.0; // 3 vòng xoắn
    let spiral_radius = progress * width as f32 * 0.4;
    let fly_up = -progress * height as f32 * 1.2;
    
    let offset_x = spiral_angle.cos() * spiral_radius;
    let offset_y = fly_up + spiral_angle.sin() * spiral_radius * 0.3;
    let rotation_z = spiral_angle * 180.0 / std::f32::consts::PI;
    let scale_factor = 1.0 - progress * 0.5;
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        offset_x,
        offset_y,
        scale_factor,
        progress * 20.0, // Tilt về phía sau
        0.0,
        rotation_z
    )
}

// 4. Lật và xoay 3D
fn apply_flip_rotate_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Flip với rotation 3D
    let rotation_y = progress * 360.0; // Xoay quanh trục Y
    let rotation_x = (progress * std::f32::consts::PI * 2.0).sin() * 30.0; // Wave tilt
    let scale_factor = 0.8 + 0.2 * (progress * std::f32::consts::PI).cos().abs();
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        0.0,
        0.0,
        scale_factor,
        rotation_x,
        rotation_y,
        0.0
    )
}

// 5. Orbit 3D quanh tâm
fn apply_orbit_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Orbit 3D với perspective depth
    let orbit_angle = progress * std::f32::consts::PI * 3.0;
    let orbit_radius = width.min(height) as f32 * 0.25;
    
    let depth_cos = orbit_angle.cos();
    let orbit_x = orbit_angle.sin() * orbit_radius;
    let orbit_z = depth_cos * orbit_radius;
    
    // Scale dựa trên depth (closer = larger)
    let scale_factor = 0.6 + 0.4 * (depth_cos * 0.5 + 0.5);
    let rotation_y = orbit_angle * 180.0 / std::f32::consts::PI;
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        orbit_x,
        0.0,
        scale_factor,
        0.0,
        rotation_y,
        0.0
    )
}

// 6. Bounce bay 3D
fn apply_bounce_fly_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Physics-based bounce
    let gravity = 0.5;
    let initial_velocity = 1.5;
    let bounce_y = initial_velocity * progress - 0.5 * gravity * progress * progress;
    let bounce_height = -bounce_y * height as f32 * 0.6;
    
    // Add rotation during bounce
    let rotation_z = progress * 720.0; // 2 full rotations
    let scale_factor = 0.7 + 0.3 * (1.0 - progress);
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        0.0,
        bounce_height,
        scale_factor,
        progress * 45.0, // Tilt during flight
        0.0,
        rotation_z
    )
}

// 7. Wave rotation 3D
fn apply_wave_rotate_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Wave motion với multiple axis rotation
    let wave_x = (progress * std::f32::consts::PI * 4.0).sin() * width as f32 * 0.2;
    let wave_y = (progress * std::f32::consts::PI * 3.0).cos() * height as f32 * 0.15;
    
    let rotation_x = (progress * std::f32::consts::PI * 2.0).sin() * 30.0;
    let rotation_y = (progress * std::f32::consts::PI * 1.5).cos() * 45.0;
    let rotation_z = progress * 180.0;
    
    let scale_factor = 0.8 + 0.2 * (progress * std::f32::consts::PI * 2.0).cos().abs();
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        wave_x,
        wave_y,
        scale_factor,
        rotation_x,
        rotation_y,
        rotation_z
    )
}

// 8. Perspective zoom 3D
fn apply_perspective_zoom_3d(img: &DynamicImage, progress: f32) -> DynamicImage {
    let (width, height) = (img.width(), img.height());
    let rgba_img = img.to_rgba8();
    
    // Dramatic perspective zoom với depth
    let zoom_progress = ease_in_out_cubic(progress);
    let scale_factor = 1.0 + zoom_progress * 1.5; // Zoom to 250%
    let perspective_offset = -zoom_progress * height as f32 * 0.3;
    
    // Add slight rotation để tạo dynamic feel
    let rotation_x = zoom_progress * 10.0;
    let rotation_z = (zoom_progress * std::f32::consts::PI).sin() * 5.0;
    
    apply_3d_transform(
        &rgba_img,
        width,
        height,
        0.0,
        perspective_offset,
        scale_factor,
        rotation_x,
        0.0,
        rotation_z
    )
}

// Core 3D transformation function
fn apply_3d_transform(
    rgba_img: &image::RgbaImage,
    width: u32,
    height: u32,
    offset_x: f32,
    offset_y: f32,
    scale: f32,
    rotation_x: f32,
    rotation_y: f32,
    rotation_z: f32,
) -> DynamicImage {
    let mut result = image::ImageBuffer::new(width, height);
    
    // Background color (transparent black)
    for pixel in result.pixels_mut() {
        *pixel = image::Rgba([0, 0, 0, 0]);
    }
    
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    
    // Convert degrees to radians
    let rad_x = rotation_x * std::f32::consts::PI / 180.0;
    let rad_y = rotation_y * std::f32::consts::PI / 180.0;
    let rad_z = rotation_z * std::f32::consts::PI / 180.0;
    
    // Pre-calculate trigonometric values
    let cos_x = rad_x.cos();
    let sin_x = rad_x.sin();
    let cos_y = rad_y.cos();
    let sin_y = rad_y.sin();
    let cos_z = rad_z.cos();
    let sin_z = rad_z.sin();
    
    for (x, y, pixel) in result.enumerate_pixels_mut() {
        let px = x as f32 - center_x - offset_x;
        let py = y as f32 - center_y - offset_y;
        
        // Apply 3D rotation matrix
        // First rotate around Z axis
        let x1 = px * cos_z - py * sin_z;
        let y1 = px * sin_z + py * cos_z;
        let z1 = 0.0;
        
        // Then rotate around Y axis
        let x2 = x1 * cos_y + z1 * sin_y;
        let y2 = y1;
        let z2 = -x1 * sin_y + z1 * cos_y;
        
        // Finally rotate around X axis
        let x3 = x2;
        let y3 = y2 * cos_x - z2 * sin_x;
        let z3 = y2 * sin_x + z2 * cos_x;
        
        // Apply perspective projection
        let perspective_factor = 1.0 + z3 * 0.001; // Subtle perspective
        let final_x = (x3 / scale / perspective_factor) + center_x;
        let final_y = (y3 / scale / perspective_factor) + center_y;
        
        // Sample từ original image nếu coordinates valid
        if final_x >= 0.0 && final_x < width as f32 - 1.0 && 
           final_y >= 0.0 && final_y < height as f32 - 1.0 {
            
            // Bilinear interpolation
            let x_floor = final_x as u32;
            let y_floor = final_y as u32;
            let x_frac = final_x - x_floor as f32;
            let y_frac = final_y - y_floor as f32;
            
            if x_floor + 1 < width && y_floor + 1 < height {
                let p1 = rgba_img.get_pixel(x_floor, y_floor);
                let p2 = rgba_img.get_pixel(x_floor + 1, y_floor);
                let p3 = rgba_img.get_pixel(x_floor, y_floor + 1);
                let p4 = rgba_img.get_pixel(x_floor + 1, y_floor + 1);
                
                // Interpolate
                let r = interpolate_color(p1[0], p2[0], p3[0], p4[0], x_frac, y_frac);
                let g = interpolate_color(p1[1], p2[1], p3[1], p4[1], x_frac, y_frac);
                let b = interpolate_color(p1[2], p2[2], p3[2], p4[2], x_frac, y_frac);
                let a = interpolate_color(p1[3], p2[3], p3[3], p4[3], x_frac, y_frac);
                
                *pixel = image::Rgba([r, g, b, a]);
            }
        }
    }
    
    DynamicImage::ImageRgba8(result)
}

// Bilinear interpolation helper
fn interpolate_color(c1: u8, c2: u8, c3: u8, c4: u8, x_frac: f32, y_frac: f32) -> u8 {
    let top = c1 as f32 * (1.0 - x_frac) + c2 as f32 * x_frac;
    let bottom = c3 as f32 * (1.0 - x_frac) + c4 as f32 * x_frac;
    let result = top * (1.0 - y_frac) + bottom * y_frac;
    result.clamp(0.0, 255.0) as u8
}
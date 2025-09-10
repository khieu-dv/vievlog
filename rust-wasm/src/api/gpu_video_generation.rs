use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;
use crate::api::wgpu_renderer::WgpuRenderer;
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

static mut WGPU_RENDERER: Option<WgpuRenderer> = None;

#[wasm_bindgen]
pub fn initialize_gpu_renderer() -> js_sys::Promise {
    future_to_promise(async move {
    console_log!("Initializing WGPU renderer for advanced video effects...");
    
        match WgpuRenderer::new().await {
            Ok(renderer) => {
                unsafe {
                    WGPU_RENDERER = Some(renderer);
                }
                console_log!("WGPU renderer initialized successfully!");
                Ok(JsValue::from(true))
            },
            Err(e) => {
                console_log!("Failed to initialize WGPU renderer: {}", e);
                Ok(JsValue::from(false))
            }
        }
    })
}

fn get_renderer() -> Result<&'static mut WgpuRenderer, String> {
    unsafe {
        WGPU_RENDERER.as_mut().ok_or_else(|| "WGPU renderer not initialized. Call initialize_gpu_renderer() first.".to_string())
    }
}

#[wasm_bindgen]
pub fn generate_gpu_transition_frames(
    image1_data: &[u8],
    image2_data: &[u8],
    transition_frames: u32,
    effect_type: &str,
    intensity: f32,
) -> js_sys::Promise {
    future_to_promise(async move {
    let start_time = js_sys::Date::now();
    let frames = js_sys::Array::new();
    
    console_log!("Starting GPU transition generation: {} frames, effect: {}", transition_frames, effect_type);
    
        let renderer = match get_renderer() {
            Ok(r) => r,
            Err(e) => {
                console_log!("Renderer error: {}", e);
                return Ok(JsValue::from(js_sys::Array::new()));
            }
        };
    
        // Load and validate images
        let img1 = match image::load_from_memory(image1_data) {
            Ok(img) => img,
            Err(_) => {
                console_log!("Failed to load first image");
                return Ok(JsValue::from(js_sys::Array::new()));
            }
        };
        
        let img2 = match image::load_from_memory(image2_data) {
            Ok(img) => img,
            Err(_) => {
                console_log!("Failed to load second image");
                return Ok(JsValue::from(js_sys::Array::new()));
            }
        };
    
    // Resize both images to the same dimensions
    let (width, height) = (
        img1.width().min(img2.width()),
        img1.height().min(img2.height())
    );
    
    let img1_resized = img1.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    let img2_resized = img2.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    
    // Convert images to raw data
    let img1_data = {
        let mut output = Vec::new();
        let mut cursor = Cursor::new(&mut output);
        img1_resized.write_to(&mut cursor, ImageFormat::Png).unwrap();
        output
    };
    
    let img2_data = {
        let mut output = Vec::new();
        let mut cursor = Cursor::new(&mut output);
        img2_resized.write_to(&mut cursor, ImageFormat::Png).unwrap();
        output
    };
    
    // Generate frames using GPU
    for i in 0..transition_frames {
        let progress = i as f32 / (transition_frames - 1) as f32;
        
        match renderer.apply_effect(
            &img1_data,
            Some(&img2_data),
            width,
            height,
            effect_type,
            progress,
            intensity,
        ).await {
            Ok(result_data) => {
                // Convert RGBA data to PNG and then to base64
                let rgba_img = image::ImageBuffer::<image::Rgba<u8>, Vec<u8>>::from_raw(
                    width, height, result_data
                ).unwrap();
                
                let dynamic_img = DynamicImage::ImageRgba8(rgba_img);
                
                let mut output = Vec::new();
                let mut cursor = Cursor::new(&mut output);
                
                match dynamic_img.write_to(&mut cursor, ImageFormat::Png) {
                    Ok(_) => {
                        let base64_data = general_purpose::STANDARD.encode(&output);
                        frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
                    },
                    Err(_) => {
                        console_log!("Failed to encode frame {}", i);
                    }
                }
            },
            Err(e) => {
                console_log!("GPU effect failed for frame {}: {}", i, e);
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("GPU generated {} frames in {}ms", frames.length(), end_time - start_time);
    
    frames
}

#[wasm_bindgen]
pub async fn generate_gpu_video_from_images(
    images_data: js_sys::Array,
    frames_per_image: u32,
    transition_frames: u32,
    effects_list: js_sys::Array, // Array of effect names
    intensity: f32,
) -> js_sys::Array {
    let start_time = js_sys::Date::now();
    let all_frames = js_sys::Array::new();
    
    console_log!("Generating GPU video from {} images", images_data.length());
    console_log!("Frames per image: {}, transition frames: {}", frames_per_image, transition_frames);
    
    let renderer = match get_renderer() {
        Ok(r) => r,
        Err(e) => {
            console_log!("Renderer error: {}", e);
            return all_frames;
        }
    };
    
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
    
    // Available GPU effects
    let available_effects = [
        "crossfade", "3d_flip", "parallax", "film_grain", "light_leak", "bokeh"
    ];
    
    for (idx, img) in processed_images.iter().enumerate() {
        // Select effect for this image
        let effect_index = if effects_list.length() > 0 {
            let effect_idx = (idx as u32) % effects_list.length();
            if let Some(effect_name) = effects_list.get(effect_idx).as_string() {
                effect_name
            } else {
                available_effects[idx % available_effects.len()].to_string()
            }
        } else {
            available_effects[idx % available_effects.len()].to_string()
        };
        
        console_log!("Image {} using GPU effect: {}", idx, effect_index);
        
        // Convert image to raw data
        let img_data = {
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            img.write_to(&mut cursor, ImageFormat::Png).unwrap();
            output
        };
        
        // Generate frames with motion effects
        for frame_idx in 0..frames_per_image {
            let progress = frame_idx as f32 / frames_per_image as f32;
            
            match renderer.apply_effect(
                &img_data,
                None, // Single image effect
                target_width,
                target_height,
                &effect_index,
                progress,
                intensity,
            ).await {
                Ok(result_data) => {
                    // Convert RGBA data to PNG
                    let rgba_img = image::ImageBuffer::<image::Rgba<u8>, Vec<u8>>::from_raw(
                        target_width, target_height, result_data
                    ).unwrap();
                    
                    let dynamic_img = DynamicImage::ImageRgba8(rgba_img);
                    
                    let mut output = Vec::new();
                    let mut cursor = Cursor::new(&mut output);
                    
                    match dynamic_img.write_to(&mut cursor, ImageFormat::Png) {
                        Ok(_) => {
                            let base64_data = general_purpose::STANDARD.encode(&output);
                            all_frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
                        },
                        Err(_) => {
                            console_log!("Failed to encode frame {} of image {}", frame_idx, idx);
                        }
                    }
                },
                Err(e) => {
                    console_log!("GPU effect failed for image {} frame {}: {}", idx, frame_idx, e);
                }
            }
        }
        
        // Add GPU transition to next image
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
            
            // Use crossfade for transitions between images
            for trans_idx in 0..transition_frames {
                let progress = trans_idx as f32 / (transition_frames - 1) as f32;
                
                match renderer.apply_effect(
                    &img1_data,
                    Some(&img2_data),
                    target_width,
                    target_height,
                    "crossfade",
                    progress,
                    intensity,
                ).await {
                    Ok(result_data) => {
                        let rgba_img = image::ImageBuffer::<image::Rgba<u8>, Vec<u8>>::from_raw(
                            target_width, target_height, result_data
                        ).unwrap();
                        
                        let dynamic_img = DynamicImage::ImageRgba8(rgba_img);
                        
                        let mut output = Vec::new();
                        let mut cursor = Cursor::new(&mut output);
                        
                        match dynamic_img.write_to(&mut cursor, ImageFormat::Png) {
                            Ok(_) => {
                                let base64_data = general_purpose::STANDARD.encode(&output);
                                all_frames.push(&JsValue::from_str(&format!("data:image/png;base64,{}", base64_data)));
                            },
                            Err(_) => {
                                console_log!("Failed to encode transition frame {}", trans_idx);
                            }
                        }
                    },
                    Err(e) => {
                        console_log!("GPU transition failed for frame {}: {}", trans_idx, e);
                    }
                }
            }
        }
    }
    
    let end_time = js_sys::Date::now();
    console_log!("GPU generated total {} frames in {}ms", all_frames.length(), end_time - start_time);
    
    all_frames
}

#[wasm_bindgen]
pub fn get_available_gpu_effects() -> js_sys::Array {
    let effects = js_sys::Array::new();
    let available_effects = [
        "crossfade",
        "3d_flip", 
        "parallax",
        "film_grain",
        "light_leak",
        "bokeh"
    ];
    
    for effect in &available_effects {
        effects.push(&JsValue::from_str(effect));
    }
    
    effects
}

#[wasm_bindgen]
pub fn is_gpu_renderer_initialized() -> bool {
    unsafe {
        WGPU_RENDERER.is_some()
    }
}
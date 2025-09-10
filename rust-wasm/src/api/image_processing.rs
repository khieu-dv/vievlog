use wasm_bindgen::prelude::*;
use image::{ImageBuffer, ImageFormat, RgbaImage, DynamicImage, Rgba};
use imageproc::filter::{gaussian_blur_f32, box_filter};
use std::io::Cursor;

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct ImageProcessingResult {
    success: bool,
    message: String,
    processing_time_ms: f64,
}

#[wasm_bindgen]
impl ImageProcessingResult {
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.message.clone()
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

#[wasm_bindgen]
pub fn resize_image(image_data: &[u8], width: u32, height: u32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match resized.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Image resized in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode resized image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn apply_blur(image_data: &[u8], sigma: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let rgba_img = img.to_rgba8();
            let blurred = gaussian_blur_f32(&rgba_img, sigma);
            
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match DynamicImage::ImageRgba8(blurred).write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Blur applied in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode blurred image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for blur");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn adjust_brightness(image_data: &[u8], factor: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let mut rgba_img = img.to_rgba8();
            
            for pixel in rgba_img.pixels_mut() {
                let r = (pixel[0] as f32 * factor).clamp(0.0, 255.0) as u8;
                let g = (pixel[1] as f32 * factor).clamp(0.0, 255.0) as u8;
                let b = (pixel[2] as f32 * factor).clamp(0.0, 255.0) as u8;
                *pixel = Rgba([r, g, b, pixel[3]]);
            }
            
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match DynamicImage::ImageRgba8(rgba_img).write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Brightness adjusted in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode brightness-adjusted image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for brightness adjustment");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn adjust_contrast(image_data: &[u8], factor: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let mut rgba_img = img.to_rgba8();
            
            for pixel in rgba_img.pixels_mut() {
                let r = (((pixel[0] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8;
                let g = (((pixel[1] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8;
                let b = (((pixel[2] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8;
                *pixel = Rgba([r, g, b, pixel[3]]);
            }
            
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match DynamicImage::ImageRgba8(rgba_img).write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Contrast adjusted in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode contrast-adjusted image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for contrast adjustment");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn apply_grayscale(image_data: &[u8]) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let grayscale = img.grayscale();
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match grayscale.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Grayscale applied in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode grayscale image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for grayscale");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn rotate_image(image_data: &[u8], angle: f32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let rotated = match angle {
                90.0 => img.rotate90(),
                180.0 => img.rotate180(),
                270.0 => img.rotate270(),
                _ => img, // For other angles, return original (could implement custom rotation)
            };
            
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match rotated.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Image rotated in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode rotated image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for rotation");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn flip_horizontal(image_data: &[u8]) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let flipped = img.fliph();
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match flipped.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Image flipped horizontally in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode horizontally flipped image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for horizontal flip");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn flip_vertical(image_data: &[u8]) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let flipped = img.flipv();
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match flipped.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Image flipped vertically in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode vertically flipped image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for vertical flip");
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn get_image_info(image_data: &[u8]) -> String {
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let info = format!(
                r#"{{"width": {}, "height": {}, "color": "{}", "format": "auto"}}"#,
                img.width(),
                img.height(),
                match img.color() {
                    image::ColorType::L8 => "grayscale",
                    image::ColorType::La8 => "grayscale_alpha",
                    image::ColorType::Rgb8 => "rgb",
                    image::ColorType::Rgba8 => "rgba",
                    image::ColorType::L16 => "grayscale_16",
                    image::ColorType::La16 => "grayscale_alpha_16",
                    image::ColorType::Rgb16 => "rgb_16",
                    image::ColorType::Rgba16 => "rgba_16",
                    image::ColorType::Rgb32F => "rgb_32f",
                    image::ColorType::Rgba32F => "rgba_32f",
                    _ => "unknown"
                }
            );
            info
        },
        Err(_) => r#"{"error": "Failed to load image"}"#.to_string()
    }
}

#[wasm_bindgen]
pub fn crop_image(image_data: &[u8], x: u32, y: u32, width: u32, height: u32) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(img) => {
            let cropped = img.crop_imm(x, y, width, height);
            let mut output = Vec::new();
            let mut cursor = Cursor::new(&mut output);
            
            match cropped.write_to(&mut cursor, ImageFormat::Png) {
                Ok(_) => {
                    let end_time = js_sys::Date::now();
                    console_log!("Image cropped in {}ms", end_time - start_time);
                    output
                },
                Err(_) => {
                    console_log!("Failed to encode cropped image");
                    Vec::new()
                }
            }
        },
        Err(_) => {
            console_log!("Failed to load image data for cropping");
            Vec::new()
        }
    }
}
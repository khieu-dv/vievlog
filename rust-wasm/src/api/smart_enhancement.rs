use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageBuffer, Rgba, GenericImageView};
use std::io::Cursor;

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct SmartEnhancementConfig {
    auto_exposure: bool,
    auto_contrast: bool,
    auto_saturation: bool,
    noise_reduction: bool,
    sharpening: String, // "none", "subtle", "medium", "strong"
    white_balance: String, // "auto", "manual"
}

#[wasm_bindgen]
impl SmartEnhancementConfig {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SmartEnhancementConfig {
        SmartEnhancementConfig {
            auto_exposure: true,
            auto_contrast: true,
            auto_saturation: true,
            noise_reduction: false,
            sharpening: "subtle".to_string(),
            white_balance: "auto".to_string(),
        }
    }

    // Getters
    #[wasm_bindgen(getter)]
    pub fn auto_exposure(&self) -> bool { self.auto_exposure }
    
    #[wasm_bindgen(getter)]
    pub fn auto_contrast(&self) -> bool { self.auto_contrast }
    
    #[wasm_bindgen(getter)]
    pub fn auto_saturation(&self) -> bool { self.auto_saturation }
    
    #[wasm_bindgen(getter)]
    pub fn noise_reduction(&self) -> bool { self.noise_reduction }
    
    #[wasm_bindgen(getter)]
    pub fn sharpening(&self) -> String { self.sharpening.clone() }
    
    #[wasm_bindgen(getter)]
    pub fn white_balance(&self) -> String { self.white_balance.clone() }

    // Setters
    #[wasm_bindgen(setter)]
    pub fn set_auto_exposure(&mut self, value: bool) { self.auto_exposure = value; }
    
    #[wasm_bindgen(setter)]
    pub fn set_auto_contrast(&mut self, value: bool) { self.auto_contrast = value; }
    
    #[wasm_bindgen(setter)]
    pub fn set_auto_saturation(&mut self, value: bool) { self.auto_saturation = value; }
    
    #[wasm_bindgen(setter)]
    pub fn set_noise_reduction(&mut self, value: bool) { self.noise_reduction = value; }
    
    #[wasm_bindgen(setter)]
    pub fn set_sharpening(&mut self, value: String) { self.sharpening = value; }
    
    #[wasm_bindgen(setter)]
    pub fn set_white_balance(&mut self, value: String) { self.white_balance = value; }
}

#[derive(Debug, Clone)]
pub struct ImageHistogram {
    pub red: [u32; 256],
    pub green: [u32; 256],
    pub blue: [u32; 256],
    pub luminance: [u32; 256],
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

impl ImageHistogram {
    pub fn new() -> Self {
        ImageHistogram {
            red: [0; 256],
            green: [0; 256],
            blue: [0; 256],
            luminance: [0; 256],
        }
    }

    pub fn from_image(img: &DynamicImage) -> Self {
        let mut histogram = ImageHistogram::new();
        let rgba_img = img.to_rgba8();
        
        for pixel in rgba_img.pixels() {
            let r = pixel[0] as usize;
            let g = pixel[1] as usize;
            let b = pixel[2] as usize;
            
            histogram.red[r] += 1;
            histogram.green[g] += 1;
            histogram.blue[b] += 1;
            
            // Calculate luminance using ITU-R BT.709 weights
            let luminance = (0.2126 * r as f32 + 0.7152 * g as f32 + 0.0722 * b as f32) as usize;
            histogram.luminance[luminance.min(255)] += 1;
        }
        
        histogram
    }

    pub fn get_percentile(&self, channel: &[u32; 256], percentile: f32) -> u8 {
        let total_pixels: u32 = channel.iter().sum();
        let target_count = (total_pixels as f32 * percentile) as u32;
        
        let mut cumulative = 0u32;
        for (i, &count) in channel.iter().enumerate() {
            cumulative += count;
            if cumulative >= target_count {
                return i as u8;
            }
        }
        255
    }
}

/// Smart auto exposure correction based on histogram analysis
pub fn auto_exposure_correction(img: &DynamicImage) -> DynamicImage {
    let histogram = ImageHistogram::from_image(img);
    
    // Get 1st and 99th percentiles to ignore extreme values
    let shadow_point = histogram.get_percentile(&histogram.luminance, 0.01) as f32;
    let highlight_point = histogram.get_percentile(&histogram.luminance, 0.99) as f32;
    
    // Calculate optimal exposure adjustment
    let current_range = highlight_point - shadow_point;
    let ideal_shadow = 10.0; // Target shadow level
    let ideal_highlight = 245.0; // Target highlight level
    let ideal_range = ideal_highlight - ideal_shadow;
    
    let exposure_factor = if current_range > 0.0 {
        ideal_range / current_range
    } else {
        1.0
    };
    
    let exposure_offset = ideal_shadow - (shadow_point * exposure_factor);
    
    console_log!("🔆 Auto exposure: factor={:.2}, offset={:.2}", exposure_factor, exposure_offset);
    
    apply_exposure_adjustment(img, exposure_factor, exposure_offset)
}

/// Smart auto contrast enhancement using adaptive histogram equalization
pub fn auto_contrast_enhancement(img: &DynamicImage) -> DynamicImage {
    let histogram = ImageHistogram::from_image(img);
    
    // Calculate contrast ratio
    let p5 = histogram.get_percentile(&histogram.luminance, 0.05) as f32;
    let p95 = histogram.get_percentile(&histogram.luminance, 0.95) as f32;
    let contrast_ratio = (p95 - p5) / 255.0;
    
    // Determine contrast adjustment needed
    let target_contrast = 0.8; // Target contrast ratio
    let contrast_factor = if contrast_ratio > 0.1 {
        target_contrast / contrast_ratio
    } else {
        1.5 // Default boost for low contrast images
    };
    
    let contrast_adjustment = contrast_factor.min(2.0).max(0.5); // Limit adjustment
    
    console_log!("📊 Auto contrast: ratio={:.2}, factor={:.2}", contrast_ratio, contrast_adjustment);
    
    apply_contrast_adjustment(img, contrast_adjustment)
}

/// Smart saturation enhancement using vibrance algorithm
pub fn auto_saturation_enhancement(img: &DynamicImage) -> DynamicImage {
    let rgba_img = img.to_rgba8();
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    
    // Calculate average saturation
    let mut total_saturation = 0.0f32;
    let mut pixel_count = 0u32;
    
    for pixel in rgba_img.pixels() {
        let r = pixel[0] as f32 / 255.0;
        let g = pixel[1] as f32 / 255.0;
        let b = pixel[2] as f32 / 255.0;
        
        let max = r.max(g).max(b);
        let min = r.min(g).min(b);
        let saturation = if max > 0.0 { (max - min) / max } else { 0.0 };
        
        total_saturation += saturation;
        pixel_count += 1;
    }
    
    let average_saturation = total_saturation / pixel_count as f32;
    
    // Calculate vibrance adjustment (affects low-saturation pixels more)
    let vibrance_factor = if average_saturation < 0.3 {
        1.4 // Boost vibrance for dull images
    } else if average_saturation > 0.7 {
        0.9 // Reduce vibrance for oversaturated images
    } else {
        1.1 // Subtle enhancement for normal images
    };
    
    console_log!("🎨 Auto saturation: avg={:.2}, factor={:.2}", average_saturation, vibrance_factor);
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let r = pixel[0] as f32 / 255.0;
        let g = pixel[1] as f32 / 255.0;
        let b = pixel[2] as f32 / 255.0;
        let a = pixel[3];
        
        // Convert to HSV
        let max = r.max(g).max(b);
        let min = r.min(g).min(b);
        let delta = max - min;
        
        let saturation = if max > 0.0 { delta / max } else { 0.0 };
        
        // Apply vibrance (stronger effect on less saturated pixels)
        let vibrance_multiplier = vibrance_factor * (1.0 - saturation).powf(0.5);
        let new_saturation = (saturation * vibrance_multiplier).min(1.0);
        
        // Convert back to RGB
        let (new_r, new_g, new_b) = if delta == 0.0 {
            (r, g, b) // Grayscale pixel
        } else {
            let value = max;
            let saturation_ratio = new_saturation / saturation;
            
            let new_r = r * saturation_ratio + value * (1.0 - saturation_ratio);
            let new_g = g * saturation_ratio + value * (1.0 - saturation_ratio);
            let new_b = b * saturation_ratio + value * (1.0 - saturation_ratio);
            
            (new_r.min(1.0).max(0.0), new_g.min(1.0).max(0.0), new_b.min(1.0).max(0.0))
        };
        
        output.put_pixel(x, y, Rgba([
            (new_r * 255.0) as u8,
            (new_g * 255.0) as u8,
            (new_b * 255.0) as u8,
            a,
        ]));
    }
    
    DynamicImage::ImageRgba8(output)
}

/// Apply exposure adjustment
fn apply_exposure_adjustment(img: &DynamicImage, factor: f32, offset: f32) -> DynamicImage {
    let rgba_img = img.to_rgba8();
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let r = ((pixel[0] as f32 * factor + offset).max(0.0).min(255.0)) as u8;
        let g = ((pixel[1] as f32 * factor + offset).max(0.0).min(255.0)) as u8;
        let b = ((pixel[2] as f32 * factor + offset).max(0.0).min(255.0)) as u8;
        let a = pixel[3];
        
        output.put_pixel(x, y, Rgba([r, g, b, a]));
    }
    
    DynamicImage::ImageRgba8(output)
}

/// Apply contrast adjustment
fn apply_contrast_adjustment(img: &DynamicImage, factor: f32) -> DynamicImage {
    let rgba_img = img.to_rgba8();
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;
        let a = pixel[3];
        
        // Apply contrast around midpoint (127.5)
        let new_r = ((r - 127.5) * factor + 127.5).max(0.0).min(255.0) as u8;
        let new_g = ((g - 127.5) * factor + 127.5).max(0.0).min(255.0) as u8;
        let new_b = ((b - 127.5) * factor + 127.5).max(0.0).min(255.0) as u8;
        
        output.put_pixel(x, y, Rgba([new_r, new_g, new_b, a]));
    }
    
    DynamicImage::ImageRgba8(output)
}

/// Simplified smart enhancement function that accepts JavaScript values
#[wasm_bindgen]
pub fn apply_smart_enhancement_simple(
    image_data: &[u8],
    auto_exposure: bool,
    auto_contrast: bool, 
    auto_saturation: bool,
    noise_reduction: bool,
    sharpening: &str,
    white_balance: &str,
) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(mut img) => {
            console_log!("🎯 Applying smart enhancement...");
            
            // Apply enhancements in optimal order
            if auto_exposure {
                img = auto_exposure_correction(&img);
            }
            
            if auto_contrast {
                img = auto_contrast_enhancement(&img);
            }
            
            if auto_saturation {
                img = auto_saturation_enhancement(&img);
            }
            
            // TODO: Add noise reduction and sharpening based on parameters
            
            // Convert back to bytes
            let mut output_buffer = Vec::new();
            match img.write_to(&mut std::io::Cursor::new(&mut output_buffer), image::ImageFormat::Png) {
                Ok(_) => {
                    let processing_time = js_sys::Date::now() - start_time;
                    console_log!("✨ Smart enhancement completed in {:.1}ms", processing_time);
                    output_buffer
                }
                Err(_) => {
                    console_log!("❌ Failed to encode enhanced image");
                    image_data.to_vec()
                }
            }
        }
        Err(_) => {
            console_log!("❌ Failed to load image for enhancement");
            image_data.to_vec()
        }
    }
}

/// Create a new SmartEnhancementConfig with default values
#[wasm_bindgen]
pub fn create_smart_enhancement_config() -> SmartEnhancementConfig {
    SmartEnhancementConfig::new()
}

/// Main smart enhancement function (legacy)
#[wasm_bindgen]
pub fn apply_smart_enhancement(
    image_data: &[u8],
    config: &SmartEnhancementConfig,
) -> Vec<u8> {
    let start_time = js_sys::Date::now();
    
    match image::load_from_memory(image_data) {
        Ok(mut img) => {
            console_log!("🎯 Applying smart enhancement...");
            
            // Apply enhancements in optimal order
            if config.auto_exposure {
                img = auto_exposure_correction(&img);
            }
            
            if config.auto_contrast {
                img = auto_contrast_enhancement(&img);
            }
            
            if config.auto_saturation {
                img = auto_saturation_enhancement(&img);
            }
            
            // Convert back to bytes
            let mut output_buffer = Vec::new();
            match img.write_to(&mut std::io::Cursor::new(&mut output_buffer), image::ImageFormat::Png) {
                Ok(_) => {
                    let processing_time = js_sys::Date::now() - start_time;
                    console_log!("✨ Smart enhancement completed in {:.1}ms", processing_time);
                    output_buffer
                }
                Err(_) => {
                    console_log!("❌ Failed to encode enhanced image");
                    image_data.to_vec()
                }
            }
        }
        Err(_) => {
            console_log!("❌ Failed to load image for enhancement");
            image_data.to_vec()
        }
    }
}

/// Batch enhance multiple images
#[wasm_bindgen]
pub fn batch_smart_enhancement(
    images_data: js_sys::Array,
    config: &SmartEnhancementConfig,
) -> js_sys::Array {
    let enhanced_images = js_sys::Array::new();
    
    console_log!("🔄 Batch enhancing {} images", images_data.length());
    
    for i in 0..images_data.length() {
        let img_data = images_data.get(i);
        if let Some(uint8_array) = img_data.dyn_ref::<js_sys::Uint8Array>() {
            let data = uint8_array.to_vec();
            let enhanced_data = apply_smart_enhancement(&data, config);
            
            let enhanced_uint8_array = js_sys::Uint8Array::new_with_length(enhanced_data.len() as u32);
            enhanced_uint8_array.copy_from(&enhanced_data);
            enhanced_images.push(&enhanced_uint8_array);
        }
    }
    
    enhanced_images
}
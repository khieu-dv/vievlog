use image::DynamicImage;
// use colorgrad::{Gradient, Color}; // Unused for now

// Professional color grading functions
pub struct ColorGrader {
    pub shadows: ColorCorrection,
    pub midtones: ColorCorrection,
    pub highlights: ColorCorrection,
    pub global: GlobalColorSettings,
}

#[derive(Clone, Debug)]
pub struct ColorCorrection {
    pub hue: f32,          // -180 to 180
    pub saturation: f32,   // 0 to 2.0
    pub luminance: f32,    // 0 to 2.0
    pub contrast: f32,     // 0 to 2.0
    pub gamma: f32,        // 0.1 to 3.0
}

#[derive(Clone, Debug)]
pub struct GlobalColorSettings {
    pub temperature: f32,   // 2000K to 11000K
    pub tint: f32,         // -100 to 100
    pub exposure: f32,     // -5 to 5 stops
    pub vibrance: f32,     // -100 to 100
    pub saturation: f32,   // -100 to 100
}

impl ColorGrader {
    pub fn new_cinematic() -> Self {
        Self {
            shadows: ColorCorrection {
                hue: -5.0,
                saturation: 0.9,
                luminance: 0.95,
                contrast: 1.05,
                gamma: 1.1,
            },
            midtones: ColorCorrection {
                hue: 0.0,
                saturation: 1.1,
                luminance: 1.0,
                contrast: 1.1,
                gamma: 1.0,
            },
            highlights: ColorCorrection {
                hue: 10.0,
                saturation: 1.05,
                luminance: 1.05,
                contrast: 0.95,
                gamma: 0.9,
            },
            global: GlobalColorSettings {
                temperature: 5200.0,
                tint: 2.0,
                exposure: 0.1,
                vibrance: 15.0,
                saturation: 5.0,
            },
        }
    }
    
    pub fn new_warm() -> Self {
        Self {
            shadows: ColorCorrection {
                hue: 15.0,
                saturation: 1.2,
                luminance: 0.9,
                contrast: 1.1,
                gamma: 1.15,
            },
            midtones: ColorCorrection {
                hue: 8.0,
                saturation: 1.15,
                luminance: 1.05,
                contrast: 1.05,
                gamma: 1.0,
            },
            highlights: ColorCorrection {
                hue: -5.0,
                saturation: 0.95,
                luminance: 1.1,
                contrast: 0.9,
                gamma: 0.85,
            },
            global: GlobalColorSettings {
                temperature: 4800.0,
                tint: 8.0,
                exposure: 0.2,
                vibrance: 20.0,
                saturation: 8.0,
            },
        }
    }
    
    pub fn new_cool() -> Self {
        Self {
            shadows: ColorCorrection {
                hue: -15.0,
                saturation: 1.1,
                luminance: 0.92,
                contrast: 1.08,
                gamma: 1.05,
            },
            midtones: ColorCorrection {
                hue: -8.0,
                saturation: 1.05,
                luminance: 1.0,
                contrast: 1.1,
                gamma: 1.0,
            },
            highlights: ColorCorrection {
                hue: 5.0,
                saturation: 1.08,
                luminance: 1.08,
                contrast: 0.95,
                gamma: 0.92,
            },
            global: GlobalColorSettings {
                temperature: 5800.0,
                tint: -5.0,
                exposure: -0.05,
                vibrance: 12.0,
                saturation: 3.0,
            },
        }
    }
}

impl ColorGrader {
    pub fn apply_grading(&self, img: &DynamicImage) -> DynamicImage {
        let mut rgba = img.to_rgba8();
        let (_width, _height) = (rgba.width(), rgba.height());
        
        for (_x, _y, pixel) in rgba.enumerate_pixels_mut() {
            // Convert to working color space (linear RGB)
            let mut rgb = [
                srgb_to_linear(pixel[0] as f32 / 255.0),
                srgb_to_linear(pixel[1] as f32 / 255.0),
                srgb_to_linear(pixel[2] as f32 / 255.0),
            ];
            
            // Apply global adjustments first
            rgb = self.apply_global_adjustments(rgb);
            
            // Determine luminance zones
            let luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
            let (shadow_weight, midtone_weight, highlight_weight) = calculate_zone_weights(luminance);
            
            // Apply zone-specific corrections
            if shadow_weight > 0.0 {
                rgb = self.apply_zone_correction(rgb, &self.shadows, shadow_weight);
            }
            if midtone_weight > 0.0 {
                rgb = self.apply_zone_correction(rgb, &self.midtones, midtone_weight);
            }
            if highlight_weight > 0.0 {
                rgb = self.apply_zone_correction(rgb, &self.highlights, highlight_weight);
            }
            
            // Convert back to sRGB
            pixel[0] = (linear_to_srgb(rgb[0]) * 255.0).clamp(0.0, 255.0) as u8;
            pixel[1] = (linear_to_srgb(rgb[1]) * 255.0).clamp(0.0, 255.0) as u8;
            pixel[2] = (linear_to_srgb(rgb[2]) * 255.0).clamp(0.0, 255.0) as u8;
        }
        
        DynamicImage::ImageRgba8(rgba)
    }
    
    fn apply_global_adjustments(&self, mut rgb: [f32; 3]) -> [f32; 3] {
        // Temperature and tint adjustment
        rgb = apply_white_balance(rgb, self.global.temperature, self.global.tint);
        
        // Exposure adjustment
        let exposure_factor = 2.0_f32.powf(self.global.exposure);
        rgb[0] *= exposure_factor;
        rgb[1] *= exposure_factor;
        rgb[2] *= exposure_factor;
        
        // Global saturation and vibrance
        rgb = apply_saturation_vibrance(rgb, self.global.saturation / 100.0, self.global.vibrance / 100.0);
        
        rgb
    }
    
    fn apply_zone_correction(&self, mut rgb: [f32; 3], correction: &ColorCorrection, weight: f32) -> [f32; 3] {
        // Gamma correction
        if correction.gamma != 1.0 {
            rgb[0] = rgb[0].powf(1.0 / correction.gamma);
            rgb[1] = rgb[1].powf(1.0 / correction.gamma);
            rgb[2] = rgb[2].powf(1.0 / correction.gamma);
        }
        
        // Luminance adjustment
        if correction.luminance != 1.0 {
            let lum_factor = 1.0 + ((correction.luminance - 1.0) * weight);
            rgb[0] *= lum_factor;
            rgb[1] *= lum_factor;
            rgb[2] *= lum_factor;
        }
        
        // Contrast adjustment
        if correction.contrast != 1.0 {
            let contrast_factor = 1.0 + ((correction.contrast - 1.0) * weight);
            rgb[0] = ((rgb[0] - 0.5) * contrast_factor + 0.5).max(0.0);
            rgb[1] = ((rgb[1] - 0.5) * contrast_factor + 0.5).max(0.0);
            rgb[2] = ((rgb[2] - 0.5) * contrast_factor + 0.5).max(0.0);
        }
        
        // Saturation adjustment
        if correction.saturation != 1.0 {
            let sat_factor = 1.0 + ((correction.saturation - 1.0) * weight);
            rgb = apply_saturation_simple(rgb, sat_factor);
        }
        
        // Hue shift
        if correction.hue != 0.0 {
            let hue_shift = correction.hue * weight;
            rgb = apply_hue_shift(rgb, hue_shift);
        }
        
        rgb
    }
}

// Helper functions for color calculations
fn calculate_zone_weights(luminance: f32) -> (f32, f32, f32) {
    // Smooth transitions between zones
    let shadow_end = 0.3;
    let highlight_start = 0.7;
    
    let shadow_weight = if luminance < shadow_end {
        1.0 - (luminance / shadow_end)
    } else {
        0.0
    };
    
    let highlight_weight = if luminance > highlight_start {
        (luminance - highlight_start) / (1.0 - highlight_start)
    } else {
        0.0
    };
    
    let midtone_weight = 1.0 - shadow_weight - highlight_weight;
    
    (shadow_weight, midtone_weight.max(0.0), highlight_weight)
}

fn srgb_to_linear(srgb: f32) -> f32 {
    if srgb <= 0.04045 {
        srgb / 12.92
    } else {
        ((srgb + 0.055) / 1.055).powf(2.4)
    }
}

fn linear_to_srgb(linear: f32) -> f32 {
    if linear <= 0.0031308 {
        linear * 12.92
    } else {
        1.055 * linear.powf(1.0 / 2.4) - 0.055
    }
}

fn apply_white_balance(rgb: [f32; 3], temperature: f32, tint: f32) -> [f32; 3] {
    // Simplified white balance based on temperature
    let temp_factor = temperature / 5500.0; // Normalize to daylight
    let tint_factor = tint / 100.0;
    
    let r_factor = if temp_factor > 1.0 {
        1.0 + (temp_factor - 1.0) * 0.3
    } else {
        1.0 - (1.0 - temp_factor) * 0.4
    };
    
    let b_factor = if temp_factor > 1.0 {
        1.0 - (temp_factor - 1.0) * 0.5
    } else {
        1.0 + (1.0 - temp_factor) * 0.3
    };
    
    let g_factor = 1.0 + tint_factor * 0.2;
    
    [
        rgb[0] * r_factor,
        rgb[1] * g_factor,
        rgb[2] * b_factor,
    ]
}

fn apply_saturation_simple(rgb: [f32; 3], factor: f32) -> [f32; 3] {
    let gray = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
    [
        gray + (rgb[0] - gray) * factor,
        gray + (rgb[1] - gray) * factor,
        gray + (rgb[2] - gray) * factor,
    ]
}

fn apply_saturation_vibrance(rgb: [f32; 3], saturation: f32, vibrance: f32) -> [f32; 3] {
    // First apply basic saturation
    let mut result = apply_saturation_simple(rgb, 1.0 + saturation);
    
    // Then apply vibrance (more intelligent saturation)
    if vibrance != 0.0 {
        let max_component = result[0].max(result[1]).max(result[2]);
        let min_component = result[0].min(result[1]).min(result[2]);
        let current_saturation = if max_component > 0.0 {
            (max_component - min_component) / max_component
        } else {
            0.0
        };
        
        // Vibrance affects less saturated colors more
        let vibrance_factor = 1.0 + vibrance * (1.0 - current_saturation);
        result = apply_saturation_simple(result, vibrance_factor);
    }
    
    result
}

fn apply_hue_shift(rgb: [f32; 3], hue_degrees: f32) -> [f32; 3] {
    // Convert RGB to HSL, shift hue, convert back
    let (h, s, l) = rgb_to_hsl(rgb);
    let new_h = (h + hue_degrees / 360.0) % 1.0;
    hsl_to_rgb([new_h, s, l])
}

fn rgb_to_hsl(rgb: [f32; 3]) -> (f32, f32, f32) {
    let max = rgb[0].max(rgb[1]).max(rgb[2]);
    let min = rgb[0].min(rgb[1]).min(rgb[2]);
    let delta = max - min;
    
    let l = (max + min) / 2.0;
    
    if delta == 0.0 {
        return (0.0, 0.0, l); // Grayscale
    }
    
    let s = if l > 0.5 {
        delta / (2.0 - max - min)
    } else {
        delta / (max + min)
    };
    
    let h = if max == rgb[0] {
        (rgb[1] - rgb[2]) / delta + if rgb[1] < rgb[2] { 6.0 } else { 0.0 }
    } else if max == rgb[1] {
        (rgb[2] - rgb[0]) / delta + 2.0
    } else {
        (rgb[0] - rgb[1]) / delta + 4.0
    } / 6.0;
    
    (h, s, l)
}

fn hsl_to_rgb(hsl: [f32; 3]) -> [f32; 3] {
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    
    if s == 0.0 {
        return [l, l, l]; // Grayscale
    }
    
    let hue_to_rgb = |p: f32, q: f32, mut t: f32| -> f32 {
        if t < 0.0 { t += 1.0; }
        if t > 1.0 { t -= 1.0; }
        if t < 1.0/6.0 { p + (q - p) * 6.0 * t }
        else if t < 1.0/2.0 { q }
        else if t < 2.0/3.0 { p + (q - p) * (2.0/3.0 - t) * 6.0 }
        else { p }
    };
    
    let q = if l < 0.5 { l * (1.0 + s) } else { l + s - l * s };
    let p = 2.0 * l - q;
    
    [
        hue_to_rgb(p, q, h + 1.0/3.0),
        hue_to_rgb(p, q, h),
        hue_to_rgb(p, q, h - 1.0/3.0),
    ]
}

// Preset color grading functions
pub fn apply_cinematic_look(img: &DynamicImage) -> DynamicImage {
    let grader = ColorGrader::new_cinematic();
    grader.apply_grading(img)
}

pub fn apply_warm_look(img: &DynamicImage) -> DynamicImage {
    let grader = ColorGrader::new_warm();
    grader.apply_grading(img)
}

pub fn apply_cool_look(img: &DynamicImage) -> DynamicImage {
    let grader = ColorGrader::new_cool();
    grader.apply_grading(img)
}

// Film emulation LUTs (simplified)
pub fn apply_kodak_film_look(img: &DynamicImage) -> DynamicImage {
    let mut grader = ColorGrader::new_cinematic();
    
    // Kodak-inspired adjustments
    grader.shadows.saturation = 1.15;
    grader.shadows.gamma = 1.2;
    grader.highlights.saturation = 0.9;
    grader.global.temperature = 5100.0;
    grader.global.vibrance = 25.0;
    
    grader.apply_grading(img)
}

pub fn apply_fuji_film_look(img: &DynamicImage) -> DynamicImage {
    let mut grader = ColorGrader::new_cool();
    
    // Fuji-inspired adjustments
    grader.midtones.saturation = 1.25;
    grader.highlights.luminance = 1.1;
    grader.global.temperature = 5400.0;
    grader.global.vibrance = 30.0;
    
    grader.apply_grading(img)
}
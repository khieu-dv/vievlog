use wasm_bindgen::prelude::*;
use bevy::prelude::*;

// Modern Bevy modules for image and video processing
pub mod bevy_image_processor;
pub mod bevy_video_generator; 
pub mod bevy_effects_manager;

// Re-export the new Bevy-powered API
pub use bevy_image_processor::*;
pub use bevy_video_generator::*;
pub use bevy_effects_manager::*;

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

/// Main Bevy App for WASM image/video processing
#[derive(Resource, Default)]
pub struct ImageProcessingApp {
    pub world: World,
}

/// Image processing component
#[derive(Component)]
pub struct ImageProcessor {
    pub width: u32,
    pub height: u32,
    pub data: Vec<u8>,
}

/// Effect component for image processing
#[derive(Component, Clone)]
pub struct ImageEffect {
    pub effect_type: EffectType,
    pub intensity: f32,
}

/// Types of effects available
#[derive(Clone, Debug)]
pub enum EffectType {
    Blur { radius: f32 },
    Brightness { factor: f32 },
    Contrast { factor: f32 },
    Saturation { factor: f32 },
    Grayscale,
    Sepia,
    Vignette { strength: f32 },
    FilmGrain { intensity: f32 },
    LightLeak { position: (f32, f32), intensity: f32 },
    ColorGrade { shadows: (f32, f32, f32), highlights: (f32, f32, f32) },
}

/// Video transition component
#[derive(Component, Clone)]
pub struct VideoTransition {
    pub transition_type: TransitionType,
    pub progress: f32,
    pub duration: f32,
}

/// Types of video transitions
#[derive(Clone, Debug)]
pub enum TransitionType {
    Crossfade,
    SlideLeft,
    SlideRight,
    SlideUp,
    SlideDown,
    ZoomIn,
    ZoomOut,
    Dissolve,
    Wipe,
    Iris,
}

/// Animation tween component
#[derive(Component)]
pub struct AnimationTween {
    pub start_value: f32,
    pub end_value: f32,
    pub current_time: f32,
    pub duration: f32,
    pub easing: EasingType,
}

/// Easing types for smooth animations
#[derive(Clone, Debug)]
pub enum EasingType {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
    EaseInCubic,
    EaseOutCubic,
    EaseInOutCubic,
    EaseInOutSine,
}

impl EasingType {
    pub fn apply(&self, t: f32) -> f32 {
        let t = t.clamp(0.0, 1.0);
        match self {
            EasingType::Linear => t,
            EasingType::EaseIn => t * t,
            EasingType::EaseOut => 1.0 - (1.0 - t).powi(2),
            EasingType::EaseInOut => {
                if t < 0.5 {
                    2.0 * t * t
                } else {
                    1.0 - 2.0 * (1.0 - t).powi(2)
                }
            }
            EasingType::EaseInCubic => t.powi(3),
            EasingType::EaseOutCubic => 1.0 - (1.0 - t).powi(3),
            EasingType::EaseInOutCubic => {
                if t < 0.5 {
                    4.0 * t.powi(3)
                } else {
                    1.0 - (-2.0 * t + 2.0).powi(3) / 2.0
                }
            }
            EasingType::EaseInOutSine => {
                (-(t * std::f32::consts::PI).cos() - 1.0) / 2.0
            }
        }
    }
}

/// Global state for image processing
static mut BEVY_APP: Option<App> = None;

fn get_or_create_app() -> &'static mut App {
    unsafe {
        if BEVY_APP.is_none() {
            let mut app = App::new();
            app.add_plugins(MinimalPlugins)
               .add_systems(Update, (
                   process_image_effects,
                   update_video_transitions,
                   update_animations,
               ));
            BEVY_APP = Some(app);
        }
        BEVY_APP.as_mut().unwrap()
    }
}

/// System to process image effects
fn process_image_effects(
    mut query: Query<(&mut ImageProcessor, &ImageEffect)>,
) {
    for (mut processor, effect) in query.iter_mut() {
        let width = processor.width;
        let height = processor.height;
        apply_effect(&mut processor.data, width, height, effect);
    }
}

/// System to update video transitions
fn update_video_transitions(
    mut query: Query<&mut VideoTransition>,
    time: Res<Time>,
) {
    for mut transition in query.iter_mut() {
        transition.progress += time.delta_secs() / transition.duration;
        transition.progress = transition.progress.clamp(0.0, 1.0);
    }
}

/// System to update animations
fn update_animations(
    mut query: Query<&mut AnimationTween>,
    time: Res<Time>,
) {
    for mut tween in query.iter_mut() {
        tween.current_time += time.delta_secs();
        let progress = (tween.current_time / tween.duration).clamp(0.0, 1.0);
        let _eased_progress = tween.easing.apply(progress);
        // Use eased_progress to interpolate between start_value and end_value
    }
}

/// Apply effect to image data
fn apply_effect(data: &mut [u8], width: u32, height: u32, effect: &ImageEffect) {
    match &effect.effect_type {
        EffectType::Blur { radius } => apply_blur(data, width, height, *radius * effect.intensity),
        EffectType::Brightness { factor } => apply_brightness(data, 1.0 + (*factor - 1.0) * effect.intensity),
        EffectType::Contrast { factor } => apply_contrast(data, 1.0 + (*factor - 1.0) * effect.intensity),
        EffectType::Saturation { factor } => apply_saturation(data, 1.0 + (*factor - 1.0) * effect.intensity),
        EffectType::Grayscale => apply_grayscale(data, effect.intensity),
        EffectType::Sepia => apply_sepia(data, effect.intensity),
        EffectType::Vignette { strength } => apply_vignette(data, width, height, *strength * effect.intensity),
        EffectType::FilmGrain { intensity } => apply_film_grain(data, *intensity * effect.intensity),
        EffectType::LightLeak { position, intensity } => apply_light_leak(data, width, height, *position, *intensity * effect.intensity),
        EffectType::ColorGrade { shadows, highlights } => apply_color_grade(data, *shadows, *highlights, effect.intensity),
    }
}

/// Apply blur effect using simple box blur
fn apply_blur(data: &mut [u8], width: u32, height: u32, radius: f32) {
    if radius <= 0.0 { return; }
    
    let kernel_size = (radius * 2.0) as usize + 1;
    let temp_data = data.to_vec();
    
    // Horizontal pass
    for y in 0..height {
        for x in 0..width {
            let idx = (y * width + x) as usize * 4;
            if idx + 3 < data.len() {
                let mut r_sum = 0u32;
                let mut g_sum = 0u32;
                let mut b_sum = 0u32;
                let mut count = 0u32;
                
                for kx in 0..kernel_size {
                    let sample_x = (x as i32 - kernel_size as i32 / 2 + kx as i32)
                        .clamp(0, width as i32 - 1) as usize;
                    let sample_idx = (y as usize * width as usize + sample_x) * 4;
                    
                    if sample_idx + 2 < temp_data.len() {
                        r_sum += temp_data[sample_idx] as u32;
                        g_sum += temp_data[sample_idx + 1] as u32;
                        b_sum += temp_data[sample_idx + 2] as u32;
                        count += 1;
                    }
                }
                
                if count > 0 {
                    data[idx] = (r_sum / count) as u8;
                    data[idx + 1] = (g_sum / count) as u8;
                    data[idx + 2] = (b_sum / count) as u8;
                }
            }
        }
    }
}

/// Apply brightness adjustment
fn apply_brightness(data: &mut [u8], factor: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            chunk[0] = (chunk[0] as f32 * factor).clamp(0.0, 255.0) as u8;
            chunk[1] = (chunk[1] as f32 * factor).clamp(0.0, 255.0) as u8;
            chunk[2] = (chunk[2] as f32 * factor).clamp(0.0, 255.0) as u8;
        }
    }
}

/// Apply contrast adjustment
fn apply_contrast(data: &mut [u8], factor: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            for i in 0..3 {
                let pixel = chunk[i] as f32 / 255.0;
                let adjusted = ((pixel - 0.5) * factor + 0.5) * 255.0;
                chunk[i] = adjusted.clamp(0.0, 255.0) as u8;
            }
        }
    }
}

/// Apply saturation adjustment
fn apply_saturation(data: &mut [u8], factor: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            let r = chunk[0] as f32 / 255.0;
            let g = chunk[1] as f32 / 255.0;
            let b = chunk[2] as f32 / 255.0;
            
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            
            let new_r = (gray + (r - gray) * factor) * 255.0;
            let new_g = (gray + (g - gray) * factor) * 255.0;
            let new_b = (gray + (b - gray) * factor) * 255.0;
            
            chunk[0] = new_r.clamp(0.0, 255.0) as u8;
            chunk[1] = new_g.clamp(0.0, 255.0) as u8;
            chunk[2] = new_b.clamp(0.0, 255.0) as u8;
        }
    }
}

/// Apply grayscale effect
fn apply_grayscale(data: &mut [u8], intensity: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            let r = chunk[0] as f32;
            let g = chunk[1] as f32;
            let b = chunk[2] as f32;
            
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            
            chunk[0] = (r * (1.0 - intensity) + gray * intensity) as u8;
            chunk[1] = (g * (1.0 - intensity) + gray * intensity) as u8;
            chunk[2] = (b * (1.0 - intensity) + gray * intensity) as u8;
        }
    }
}

/// Apply sepia effect
fn apply_sepia(data: &mut [u8], intensity: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            let r = chunk[0] as f32 / 255.0;
            let g = chunk[1] as f32 / 255.0;
            let b = chunk[2] as f32 / 255.0;
            
            let sepia_r = (0.393 * r + 0.769 * g + 0.189 * b) * 255.0;
            let sepia_g = (0.349 * r + 0.686 * g + 0.168 * b) * 255.0;
            let sepia_b = (0.272 * r + 0.534 * g + 0.131 * b) * 255.0;
            
            chunk[0] = (chunk[0] as f32 * (1.0 - intensity) + sepia_r * intensity).clamp(0.0, 255.0) as u8;
            chunk[1] = (chunk[1] as f32 * (1.0 - intensity) + sepia_g * intensity).clamp(0.0, 255.0) as u8;
            chunk[2] = (chunk[2] as f32 * (1.0 - intensity) + sepia_b * intensity).clamp(0.0, 255.0) as u8;
        }
    }
}

/// Apply vignette effect
fn apply_vignette(data: &mut [u8], width: u32, height: u32, strength: f32) {
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    let max_distance = ((width * width + height * height) as f32).sqrt() / 2.0;
    
    for (i, chunk) in data.chunks_mut(4).enumerate() {
        if chunk.len() >= 3 {
            let x = (i % width as usize) as f32;
            let y = (i / width as usize) as f32;
            
            let distance = ((x - center_x).powi(2) + (y - center_y).powi(2)).sqrt();
            let vignette_factor = 1.0 - (distance / max_distance * strength).min(1.0);
            
            chunk[0] = (chunk[0] as f32 * vignette_factor) as u8;
            chunk[1] = (chunk[1] as f32 * vignette_factor) as u8;
            chunk[2] = (chunk[2] as f32 * vignette_factor) as u8;
        }
    }
}

/// Apply film grain effect
fn apply_film_grain(data: &mut [u8], intensity: f32) {
    for (i, chunk) in data.chunks_mut(4).enumerate() {
        if chunk.len() >= 3 {
            // Simple pseudo-random noise based on pixel position
            let noise = ((i as f32 * 12.9898).sin() * 43758.5453).fract() - 0.5;
            let grain = (noise * intensity * 20.0) as i16;
            
            chunk[0] = (chunk[0] as i16 + grain).clamp(0, 255) as u8;
            chunk[1] = (chunk[1] as i16 + grain).clamp(0, 255) as u8;
            chunk[2] = (chunk[2] as i16 + grain).clamp(0, 255) as u8;
        }
    }
}

/// Apply light leak effect
fn apply_light_leak(data: &mut [u8], width: u32, height: u32, position: (f32, f32), intensity: f32) {
    let leak_x = position.0 * width as f32;
    let leak_y = position.1 * height as f32;
    let max_distance = (width as f32 + height as f32) / 3.0;
    
    for (i, chunk) in data.chunks_mut(4).enumerate() {
        if chunk.len() >= 3 {
            let x = (i % width as usize) as f32;
            let y = (i / width as usize) as f32;
            
            let distance = ((x - leak_x).powi(2) + (y - leak_y).powi(2)).sqrt();
            
            if distance < max_distance {
                let leak_factor = (1.0 - distance / max_distance) * intensity;
                let golden_tint = (255.0 * leak_factor) as u8;
                
                chunk[0] = (chunk[0] as u16 + golden_tint as u16).min(255) as u8;
                chunk[1] = (chunk[1] as u16 + (golden_tint as f32 * 0.8) as u16).min(255) as u8;
                chunk[2] = (chunk[2] as u16 + (golden_tint as f32 * 0.3) as u16).min(255) as u8;
            }
        }
    }
}

/// Apply color grading
fn apply_color_grade(data: &mut [u8], shadows: (f32, f32, f32), highlights: (f32, f32, f32), intensity: f32) {
    for chunk in data.chunks_mut(4) {
        if chunk.len() >= 3 {
            let r = chunk[0] as f32 / 255.0;
            let g = chunk[1] as f32 / 255.0;
            let b = chunk[2] as f32 / 255.0;
            
            let luma = 0.299 * r + 0.587 * g + 0.114 * b;
            
            let grading = if luma < 0.5 { shadows } else { highlights };
            
            let new_r = (r * grading.0 * intensity + r * (1.0 - intensity)) * 255.0;
            let new_g = (g * grading.1 * intensity + g * (1.0 - intensity)) * 255.0;
            let new_b = (b * grading.2 * intensity + b * (1.0 - intensity)) * 255.0;
            
            chunk[0] = new_r.clamp(0.0, 255.0) as u8;
            chunk[1] = new_g.clamp(0.0, 255.0) as u8;
            chunk[2] = new_b.clamp(0.0, 255.0) as u8;
        }
    }
}

// Data Structures and Algorithms Modules
pub mod data_structures;
pub mod algorithms;

// Re-export specific modules to avoid conflicts
pub use data_structures::{
    arrays::*, linked_lists::*, trees::*, graphs::*,
    hash_tables::*, stacks::*, queues::*, heaps::*
};
pub use algorithms::{
    sorting::*, searching::*, graph_algorithms::*, dynamic_programming::*
};

#[wasm_bindgen(start)]
pub fn main() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    console_log!("VieVlog Rust WASM with Bevy 0.16 initialized!");
}
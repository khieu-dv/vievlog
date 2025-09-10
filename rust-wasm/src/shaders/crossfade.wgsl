struct EffectParams {
    time: f32,
    progress: f32,
    width: f32,
    height: f32,
    effect_type: u32,
    intensity: f32,
}

@group(0) @binding(0) var input1_texture: texture_2d<f32>;
@group(0) @binding(1) var input2_texture: texture_2d<f32>;
@group(0) @binding(2) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(3) var<uniform> params: EffectParams;
@group(0) @binding(4) var texture_sampler: sampler;

// Enhanced easing functions
fn ease_in_out_cubic(t: f32) -> f32 {
    if t < 0.5 {
        return 4.0 * t * t * t;
    } else {
        let p = -2.0 * t + 2.0;
        return 1.0 - p * p * p / 2.0;
    }
}

fn ease_in_out_sine(t: f32) -> f32 {
    return -(cos(3.14159265 * t) - 1.0) / 2.0;
}

// Luminance-based crossfade for more cinematic blending
fn get_luminance(color: vec3<f32>) -> f32 {
    return dot(color, vec3<f32>(0.299, 0.587, 0.114));
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let coords = vec2<i32>(global_id.xy);
    let dimensions = vec2<i32>(textureDimensions(input1_texture));
    
    if coords.x >= dimensions.x || coords.y >= dimensions.y {
        return;
    }

    let uv = vec2<f32>(coords) / vec2<f32>(dimensions);
    
    // Sample both input textures
    let color1 = textureSample(input1_texture, texture_sampler, uv);
    let color2 = textureSample(input2_texture, texture_sampler, uv);
    
    // Apply cinematic crossfade with multiple techniques
    var progress = ease_in_out_cubic(params.progress);
    
    // Add subtle zoom effect during transition
    let zoom_factor = 1.0 + 0.05 * sin(progress * 3.14159265);
    let center = vec2<f32>(0.5, 0.5);
    let zoom_uv1 = center + (uv - center) / zoom_factor;
    let zoom_uv2 = center + (uv - center) / (zoom_factor * 0.95);
    
    // Sample with zoom effect
    let zoomed_color1 = textureSample(input1_texture, texture_sampler, zoom_uv1);
    let zoomed_color2 = textureSample(input2_texture, texture_sampler, zoom_uv2);
    
    // Luminance-based blending for more natural transitions
    let lum1 = get_luminance(zoomed_color1.rgb);
    let lum2 = get_luminance(zoomed_color2.rgb);
    let lum_diff = abs(lum1 - lum2);
    
    // Adjust blend factor based on luminance difference
    let adjusted_progress = progress + (lum_diff - 0.5) * 0.1 * params.intensity;
    let final_progress = clamp(adjusted_progress, 0.0, 1.0);
    
    // Cross dissolve with color grading
    var final_color = mix(zoomed_color1.rgb, zoomed_color2.rgb, final_progress);
    
    // Add cinematic color grading
    final_color = pow(final_color, vec3<f32>(0.9)); // Slight gamma adjustment
    final_color = mix(final_color, final_color * vec3<f32>(1.05, 0.95, 0.85), 0.1); // Warm tone
    
    // Subtle vignette during transition
    let vignette_strength = 0.1 * (1.0 - abs(progress - 0.5) * 2.0);
    let dist_from_center = length(uv - center);
    let vignette = 1.0 - vignette_strength * dist_from_center;
    final_color *= vignette;
    
    textureStore(output_texture, coords, vec4<f32>(final_color, 1.0));
}
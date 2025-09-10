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

// Depth of field calculation
fn calculate_depth(uv: vec2<f32>, focus_point: vec2<f32>, focus_range: f32) -> f32 {
    let distance_from_focus = length(uv - focus_point);
    return clamp(distance_from_focus / focus_range, 0.0, 1.0);
}

// Hexagonal bokeh shape approximation
fn hexagon_bokeh_weight(offset: vec2<f32>, radius: f32) -> f32 {
    let abs_offset = abs(offset);
    let d = max(abs_offset.x * 0.866025 + abs_offset.y * 0.5, abs_offset.y);
    return 1.0 - smoothstep(radius * 0.8, radius, d);
}

// High-quality blur with bokeh shapes
fn bokeh_blur(uv: vec2<f32>, blur_radius: f32, aperture_shape: f32) -> vec3<f32> {
    var color = vec3<f32>(0.0);
    var total_weight = 0.0;
    
    let sample_count = 37; // Optimized sample count for quality/performance balance
    let golden_angle = 2.39996323; // Golden angle in radians
    
    for (var i = 0; i < sample_count; i = i + 1) {
        let r = sqrt(f32(i) + 0.5) / sqrt(f32(sample_count));
        let theta = f32(i) * golden_angle;
        
        let sample_offset = r * blur_radius * vec2<f32>(cos(theta), sin(theta));
        let sample_uv = uv + sample_offset / vec2<f32>(params.width, params.height);
        
        // Hexagonal bokeh weight
        let bokeh_weight = hexagon_bokeh_weight(sample_offset, blur_radius);
        
        // Circular aperture falloff
        let circular_weight = 1.0 - smoothstep(blur_radius * 0.7, blur_radius, length(sample_offset));
        
        // Blend between hexagonal and circular based on aperture_shape parameter
        let final_weight = mix(circular_weight, bokeh_weight, aperture_shape);
        
        if sample_uv.x >= 0.0 && sample_uv.x <= 1.0 && sample_uv.y >= 0.0 && sample_uv.y <= 1.0 {
            let sample_color = textureSample(input1_texture, texture_sampler, sample_uv).rgb;
            
            // Highlight preservation for realistic bokeh
            let luminance = dot(sample_color, vec3<f32>(0.299, 0.587, 0.114));
            let highlight_boost = 1.0 + smoothstep(0.7, 1.0, luminance) * 2.0;
            
            color += sample_color * final_weight * highlight_boost;
            total_weight += final_weight * highlight_boost;
        }
    }
    
    return color / max(total_weight, 0.001);
}

// Advanced depth map generation
fn generate_depth_map(uv: vec2<f32>) -> f32 {
    // Sample texture to get a basic depth approximation
    let sample_color = textureSample(input1_texture, texture_sampler, uv).rgb;
    let luminance = dot(sample_color, vec3<f32>(0.299, 0.587, 0.114));
    
    // Use contrast and edge detection for depth estimation
    let dx = dpdx(luminance);
    let dy = dpdy(luminance);
    let edge_strength = sqrt(dx * dx + dy * dy);
    
    // Create a procedural depth based on position and edges
    let center = vec2<f32>(0.5, 0.5);
    let distance_from_center = length(uv - center);
    
    // Combine factors for depth
    let base_depth = distance_from_center * 0.7;
    let edge_depth = edge_strength * 0.3;
    
    return clamp(base_depth + edge_depth, 0.0, 1.0);
}

// Chromatic aberration for out-of-focus areas
fn chromatic_aberration_sample(uv: vec2<f32>, aberration_strength: f32) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let offset_dir = normalize(uv - center);
    
    let r_offset = offset_dir * aberration_strength * 0.8;
    let g_offset = offset_dir * aberration_strength * 0.4;
    let b_offset = offset_dir * aberration_strength * 1.2;
    
    let r = textureSample(input1_texture, texture_sampler, uv + r_offset).r;
    let g = textureSample(input1_texture, texture_sampler, uv + g_offset).g;
    let b = textureSample(input1_texture, texture_sampler, uv + b_offset).b;
    
    return vec3<f32>(r, g, b);
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let coords = vec2<i32>(global_id.xy);
    let dimensions = vec2<i32>(textureDimensions(input1_texture));
    
    if coords.x >= dimensions.x || coords.y >= dimensions.y {
        return;
    }

    let uv = vec2<f32>(coords) / vec2<f32>(dimensions);
    
    // Sample input texture(s)
    var base_color: vec3<f32>;
    if params.progress < 0.5 {
        base_color = textureSample(input1_texture, texture_sampler, uv).rgb;
    } else {
        let fade_progress = (params.progress - 0.5) * 2.0;
        let color1 = textureSample(input1_texture, texture_sampler, uv).rgb;
        let color2 = textureSample(input2_texture, texture_sampler, uv).rgb;
        base_color = mix(color1, color2, fade_progress);
    }
    
    // Animated focus parameters
    let time = params.time;
    let focus_center = vec2<f32>(0.5, 0.5) + 0.1 * vec2<f32>(sin(time * 0.3), cos(time * 0.2));
    let focus_range = 0.3 + 0.1 * sin(time * 0.5);
    let max_blur_radius = 15.0 * params.intensity;
    
    // Calculate depth and blur amount
    let depth = generate_depth_map(uv);
    let focus_distance = calculate_depth(uv, focus_center, focus_range);
    
    // Combine depth map with focus distance
    let blur_factor = mix(depth, focus_distance, 0.7);
    let blur_radius = blur_factor * max_blur_radius;
    
    var final_color: vec3<f32>;
    
    if blur_radius < 1.0 {
        // Sharp area - use original color with minimal processing
        final_color = base_color;
        
        // Slight sharpening for in-focus areas
        let sharpen_strength = (1.0 - blur_factor) * 0.2;
        if sharpen_strength > 0.01 {
            let pixel_size = 1.0 / vec2<f32>(dimensions);
            let center_sample = textureSample(input1_texture, texture_sampler, uv).rgb;
            let edge_sample = (
                textureSample(input1_texture, texture_sampler, uv + vec2<f32>(pixel_size.x, 0.0)).rgb +
                textureSample(input1_texture, texture_sampler, uv - vec2<f32>(pixel_size.x, 0.0)).rgb +
                textureSample(input1_texture, texture_sampler, uv + vec2<f32>(0.0, pixel_size.y)).rgb +
                textureSample(input1_texture, texture_sampler, uv - vec2<f32>(0.0, pixel_size.y)).rgb
            ) * 0.25;
            
            let sharpened = center_sample + (center_sample - edge_sample) * sharpen_strength;
            final_color = mix(final_color, sharpened, sharpen_strength);
        }
    } else {
        // Blurred area - apply bokeh effect
        let aperture_shape = 0.7; // Hexagonal bokeh shape
        final_color = bokeh_blur(uv, blur_radius, aperture_shape);
        
        // Add chromatic aberration to out-of-focus areas
        let aberration_strength = blur_factor * 0.002 * params.intensity;
        if aberration_strength > 0.001 {
            let aberrated_color = chromatic_aberration_sample(uv, aberration_strength);
            final_color = mix(final_color, aberrated_color, 0.3);
        }
    }
    
    // Add subtle bloom to highlights in out-of-focus areas
    let luminance = dot(final_color, vec3<f32>(0.299, 0.587, 0.114));
    if luminance > 0.8 && blur_radius > 5.0 {
        let bloom_strength = (luminance - 0.8) * blur_factor * 0.3;
        let bloom_color = final_color * bloom_strength;
        final_color += bloom_color;
    }
    
    // Depth-based color grading
    let depth_tint = mix(vec3<f32>(1.0, 1.0, 1.0), vec3<f32>(0.9, 0.95, 1.1), blur_factor * 0.15);
    final_color *= depth_tint;
    
    // Add subtle vignette that follows focus
    let vignette_strength = 0.1;
    let distance_from_focus = length(uv - focus_center);
    let vignette = 1.0 - smoothstep(0.3, 1.0, distance_from_focus) * vignette_strength;
    final_color *= vignette;
    
    // Micro-contrast enhancement for realism
    let contrast_strength = mix(1.05, 0.95, blur_factor);
    final_color = (final_color - 0.5) * contrast_strength + 0.5;
    
    textureStore(output_texture, coords, vec4<f32>(final_color, 1.0));
}
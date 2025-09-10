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

// High-quality noise functions for film grain
fn hash(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    
    let a = hash(i);
    let b = hash(i + vec2<f32>(1.0, 0.0));
    let c = hash(i + vec2<f32>(0.0, 1.0));
    let d = hash(i + vec2<f32>(1.0, 1.0));
    
    let u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Multi-octave noise for realistic grain texture
fn fbm(p: vec2<f32>) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var p_var = p;
    
    for (var i = 0; i < 6; i = i + 1) {
        value += amplitude * noise(p_var * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
        p_var = p_var * 1.2;
    }
    
    return value;
}

// Vintage film response curve
fn film_response(x: f32) -> f32 {
    // S-curve that mimics analog film
    let toe = 0.04;
    let shoulder = 0.96;
    let toe_strength = 2.0;
    let shoulder_strength = 0.8;
    
    if x < toe {
        return pow(x / toe, toe_strength) * toe;
    } else if x > shoulder {
        let overshoot = x - shoulder;
        return shoulder + overshoot * shoulder_strength;
    } else {
        return x;
    }
}

// Color grading for vintage look
fn vintage_color_grade(color: vec3<f32>) -> vec3<f32> {
    var graded = color;
    
    // Warm up the shadows, cool the highlights
    let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
    let shadow_tint = vec3<f32>(1.1, 0.9, 0.7);
    let highlight_tint = vec3<f32>(0.9, 1.0, 1.2);
    
    let shadow_mask = 1.0 - smoothstep(0.0, 0.5, luminance);
    let highlight_mask = smoothstep(0.5, 1.0, luminance);
    
    graded = mix(graded, graded * shadow_tint, shadow_mask * 0.2);
    graded = mix(graded, graded * highlight_tint, highlight_mask * 0.15);
    
    // Reduce saturation slightly for vintage feel
    let desaturated = vec3<f32>(luminance);
    graded = mix(desaturated, graded, 0.8);
    
    return graded;
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
    
    // Generate multiple grain layers for realism
    let pixel_pos = vec2<f32>(coords);
    let time_offset = params.time * 24.0; // Simulate 24fps film
    
    // Fine grain layer
    let fine_grain_scale = 800.0;
    let fine_grain = fbm((pixel_pos + vec2<f32>(time_offset * 0.1, time_offset * 0.07)) / fine_grain_scale);
    
    // Coarse grain layer
    let coarse_grain_scale = 200.0;
    let coarse_grain = fbm((pixel_pos + vec2<f32>(time_offset * 0.05, time_offset * 0.03)) / coarse_grain_scale);
    
    // Dust and scratches simulation
    let scratch_scale = 50.0;
    let scratch_noise = noise((pixel_pos + vec2<f32>(time_offset * 0.2, 0.0)) / scratch_scale);
    let scratch_mask = step(0.98, scratch_noise);
    
    // Combine grain layers
    let combined_grain = fine_grain * 0.6 + coarse_grain * 0.4;
    let grain_intensity = params.intensity * 0.15;
    
    // Apply film response curve
    var film_color = vec3<f32>(
        film_response(base_color.r),
        film_response(base_color.g),
        film_response(base_color.b)
    );
    
    // Add grain to each channel with slight color variation
    let grain_r = (combined_grain - 0.5) * grain_intensity * 1.1;
    let grain_g = (combined_grain - 0.5) * grain_intensity;
    let grain_b = (combined_grain - 0.5) * grain_intensity * 0.9;
    
    film_color.r = clamp(film_color.r + grain_r, 0.0, 1.0);
    film_color.g = clamp(film_color.g + grain_g, 0.0, 1.0);
    film_color.b = clamp(film_color.b + grain_b, 0.0, 1.0);
    
    // Add scratches and dust
    if scratch_mask > 0.5 {
        let scratch_intensity = 0.3 * params.intensity;
        film_color = mix(film_color, vec3<f32>(0.9, 0.9, 0.9), scratch_intensity);
    }
    
    // Apply vintage color grading
    film_color = vintage_color_grade(film_color);
    
    // Add subtle vignetting
    let center = vec2<f32>(0.5, 0.5);
    let vignette_strength = 0.4;
    let dist_from_center = length(uv - center);
    let vignette = 1.0 - smoothstep(0.3, 1.0, dist_from_center) * vignette_strength * params.intensity;
    film_color *= vignette;
    
    // Simulate film gate flicker
    let flicker_frequency = 8.0;
    let flicker_amount = 0.05 * params.intensity;
    let flicker = 1.0 + sin(params.time * flicker_frequency) * flicker_amount;
    film_color *= flicker;
    
    // Add subtle chromatic aberration
    let aberration_strength = 0.003 * params.intensity;
    if aberration_strength > 0.001 {
        let center_offset = uv - center;
        let r_uv = center + center_offset * (1.0 + aberration_strength);
        let b_uv = center + center_offset * (1.0 - aberration_strength);
        
        let r_sample = textureSample(input1_texture, texture_sampler, r_uv).r;
        let b_sample = textureSample(input1_texture, texture_sampler, b_uv).b;
        
        film_color.r = mix(film_color.r, r_sample, 0.5);
        film_color.b = mix(film_color.b, b_sample, 0.5);
    }
    
    // Final contrast and exposure adjustment
    let contrast = 1.1;
    let exposure = 1.05;
    film_color = (film_color - 0.5) * contrast + 0.5;
    film_color *= exposure;
    
    textureStore(output_texture, coords, vec4<f32>(film_color, 1.0));
}
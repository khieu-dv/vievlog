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

// Advanced noise functions for organic light patterns
fn hash12(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2<f32>) -> vec2<f32> {
    var p3 = fract(vec3<f32>(p.x, p.y, p.x) * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    
    let a = hash12(i);
    let b = hash12(i + vec2<f32>(1.0, 0.0));
    let c = hash12(i + vec2<f32>(0.0, 1.0));
    let d = hash12(i + vec2<f32>(1.0, 1.0));
    
    let u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractional Brownian Motion for complex light patterns
fn fbm(p: vec2<f32>) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var p_var = p;
    
    for (var i = 0; i < 5; i = i + 1) {
        value += amplitude * noise(p_var * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
        p_var = p_var * mat2x2<f32>(1.6, 1.2, -1.2, 1.6);
    }
    
    return value;
}

// Generate organic light streak patterns
fn light_streak_pattern(uv: vec2<f32>, time: f32, origin: vec2<f32>) -> f32 {
    let direction = normalize(uv - origin);
    let distance = length(uv - origin);
    
    // Create animated light rays
    let ray_angle = atan2(direction.y, direction.x);
    let ray_count = 12.0;
    let ray_width = 0.1;
    
    var streak_intensity = 0.0;
    
    for (var i = 0.0; i < ray_count; i = i + 1.0) {
        let target_angle = (i / ray_count) * 6.28318530718 + time * 0.2;
        let angle_diff = abs(ray_angle - target_angle);
        let wrapped_diff = min(angle_diff, 6.28318530718 - angle_diff);
        
        let ray_strength = 1.0 - smoothstep(0.0, ray_width, wrapped_diff);
        let distance_falloff = 1.0 / (1.0 + distance * 2.0);
        
        streak_intensity += ray_strength * distance_falloff;
    }
    
    return streak_intensity;
}

// Golden hour color palette
fn golden_hour_color(base_intensity: f32, warm_factor: f32) -> vec3<f32> {
    let golden = vec3<f32>(1.0, 0.8, 0.4);
    let amber = vec3<f32>(1.0, 0.6, 0.2);
    let warm_white = vec3<f32>(1.0, 0.95, 0.8);
    
    var color = mix(golden, amber, warm_factor);
    color = mix(color, warm_white, smoothstep(0.7, 1.0, base_intensity));
    
    return color * base_intensity;
}

// Lens flare effect
fn lens_flare(uv: vec2<f32>, light_pos: vec2<f32>, intensity: f32) -> vec3<f32> {
    let light_dir = uv - light_pos;
    let dist = length(light_dir);
    
    var flare = vec3<f32>(0.0);
    
    // Main flare disc
    let main_flare = 1.0 - smoothstep(0.0, 0.15, dist);
    flare += main_flare * intensity * vec3<f32>(1.0, 0.9, 0.7);
    
    // Secondary flare rings
    for (var i = 1; i <= 3; i = i + 1) {
        let ring_dist = f32(i) * 0.08;
        let ring_width = 0.02;
        let ring_intensity = 1.0 - smoothstep(ring_dist - ring_width, ring_dist + ring_width, dist);
        let ring_alpha = 0.3 / f32(i);
        
        flare += ring_intensity * ring_alpha * intensity * vec3<f32>(1.0, 0.8, 0.6);
    }
    
    // Chromatic spikes
    let spike_angle = atan2(light_dir.y, light_dir.x);
    let spike_pattern = abs(sin(spike_angle * 4.0));
    let spike_intensity = spike_pattern * (1.0 - smoothstep(0.0, 0.25, dist));
    flare += spike_intensity * intensity * 0.4 * vec3<f32>(1.0, 0.7, 0.4);
    
    return flare;
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
    
    // Animated light leak origins
    let time = params.time;
    let leak_intensity = params.intensity;
    
    // Primary light leak from top-right corner
    let primary_origin = vec2<f32>(0.85, 0.15) + 0.05 * vec2<f32>(sin(time * 0.3), cos(time * 0.2));
    let primary_streak = light_streak_pattern(uv, time, primary_origin);
    
    // Secondary light leak from left edge
    let secondary_origin = vec2<f32>(0.0, 0.6) + 0.03 * vec2<f32>(sin(time * 0.5), cos(time * 0.4));
    let secondary_streak = light_streak_pattern(uv, time * 1.3, secondary_origin) * 0.6;
    
    // Organic light pattern using noise
    let noise_scale = 2.0;
    let organic_pattern = fbm(uv * noise_scale + vec2<f32>(time * 0.1, time * 0.07));
    let organic_mask = smoothstep(0.4, 0.8, organic_pattern);
    
    // Combine light patterns
    let combined_leak_intensity = (primary_streak + secondary_streak) * organic_mask;
    
    // Generate light leak colors
    let warm_factor = sin(time * 0.4) * 0.5 + 0.5;
    let leak_color = golden_hour_color(combined_leak_intensity, warm_factor);
    
    // Add lens flare effects
    var flare_color = lens_flare(uv, primary_origin, leak_intensity * 0.8);
    flare_color += lens_flare(uv, secondary_origin, leak_intensity * 0.5);
    
    // Apply light leaks with proper blending
    var final_color = base_color;
    
    // Screen blend mode for light leaks
    let leak_contribution = leak_color * leak_intensity;
    final_color = final_color + leak_contribution - (final_color * leak_contribution);
    
    // Add flare with additive blending
    final_color += flare_color * leak_intensity * 0.7;
    
    // Add subtle bloom effect
    let bloom_threshold = 0.8;
    let bloom_strength = 0.3;
    let luminance = dot(final_color, vec3<f32>(0.299, 0.587, 0.114));
    
    if luminance > bloom_threshold {
        let bloom_amount = (luminance - bloom_threshold) * bloom_strength;
        let bloom_radius = 0.01;
        
        var bloom_color = vec3<f32>(0.0);
        let sample_count = 8.0;
        
        for (var i = 0.0; i < sample_count; i = i + 1.0) {
            let angle = (i / sample_count) * 6.28318530718;
            let offset = vec2<f32>(cos(angle), sin(angle)) * bloom_radius;
            bloom_color += textureSample(input1_texture, texture_sampler, uv + offset).rgb;
        }
        
        bloom_color /= sample_count;
        final_color += bloom_color * bloom_amount * leak_intensity;
    }
    
    // Add atmospheric haze in bright areas
    let haze_strength = leak_intensity * 0.2;
    let haze_color = vec3<f32>(1.0, 0.9, 0.7);
    let haze_mask = smoothstep(0.5, 1.0, combined_leak_intensity);
    final_color = mix(final_color, final_color + haze_color * haze_strength, haze_mask);
    
    // Color temperature shift based on light leak intensity
    let temperature_shift = combined_leak_intensity * leak_intensity * 0.3;
    final_color.r *= 1.0 + temperature_shift * 0.2;
    final_color.g *= 1.0 + temperature_shift * 0.1;
    final_color.b *= 1.0 - temperature_shift * 0.1;
    
    // Subtle desaturation in non-lit areas for contrast
    let desaturation_mask = 1.0 - smoothstep(0.0, 0.3, combined_leak_intensity);
    let desaturated = vec3<f32>(dot(final_color, vec3<f32>(0.299, 0.587, 0.114)));
    final_color = mix(final_color, desaturated, desaturation_mask * 0.2);
    
    textureStore(output_texture, coords, vec4<f32>(final_color, 1.0));
}
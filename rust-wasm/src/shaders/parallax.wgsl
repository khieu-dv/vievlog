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

// Noise functions for dynamic parallax layers
fn random(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(12.9898, 78.233))) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    
    let a = random(i);
    let b = random(i + vec2<f32>(1.0, 0.0));
    let c = random(i + vec2<f32>(0.0, 1.0));
    let d = random(i + vec2<f32>(1.0, 1.0));
    
    let u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Multi-octave noise for depth variation
fn fbm(p: vec2<f32>) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var p_var = p;
    
    for (var i = 0; i < 4; i = i + 1) {
        value += amplitude * noise(p_var);
        p_var *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

// Smooth easing functions
fn ease_in_out_quart(t: f32) -> f32 {
    if t < 0.5 {
        return 8.0 * t * t * t * t;
    } else {
        let p = -2.0 * t + 2.0;
        return 1.0 - p * p * p * p / 2.0;
    }
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let coords = vec2<i32>(global_id.xy);
    let dimensions = vec2<i32>(textureDimensions(input1_texture));
    
    if coords.x >= dimensions.x || coords.y >= dimensions.y {
        return;
    }

    let uv = vec2<f32>(coords) / vec2<f32>(dimensions);
    let center = vec2<f32>(0.5, 0.5);
    let centered_uv = uv - center;
    
    // Enhanced parallax parameters
    let parallax_progress = ease_in_out_quart(params.progress);
    let time_factor = params.time * 0.5;
    
    // Generate depth map using procedural noise
    let depth_scale = 3.0;
    let depth_noise = fbm(uv * depth_scale + vec2<f32>(time_factor * 0.1, 0.0));
    let depth = depth_noise * 0.5 + 0.5; // Normalize to 0-1
    
    // Multi-layer parallax effect
    let num_layers = 5.0;
    var accumulated_color = vec3<f32>(0.0, 0.0, 0.0);
    var total_weight = 0.0;
    
    for (var layer = 0.0; layer < num_layers; layer = layer + 1.0) {
        let layer_depth = layer / (num_layers - 1.0);
        let layer_intensity = params.intensity * (1.0 - layer_depth * 0.5);
        
        // Calculate parallax offset for this layer
        let parallax_strength = layer_depth * 0.15 * layer_intensity;
        let movement_direction = vec2<f32>(
            cos(time_factor + layer * 0.5) * parallax_strength,
            sin(time_factor * 0.7 + layer * 0.3) * parallax_strength * 0.5
        );
        
        // Apply depth-based movement
        let depth_offset = (depth - 0.5) * parallax_strength * 2.0;
        let layer_offset = movement_direction * parallax_progress + 
                          centered_uv * depth_offset * parallax_progress;
        
        let layer_uv = center + centered_uv + layer_offset;
        
        // Sample textures for this layer
        var layer_color: vec3<f32>;
        let transition_point = 0.5;
        
        if parallax_progress < transition_point {
            // Sample from first texture with subtle zoom
            let zoom_factor = 1.0 + layer_depth * 0.05;
            let zoom_uv = center + (layer_uv - center) / zoom_factor;
            layer_color = textureSample(input1_texture, texture_sampler, zoom_uv).rgb;
        } else {
            // Transition to second texture
            let transition_progress = (parallax_progress - transition_point) / (1.0 - transition_point);
            let zoom_factor1 = 1.0 + layer_depth * 0.05;
            let zoom_factor2 = 1.0 + layer_depth * 0.03;
            
            let zoom_uv1 = center + (layer_uv - center) / zoom_factor1;
            let zoom_uv2 = center + (layer_uv - center) / zoom_factor2;
            
            let color1 = textureSample(input1_texture, texture_sampler, zoom_uv1).rgb;
            let color2 = textureSample(input2_texture, texture_sampler, zoom_uv2).rgb;
            
            layer_color = mix(color1, color2, transition_progress);
        }
        
        // Apply depth-based lighting
        let light_factor = 0.7 + 0.3 * (1.0 - layer_depth);
        layer_color *= light_factor;
        
        // Apply atmospheric perspective (further layers are more faded)
        let atmospheric_fade = 1.0 - layer_depth * 0.3;
        layer_color *= atmospheric_fade;
        
        // Layer blending weight
        let layer_weight = 1.0 / (layer + 1.0);
        accumulated_color += layer_color * layer_weight;
        total_weight += layer_weight;
    }
    
    // Normalize accumulated color
    var final_color = accumulated_color / total_weight;
    
    // Add dynamic color grading based on depth and movement
    let color_shift = depth * 0.1;
    final_color.r *= 1.0 + color_shift;
    final_color.b *= 1.0 - color_shift * 0.5;
    
    // Add subtle vignette that moves with parallax
    let vignette_center = center + movement_direction * 0.1;
    let vignette_dist = length(uv - vignette_center);
    let vignette = 1.0 - smoothstep(0.5, 1.2, vignette_dist) * 0.3;
    final_color *= vignette;
    
    // Add depth-based contrast
    let contrast_factor = 1.0 + depth * 0.2;
    final_color = (final_color - 0.5) * contrast_factor + 0.5;
    
    // Subtle chromatic aberration for cinematic feel
    let aberration_strength = 0.002 * params.intensity;
    let r_offset = vec2<f32>(aberration_strength, 0.0);
    let b_offset = vec2<f32>(-aberration_strength, 0.0);
    
    if aberration_strength > 0.001 {
        let r_sample = textureSample(input1_texture, texture_sampler, uv + r_offset).r;
        let b_sample = textureSample(input1_texture, texture_sampler, uv + b_offset).b;
        final_color.r = mix(final_color.r, r_sample, 0.3);
        final_color.b = mix(final_color.b, b_sample, 0.3);
    }
    
    textureStore(output_texture, coords, vec4<f32>(final_color, 1.0));
}
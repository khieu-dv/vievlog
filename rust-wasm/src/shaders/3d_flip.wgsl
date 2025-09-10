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

// 3D transformation matrices
fn get_rotation_matrix_y(angle: f32) -> mat3x3<f32> {
    let c = cos(angle);
    let s = sin(angle);
    return mat3x3<f32>(
        vec3<f32>(c, 0.0, s),
        vec3<f32>(0.0, 1.0, 0.0),
        vec3<f32>(-s, 0.0, c)
    );
}

fn project_3d_to_2d(pos_3d: vec3<f32>, fov: f32, aspect: f32) -> vec2<f32> {
    let z_offset = 2.0;
    let projected_z = pos_3d.z + z_offset;
    
    if projected_z <= 0.0 {
        return vec2<f32>(-999.0, -999.0); // Behind camera
    }
    
    let scale = 1.0 / tan(fov * 0.5);
    let x_proj = pos_3d.x * scale / projected_z;
    let y_proj = pos_3d.y * scale / projected_z / aspect;
    
    return vec2<f32>(x_proj, y_proj);
}

// Enhanced easing for 3D flip
fn ease_in_out_back(t: f32) -> f32 {
    let c1 = 1.70158;
    let c2 = c1 * 1.525;
    
    if t < 0.5 {
        return (pow(2.0 * t, 2.0) * ((c2 + 1.0) * 2.0 * t - c2)) / 2.0;
    } else {
        return (pow(2.0 * t - 2.0, 2.0) * ((c2 + 1.0) * (t * 2.0 - 2.0) + c2) + 2.0) / 2.0;
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
    let centered_uv = uv - vec2<f32>(0.5, 0.5);
    
    // 3D flip animation with enhanced easing
    let flip_progress = ease_in_out_back(params.progress);
    let flip_angle = flip_progress * 3.14159265; // 180 degree flip
    
    // Create 3D position for the pixel
    let pos_3d = vec3<f32>(centered_uv.x, centered_uv.y, 0.0);
    
    // Apply 3D rotation
    let rotation_matrix = get_rotation_matrix_y(flip_angle);
    let rotated_pos = rotation_matrix * pos_3d;
    
    // Project back to 2D
    let aspect_ratio = params.width / params.height;
    let fov = 1.2; // Field of view
    let projected_2d = project_3d_to_2d(rotated_pos, fov, aspect_ratio);
    
    // Convert back to UV coordinates
    let final_uv = projected_2d + vec2<f32>(0.5, 0.5);
    
    var final_color = vec3<f32>(0.0, 0.0, 0.0);
    var alpha = 1.0;
    
    // Check if the pixel is visible (not behind or outside bounds)
    if final_uv.x >= 0.0 && final_uv.x <= 1.0 && 
       final_uv.y >= 0.0 && final_uv.y <= 1.0 && 
       rotated_pos.z >= -1.0 {
        
        // Determine which texture to use based on rotation
        if flip_progress < 0.5 {
            // Show first texture
            final_color = textureSample(input1_texture, texture_sampler, final_uv).rgb;
            
            // Add subtle lighting based on rotation
            let light_intensity = cos(flip_angle * 0.5) * 0.3 + 0.7;
            final_color *= light_intensity;
        } else {
            // Show second texture (back side)
            let back_uv = vec2<f32>(1.0 - final_uv.x, final_uv.y); // Mirror for back side
            final_color = textureSample(input2_texture, texture_sampler, back_uv).rgb;
            
            // Add subtle lighting for back side
            let light_intensity = cos((flip_angle - 3.14159265) * 0.5) * 0.3 + 0.7;
            final_color *= light_intensity;
        }
        
        // Add depth-based shading
        let depth_factor = 1.0 - abs(rotated_pos.z) * 0.2;
        final_color *= depth_factor;
        
        // Add subtle edge darkening for 3D effect
        let edge_distance = min(min(final_uv.x, 1.0 - final_uv.x), min(final_uv.y, 1.0 - final_uv.y));
        let edge_fade = smoothstep(0.0, 0.1, edge_distance);
        final_color *= edge_fade;
        
    } else {
        // Outside bounds or behind camera - show background or fade to black
        alpha = 0.0;
        final_color = vec3<f32>(0.0, 0.0, 0.0);
    }
    
    // Add motion blur effect during fast rotation
    let motion_blur_factor = abs(sin(flip_angle * 2.0)) * params.intensity * 0.1;
    if motion_blur_factor > 0.01 {
        // Sample additional points for motion blur
        let blur_offset = motion_blur_factor * 0.01;
        let blur_sample1 = textureSample(input1_texture, texture_sampler, final_uv + vec2<f32>(blur_offset, 0.0));
        let blur_sample2 = textureSample(input1_texture, texture_sampler, final_uv - vec2<f32>(blur_offset, 0.0));
        final_color = mix(final_color, (blur_sample1.rgb + blur_sample2.rgb) * 0.5, motion_blur_factor);
    }
    
    textureStore(output_texture, coords, vec4<f32>(final_color, alpha));
}
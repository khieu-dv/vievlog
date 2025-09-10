use wasm_bindgen::prelude::*;
use wgpu::util::DeviceExt;
use bytemuck::{Pod, Zeroable};
use std::borrow::Cow;

#[repr(C)]
#[derive(Clone, Copy, Debug, Pod, Zeroable)]
pub struct EffectParams {
    pub time: f32,
    pub progress: f32,
    pub width: f32,
    pub height: f32,
    pub effect_type: u32,
    pub intensity: f32,
    pub _padding: [f32; 2],
}

pub struct WgpuRenderer {
    device: wgpu::Device,
    queue: wgpu::Queue,
    compute_pipeline_crossfade: wgpu::ComputePipeline,
    compute_pipeline_3d_flip: wgpu::ComputePipeline,
    compute_pipeline_parallax: wgpu::ComputePipeline,
    compute_pipeline_film_grain: wgpu::ComputePipeline,
    compute_pipeline_light_leak: wgpu::ComputePipeline,
    compute_pipeline_bokeh: wgpu::ComputePipeline,
    bind_group_layout: wgpu::BindGroupLayout,
}

impl WgpuRenderer {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        // Initialize WGPU
        let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
            backends: wgpu::Backends::all(),
            ..Default::default()
        });

        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                compatible_surface: None,
                force_fallback_adapter: false,
            })
            .await
            .ok_or("Failed to find an appropriate adapter")?;

        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    required_features: wgpu::Features::empty(),
                    required_limits: wgpu::Limits::default(),
                    label: None,
                    memory_hints: wgpu::MemoryHints::default(),
                },
                None,
            )
            .await?;

        // Create bind group layout
        let bind_group_layout = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Video Effects Bind Group Layout"),
            entries: &[
                // Input texture
                wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::COMPUTE,
                    ty: wgpu::BindingType::Texture {
                        multisampled: false,
                        view_dimension: wgpu::TextureViewDimension::D2,
                        sample_type: wgpu::TextureSampleType::Float { filterable: true },
                    },
                    count: None,
                },
                // Second input texture (for transitions)
                wgpu::BindGroupLayoutEntry {
                    binding: 1,
                    visibility: wgpu::ShaderStages::COMPUTE,
                    ty: wgpu::BindingType::Texture {
                        multisampled: false,
                        view_dimension: wgpu::TextureViewDimension::D2,
                        sample_type: wgpu::TextureSampleType::Float { filterable: true },
                    },
                    count: None,
                },
                // Output texture
                wgpu::BindGroupLayoutEntry {
                    binding: 2,
                    visibility: wgpu::ShaderStages::COMPUTE,
                    ty: wgpu::BindingType::StorageTexture {
                        access: wgpu::StorageTextureAccess::WriteOnly,
                        format: wgpu::TextureFormat::Rgba8Unorm,
                        view_dimension: wgpu::TextureViewDimension::D2,
                    },
                    count: None,
                },
                // Effect parameters uniform buffer
                wgpu::BindGroupLayoutEntry {
                    binding: 3,
                    visibility: wgpu::ShaderStages::COMPUTE,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                },
                // Sampler
                wgpu::BindGroupLayoutEntry {
                    binding: 4,
                    visibility: wgpu::ShaderStages::COMPUTE,
                    ty: wgpu::BindingType::Sampler(wgpu::SamplerBindingType::Filtering),
                    count: None,
                },
            ],
        });

        // Create compute pipelines for different effects
        let compute_pipeline_crossfade = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/crossfade.wgsl"),
            "Crossfade Pipeline",
        );

        let compute_pipeline_3d_flip = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/3d_flip.wgsl"),
            "3D Flip Pipeline",
        );

        let compute_pipeline_parallax = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/parallax.wgsl"),
            "Parallax Pipeline",
        );

        let compute_pipeline_film_grain = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/film_grain.wgsl"),
            "Film Grain Pipeline",
        );

        let compute_pipeline_light_leak = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/light_leak.wgsl"),
            "Light Leak Pipeline",
        );

        let compute_pipeline_bokeh = Self::create_compute_pipeline(
            &device,
            &bind_group_layout,
            include_str!("../shaders/bokeh.wgsl"),
            "Bokeh Pipeline",
        );

        Ok(Self {
            device,
            queue,
            compute_pipeline_crossfade,
            compute_pipeline_3d_flip,
            compute_pipeline_parallax,
            compute_pipeline_film_grain,
            compute_pipeline_light_leak,
            compute_pipeline_bokeh,
            bind_group_layout,
        })
    }

    fn create_compute_pipeline(
        device: &wgpu::Device,
        bind_group_layout: &wgpu::BindGroupLayout,
        shader_source: &str,
        label: &str,
    ) -> wgpu::ComputePipeline {
        let shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some(label),
            source: wgpu::ShaderSource::Wgsl(Cow::Borrowed(shader_source)),
        });

        let pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some(&format!("{} Layout", label)),
            bind_group_layouts: &[bind_group_layout],
            push_constant_ranges: &[],
        });

        device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some(label),
            layout: Some(&pipeline_layout),
            module: &shader,
            entry_point: "main",
        })
    }

    pub async fn apply_effect(
        &self,
        input1_data: &[u8],
        input2_data: Option<&[u8]>,
        width: u32,
        height: u32,
        effect_type: &str,
        progress: f32,
        intensity: f32,
    ) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        // Create input textures
        let input1_texture = self.create_texture_from_data(input1_data, width, height, "Input1")?;
        let input2_texture = if let Some(data) = input2_data {
            self.create_texture_from_data(data, width, height, "Input2")?
        } else {
            // Create a black texture as fallback
            let black_data = vec![0u8; (width * height * 4) as usize];
            self.create_texture_from_data(&black_data, width, height, "Input2 Black")?
        };

        // Create output texture
        let output_texture = self.device.create_texture(&wgpu::TextureDescriptor {
            label: Some("Output Texture"),
            size: wgpu::Extent3d { width, height, depth_or_array_layers: 1 },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: wgpu::TextureFormat::Rgba8Unorm,
            usage: wgpu::TextureUsages::STORAGE_BINDING | wgpu::TextureUsages::COPY_SRC,
            view_formats: &[],
        });

        // Create effect parameters
        let effect_type_id = match effect_type {
            "crossfade" => 0,
            "3d_flip" => 1,
            "parallax" => 2,
            "film_grain" => 3,
            "light_leak" => 4,
            "bokeh" => 5,
            _ => 0,
        };

        let params = EffectParams {
            time: js_sys::Date::now() as f32 / 1000.0,
            progress,
            width: width as f32,
            height: height as f32,
            effect_type: effect_type_id,
            intensity,
            _padding: [0.0, 0.0],
        };

        let params_buffer = self.device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Effect Parameters Buffer"),
            contents: bytemuck::cast_slice(&[params]),
            usage: wgpu::BufferUsages::UNIFORM,
        });

        // Create sampler
        let sampler = self.device.create_sampler(&wgpu::SamplerDescriptor {
            address_mode_u: wgpu::AddressMode::ClampToEdge,
            address_mode_v: wgpu::AddressMode::ClampToEdge,
            address_mode_w: wgpu::AddressMode::ClampToEdge,
            mag_filter: wgpu::FilterMode::Linear,
            min_filter: wgpu::FilterMode::Linear,
            mipmap_filter: wgpu::FilterMode::Linear,
            ..Default::default()
        });

        // Create bind group
        let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
            label: Some("Video Effects Bind Group"),
            layout: &self.bind_group_layout,
            entries: &[
                wgpu::BindGroupEntry {
                    binding: 0,
                    resource: wgpu::BindingResource::TextureView(
                        &input1_texture.create_view(&wgpu::TextureViewDescriptor::default())
                    ),
                },
                wgpu::BindGroupEntry {
                    binding: 1,
                    resource: wgpu::BindingResource::TextureView(
                        &input2_texture.create_view(&wgpu::TextureViewDescriptor::default())
                    ),
                },
                wgpu::BindGroupEntry {
                    binding: 2,
                    resource: wgpu::BindingResource::TextureView(
                        &output_texture.create_view(&wgpu::TextureViewDescriptor::default())
                    ),
                },
                wgpu::BindGroupEntry {
                    binding: 3,
                    resource: params_buffer.as_entire_binding(),
                },
                wgpu::BindGroupEntry {
                    binding: 4,
                    resource: wgpu::BindingResource::Sampler(&sampler),
                },
            ],
        });

        // Select appropriate pipeline
        let pipeline = match effect_type {
            "3d_flip" => &self.compute_pipeline_3d_flip,
            "parallax" => &self.compute_pipeline_parallax,
            "film_grain" => &self.compute_pipeline_film_grain,
            "light_leak" => &self.compute_pipeline_light_leak,
            "bokeh" => &self.compute_pipeline_bokeh,
            _ => &self.compute_pipeline_crossfade,
        };

        // Execute compute shader
        let mut encoder = self.device.create_command_encoder(&wgpu::CommandEncoderDescriptor {
            label: Some("Video Effects Encoder"),
        });

        {
            let mut compute_pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                label: Some("Video Effects Pass"),
                timestamp_writes: None,
            });
            compute_pass.set_pipeline(pipeline);
            compute_pass.set_bind_group(0, &bind_group, &[]);
            
            // Dispatch with appropriate work group size
            let workgroup_size = 8;
            let num_workgroups_x = (width + workgroup_size - 1) / workgroup_size;
            let num_workgroups_y = (height + workgroup_size - 1) / workgroup_size;
            compute_pass.dispatch_workgroups(num_workgroups_x, num_workgroups_y, 1);
        }

        // Copy result to buffer for reading
        let buffer_size = (width * height * 4) as wgpu::BufferAddress;
        let output_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Output Buffer"),
            size: buffer_size,
            usage: wgpu::BufferUsages::COPY_DST | wgpu::BufferUsages::MAP_READ,
            mapped_at_creation: false,
        });

        encoder.copy_texture_to_buffer(
            wgpu::ImageCopyTexture {
                aspect: wgpu::TextureAspect::All,
                texture: &output_texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
            },
            wgpu::ImageCopyBuffer {
                buffer: &output_buffer,
                layout: wgpu::ImageDataLayout {
                    offset: 0,
                    bytes_per_row: Some(4 * width),
                    rows_per_image: Some(height),
                },
            },
            wgpu::Extent3d { width, height, depth_or_array_layers: 1 },
        );

        self.queue.submit(Some(encoder.finish()));

        // Read back the result
        let buffer_slice = output_buffer.slice(..);
        let (sender, receiver) = futures::channel::oneshot::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            sender.send(result).unwrap();
        });

        self.device.poll(wgpu::Maintain::Wait);
        receiver.await??;

        let data = buffer_slice.get_mapped_range();
        let result = data.to_vec();
        drop(data);
        output_buffer.unmap();

        Ok(result)
    }

    fn create_texture_from_data(
        &self,
        data: &[u8],
        width: u32,
        height: u32,
        label: &str,
    ) -> Result<wgpu::Texture, Box<dyn std::error::Error>> {
        // Load image and convert to RGBA
        let img = image::load_from_memory(data)?.to_rgba8();
        let rgba_data = img.into_raw();

        let texture = self.device.create_texture(&wgpu::TextureDescriptor {
            label: Some(label),
            size: wgpu::Extent3d { width, height, depth_or_array_layers: 1 },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: wgpu::TextureFormat::Rgba8Unorm,
            usage: wgpu::TextureUsages::TEXTURE_BINDING | wgpu::TextureUsages::COPY_DST,
            view_formats: &[],
        });

        self.queue.write_texture(
            wgpu::ImageCopyTexture {
                aspect: wgpu::TextureAspect::All,
                texture: &texture,
                mip_level: 0,
                origin: wgpu::Origin3d::ZERO,
            },
            &rgba_data,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(4 * width),
                rows_per_image: Some(height),
            },
            wgpu::Extent3d { width, height, depth_or_array_layers: 1 },
        );

        Ok(texture)
    }
}
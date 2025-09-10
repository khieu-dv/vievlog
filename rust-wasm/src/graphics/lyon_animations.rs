use lyon::math::{Point, Vector};
use lyon::path::Path;
use lyon::path::builder::*;
use kurbo::{BezPath, CubicBez, QuadBez, Circle, Ellipse};
use palette::{Hsv, Srgb, FromColor, IntoColor};
use rand::prelude::*;
use image::{RgbaImage, Rgba};

// Lyon-based beautiful vector animations
pub struct LyonAnimator {
    width: u32,
    height: u32,
    rng: StdRng,
}

impl LyonAnimator {
    pub fn new(width: u32, height: u32, seed: u64) -> Self {
        Self {
            width,
            height,
            rng: StdRng::seed_from_u64(seed),
        }
    }

    // Beautiful butterfly with curved wings using bezier paths
    pub fn draw_vector_butterfly(&mut self, img: &mut RgbaImage, x: f32, y: f32, progress: f32, intensity: f32) {
        let scale = intensity * 20.0;
        let wing_beat = (progress * 15.0).sin() * 0.3 + 0.7;
        
        // Generate rainbow color based on position and progress
        let hue = (progress * 360.0 + x * 0.5 + y * 0.3) % 360.0;
        let hsv = Hsv::new(hue, 0.8, wing_beat);
        let rgb: Srgb = hsv.into_color();
        let color = [
            (rgb.red * 255.0) as u8,
            (rgb.green * 255.0) as u8,
            (rgb.blue * 255.0) as u8,
            (200.0 * intensity) as u8,
        ];

        // Left wing using cubic bezier curve
        let wing_path = self.create_butterfly_wing_path(x, y, scale, wing_beat, true);
        self.rasterize_path_to_image(img, &wing_path, color);

        // Right wing (mirrored)
        let wing_path = self.create_butterfly_wing_path(x, y, scale, wing_beat, false);
        self.rasterize_path_to_image(img, &wing_path, color);

        // Body using smooth path
        let body_path = self.create_butterfly_body_path(x, y, scale);
        let body_color = [color[0] / 2, color[1] / 2, color[2] / 2, color[3]];
        self.rasterize_path_to_image(img, &body_path, body_color);
    }

    // Beautiful bird with smooth wing curves
    pub fn draw_vector_bird(&mut self, img: &mut RgbaImage, x: f32, y: f32, progress: f32, intensity: f32, bird_color: [u8; 3]) {
        let scale = intensity * 15.0;
        let wing_flap = (progress * 12.0).sin();
        
        // Golden shimmer effect
        let shimmer = (progress * 20.0).sin() * 0.2 + 0.8;
        let color = [
            (bird_color[0] as f32 * shimmer) as u8,
            (bird_color[1] as f32 * shimmer) as u8,
            (bird_color[2] as f32 * shimmer) as u8,
            (180.0 * intensity) as u8,
        ];

        // Bird body using ellipse
        let body_ellipse = Ellipse::new((x as f64, y as f64), (scale as f64 * 0.3, scale as f64 * 0.6), 0.0);
        self.rasterize_ellipse_to_image(img, &body_ellipse, color);

        // Wings using smooth bezier curves
        let wing_path = self.create_bird_wing_path(x, y, scale, wing_flap);
        self.rasterize_path_to_image(img, &wing_path, color);
    }

    // Magical fireflies with glowing orbs
    pub fn draw_vector_firefly(&mut self, img: &mut RgbaImage, x: f32, y: f32, progress: f32, intensity: f32) {
        let glow_radius = intensity * 8.0;
        let pulse = (progress * 8.0).sin() * 0.4 + 0.6;
        
        // Cycle through magical colors
        let hue = (progress * 240.0 + x * y * 0.001) % 360.0;
        let hsv = Hsv::new(hue, 0.9, pulse);
        let rgb: Srgb = hsv.into_color();
        
        // Create glowing effect with multiple concentric circles
        for i in 0..5 {
            let radius = glow_radius * (1.0 - i as f32 * 0.15);
            let alpha = (pulse * 255.0 * (1.0 - i as f32 * 0.2)) as u8;
            let color = [
                (rgb.red * 255.0) as u8,
                (rgb.green * 255.0) as u8,
                (rgb.blue * 255.0) as u8,
                alpha,
            ];
            
            let circle = Circle::new((x as f64, y as f64), radius as f64);
            self.rasterize_circle_to_image(img, &circle, color);
        }
    }

    // Flower petals with smooth curves
    pub fn draw_vector_petal(&mut self, img: &mut RgbaImage, x: f32, y: f32, rotation: f32, intensity: f32, petal_color: [u8; 3]) {
        let scale = intensity * 12.0;
        
        // Color variation with gentle pulse
        let pulse = (rotation * 3.0).sin() * 0.15 + 0.85;
        let color = [
            (petal_color[0] as f32 * pulse) as u8,
            (petal_color[1] as f32 * pulse) as u8,
            (petal_color[2] as f32 * pulse) as u8,
            (160.0 * intensity) as u8,
        ];

        // Create petal shape using bezier curves
        let petal_path = self.create_petal_path(x, y, scale, rotation);
        self.rasterize_path_to_image(img, &petal_path, color);
    }

    // Star with perfect rays using vector graphics
    pub fn draw_vector_star(&mut self, img: &mut RgbaImage, x: f32, y: f32, twinkle: f32, intensity: f32) {
        let size = intensity * twinkle * 8.0;
        let brightness = (twinkle * 255.0) as u8;
        let color = [brightness, brightness, brightness, (200.0 * intensity) as u8];

        // Create perfect star using vector paths
        let star_path = self.create_star_path(x, y, size, 5);
        self.rasterize_path_to_image(img, &star_path, color);
    }

    // Heart shape with smooth curves
    pub fn draw_vector_heart(&mut self, img: &mut RgbaImage, x: f32, y: f32, pulse: f32, intensity: f32) {
        let size = intensity * pulse * 10.0;
        let color = [
            (255.0 * pulse) as u8,
            (100.0 * pulse) as u8,
            (150.0 * pulse) as u8,
            (180.0 * intensity) as u8,
        ];

        let heart_path = self.create_heart_path(x, y, size);
        self.rasterize_path_to_image(img, &heart_path, color);
    }

    // Helper methods to create paths
    fn create_butterfly_wing_path(&self, x: f32, y: f32, scale: f32, wing_beat: f32, is_left: bool) -> BezPath {
        let mut path = BezPath::new();
        let sign = if is_left { -1.0 } else { 1.0 };
        let wing_scale = wing_beat * scale;
        
        // Start at body
        path.move_to((x as f64, y as f64));
        
        // Create butterfly wing using cubic bezier curves
        let ctrl1_x = x + sign * wing_scale * 0.3;
        let ctrl1_y = y - wing_scale * 0.5;
        let ctrl2_x = x + sign * wing_scale * 0.8;
        let ctrl2_y = y - wing_scale * 0.3;
        let end_x = x + sign * wing_scale;
        let end_y = y;
        
        path.curve_to(
            (ctrl1_x as f64, ctrl1_y as f64),
            (ctrl2_x as f64, ctrl2_y as f64),
            (end_x as f64, end_y as f64),
        );
        
        // Lower wing part
        let ctrl3_x = x + sign * wing_scale * 0.6;
        let ctrl3_y = y + wing_scale * 0.4;
        path.curve_to(
            (ctrl2_x as f64, (y + wing_scale * 0.2) as f64),
            (ctrl3_x as f64, ctrl3_y as f64),
            (x as f64, y as f64),
        );
        
        path.close_path();
        path
    }

    fn create_butterfly_body_path(&self, x: f32, y: f32, scale: f32) -> BezPath {
        let mut path = BezPath::new();
        
        // Elongated body using smooth curve
        let body_length = scale * 0.8;
        path.move_to((x as f64, (y - body_length * 0.5) as f64));
        
        path.line_to((x as f64, (y + body_length * 0.5) as f64));
        
        path
    }

    fn create_bird_wing_path(&self, x: f32, y: f32, scale: f32, wing_flap: f32) -> BezPath {
        let mut path = BezPath::new();
        let wing_length = scale * (0.8 + wing_flap * 0.2);
        
        path.move_to((x as f64, y as f64));
        
        // Wing curve affected by flap
        let ctrl_x = x + wing_length * 0.5;
        let ctrl_y = y - wing_length * 0.3 * wing_flap;
        let end_x = x + wing_length;
        let end_y = y + wing_length * 0.1 * wing_flap;
        
        path.quad_to(
            (ctrl_x as f64, ctrl_y as f64),
            (end_x as f64, end_y as f64),
        );
        
        path
    }

    fn create_petal_path(&self, x: f32, y: f32, scale: f32, rotation: f32) -> BezPath {
        let mut path = BezPath::new();
        
        // Petal shape using curves
        let cos_r = rotation.cos();
        let sin_r = rotation.sin();
        
        path.move_to((x as f64, y as f64));
        
        // Create curved petal
        let tip_x = x + scale * cos_r;
        let tip_y = y + scale * sin_r;
        let ctrl1_x = x + scale * 0.3 * cos_r + scale * 0.2 * sin_r;
        let ctrl1_y = y + scale * 0.3 * sin_r - scale * 0.2 * cos_r;
        let ctrl2_x = x + scale * 0.7 * cos_r + scale * 0.1 * sin_r;
        let ctrl2_y = y + scale * 0.7 * sin_r - scale * 0.1 * cos_r;
        
        path.curve_to(
            (ctrl1_x as f64, ctrl1_y as f64),
            (ctrl2_x as f64, ctrl2_y as f64),
            (tip_x as f64, tip_y as f64),
        );
        
        // Other side of petal
        let ctrl3_x = x + scale * 0.7 * cos_r - scale * 0.1 * sin_r;
        let ctrl3_y = y + scale * 0.7 * sin_r + scale * 0.1 * cos_r;
        let ctrl4_x = x + scale * 0.3 * cos_r - scale * 0.2 * sin_r;
        let ctrl4_y = y + scale * 0.3 * sin_r + scale * 0.2 * cos_r;
        
        path.curve_to(
            (ctrl3_x as f64, ctrl3_y as f64),
            (ctrl4_x as f64, ctrl4_y as f64),
            (x as f64, y as f64),
        );
        
        path.close_path();
        path
    }

    fn create_star_path(&self, x: f32, y: f32, size: f32, points: u32) -> BezPath {
        let mut path = BezPath::new();
        let angle_step = std::f32::consts::PI * 2.0 / (points as f32);
        let inner_radius = size * 0.4;
        let outer_radius = size;
        
        for i in 0..(points * 2) {
            let angle = i as f32 * angle_step * 0.5;
            let radius = if i % 2 == 0 { outer_radius } else { inner_radius };
            let px = x + radius * angle.cos();
            let py = y + radius * angle.sin();
            
            if i == 0 {
                path.move_to((px as f64, py as f64));
            } else {
                path.line_to((px as f64, py as f64));
            }
        }
        
        path.close_path();
        path
    }

    fn create_heart_path(&self, x: f32, y: f32, size: f32) -> BezPath {
        let mut path = BezPath::new();
        
        // Heart shape using cubic bezier curves
        path.move_to((x as f64, (y + size * 0.3) as f64));
        
        // Left curve
        path.curve_to(
            ((x - size * 0.5) as f64, (y - size * 0.2) as f64),
            ((x - size * 0.5) as f64, (y - size * 0.8) as f64),
            (x as f64, (y - size * 0.5) as f64),
        );
        
        // Right curve
        path.curve_to(
            ((x + size * 0.5) as f64, (y - size * 0.8) as f64),
            ((x + size * 0.5) as f64, (y - size * 0.2) as f64),
            (x as f64, (y + size * 0.3) as f64),
        );
        
        path.close_path();
        path
    }

    // Rasterization methods
    fn rasterize_path_to_image(&self, img: &mut RgbaImage, path: &BezPath, color: [u8; 4]) {
        // Simple rasterization - in real implementation would use lyon tessellation
        let elements = path.elements();
        for element in elements {
            match element {
                kurbo::PathEl::MoveTo(point) => {
                    self.plot_point(img, point.x as u32, point.y as u32, color);
                }
                kurbo::PathEl::LineTo(point) => {
                    self.plot_point(img, point.x as u32, point.y as u32, color);
                }
                kurbo::PathEl::QuadTo(_, point) => {
                    self.plot_point(img, point.x as u32, point.y as u32, color);
                }
                kurbo::PathEl::CurveTo(_, _, point) => {
                    self.plot_point(img, point.x as u32, point.y as u32, color);
                }
                kurbo::PathEl::ClosePath => {}
            }
        }
    }

    fn rasterize_circle_to_image(&self, img: &mut RgbaImage, circle: &Circle, color: [u8; 4]) {
        let center = circle.center;
        let radius = circle.radius;
        
        for dy in -(radius as i32)..=(radius as i32) {
            for dx in -(radius as i32)..=(radius as i32) {
                if (dx * dx + dy * dy) as f64 <= radius * radius {
                    let x = (center.x as i32 + dx).max(0).min(self.width as i32 - 1) as u32;
                    let y = (center.y as i32 + dy).max(0).min(self.height as i32 - 1) as u32;
                    self.plot_point(img, x, y, color);
                }
            }
        }
    }

    fn rasterize_ellipse_to_image(&self, img: &mut RgbaImage, ellipse: &Ellipse, color: [u8; 4]) {
        let center = ellipse.center();
        let radii = ellipse.radii();
        
        for dy in -(radii.y as i32)..=(radii.y as i32) {
            for dx in -(radii.x as i32)..=(radii.x as i32) {
                let norm_x = dx as f64 / radii.x;
                let norm_y = dy as f64 / radii.y;
                if norm_x * norm_x + norm_y * norm_y <= 1.0 {
                    let x = (center.x as i32 + dx).max(0).min(self.width as i32 - 1) as u32;
                    let y = (center.y as i32 + dy).max(0).min(self.height as i32 - 1) as u32;
                    self.plot_point(img, x, y, color);
                }
            }
        }
    }

    fn plot_point(&self, img: &mut RgbaImage, x: u32, y: u32, color: [u8; 4]) {
        if x < self.width && y < self.height {
            let pixel = Rgba(color);
            // Alpha blending
            if let Some(existing) = img.get_pixel_mut_checked(x, y) {
                let alpha = color[3] as f32 / 255.0;
                let inv_alpha = 1.0 - alpha;
                
                existing[0] = ((existing[0] as f32 * inv_alpha + color[0] as f32 * alpha) as u8).min(255);
                existing[1] = ((existing[1] as f32 * inv_alpha + color[1] as f32 * alpha) as u8).min(255);
                existing[2] = ((existing[2] as f32 * inv_alpha + color[2] as f32 * alpha) as u8).min(255);
                existing[3] = ((existing[3] as f32 * inv_alpha + color[3] as f32 * alpha) as u8).min(255);
            }
        }
    }
}
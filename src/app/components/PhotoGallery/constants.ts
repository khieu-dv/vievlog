// src/components/PhotoGallery/constants.ts
import { Vector3 } from "three";
// Đường dẫn đến hình ảnh
export const IMAGES: string[] = [
  "/images/0.jpg",
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg"
];

// Thông tin văn bản cho từng ảnh
export const IMAGE_DETAILS: string[] = [
  "🎄VK Ck đi chơi Noel",
  "👶👶 Chào thế giới, hai tình yêu bé nhỏ",
  "👵👶 Vòng tay bên Bà và Cậu",
  "👨‍👩‍👧‍👦 2 Vk Ck chào đón 2 con",
  "✝️  Khoảnh khắc thiêng liêng đầu đời",
  "🎂 Bống thêm tuổi mới",
  "😴  Giấc mơ của 2 thiên thần",
  "🌌  Ánh mắt Minh Hà giữa trời sao",
  "💉 Đưa 2 con đi tiêm chủng",
  "✈️ Kỷ niệm tại sân bay Incheon"
];

// Vị trí hiển thị cho mỗi hình ảnh
export const IMAGE_POSITIONS: Vector3[] = [
  new Vector3(3, 1.5, -2),
  new Vector3(-3, 2, 2),
  new Vector3(0, 3, -4),
  new Vector3(-2, 0, 5),
  new Vector3(3, -2, 1),
  new Vector3(-4, -0.5, -1.5),
  new Vector3(1.5, 3, 3),
  new Vector3(-3, 1.5, -3),
  new Vector3(4, -1.5, -2.5),
  new Vector3(0, -3, 4)
];

// Các thông số cấu hình
export const CONFIG = {
  TRIGGER_DISTANCE: 1.5,           // Khoảng cách để kích hoạt hiển thị hình ảnh
  MAX_VISIBLE_IMAGES: 1,           // Số lượng hình ảnh hiển thị đồng thời
  APPEAR_TRANSITION_DURATION: 1.0, // Thời gian chuyển tiếp xuất hiện (giây)
  DISAPPEAR_TRANSITION_DURATION: 1.5, // Thời gian chuyển tiếp biến mất (giây)
  AUDIO_URL: "https://viedesk.sgp1.cdn.digitaloceanspaces.com/audio_birthday.m4a", // Audio nền
  AUTO_ADVANCE_TIME: 4             // Thời gian tự động chuyển tiếp (giây)
};

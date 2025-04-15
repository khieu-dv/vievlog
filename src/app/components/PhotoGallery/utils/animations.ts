
// src/components/PhotoGallery/utils/animations.ts
import { Effect, DisappearEffect } from "../types";

// Easing functions
export const easeOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const easeOutElastic = (x: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

// Hiệu ứng xuất hiện
export const appearEffects: Effect[] = [
  (progress) => ({ // Mờ dần và phóng to
    opacity: progress,
    scale: 0.7 + easeOutBack(progress) * 0.3,
    rotation: 0,
    translateY: 0,
  }),
  (progress) => ({ // Trượt lên
    opacity: progress,
    scale: 1,
    rotation: 0,
    translateY: (1 - progress) * -1.5,
  }),
  (progress) => ({ // Phóng to từ giữa
    opacity: progress,
    scale: easeOutElastic(progress) * 0.8,
    rotation: 0,
    translateY: 0,
  }),
  (progress) => ({ // Xoay vào
    opacity: progress,
    scale: progress * 0.8,
    rotation: progress * Math.PI * 2,
    translateY: 0,
  }),
  (progress) => ({ // Mờ dần với xoay nhẹ
    opacity: progress,
    scale: 1,
    rotation: (1 - progress) * Math.PI * 0.3,
    translateY: 0,
  }),
];

// Hiệu ứng biến mất
export const disappearEffects: DisappearEffect[] = [
  (progress, direction) => ({ // Mờ dần và bay lên
    opacity: 1 - progress,
    scale: 1 - progress * 0.6,
    rotation: 0,
    translateX: direction.x * progress * 2,
    translateY: direction.y * progress * 2,
    translateZ: direction.z * progress * 2,
  }),
  (progress, direction) => ({ // Thu nhỏ và mờ dần
    opacity: 1 - progress,
    scale: 1 - progress * 0.7,
    rotation: 0,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
  }),
  (progress, direction) => ({ // Xoay và mờ dần
    opacity: 1 - progress,
    scale: 1 - progress * 0.4,
    rotation: progress * Math.PI * 2,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
  }),
  (progress, direction) => ({ // Di chuyển nhanh ra xa
    opacity: 1 - progress,
    scale: 1,
    rotation: 0,
    translateX: direction.x * progress * 3,
    translateY: direction.y * progress * 3,
    translateZ: direction.z * progress * 3,
  }),
  (progress, direction) => ({ // Mờ dần và xoay nhẹ
    opacity: 1 - progress,
    scale: 1,
    rotation: progress * Math.PI * 0.3,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
  }),
];
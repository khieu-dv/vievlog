
// src/components/PhotoGallery/hooks/useTextures.ts
import { useState, useEffect, useRef } from "react";
import { TextureLoader, Texture } from "three";
import { IMAGES } from "../constants";
import { AspectRatioMap } from "../types";

export const useTextures = () => {
  const [imageAspectRatios, setImageAspectRatios] = useState<AspectRatioMap>({});
  const textureRefs = useRef<Array<Texture | null>>([]);

  useEffect(() => {
    const loadTextures = async () => {
      const loader = new TextureLoader();
      const loadPromises = IMAGES.map((url, index) => {
        return new Promise<Texture | null>((resolve) => {
          const img = new Image();
          img.onload = () => {
            // Lưu tỷ lệ khung hình (width/height) của ảnh
            const aspectRatio = img.width / img.height;
            setImageAspectRatios(prev => ({ ...prev, [index]: aspectRatio }));

            // Load texture
            loader.load(url, texture => {
              resolve(texture);
            }, undefined, error => {
              console.error("Error loading texture:", error);
              resolve(null);
            });
          };
          img.onerror = () => {
            console.error("Error loading image:", url);
            setImageAspectRatios(prev => ({ ...prev, [index]: 1.5 })); // Tỷ lệ mặc định nếu load ảnh lỗi
            resolve(null);
          };
          img.src = url;
        });
      });

      try {
        const loadedTextures = await Promise.all(loadPromises);
        textureRefs.current = loadedTextures;
      } catch (error) {
        console.error("Error loading textures:", error);
      }
    };

    loadTextures();
  }, []);

  return { imageAspectRatios, textureRefs };
};
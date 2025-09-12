"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { rustWasm, ImageInfo } from '~/lib/wasm-loader';
import { Button } from '~/components/ui/Button';

interface ImageEditorProps {
  onImageProcessed?: (imageData: Uint8Array) => void;
}

export function ImageEditor({ onImageProcessed }: ImageEditorProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<Uint8Array | null>(null);
  const [currentImage, setCurrentImage] = useState<Uint8Array | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to convert file to RGBA data
  const fileToRGBAData = async (file: File): Promise<{data: Uint8Array, width: number, height: number}> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Cannot get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve({
          data: new Uint8Array(imageData.data),
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };
  
  // Controls state
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initWasm = async () => {
      try {
        setLoading(true);
        await rustWasm.init();
        
        // Additional check to ensure functions are available
        if (window.rustWasm && window.rustWasm.bevy_process_image) {
          setIsLoaded(true);
          console.log('✅ WASM fully loaded and ready');
        } else {
          throw new Error('WASM functions not available');
        }
      } catch (error) {
        console.error('Failed to initialize WASM:', error);
      } finally {
        setLoading(false);
      }
    };

    initWasm();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isLoaded) return;

    try {
      setProcessing(true);
      
      // Convert file to RGBA data using Canvas
      const rgbaData = await fileToRGBAData(file);
      
      setOriginalImage(rgbaData.data);
      setCurrentImage(rgbaData.data);
      
      // Set image info from canvas
      setImageInfo({
        width: rgbaData.width,
        height: rgbaData.height,
        color: 'RGBA',
        format: 'Canvas'
      });
      
      // Create preview URL from original file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Reset controls
      setBrightness(1.0);
      setContrast(1.0);
      setBlur(0);
      setRotation(0);
      
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      alert('Không thể xử lý file ảnh này. Vui lòng thử file khác.');
    } finally {
      setProcessing(false);
    }
  };

  const applyEffect = async (effectFunction: () => Uint8Array) => {
    if (!currentImage || !isLoaded || processing || !imageInfo) return;
    
    try {
      setProcessing(true);
      
      // Double check WASM is initialized
      if (!window.rustWasm) {
        console.error('WASM module not available');
        return;
      }
      
      const result = effectFunction();
      if (result && result.length > 0) {
        setCurrentImage(result);
        
        // Convert RGBA data back to image for preview
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = imageInfo.width;
          canvas.height = imageInfo.height;
          
          const imageData = new ImageData(
            new Uint8ClampedArray(result),
            imageInfo.width,
            imageInfo.height
          );
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
              }
              setPreviewUrl(url);
            }
          }, 'image/png');
        }
        
        onImageProcessed?.(result);
      }
    } catch (error) {
      console.error('Error applying effect:', error);
      alert('Có lỗi khi xử lý ảnh. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const applyPresetEffects = (baseImage: Uint8Array, info: ImageInfo, presetName: string): Uint8Array => {
    let processedImage = baseImage;
    const { width, height } = info;

    switch (presetName) {
      case 'cinematic_dark':
        processedImage = rustWasm.adjustContrast(processedImage, width, height, 1.2);
        processedImage = rustWasm.applyVignette(processedImage, width, height, 0.3);
        processedImage = rustWasm.applyFilmGrain(processedImage, width, height, 0.1);
        break;
      case 'golden_hour':
        processedImage = rustWasm.adjustBrightness(processedImage, width, height, 1.1);
        processedImage = rustWasm.adjustSaturation(processedImage, width, height, 1.2);
        processedImage = rustWasm.applyLightLeak(processedImage, width, height, 0.2);
        break;
      case 'vintage_film':
        processedImage = rustWasm.applySepia(processedImage, width, height);
        processedImage = rustWasm.applyVignette(processedImage, width, height, 0.4);
        processedImage = rustWasm.applyFilmGrain(processedImage, width, height, 0.3);
        break;
      case 'dreamy_soft':
        processedImage = rustWasm.applyBlur(processedImage, width, height, 0.3);
        processedImage = rustWasm.adjustBrightness(processedImage, width, height, 1.15);
        processedImage = rustWasm.adjustSaturation(processedImage, width, height, 1.2);
        break;
      default:
        break;
    }
    return processedImage;
  };

  const applyAllEffects = useCallback((newBrightness?: number, newContrast?: number, newBlur?: number) => {
    if (!originalImage || !imageInfo) return;
    
    const finalBrightness = newBrightness !== undefined ? newBrightness : brightness;
    const finalContrast = newContrast !== undefined ? newContrast : contrast;
    const finalBlur = newBlur !== undefined ? newBlur : blur;
    
    let processedImage = originalImage;
    const { width, height } = imageInfo;
    
    // Apply brightness if different from default
    if (finalBrightness !== 1.0) {
      processedImage = rustWasm.adjustBrightness(processedImage, width, height, finalBrightness);
    }
    
    // Apply contrast if different from default
    if (finalContrast !== 1.0) {
      processedImage = rustWasm.adjustContrast(processedImage, width, height, finalContrast);
    }
    
    // Apply blur if different from default
    if (finalBlur !== 0) {
      processedImage = rustWasm.applyBlur(processedImage, width, height, finalBlur);
    }
    
    return processedImage;
  }, [originalImage, imageInfo, brightness, contrast, blur]);

  const debouncedApplyEffects = useCallback((newBrightness?: number, newContrast?: number, newBlur?: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      if (originalImage) {
        const result = applyAllEffects(newBrightness, newContrast, newBlur);
        if (result) {
          applyEffect(() => result);
        }
      }
    }, 150); // 150ms debounce
    
    setDebounceTimer(timer);
  }, [debounceTimer, originalImage, applyAllEffects]);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    debouncedApplyEffects(value);
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    debouncedApplyEffects(undefined, value);
  };

  const handleBlurChange = (value: number) => {
    setBlur(value);
    debouncedApplyEffects(undefined, undefined, value);
  };

  const handleRotation = (angle: number) => {
    const newRotation = (rotation + angle) % 360;
    setRotation(newRotation);
    if (currentImage) {
      applyEffect(() => rustWasm.rotateImage(currentImage, angle));
    }
  };

  const resetImage = () => {
    if (originalImage && imageInfo) {
      setCurrentImage(originalImage);
      
      // Convert RGBA data back to image for preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = imageInfo.width;
        canvas.height = imageInfo.height;
        
        const imageData = new ImageData(
          new Uint8ClampedArray(originalImage),
          imageInfo.width,
          imageInfo.height
        );
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            if (previewUrl && previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(url);
          }
        }, 'image/png');
      }
      
      // Reset controls
      setBrightness(1.0);
      setContrast(1.0);
      setBlur(0);
      setRotation(0);
    }
  };

  const downloadImage = () => {
    if (!currentImage || !imageInfo) return;
    
    // Convert RGBA data to canvas and download as PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = imageInfo.width;
      canvas.height = imageInfo.height;
      
      const imageData = new ImageData(
        new Uint8ClampedArray(currentImage),
        imageInfo.width,
        imageInfo.height
      );
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `edited-image-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    }
  };

  const resizeImage = (width: number, height: number) => {
    if (currentImage && imageInfo) {
      applyEffect(() => rustWasm.resizeImage(currentImage, imageInfo.width, imageInfo.height, width, height));
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải Rust WASM...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-red-600">
          <p>Không thể tải Rust WASM module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🖼️ Professional Image Editor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chỉnh sửa hình ảnh chuyên nghiệp với sức mạnh của Rust WASM
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          📁 Tải lên hình ảnh
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="text-4xl mb-2">📷</div>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click để tải lên</span> hoặc kéo thả file
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, WEBP</p>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      {previewUrl && imageInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  🖼️ Preview
                </h2>
                {processing && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Đang xử lý...</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-96 object-contain rounded"
                />
              </div>
              
              {/* Image Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Kích thước</div>
                  <div className="text-gray-600 dark:text-gray-400">{imageInfo.width} × {imageInfo.height}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Màu sắc</div>
                  <div className="text-gray-600 dark:text-gray-400">{imageInfo.color}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Độ sáng</div>
                  <div className="text-gray-600 dark:text-gray-400">{Math.round(brightness * 100)}%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-gray-900 dark:text-white">Xoay</div>
                  <div className="text-gray-600 dark:text-gray-400">{rotation}°</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Basic Adjustments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                🎛️ Điều chỉnh cơ bản
              </h3>
              
              <div className="space-y-4">
                {/* Brightness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💡 Độ sáng: {Math.round(brightness * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={brightness}
                    onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ⚡ Độ tương phản: {Math.round(contrast * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={contrast}
                    onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Blur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🌊 Độ mờ: {blur.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={blur}
                    onChange={(e) => handleBlurChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Transform Controls */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                🔄 Biến đổi
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleRotation(90)}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  className="text-xs"
                >
                  🔄 Xoay 90°
                </Button>
                <Button 
                  onClick={() => handleRotation(180)}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  className="text-xs"
                >
                  🔄 Xoay 180°
                </Button>
                <Button 
                  onClick={() => currentImage && applyEffect(() => rustWasm.flipHorizontal(currentImage))}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  className="text-xs"
                >
                  ↔️ Lật ngang
                </Button>
                <Button 
                  onClick={() => currentImage && applyEffect(() => rustWasm.flipVertical(currentImage))}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  className="text-xs"
                >
                  ↕️ Lật dọc
                </Button>
              </div>
            </div>

            {/* Basic Filters */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                🎨 Bộ lọc cơ bản
              </h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => rustWasm.applyGrayscale(currentImage, imageInfo.width, imageInfo.height))}
                  variant="outline"
                  className="w-full"
                  disabled={processing}
                >
                  🖤 Đen trắng
                </Button>
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => rustWasm.applySepia(currentImage, imageInfo.width, imageInfo.height))}
                  variant="outline"
                  className="w-full"
                  disabled={processing}
                >
                  🟤 Sepia
                </Button>
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => rustWasm.applyVignette(currentImage, imageInfo.width, imageInfo.height, 0.4))}
                  variant="outline"
                  className="w-full"
                  disabled={processing}
                >
                  🌑 Vignette
                </Button>
              </div>
            </div>

            {/* Cinematic Presets */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                🎬 Preset điện ảnh
              </h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => applyPresetEffects(currentImage, imageInfo, "cinematic_dark"))}
                  variant="outline"
                  className="w-full text-xs"
                  disabled={processing}
                >
                  🌃 Cinematic Dark
                </Button>
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => applyPresetEffects(currentImage, imageInfo, "golden_hour"))}
                  variant="outline"
                  className="w-full text-xs"
                  disabled={processing}
                >
                  🌅 Golden Hour
                </Button>
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => applyPresetEffects(currentImage, imageInfo, "vintage_film"))}
                  variant="outline"
                  className="w-full text-xs"
                  disabled={processing}
                >
                  📼 Vintage Film
                </Button>
                <Button 
                  onClick={() => currentImage && imageInfo && applyEffect(() => applyPresetEffects(currentImage, imageInfo, "dreamy_soft"))}
                  variant="outline"
                  className="w-full text-xs"
                  disabled={processing}
                >
                  ☁️ Dreamy Soft
                </Button>
              </div>
            </div>

            {/* Quick Resize */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                📐 Thay đổi kích thước
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => resizeImage(800, 600)}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                >
                  📱 800×600
                </Button>
                <Button 
                  onClick={() => resizeImage(1200, 800)}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                >
                  💻 1200×800
                </Button>
                <Button 
                  onClick={() => resizeImage(1920, 1080)}
                  variant="outline"
                  size="sm"
                  disabled={processing}
                >
                  🖥️ 1920×1080
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                ⚡ Hành động
              </h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={resetImage}
                  variant="outline"
                  className="w-full"
                  disabled={!originalImage || processing}
                >
                  🔄 Reset về gốc
                </Button>
                <Button 
                  onClick={downloadImage}
                  className="w-full"
                  disabled={!currentImage || processing}
                >
                  💾 Tải về
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!previewUrl && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            📚 Hướng dẫn sử dụng:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-disc list-inside">
            <li>Tải lên một hình ảnh (PNG, JPG, JPEG, WEBP)</li>
            <li>Sử dụng các thanh trượt để điều chỉnh độ sáng, tương phản và độ mờ</li>
            <li>Áp dụng các phép biến đổi như xoay, lật hình</li>
            <li>Thử các bộ lọc như đen trắng</li>
            <li>Thay đổi kích thước với các preset có sẵn</li>
            <li>Tải về kết quả cuối cùng dưới dạng PNG</li>
          </ul>
        </div>
      )}
    </div>
  );
}
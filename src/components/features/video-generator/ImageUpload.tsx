"use client";

import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 10, 
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className 
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => 
      acceptedTypes.includes(file.type) && 
      file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    const newImages = [...images, ...validFiles].slice(0, maxImages);
    setImages(newImages);
    onImagesChange(newImages);

    // Generate previews
    const newPreviews = [...previews];
    validFiles.forEach((file, index) => {
      if (newImages.length <= maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewIndex = images.length + index;
          if (previewIndex < maxImages) {
            newPreviews[previewIndex] = e.target?.result as string;
            setPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images, previews, maxImages, acceptedTypes, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // Reset input
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  }, [images, previews, onImagesChange]);

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    
    newImages.splice(toIndex, 0, movedImage);
    newPreviews.splice(toIndex, 0, movedPreview);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  }, [images, previews, onImagesChange]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          "hover:border-primary/50 hover:bg-primary/5",
          dragActive ? "border-primary bg-primary/10" : "border-border",
          images.length >= maxImages ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          disabled={images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">
              {images.length >= maxImages 
                ? `Maximum ${maxImages} images reached` 
                : "Drop images here or click to upload"
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {images.length}/{maxImages} images • Max 10MB each • PNG, JPG, WEBP
            </p>
          </div>

          {images.length < maxImages && (
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Select Images
            </Button>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIndex !== index) {
                  reorderImages(fromIndex, index);
                }
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              {/* Remove button */}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
              
              {/* Order indicator */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Drag and drop images to reorder them</p>
          <p>• The video will play images in the order shown above</p>
          <p>• Upload at least 2 images to generate a video</p>
        </div>
      )}
    </div>
  );
}
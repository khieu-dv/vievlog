"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '~/lib/utils';

interface ColorWheelProps {
  value: { hue: number; saturation: number; lightness: number };
  onChange: (value: { hue: number; saturation: number; lightness: number }) => void;
  size?: number;
  className?: string;
  label?: string;
}

export function ColorWheel({ 
  value, 
  onChange, 
  size = 120, 
  className,
  label 
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'hue' | 'saturation' | null>(null);

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const innerRadius = radius * 0.7;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw hue ring
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Draw saturation/lightness area
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius);
    gradient.addColorStop(0, `hsl(${value.hue}, 0%, ${value.lightness}%)`);
    gradient.addColorStop(1, `hsl(${value.hue}, 100%, ${value.lightness}%)`);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw lightness gradient overlay
    const lightnessGradient = ctx.createLinearGradient(centerX - innerRadius, centerY, centerX + innerRadius, centerY);
    lightnessGradient.addColorStop(0, 'rgba(0,0,0,0.5)');
    lightnessGradient.addColorStop(0.5, 'rgba(0,0,0,0)');
    lightnessGradient.addColorStop(1, 'rgba(255,255,255,0.5)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = lightnessGradient;
    ctx.fill();

    // Draw hue indicator
    const hueAngle = (value.hue - 90) * Math.PI / 180;
    const hueX = centerX + Math.cos(hueAngle) * (radius - 5);
    const hueY = centerY + Math.sin(hueAngle) * (radius - 5);
    
    ctx.beginPath();
    ctx.arc(hueX, hueY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw saturation/lightness indicator
    const satX = centerX + (value.saturation / 100) * Math.cos(hueAngle) * innerRadius * 0.8;
    const satY = centerY + (value.saturation / 100) * Math.sin(hueAngle) * innerRadius * 0.8;
    
    ctx.beginPath();
    ctx.arc(satX, satY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${value.hue}, ${value.saturation}%, ${value.lightness}%)`;
    ctx.fill();
    ctx.strokeStyle = value.lightness > 50 ? 'black' : 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [value, size]);

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  const getPositionValue = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const innerRadius = radius * 0.7;

    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const angle = Math.atan2(y - centerY, x - centerX);
    const hue = ((angle * 180 / Math.PI) + 90 + 360) % 360;

    if (distance > innerRadius && distance <= radius) {
      // Hue ring
      return { type: 'hue' as const, hue, saturation: value.saturation, lightness: value.lightness };
    } else if (distance <= innerRadius) {
      // Saturation/lightness area
      const saturation = Math.min(100, (distance / innerRadius) * 100);
      const lightness = Math.max(0, Math.min(100, 50 + (x - centerX) / innerRadius * 50));
      return { type: 'saturation' as const, hue: value.hue, saturation, lightness };
    }

    return null;
  }, [value, size]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const result = getPositionValue(e.clientX, e.clientY);
    if (result) {
      setIsDragging(true);
      setDragTarget(result.type);
      onChange({ hue: result.hue, saturation: result.saturation, lightness: result.lightness });
    }
  }, [getPositionValue, onChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const result = getPositionValue(e.clientX, e.clientY);
    if (result) {
      onChange({ hue: result.hue, saturation: result.saturation, lightness: result.lightness });
    }
  }, [isDragging, getPositionValue, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const result = getPositionValue(e.clientX, e.clientY);
        if (result) {
          onChange({ hue: result.hue, saturation: result.saturation, lightness: result.lightness });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setDragTarget(null);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, getPositionValue, onChange]);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
        <span>H: {Math.round(value.hue)}°</span>
        <span>S: {Math.round(value.saturation)}%</span>
        <span>L: {Math.round(value.lightness)}%</span>
      </div>

      <div 
        className="w-8 h-8 border-2 border-white shadow-md rounded"
        style={{ 
          backgroundColor: `hsl(${value.hue}, ${value.saturation}%, ${value.lightness}%)` 
        }}
      />
    </div>
  );
}
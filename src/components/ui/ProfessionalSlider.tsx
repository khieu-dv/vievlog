"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '~/lib/utils';

interface ProfessionalSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  className?: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  showReset?: boolean;
  disabled?: boolean;
}

export function ProfessionalSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  defaultValue,
  unit = '',
  className,
  color = 'blue',
  showReset = true,
  disabled = false
}: ProfessionalSliderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;
  const isDefault = defaultValue !== undefined && Math.abs(value - defaultValue) < step;

  const colorClasses = {
    blue: {
      track: 'bg-blue-500',
      thumb: 'bg-blue-600 border-blue-300',
      glow: 'shadow-blue-500/50'
    },
    purple: {
      track: 'bg-purple-500',
      thumb: 'bg-purple-600 border-purple-300',
      glow: 'shadow-purple-500/50'
    },
    green: {
      track: 'bg-green-500',
      thumb: 'bg-green-600 border-green-300',
      glow: 'shadow-green-500/50'
    },
    orange: {
      track: 'bg-orange-500',
      thumb: 'bg-orange-600 border-orange-300',
      glow: 'shadow-orange-500/50'
    },
    red: {
      track: 'bg-red-500',
      thumb: 'bg-red-600 border-red-300',
      glow: 'shadow-red-500/50'
    }
  };

  const colors = colorClasses[color];

  const handleReset = useCallback(() => {
    if (defaultValue !== undefined && !disabled) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && !disabled) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  }, [onChange, min, max, disabled]);

  const formatValue = useCallback((val: number) => {
    if (step >= 1) {
      return val.toFixed(0);
    } else if (step >= 0.1) {
      return val.toFixed(1);
    } else {
      return val.toFixed(2);
    }
  }, [step]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label 
          className={cn(
            "text-sm font-medium transition-colors",
            disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-300",
            (isFocused || isDragging) && !disabled && "text-gray-900 dark:text-white"
          )}
        >
          {label}
        </label>
        
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={formatValue(value)}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              "w-16 px-2 py-1 text-xs text-right border rounded transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              disabled 
                ? "bg-gray-100 text-gray-400 border-gray-200" 
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            )}
          />
          <span className="text-xs text-gray-500 w-4">{unit}</span>
          
          {showReset && defaultValue !== undefined && (
            <button
              onClick={handleReset}
              disabled={disabled || isDefault}
              className={cn(
                "text-xs px-2 py-1 rounded transition-all",
                disabled || isDefault
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700"
              )}
              title="Reset to default"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <div className={cn(
          "relative w-full h-2 rounded-full transition-all",
          disabled ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
        )}>
          {/* Progress Track */}
          <div
            className={cn(
              "absolute top-0 left-0 h-full rounded-full transition-all",
              disabled ? "bg-gray-400" : colors.track
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Default Value Indicator */}
          {defaultValue !== undefined && (
            <div
              className="absolute top-1/2 w-0.5 h-4 bg-gray-400 transform -translate-y-1/2 -translate-x-0.5"
              style={{
                left: `${((defaultValue - min) / (max - min)) * 100}%`
              }}
            />
          )}
          
          {/* Slider Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            disabled={disabled}
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              disabled && "cursor-not-allowed"
            )}
          />
          
          {/* Custom Thumb */}
          <div
            className={cn(
              "absolute top-1/2 w-4 h-4 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-all",
              "border-2 shadow-lg",
              disabled 
                ? "bg-gray-400 border-gray-300" 
                : cn(colors.thumb, (isFocused || isDragging) && `shadow-lg ${colors.glow}`)
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Value Display */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(min)}{unit}</span>
        <span className={cn(
          "font-mono",
          (isFocused || isDragging) && !disabled && "text-gray-700 dark:text-gray-300"
        )}>
          {formatValue(value)}{unit}
        </span>
        <span>{formatValue(max)}{unit}</span>
      </div>
    </div>
  );
}
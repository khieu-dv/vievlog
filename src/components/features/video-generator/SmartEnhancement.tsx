"use client";

import React, { useState, useCallback } from 'react';
import { Sparkles, Settings, Wand2, Eye, RotateCcw } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { ProfessionalSlider } from '~/components/ui/ProfessionalSlider';
import { ColorWheel } from '~/components/ui/ColorWheel';
import { cn } from '~/lib/utils';

export interface SmartEnhancementConfig {
  // Auto Enhancement
  autoExposure: boolean;
  autoContrast: boolean;
  autoSaturation: boolean;
  noiseReduction: boolean;
  sharpening: 'none' | 'subtle' | 'medium' | 'strong';
  whiteBalance: 'auto' | 'manual';
  
  // Manual Controls
  exposure: number;
  contrast: number;
  vibrance: number;
  saturation: number;
  temperature: number;
  tint: number;
  
  // Color Grading
  shadows: { hue: number; saturation: number; lightness: number };
  midtones: { hue: number; saturation: number; lightness: number };
  highlights: { hue: number; saturation: number; lightness: number };
  
  // Film Effects
  filmGrain: number;
  vignette: number;
  
  // Preset
  preset: 'auto' | 'cinematic' | 'vintage' | 'modern' | 'warm' | 'cool' | 'custom';
}

const DEFAULT_CONFIG: SmartEnhancementConfig = {
  autoExposure: true,
  autoContrast: true,
  autoSaturation: true,
  noiseReduction: false,
  sharpening: 'subtle',
  whiteBalance: 'auto',
  
  exposure: 0,
  contrast: 0,
  vibrance: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  
  shadows: { hue: 220, saturation: 15, lightness: 25 },
  midtones: { hue: 30, saturation: 20, lightness: 50 },
  highlights: { hue: 45, saturation: 10, lightness: 75 },
  
  filmGrain: 0,
  vignette: 0,
  
  preset: 'auto'
};

const PRESETS: Record<string, Partial<SmartEnhancementConfig>> = {
  auto: {
    autoExposure: true,
    autoContrast: true,
    autoSaturation: true,
    preset: 'auto'
  },
  cinematic: {
    autoExposure: false,
    contrast: 0.2,
    vibrance: 0.1,
    shadows: { hue: 220, saturation: 25, lightness: 20 },
    midtones: { hue: 30, saturation: 15, lightness: 50 },
    highlights: { hue: 45, saturation: 10, lightness: 80 },
    temperature: -100,
    vignette: 0.15,
    preset: 'cinematic'
  },
  vintage: {
    autoExposure: false,
    contrast: -0.1,
    saturation: -0.2,
    temperature: 200,
    filmGrain: 0.3,
    vignette: 0.2,
    shadows: { hue: 30, saturation: 30, lightness: 30 },
    preset: 'vintage'
  },
  warm: {
    autoExposure: true,
    autoContrast: true,
    temperature: 300,
    tint: 50,
    vibrance: 0.15,
    preset: 'warm'
  },
  cool: {
    autoExposure: true,
    autoContrast: true,
    temperature: -300,
    tint: -50,
    saturation: 0.1,
    preset: 'cool'
  }
};

interface SmartEnhancementProps {
  config: SmartEnhancementConfig;
  onConfigChange: (config: SmartEnhancementConfig) => void;
  className?: string;
}

export function SmartEnhancement({ config, onConfigChange, className }: SmartEnhancementProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'manual' | 'color' | 'effects'>('auto');

  const handlePresetChange = useCallback((preset: string) => {
    const presetConfig = PRESETS[preset];
    if (presetConfig) {
      onConfigChange({ ...config, ...presetConfig });
    }
  }, [config, onConfigChange]);

  const handleReset = useCallback(() => {
    onConfigChange(DEFAULT_CONFIG);
  }, [onConfigChange]);

  const updateConfig = useCallback((updates: Partial<SmartEnhancementConfig>) => {
    onConfigChange({ ...config, ...updates, preset: 'custom' });
  }, [config, onConfigChange]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Smart Enhancement
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 h-7"
          >
            <Settings className="w-3 h-3 mr-1" />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 h-7"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {Object.keys(PRESETS).map((preset) => (
          <Button
            key={preset}
            onClick={() => handlePresetChange(preset)}
            variant={config.preset === preset ? "default" : "outline"}
            size="sm"
            className={cn(
              "capitalize text-xs px-2 py-1 h-7",
              config.preset === preset && "bg-purple-600 hover:bg-purple-700"
            )}
          >
            <Wand2 className="w-2 h-2 mr-1" />
            {preset}
          </Button>
        ))}
      </div>

      {!showAdvanced ? (
        /* Simple Mode */
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={config.autoExposure}
                onChange={(e) => updateConfig({ autoExposure: e.target.checked })}
                className="w-3 h-3 text-purple-600"
              />
              <span className="text-xs font-medium">Auto Exposure</span>
            </label>
            
            <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={config.autoContrast}
                onChange={(e) => updateConfig({ autoContrast: e.target.checked })}
                className="w-3 h-3 text-purple-600"
              />
              <span className="text-xs font-medium">Auto Contrast</span>
            </label>
            
            <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={config.autoSaturation}
                onChange={(e) => updateConfig({ autoSaturation: e.target.checked })}
                className="w-3 h-3 text-purple-600"
              />
              <span className="text-xs font-medium">Smart Colors</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">Sharpening</label>
            <select
              value={config.sharpening}
              onChange={(e) => updateConfig({ sharpening: e.target.value as any })}
              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="none">None</option>
              <option value="subtle">Subtle</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      ) : (
        /* Advanced Mode */
        <div className="space-y-3">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
            {[
              { id: 'auto', label: 'Auto', icon: Wand2 },
              { id: 'manual', label: 'Manual', icon: Settings },
              { id: 'color', label: 'Color', icon: Eye },
              { id: 'effects', label: 'Effects', icon: Sparkles }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  "flex items-center px-2 py-1 text-xs font-medium rounded transition-colors flex-1 justify-center",
                  activeTab === id
                    ? "bg-white dark:bg-gray-700 text-purple-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-64 overflow-y-auto">
            {activeTab === 'auto' && (
              <div className="space-y-3 p-2">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'autoExposure', label: 'Auto Exposure' },
                    { key: 'autoContrast', label: 'Auto Contrast' },
                    { key: 'autoSaturation', label: 'Smart Colors' },
                    { key: 'noiseReduction', label: 'Noise Reduction' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="checkbox"
                        checked={config[key as keyof SmartEnhancementConfig] as boolean}
                        onChange={(e) => updateConfig({ [key]: e.target.checked })}
                        className="w-3 h-3 text-purple-600"
                      />
                      <span className="text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Sharpening</label>
                    <select
                      value={config.sharpening}
                      onChange={(e) => updateConfig({ sharpening: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="none">None</option>
                      <option value="subtle">Subtle</option>
                      <option value="medium">Medium</option>
                      <option value="strong">Strong</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">White Balance</label>
                    <select
                      value={config.whiteBalance}
                      onChange={(e) => updateConfig({ whiteBalance: e.target.value as any })}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="auto">Auto</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="space-y-3 p-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Exposure</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={config.exposure}
                      onChange={(e) => updateConfig({ exposure: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.exposure.toFixed(1)} EV</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Contrast</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={config.contrast}
                      onChange={(e) => updateConfig({ contrast: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.contrast.toFixed(2)}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Vibrance</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={config.vibrance}
                      onChange={(e) => updateConfig({ vibrance: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.vibrance.toFixed(2)}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Saturation</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={config.saturation}
                      onChange={(e) => updateConfig({ saturation: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.saturation.toFixed(2)}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Temperature</label>
                    <input
                      type="range"
                      min="-1000"
                      max="1000"
                      step="50"
                      value={config.temperature}
                      onChange={(e) => updateConfig({ temperature: parseInt(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.temperature}K</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Tint</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="5"
                      value={config.tint}
                      onChange={(e) => updateConfig({ tint: parseInt(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{config.tint}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'color' && (
              <div className="space-y-3 p-2">
                <div className="grid grid-cols-3 gap-2">
                  <ColorWheel
                    label="Shadows"
                    value={config.shadows}
                    onChange={(value) => updateConfig({ shadows: value })}
                    size={60}
                  />
                  
                  <ColorWheel
                    label="Midtones"
                    value={config.midtones}
                    onChange={(value) => updateConfig({ midtones: value })}
                    size={60}
                  />
                  
                  <ColorWheel
                    label="Highlights"
                    value={config.highlights}
                    onChange={(value) => updateConfig({ highlights: value })}
                    size={60}
                  />
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-3 p-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Film Grain</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.filmGrain}
                      onChange={(e) => updateConfig({ filmGrain: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{(config.filmGrain * 100).toFixed(0)}%</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Vignette</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.vignette}
                      onChange={(e) => updateConfig({ vignette: parseFloat(e.target.value) })}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-500 text-center">{(config.vignette * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded p-2 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center text-purple-700 dark:text-purple-300 text-xs">
          <Eye className="w-3 h-3 mr-1" />
          <span>
            {config.preset !== 'custom' 
              ? `${config.preset} preset active` 
              : 'Custom settings'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface ColorPickerProps {
  value?: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
}

const CURATED_PALETTE = [
  { name: 'Orange KanbanEx', hex: '#FF7A00' },
  { name: 'Flamme Intense', hex: '#FF4500' },
  { name: 'Ambre Doré', hex: '#F59E0B' },
  { name: 'Émeraude Vif', hex: '#10B981' },
  { name: 'Cyan Océan', hex: '#06B6D4' },
  { name: 'Bleu Cobalt', hex: '#3B82F6' },
  { name: 'Indigo Nuit', hex: '#6366F1' },
  { name: 'Violet Royal', hex: '#8B5CF6' },
  { name: 'Rose Magenta', hex: '#EC4899' },
  { name: 'Rouge Corail', hex: '#EF4444' },
  { name: 'Turquoise', hex: '#14B8A6' },
  { name: 'Ardoise Sobre', hex: '#64748B' },
];

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function ColorPicker({
  value = '#FF7A00',
  onChange,
  label,
  className = '',
  disabled = false,
  align = 'left',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleSelectPreset = (hex: string) => {
    onChange(hex);
    setHexInput(hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith('#') && raw.length > 0) {
      raw = `#${raw}`;
    }
    setHexInput(raw);
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
      onChange(raw.toUpperCase());
    }
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value, 10);
    const newHex = hslToHex(hue, 95, 50);
    onChange(newHex);
    setHexInput(newHex);
  };

  const currentColor = value || '#FF7A00';

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Modern Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-11 px-3 flex items-center justify-between bg-slate-100/90 dark:bg-[#12151C] border rounded-xl transition-all select-none ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white dark:bg-[#161B24]'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Color Preview Swatch */}
          <span
            className="w-6 h-6 rounded-lg shrink-0 shadow-xs border border-black/10 dark:border-white/10 transition-transform"
            style={{ backgroundColor: currentColor }}
          />
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentColor}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </button>

      {/* Popover Color Palette */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-64 p-3.5 rounded-2xl bg-white/95 dark:bg-[#131720]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in space-y-3.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              Nuances recommandées
            </span>
            <span
              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
              style={{ backgroundColor: currentColor }}
            />
          </div>

          {/* Curated Grid Swatches */}
          <div className="grid grid-cols-4 gap-2">
            {CURATED_PALETTE.map((item) => {
              const isSelected = currentColor.toUpperCase() === item.hex.toUpperCase();
              return (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() => handleSelectPreset(item.hex)}
                  title={item.name}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-[#131720] scale-105 shadow-md'
                      : 'hover:scale-105 border border-black/5 dark:border-white/5'
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 text-white drop-shadow-md stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Continuous Spectrum Slider */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Spectre chromatique
            </label>
            <div className="relative h-4 w-full rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <input
                type="range"
                min="0"
                max="360"
                defaultValue="28"
                onChange={handleHueChange}
                className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
              />
              <div
                className="w-full h-full pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>
          </div>

          {/* Hex Input Field */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Code Hexadécimal
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={7}
                  value={hexInput}
                  onChange={handleHexInputChange}
                  placeholder="#FF7A00"
                  className="w-full px-3 py-1.5 bg-slate-100 dark:bg-[#181D26] border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

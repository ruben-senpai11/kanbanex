'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  colorDot?: string;
  description?: string;
}

export interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  error?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Sélectionner...',
  className = '',
  disabled = false,
  id,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      {/* Modern Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-11 px-3.5 flex items-center justify-between bg-slate-100/90 dark:bg-[#12151C] border rounded-xl text-sm transition-all select-none text-left ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white dark:bg-[#161B24]'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          error ? 'border-rose-500 ring-1 ring-rose-500/30' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedOption?.colorDot && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: selectedOption.colorDot }}
            />
          )}
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={`truncate font-medium ${
              selectedOption
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </button>

      {/* Popover Options Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full z-50 p-1.5 rounded-2xl bg-white/95 dark:bg-[#131720]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 flex items-center justify-between text-left rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {option.colorDot && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: option.colorDot }}
                    />
                  )}
                  {option.icon && (
                    <span className="shrink-0 opacity-80">{option.icon}</span>
                  )}
                  <span className="truncate">{option.label}</span>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

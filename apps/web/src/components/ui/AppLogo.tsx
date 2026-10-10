'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  imgClassName?: string;
  withText?: boolean;
  textClassName?: string;
  priority?: boolean;
  variant?: 'emblem' | 'full';
}

const SIZE_MAP = {
  xs: { dim: 20, container: 'w-5 h-5', text: 'text-xs' },
  sm: { dim: 28, container: 'w-7 h-7', text: 'text-sm' },
  md: { dim: 34, container: 'w-8.5 h-8.5', text: 'text-base' },
  lg: { dim: 48, container: 'w-12 h-12', text: 'text-xl' },
  xl: { dim: 64, container: 'w-16 h-16', text: 'text-2xl' },
  '2xl': { dim: 96, container: 'w-24 h-24', text: 'text-4xl' },
};

/**
 * Premium Atomic AppLogo for KanbanEx.
 * Renders the pure stylized 3D K emblem with ultra-clean transparency,
 * accompanied by adaptive high-contrast brand typography that automatically
 * harmonizes across Light and Dark themes.
 */
export function AppLogo({
  size = 'md',
  className = '',
  imgClassName = '',
  withText = false,
  textClassName = '',
  priority = true,
  variant = 'emblem',
}: AppLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimension = typeof size === 'number' ? size : SIZE_MAP[size].dim;
  const containerClass = typeof size === 'number'
    ? `w-[${size}px] h-[${size}px]`
    : SIZE_MAP[size].container;
  const defaultTextSize = typeof size === 'number' ? 'text-base' : SIZE_MAP[size].text;

  // Ultra-clean transparent PNG emblem
  const emblemSrc = dimension <= 48 ? '/images/kanbanex-logo-small.png' : '/images/kanbanex-logo.png';

  // Variant "full": renders the complete official SVG logo with adaptive light/dark theme
  if (variant === 'full') {
    const fullWidth = typeof size === 'number' ? size * 4 : dimension * 4;
    const fullHeight = typeof size === 'number' ? size : dimension;

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        {/* Dark mode full logo (white text + golden-orange K + gradient Ex) */}
        <div className="hidden dark:block">
          <Image
            src="/images/kanbanex-logo-dark.svg"
            alt="KanbanEx"
            width={fullWidth}
            height={fullHeight}
            className={`h-auto max-h-full object-contain ${imgClassName}`}
            priority={priority}
            unoptimized={true}
          />
        </div>
        {/* Light mode full logo (dark slate text + golden-orange K + gradient Ex) */}
        <div className="block dark:hidden">
          <Image
            src="/images/kanbanex-logo-light.svg"
            alt="KanbanEx"
            width={fullWidth}
            height={fullHeight}
            className={`h-auto max-h-full object-contain ${imgClassName}`}
            priority={priority}
            unoptimized={true}
          />
        </div>
      </div>
    );
  }

  // Variant "emblem" (Default Atomic Design): Emblem + Adaptive text
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Pure Floating 3D K Ribbon Emblem */}
      <div
        className={`${containerClass} flex items-center justify-center shrink-0 relative select-none`}
        style={typeof size === 'number' ? { width: dimension, height: dimension } : undefined}
      >
        {!imageError ? (
          <Image
            src={emblemSrc}
            alt="KanbanEx Emblem"
            width={dimension}
            height={dimension}
            className={`w-full h-full object-contain drop-shadow-xs transition-transform ${imgClassName}`}
            priority={priority}
            unoptimized={true}
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          /* High-Fidelity SVG Fallback Ribbon Emblem */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="kanbanex-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE94A" />
                <stop offset="45%" stopColor="#FF9D00" />
                <stop offset="100%" stopColor="#FF3B08" />
              </linearGradient>
              <linearGradient id="kanbanex-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="50%" stopColor="#FF9D00" />
                <stop offset="100%" stopColor="#D93800" />
              </linearGradient>
            </defs>
            <path
              d="M24 16 L40 16 L40 84 L24 84 Z"
              fill="url(#kanbanex-grad-1)"
              rx="2"
            />
            <path
              d="M40 54 L68 18 L84 18 L54 58 Z"
              fill="url(#kanbanex-grad-2)"
            />
            <path
              d="M44 48 L84 84 L68 84 L36 54 Z"
              fill="url(#kanbanex-grad-1)"
            />
          </svg>
        )}
      </div>

      {/* Adaptive Brand Name Text: High contrast in both Light & Dark themes */}
      {withText && (
        <span
          className={`font-black tracking-tight text-slate-900 dark:text-white flex items-center select-none transition-colors ${
            textClassName || defaultTextSize
          }`}
        >
          Kanban<span className="app-logo-accent font-black">Ex</span>
        </span>
      )}
    </div>
  );
}


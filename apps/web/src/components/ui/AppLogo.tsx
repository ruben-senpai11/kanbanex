'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  imgClassName?: string;
  withText?: boolean;
  textClassName?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { dim: 20, container: 'w-5 h-5' },
  sm: { dim: 28, container: 'w-7 h-7' },
  md: { dim: 32, container: 'w-8 h-8' },
  lg: { dim: 48, container: 'w-12 h-12' },
  xl: { dim: 64, container: 'w-16 h-16' },
  '2xl': { dim: 96, container: 'w-24 h-24' },
};

/**
 * Premium AppLogo for KanbanEx.
 * Renders the pure stylized 3D K emblem without any container background box,
 * directly followed by the brand name "KanbanEx".
 */
export function AppLogo({
  size = 'md',
  className = '',
  imgClassName = '',
  withText = false,
  textClassName = '',
  priority = true,
}: AppLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimension = typeof size === 'number' ? size : SIZE_MAP[size].dim;
  const containerClass = typeof size === 'number'
    ? `w-[${size}px] h-[${size}px]`
    : SIZE_MAP[size].container;

  // Ultra-clean transparent PNG emblem (no background container)
  const logoSrc = dimension <= 48 ? '/images/kanbanex-logo-small.png' : '/images/kanbanex-logo.png';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Pure Floating K Emblem with zero background box */}
      <div
        className={`${containerClass} flex items-center justify-center shrink-0 relative select-none`}
        style={typeof size === 'number' ? { width: dimension, height: dimension } : undefined}
      >
        {!imageError ? (
          <Image
            src={logoSrc}
            alt="KanbanEx"
            width={dimension}
            height={dimension}
            className={`w-full h-full object-contain ${imgClassName}`}
            priority={priority}
            unoptimized={true}
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          /* High-Fidelity SVG Fallback Emblem (Glowing Orange/Amber stylized K without dark container) */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="kanbanex-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="45%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="kanbanex-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            {/* Pure floating K emblem without background box */}
            <path
              d="M26 18 L40 18 L40 82 L26 82 Z"
              fill="url(#kanbanex-grad-1)"
            />
            <path
              d="M40 52 L64 20 L80 20 L52 56 Z"
              fill="url(#kanbanex-grad-2)"
            />
            <path
              d="M44 48 L80 82 L64 82 L36 54 Z"
              fill="url(#kanbanex-grad-1)"
            />
          </svg>
        )}
      </div>

      {withText && (
        <span
          className={`font-black tracking-tight text-slate-900 dark:text-white flex items-center select-none ${textClassName || 'text-base'}`}
        >
          Kanban<span className="app-logo-accent text-[#FF7A00]">Ex</span>
        </span>
      )}
    </div>
  );
}

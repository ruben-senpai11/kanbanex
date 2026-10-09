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
  xs: { dim: 20, container: 'w-5 h-5 rounded-md' },
  sm: { dim: 28, container: 'w-7 h-7 rounded-lg' },
  md: { dim: 32, container: 'w-8 h-8 rounded-xl' },
  lg: { dim: 48, container: 'w-12 h-12 rounded-2xl' },
  xl: { dim: 64, container: 'w-16 h-16 rounded-2xl' },
  '2xl': { dim: 96, container: 'w-24 h-24 rounded-3xl' },
};

/**
 * Bulletproof, high-fidelity AppLogo for KabanEx.
 * Always renders crisp, never breaks (includes an embedded SVG fallback if network asset fails).
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
    ? `w-[${size}px] h-[${size}px] rounded-xl`
    : SIZE_MAP[size].container;

  // Use the optimized PNG variant for blazing speed and universal browser compatibility
  const logoSrc = dimension <= 48 ? '/images/kabanex-logo-small.png' : '/images/kabanex-logo.png';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${containerClass} overflow-hidden border border-amber-500/40 shadow-md bg-black flex items-center justify-center shrink-0 relative select-none`}
        style={typeof size === 'number' ? { width: dimension, height: dimension } : undefined}
      >
        {!imageError ? (
          <Image
            src={logoSrc}
            alt="KabanEx"
            width={dimension}
            height={dimension}
            className={`w-full h-full object-cover ${imgClassName}`}
            priority={priority}
            unoptimized={true} // Bypasses Next image proxy to guarantee 100% direct static asset loading
            onError={() => {
              // Try fallback to JPG first, or SVG if already tried
              setImageError(true);
            }}
          />
        ) : (
          /* High-Fidelity SVG Fallback Emblem (Glowing Orange/Amber stylized 3D K) */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="kabanex-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="45%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="kabanex-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            {/* Dark background */}
            <rect width="100" height="100" rx="20" fill="#0A0D12" />
            {/* Stylized K Stem */}
            <path
              d="M32 24 L44 24 L44 76 L32 76 Z"
              fill="url(#kabanex-grad-1)"
            />
            {/* Upper diagonal arm */}
            <path
              d="M44 52 L62 26 L76 26 L54 55 Z"
              fill="url(#kabanex-grad-2)"
            />
            {/* Lower diagonal arm */}
            <path
              d="M48 48 L76 76 L62 76 L40 54 Z"
              fill="url(#kabanex-grad-1)"
            />
          </svg>
        )}
      </div>

      {withText && (
        <span
          className={`font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center ${textClassName || 'text-sm'}`}
        >
          Kaban<span className="text-orange-500">Ex</span>
        </span>
      )}
    </div>
  );
}

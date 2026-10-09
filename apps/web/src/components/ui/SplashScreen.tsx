'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  forceShow?: boolean;
  onFinish?: () => void;
  durationMs?: number;
}

export function SplashScreen({
  forceShow = false,
  onFinish,
  durationMs = 1800,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session storage so splashscreen only displays once per session (unless forceShow is true)
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('kabanex_splash_seen');
      if (alreadyShown && !forceShow) {
        return;
      }
      setIsVisible(true);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(currentProgress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [forceShow, durationMs]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kabanex_splash_seen', 'true');
    }
    setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black select-none transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="KabanEx SplashScreen"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Background Layers: Responsive Mobile (Img 2) vs Desktop (Img 3) */}
      {/* Mobile Splashscreen: 9:16 Portrait Image */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/images/kabanex-mobile.jpg"
          alt="KabanEx Mobile Splashscreen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Desktop Splashscreen: 16:9 Landscape Image */}
      <div className="hidden md:block absolute inset-0 -z-10">
        <Image
          src="/images/kabanex-desktop.jpg"
          alt="KabanEx Desktop Splashscreen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
      </div>

      {/* Top Header with Skip Button */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 shadow-md bg-black shrink-0">
            <Image
              src="/images/kabanex-logo.jpg"
              alt="Logo KabanEx"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-extrabold tracking-tight text-sm drop-shadow-md">
            Kaban<span className="text-orange-500">Ex</span>
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="px-3 py-1 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          Passer
        </button>
      </div>

      {/* Center Desktop Brand Callout (Mobile already has tagline in the artwork, desktop highlights brand) */}
      <div className="hidden md:flex relative z-10 flex-col items-center text-center px-6 my-auto">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/50 shadow-2xl shadow-orange-950/80 mb-4 bg-black animate-fade-in">
          <Image
            src="/images/kabanex-logo.jpg"
            alt="KabanEx Official Brand"
            width={80}
            height={80}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-lg">
          Bienvenue sur Kaban<span className="text-orange-500">Ex</span>
        </h1>
        <p className="mt-2 text-sm text-amber-200/90 font-medium tracking-wide drop-shadow">
          Vos projets. Une seule vision.
        </p>
      </div>

      {/* Bottom Progress Bar & Loading State */}
      <div className="relative z-10 p-6 md:p-8 max-w-md w-full mx-auto space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-amber-200/90 drop-shadow">
          <span>Initialisation de l&apos;espace de travail...</span>
          <span className="font-mono">{progress}%</span>
        </div>

        {/* Golden Glowing Progress Bar */}
        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-xs border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 rounded-full shadow-[0_0_12px_rgba(255,140,0,0.8)] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
          Écosystème Expansion
        </p>
      </div>
    </div>
  );
}

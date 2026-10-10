'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CINEMATIC_THEMES, ProjectTheme, getThemeById } from './themes';

export type ThemeMode = 'system' | 'light' | 'dark';

function getLuminance(hex: string): number {
  try {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  } catch {
    return 0.5;
  }
}

function hexToRgba(hex: string, alpha: number): string {
  try {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(255, 122, 0, ${alpha})`;
  }
}

function adjustBrightness(hex: string, percent: number): string {
  try {
    const clean = hex.replace('#', '');
    let r = parseInt(clean.substring(0, 2), 16);
    let g = parseInt(clean.substring(2, 4), 16);
    let b = parseInt(clean.substring(4, 6), 16);
    r = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
    g = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
    b = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

interface PreferencesContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  primaryContrast: string;
  overviewBackground: string;
  setOverviewBackground: (themeId: string) => void;
  resolvedTheme: 'light' | 'dark';
  currentOverviewTheme: ProjectTheme;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [primaryColor, setPrimaryColorState] = useState<string>('#FF7A00'); // Default Orange
  const [overviewBackground, setOverviewBackgroundState] = useState<string>('gradient-orange-chaud');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Load persisted preferences on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedMode = (localStorage.getItem('kanbanex_theme_mode') || localStorage.getItem('kabanex_theme_mode')) as ThemeMode || 'light';
    const savedColor = localStorage.getItem('kanbanex_primary_color') || localStorage.getItem('kabanex_primary_color') || '#FF7A00';
    let savedBg = localStorage.getItem('kanbanex_overview_bg') || localStorage.getItem('kabanex_overview_bg') || 'gradient-orange-chaud';
    if (savedBg === 'kabanex-horizon' || savedBg === 'kanbanex-horizon') {
      savedBg = 'gradient-orange-chaud';
    }

    setThemeModeState(savedMode);
    setPrimaryColorState(savedColor);
    setOverviewBackgroundState(savedBg);
  }, []);

  // Handle system vs light vs dark
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      let isDark = true;
      if (themeMode === 'system') {
        isDark = mediaQuery.matches;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        isDark = true;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    updateResolvedTheme();

    const listener = () => {
      if (themeMode === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  // Handle primary color CSS variable & dynamic contrast
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-hover', adjustBrightness(primaryColor, -12));
    root.style.setProperty('--primary-light', hexToRgba(primaryColor, 0.15));
    root.style.setProperty('--primary-border', hexToRgba(primaryColor, 0.4));
    const contrastText = getLuminance(primaryColor) > 0.45 ? '#0F172A' : '#FFFFFF';
    root.style.setProperty('--primary-contrast', contrastText);

    const isCustom = primaryColor.toLowerCase() !== '#ff7a00';
    root.dataset.customPrimary = isCustom ? 'true' : 'false';
  }, [primaryColor]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanbanex_theme_mode', mode);
    }
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanbanex_primary_color', color);
    }
  };

  const setOverviewBackground = (bgId: string) => {
    setOverviewBackgroundState(bgId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanbanex_overview_bg', bgId);
    }
  };

  const currentOverviewTheme = getThemeById(overviewBackground);
  const primaryContrast = getLuminance(primaryColor) > 0.45 ? '#0F172A' : '#FFFFFF';

  return (
    <PreferencesContext.Provider
      value={{
        themeMode,
        setThemeMode,
        primaryColor,
        setPrimaryColor,
        primaryContrast,
        overviewBackground,
        setOverviewBackground,
        resolvedTheme,
        currentOverviewTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CINEMATIC_THEMES, ProjectTheme, getThemeById } from './themes';

export type ThemeMode = 'system' | 'light' | 'dark';

interface PreferencesContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  overviewBackground: string;
  setOverviewBackground: (themeId: string) => void;
  resolvedTheme: 'light' | 'dark';
  currentOverviewTheme: ProjectTheme;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [primaryColor, setPrimaryColorState] = useState<string>('#FF7A00'); // Default Orange
  const [overviewBackground, setOverviewBackgroundState] = useState<string>('kanbanex-horizon');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // Load persisted preferences on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedMode = (localStorage.getItem('kanbanex_theme_mode') || localStorage.getItem('kabanex_theme_mode')) as ThemeMode || 'system';
    const savedColor = localStorage.getItem('kanbanex_primary_color') || localStorage.getItem('kabanex_primary_color') || '#FF7A00';
    let savedBg = localStorage.getItem('kanbanex_overview_bg') || localStorage.getItem('kabanex_overview_bg') || 'kanbanex-horizon';
    if (savedBg === 'kabanex-horizon') savedBg = 'kanbanex-horizon';

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

  // Handle primary color CSS variable
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
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

  return (
    <PreferencesContext.Provider
      value={{
        themeMode,
        setThemeMode,
        primaryColor,
        setPrimaryColor,
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

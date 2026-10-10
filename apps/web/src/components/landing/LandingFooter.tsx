'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp, Sun, Moon } from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { usePreferences } from '@/lib/preferences-context';

export function LandingFooter() {
  const { resolvedTheme, setThemeMode } = usePreferences();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-black/80 backdrop-blur-2xl text-slate-600 dark:text-slate-400 text-xs py-12 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div>
              <AppLogo size="md" withText textClassName="font-black text-base text-slate-900 dark:text-white justify-center sm:justify-start" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Vos projets. Une seule vision.</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <Link href="/legal/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Conditions Générales (CGU)
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/legal/mentions" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Mentions Légales
            </Link>
          </div>

          {/* Right Actions: Theme Switcher & Scroll to top */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Icon Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/15 hover:border-orange-500 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all text-xs bg-white/70 dark:bg-white/5 shadow-2xs"
              title={resolvedTheme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thème clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Thème sombre</span>
                </>
              )}
            </button>

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs bg-white/70 dark:bg-white/5"
              title="Revenir en haut"
            >
              <span>Haut de page</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-[11px] text-slate-500 dark:text-slate-500">
          <p>© 2026 KanbanEx. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu pour la haute productivité et l&apos;orchestration agile
          </p>
        </div>
      </div>
    </footer>
  );
}

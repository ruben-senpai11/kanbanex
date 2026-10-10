'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WifiOff, Wifi, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaContextType {
  isOffline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  installApp: () => Promise<void>;
}

const PwaContext = createContext<PwaContextType>({
  isOffline: false,
  isInstallable: false,
  isInstalled: false,
  installApp: async () => {},
});

export function usePwa() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // 1. Service Worker registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[KanbanEx PWA] Service Worker registered with scope:', registration.scope);

            // Handle service worker updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[KanbanEx PWA] Nouvelle version prête.');
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('[KanbanEx PWA] Registration error:', error);
          });
      });
    }
  }, []);

  // 2. Realtime Online / Offline listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnectedBanner(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnectedBanner(true);
      const timer = setTimeout(() => setShowReconnectedBanner(false), 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // 3. PWA Install Prompt handling (Desktop Chrome/Edge & Android)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if app is already running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user previously dismissed banner in current session
      const dismissed = sessionStorage.getItem('kanbanex_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      console.log('[KanbanEx PWA] Application installée avec succès !');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (err) {
      console.error('[KanbanEx PWA] Install prompt error:', err);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('kanbanex_install_dismissed', 'true');
  };

  return (
    <PwaContext.Provider
      value={{
        isOffline,
        isInstallable: !!deferredPrompt,
        isInstalled,
        installApp,
      }}
    >
      {children}

      {/* 1. Offline Floating Indicator */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/95 text-slate-950 font-semibold text-xs shadow-xl backdrop-blur-md border border-amber-300 animate-in fade-in slide-in-from-top duration-300 pointer-events-auto"
        >
          <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
          <span>Mode Hors-Ligne — Vos données locales restent consultables.</span>
        </aside>
      )}

      {/* 2. Reconnected Floating Indicator */}
      {!isOffline && showReconnectedBanner && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-600/95 text-white font-semibold text-xs shadow-xl backdrop-blur-md border border-emerald-400 animate-in fade-in slide-in-from-top duration-300 pointer-events-auto"
        >
          <Wifi className="w-4 h-4 shrink-0 text-white" />
          <span>Connexion rétablie — Synchronisation active.</span>
        </aside>
      )}

      {/* 3. Install App Floating Prompt for Desktop and Mobile */}
      {showInstallBanner && deferredPrompt && !isInstalled && (
        <aside
          aria-label="Installation de l'application"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9990] max-w-sm w-[calc(100vw-2rem)] p-4 rounded-2xl bg-white dark:bg-[#12161E] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center text-white shrink-0 shadow-md">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold">Installer KanbanEx</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Accès instantané &amp; utilisation fluide même hors-ligne
                </p>
              </div>
            </div>
            <button
              onClick={dismissInstallBanner}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={installApp}
              size="sm"
              className="flex-1 bg-gradient-warm text-white font-bold h-9 text-xs rounded-xl shadow-md shadow-brand-500/20"
            >
              Installer maintenant
            </Button>
            <Button
              onClick={dismissInstallBanner}
              variant="ghost"
              size="sm"
              className="h-9 text-xs rounded-xl text-slate-500 dark:text-slate-400"
            >
              Plus tard
            </Button>
          </div>
        </aside>
      )}
    </PwaContext.Provider>
  );
}

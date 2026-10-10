'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Layers, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = '/overview';
      } else {
        setIsChecking(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D11] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center">
        {/* App Logo */}
        <div className="mb-6">
          <AppLogo variant="full" size="lg" />
        </div>

        {/* Offline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-6">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Hors-Ligne (PWA)</span>
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Vous êtes actuellement hors-ligne
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Pas d&apos;inquiétude ! KanbanEx fonctionne même sans connexion Internet. Vos tableaux, projets et tâches déjà ouverts restent consultables sur votre appareil.
        </p>

        {/* Status Checklist Card */}
        <div className="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-8 text-left shadow-sm backdrop-blur-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5">
            État des services locaux
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Cache applicatif PWA
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Actif</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Tableaux &amp; Projets récents
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Consultables</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Synchronisation serveur
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {isOnline ? 'Rétablie' : 'En attente'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleRetry}
            disabled={isChecking}
            className="flex-1 bg-gradient-warm text-white font-bold h-11 rounded-xl shadow-lg shadow-brand-500/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Test en cours...' : 'Vérifier la connexion'}
          </Button>

          <Link href="/overview" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold text-xs sm:text-sm"
            >
              <Layers className="w-4 h-4 mr-2 text-brand-500" />
              Ouvrir mes projets
            </Button>
          </Link>
        </div>

        {/* Footer Hint */}
        <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
          Dès que votre connexion sera rétablie, l&apos;application se synchronisera automatiquement en arrière-plan.
        </p>
      </div>
    </div>
  );
}

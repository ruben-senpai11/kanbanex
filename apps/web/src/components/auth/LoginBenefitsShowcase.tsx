'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Wallpaper,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Star,
  Users,
  Kanban,
  Zap,
} from 'lucide-react';

interface BenefitItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string };
  icon: React.ElementType;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'kanban-fullscreen',
    badge: 'EXPÉRIENCE VISUELLE',
    title: 'Interface Kanban Pure & Plein Écran',
    subtitle: 'Zéro barre latérale encombrante, 100% de concentration.',
    description:
      'Libérez toute la largeur de votre écran. Vos colonnes de tâches respirent avec des contrastes travaillés, des badges d’état clairs et un sentiment de clarté absolue dès la première seconde.',
    stats: { label: 'Espace utile libéré', value: '+35%' },
    icon: Kanban,
  },
  {
    id: 'cinematic-wallpaper',
    badge: 'ATMOSPHÈRE SIGNATURE',
    title: 'Arrière-Plans Cinématiques & Inspirants',
    subtitle: 'Lever de soleil 16:9 cinématographique & responsive 9:16 mobile.',
    description:
      'Vos projets méritent une esthétique d’exception. Profitez de nos panoramas signature au lever du soleil ou personnalisez le fond de chaque tableau selon vos envies.',
    stats: { label: 'Rendu panoramique', value: '16:9 / 9:16' },
    icon: Wallpaper,
  },
  {
    id: 'gantt-timelines',
    badge: 'PILOTAGE STRATÉGIQUE',
    title: 'Gantt Interactif & Jalons en Temps Réel',
    subtitle: 'Anticipez chaque livraison avec une fluidité déconcertante.',
    description:
      'Passez du tableau à la chronologie temporelle en un clin d’œil. Alignez vos équipes, surveillez les dépendances et sécurisez vos dates d’échéance sans friction.',
    stats: { label: 'Vélocité constatée', value: '+42%' },
    icon: TrendingUp,
  },
  {
    id: 'dock-multiview',
    badge: 'ERGONOMIE COMPACTE',
    title: 'Mini-Dock Inférieur & Multi-Vues',
    subtitle: 'Navigation instantanée sans latence ni rechargement.',
    description:
      'Inspiré des meilleurs outils de productivité au monde, notre dock flottant inférieur rétractable vous permet de basculer entre Kanban, Gantt et Calendrier d’un simple clic.',
    stats: { label: 'Temps de bascule', value: '< 50ms' },
    icon: Layers,
  },
];

export function LoginBenefitsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeBenefit = BENEFITS[activeIndex];
  const DURATION_MS = 5000;

  // Auto-slide ticker
  useEffect(() => {
    if (isPaused) return;

    const tickInterval = 50;
    const increment = (tickInterval / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % BENEFITS.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const handleSelectBenefit = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? BENEFITS.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % BENEFITS.length);
    setProgress(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-full w-full flex flex-col justify-between p-6 sm:p-8 xl:p-12 overflow-hidden select-none bg-[#090C10] text-white"
    >
      {/* 1. Cinematic Background Artwork */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/kanbanex-desktop.jpg"
          alt="KanbanEx Horizon Artwork"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Dramatic Atmospheric Overlays for Ultra-High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-black/55 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70" />

        {/* Ambient Glowing Energy Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 left-12 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="tracking-wide uppercase text-[11px] font-black">
            Plateforme KanbanEx 2026
          </span>
        </div>

        {/* Controls: Prev / Pause / Next */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/15">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Bénéfice précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title={isPaused ? 'Reprendre la rotation' : 'Mettre en pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Bénéfice suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Center Interactive Benefit Showcase Area */}
      <div className="relative z-10 my-auto py-6 space-y-6">
        {/* Dynamic Badge & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-orange-400 uppercase">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>{activeBenefit.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {activeBenefit.title}
          </h2>

          <p className="text-sm xl:text-base text-amber-100/90 font-medium max-w-xl leading-relaxed drop-shadow-sm">
            {activeBenefit.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {activeBenefit.description}
          </p>
        </div>

        {/* Dynamic Interactive Widget Box (Animated Live Previews) */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4 hover:border-orange-500/40 transition-colors">
          {/* TAB 0 PREVIEW: Live Kanban Simulation */}
          {activeIndex === 0 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Kanban className="w-3.5 h-3.5 text-orange-400" />
                  Tableau Sprint Actif • Vue Plein Écran
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ● 12 tâches en cours
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {/* Col 1 */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>À faire</span>
                    <span className="text-slate-500">3</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-[11px] font-semibold text-slate-200 shadow-xs">
                    Déploiement Vercel
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-[11px] font-semibold text-slate-200 shadow-xs">
                    Audit Performance
                  </div>
                </div>

                {/* Col 2 - Active Card */}
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-orange-300">
                    <span>En cours</span>
                    <span className="text-orange-400">2</span>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 text-[11px] font-bold text-white shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>Refonte KanbanEx</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                {/* Col 3 */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Terminé</span>
                    <span className="text-emerald-400 font-bold">8</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 line-through opacity-80 flex items-center justify-between">
                    <span>Branding 3D K</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 line-through opacity-80 flex items-center justify-between">
                    <span>Auth Argon2id</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1 PREVIEW: Cinematic Wallpapers */}
          {activeIndex === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Wallpaper className="w-3.5 h-3.5 text-amber-400" />
                  Ambiance Panoramique & Haute Résolution
                </span>
                <span className="text-[11px] text-amber-300 font-semibold">
                  100% Adaptatif Desktop & Mobile
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-orange-950/70 to-amber-900/40 border border-orange-500/40 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Format Desktop 16:9
                  </p>
                  <p className="text-[11px] text-amber-200/80">
                    Vue cinématique grand angle pour les postes de travail et écrans 4K.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-tr from-slate-900/80 to-black/60 border border-white/15 space-y-1">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Format Mobile 9:16
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Adaptation portrait immersive pour smartphones et tablettes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 PREVIEW: Gantt Timelines */}
          {activeIndex === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Chronologie Gantt & Vélocité
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Octobre 2026 • Sprint 4
                </span>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Jalon 1 • Architecture Workspace</span>
                    <span className="text-emerald-400 font-bold">100% Terminé</span>
                  </div>
                  <div className="h-4 w-full bg-black/40 rounded-md overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Jalon 2 • Expérience Trello & Dock</span>
                    <span className="text-orange-400 font-bold">92% En cours</span>
                  </div>
                  <div className="h-4 w-full bg-black/40 rounded-md overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 PREVIEW: Bottom Dock Multi-Views */}
          {activeIndex === 3 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Mini-Dock Inférieur Épuré
                </span>
                <span className="text-[11px] text-sky-300 font-bold">
                  Bascule instantanée
                </span>
              </div>

              <div className="flex items-center justify-center p-3 rounded-xl bg-black/50 border border-white/10">
                <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/15 shadow-xl">
                  <div className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                    <Kanban className="w-3 h-3" />
                    <span>Tableau</span>
                  </div>
                  <div className="px-3 py-1 rounded-full hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Gantt</span>
                  </div>
                  <div className="px-3 py-1 rounded-full hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    <span>Calendrier</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-400">{activeBenefit.stats.label}</span>
            <span className="font-mono font-black text-amber-300 text-sm">
              {activeBenefit.stats.value}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Interactive Stepper Navigation & Social Proof */}
      <div className="relative z-10 space-y-4">
        {/* 4 Clickable Benefit Steppers with Live Progress Indicators */}
        <div className="grid grid-cols-4 gap-2">
          {BENEFITS.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            const ItemIcon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectBenefit(idx)}
                className={`text-left p-2.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white/15 border-orange-500/80 shadow-lg'
                    : 'bg-black/30 border-white/10 hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ItemIcon
                    className={`w-3.5 h-3.5 ${
                      isCurrent ? 'text-orange-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <p className="text-[11px] font-bold text-white truncate">
                  {item.title.split('&')[0]}
                </p>

                {/* Progress Line */}
                <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                        : 'bg-transparent'
                    }`}
                    style={{
                      width: isCurrent ? `${progress}%` : '0%',
                      transition: isCurrent ? 'width 50ms linear' : 'none',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Testimonial / Trust Seal */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 border border-black flex items-center justify-center text-[9px] font-bold text-white">
                AL
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 border border-black flex items-center justify-center text-[9px] font-bold text-white">
                SO
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 border border-black flex items-center justify-center text-[9px] font-bold text-white">
                MK
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300">
              Adopté par les équipes agiles & créateurs
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white text-[11px]">4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

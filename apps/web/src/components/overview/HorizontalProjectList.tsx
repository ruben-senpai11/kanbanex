'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProjectCard, ProjectOverviewData } from './ProjectCard';
import { ChevronLeft, ChevronRight, Plus, Sparkles, FolderPlus, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { animatePanoramicEntrance } from '@/lib/animations';
import { usePreferences } from '@/lib/preferences-context';

interface HorizontalProjectListProps {
  projects: ProjectOverviewData[];
  isLoading?: boolean;
  onOpenNewProject: () => void;
  onOpenThemeSelector: (projectId: string) => void;
  onStartOnboarding?: () => void;
}

export function HorizontalProjectList({
  projects,
  isLoading = false,
  onOpenNewProject,
  onOpenThemeSelector,
  onStartOnboarding,
}: HorizontalProjectListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentOverviewTheme, resolvedTheme } = usePreferences();
  const isDark = currentOverviewTheme.isDark ?? (resolvedTheme === 'dark');

  // Drag-to-scroll state with inertia
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  // Arrow visibility states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollBounds = () => {
    if (!containerRef.current) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(sl > 10);
    setCanScrollRight(sl < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollBounds();
    const handleResize = () => checkScrollBounds();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [projects, isLoading]);

  // Trigger GSAP Staggered Entrance on Projects Loaded
  useEffect(() => {
    if (!isLoading && projects.length > 0 && containerRef.current) {
      animatePanoramicEntrance(containerRef.current);
    }
  }, [isLoading, projects.length]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    setVelocity(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeft - walk;

    // Track velocity for natural inertia
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 10) {
      const dx = e.pageX - lastX.current;
      setVelocity(dx / dt);
      lastX.current = e.pageX;
      lastTime.current = now;
    }

    checkScrollBounds();
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown || !containerRef.current) return;
    setIsMouseDown(false);

    // Apply natural smooth inertia
    if (Math.abs(velocity) > 0.2) {
      const momentumDistance = velocity * 260;
      containerRef.current.scrollBy({
        left: -momentumDistance,
        behavior: 'smooth',
      });
    }
  };

  // Wheel horizontal navigation support
  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    if (e.deltaY !== 0 && !e.shiftKey) {
      containerRef.current.scrollLeft += e.deltaY * 0.8;
      checkScrollBounds();
    }
  };

  // Floating arrows scroll
  const scrollByAmount = (amount: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: amount,
      behavior: 'smooth',
    });
    setTimeout(checkScrollBounds, 300);
  };

  // 1. Shimmer Skeleton Loading State
  if (isLoading) {
    return (
      <div className="relative w-full flex-1 flex flex-col h-full min-h-0 select-none">
        <div className="horizontal-scroll-container flex-1 flex items-stretch gap-6 px-6 md:px-10 py-6 overflow-x-auto overflow-y-hidden">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    );
  }

  // 2. Zero Dummy Data: True Empty State
  if (projects.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        {/* Monochromatic icon box: white/slate according to theme, NO orange */}
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative interactive-scale ${
            isDark
              ? 'bg-white/10 border border-white/20 text-white'
              : 'bg-slate-900/10 border border-slate-900/20 text-slate-900'
          }`}
        >
          <FolderPlus className={`w-10 h-10 ${isDark ? 'text-white' : 'text-slate-900'}`} />
          <div
            className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${
              isDark
                ? 'bg-white border-black shadow-sm'
                : 'bg-slate-900 border-white shadow-sm'
            }`}
          />
        </div>

        <h3
          className={`text-2xl font-black tracking-tight ${
            isDark ? 'text-white drop-shadow-md' : 'text-slate-950 drop-shadow-xs'
          }`}
        >
          Aucun projet pour le moment
        </h3>
        <p
          className={`text-sm max-w-md mt-2 mb-8 leading-relaxed font-medium ${
            isDark ? 'text-slate-300 drop-shadow-xs' : 'text-slate-700'
          }`}
        >
          Bienvenue dans votre espace KanbanEx. Donnez vie à vos idées en créant votre premier projet ou découvrez l&apos;onboarding guidé.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main button: White in dark mode, Black in light mode. Zero orange! */}
          <button
            onClick={onOpenNewProject}
            className={`inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-bold shadow-xl transition-all interactive-scale active:scale-95 border ${
              isDark
                ? 'bg-white text-slate-950 hover:bg-slate-100 border-white/30'
                : 'bg-slate-950 text-white hover:bg-slate-900 border-slate-800'
            }`}
          >
            <Plus className={`w-5 h-5 mr-2 stroke-[2.5] ${isDark ? 'text-slate-950' : 'text-white'}`} />
            <span>Créer mon premier projet</span>
          </button>

          {onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className={`inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all backdrop-blur-md border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  : 'bg-slate-900/10 hover:bg-slate-900/15 text-slate-900 border-slate-900/15'
              }`}
            >
              <Compass className="w-4 h-4 mr-2" />
              <span>Guide d&apos;onboarding</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Real Loaded Panoramic Experience with GSAP & Inertia
  return (
    <div className="relative w-full flex-1 flex flex-col h-full min-h-0 select-none">
      {/* Floating Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-400)}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border ${
            isDark
              ? 'bg-black/80 hover:bg-black border-slate-700/80 text-white'
              : 'bg-white/90 hover:bg-white border-slate-300 text-slate-900'
          }`}
          title="Faire défiler vers la gauche"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Floating Right Navigation Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(400)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border ${
            isDark
              ? 'bg-black/80 hover:bg-black border-slate-700/80 text-white'
              : 'bg-white/90 hover:bg-white border-slate-300 text-slate-900'
          }`}
          title="Faire défiler vers la droite"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Horizontal Scroller Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        onScroll={checkScrollBounds}
        className={`horizontal-scroll-container flex-1 flex items-stretch gap-6 px-6 md:px-10 py-6 overflow-x-auto overflow-y-hidden ${
          isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpenThemeSelector={onOpenThemeSelector}
          />
        ))}

        {/* Append "+ Créer un projet" End Card */}
        <div
          onClick={onOpenNewProject}
          className={`w-[280px] shrink-0 h-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all cursor-pointer p-8 text-center group interactive-scale select-none shadow-xl backdrop-blur-md ${
            isDark
              ? 'border-white/20 hover:border-white/50 bg-black/25 hover:bg-black/40'
              : 'border-slate-300/80 hover:border-slate-700/80 bg-white/40 hover:bg-white/80'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all shadow-md group-hover:scale-110 mb-4 ${
              isDark
                ? 'bg-white/15 border-white/25 text-white group-hover:bg-white group-hover:text-black'
                : 'bg-slate-900/10 border-slate-900/20 text-slate-900 group-hover:bg-slate-950 group-hover:text-white'
            }`}
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h4
            className={`text-base font-bold transition-colors drop-shadow-sm ${
              isDark ? 'text-white group-hover:text-white' : 'text-slate-950 group-hover:text-black'
            }`}
          >
            Nouveau Projet
          </h4>
          <p
            className={`text-xs mt-1 max-w-[200px] leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Développez votre univers avec un nouveau projet
          </p>
        </div>
      </div>
    </div>
  );
}

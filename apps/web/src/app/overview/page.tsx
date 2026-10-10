'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { usePreferences } from '@/lib/preferences-context';
import { useClickOutside } from '@/hooks/useClickOutside';
import { HorizontalProjectList } from '@/components/overview/HorizontalProjectList';
import { CreateProjectModal } from '@/components/overview/CreateProjectModal';
import { ThemeSelectorModal } from '@/components/overview/ThemeSelectorModal';
import { OverviewCustomizationModal } from '@/components/overview/OverviewCustomizationModal';
import { PlanModal } from '@/components/overview/PlanModal';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { OnboardingWizardModal } from '@/components/onboarding/OnboardingWizardModal';
import { AppLogo } from '@/components/ui/AppLogo';
import {
  Plus,
  Search,
  ChevronDown,
  LogOut,
  CreditCard,
  Palette,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OverviewPage() {
  const router = useRouter();
  const { user, currentWorkspace, workspaces, setCurrentWorkspace, logout, isLoading: isAuthLoading } = useAuth();
  const { currentOverviewTheme, overviewBackground, resolvedTheme, primaryColor, primaryContrast } = usePreferences();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [themeModalProjectId, setThemeModalProjectId] = useState<string | null>(null);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const wsDropdownRef = useRef<HTMLDivElement>(null);

  // Close workspace dropdown when clicking outside
  useClickOutside(wsDropdownRef, () => setIsWsDropdownOpen(false));

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadProjects = async () => {
    if (!currentWorkspace) return;
    setIsLoading(true);
    try {
      const data = await api.getProjectsOverview(currentWorkspace.id);
      const list = data || [];
      setProjects(list);
      // Classic onboarding flow for new accounts without projects
      if (
        list.length === 0 &&
        typeof window !== 'undefined' &&
        !localStorage.getItem('kanbanex_onboarding_completed')
      ) {
        setIsOnboardingOpen(true);
      }
    } catch (err) {
      console.error('Failed to load projects overview', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
      return;
    }
    if (currentWorkspace) {
      loadProjects();
    }
  }, [currentWorkspace, user, isAuthLoading]);

  const handleCreateProject = async (data: any) => {
    if (!currentWorkspace) return;
    const res = await api.createProject(currentWorkspace.id, data);
    await loadProjects();
    if (res?.id) {
      router.push(`/projects/${res.id}`);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    if (!currentWorkspace) return;
    const res = await api.createProject(currentWorkspace.id, data);
    await loadProjects();
    if (res?.id) {
      router.push(`/projects/${res.id}`);
    }
  };

  const handleSaveTheme = async (projectId: string, themeId: string, customColor: string) => {
    await api.updateTheme(projectId, {
      backgroundTheme: themeId,
      customColor,
    });
    await loadProjects();
  };

  const currentThemeProject = projects.find((p) => p.id === themeModalProjectId);
  const workspaceTitle = currentWorkspace?.name || "Ma Vision de l'Avenir";

  const isOverviewDark = currentOverviewTheme.isDark ?? (resolvedTheme === 'dark');
  const isCustomPrimary = primaryColor.toLowerCase() !== '#ff7a00';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between overflow-hidden relative select-none transition-colors duration-300 ${
        currentOverviewTheme.backgroundClass
      }`}
      style={currentOverviewTheme.backgroundStyle}
    >
      {/* 1. Responsive Wallpaper Layer (Desktop: Img 3 / Mobile: Img 2 by default) */}
      {currentOverviewTheme.isWallpaper && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {/* Mobile Wallpaper: 9:16 Portrait */}
          <div
            className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/images/kanbanex-mobile.jpg')` }}
          />
          {/* Desktop Wallpaper: 16:9 Landscape */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/images/kanbanex-desktop.jpg')` }}
          />
          {/* Atmospheric Contrast Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
        </div>
      )}

      {/* 2. Top Header (Minimalist & Clean: Workspace Title on Left, Add Project on Right) */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between shrink-0 relative z-30">
        {/* Top-Left: Workspace Title with KanbanEx Emblem & Switcher */}
        <div className="flex items-center gap-3">
          <AppLogo size="md" priority />

          <div ref={wsDropdownRef} className="relative">
            <button
              onClick={() => workspaces.length > 1 && setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="flex items-center gap-2 group text-left"
            >
              <h1
                className={`text-xl md:text-2xl font-black tracking-tight truncate max-w-[280px] md:max-w-md ${
                  isOverviewDark ? 'text-white drop-shadow-md' : 'text-slate-950 drop-shadow-xs'
                }`}
              >
                {workspaceTitle}
              </h1>
              {workspaces.length > 1 && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOverviewDark ? 'text-white/70 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-950'
                  }`}
                />
              )}
            </button>

            {/* Dropdown if multiple workspaces */}
            {isWsDropdownOpen && workspaces.length > 1 && (
              <div
                className="absolute left-0 mt-2 w-60 bg-white dark:bg-[#12151C] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-slate-800 dark:text-slate-200"
                onClick={() => setIsWsDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Mes espaces de travail
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.id === currentWorkspace?.id && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top-Right: Quick Search & "+ Créer un projet" Primary Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors hidden sm:flex items-center gap-2 text-xs font-medium border ${
              isOverviewDark
                ? 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border-white/10'
                : 'bg-slate-900/10 hover:bg-slate-900/15 text-slate-900 border-slate-900/15'
            }`}
            title="Recherche rapide (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Rechercher</span>
            <kbd
              className={`hidden md:inline px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isOverviewDark ? 'bg-white/20 text-white/90' : 'bg-slate-900/15 text-slate-900'
              }`}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Plus Button: Monochromatic White/Black based on light/dark theme, or custom primary if selected */}
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className={`flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-xl font-bold shadow-lg text-xs md:text-sm active:scale-95 transition-all select-none border ${
              isCustomPrimary
                ? 'shadow-md border-transparent'
                : isOverviewDark
                ? 'bg-white text-slate-950 hover:bg-slate-100 border-white/30 shadow-white/10'
                : 'bg-slate-950 text-white hover:bg-slate-900 border-slate-800 shadow-slate-900/20'
            }`}
            style={
              isCustomPrimary
                ? {
                    backgroundColor: primaryColor,
                    color: primaryContrast,
                  }
                : undefined
            }
          >
            <Plus
              className={`w-4 h-4 stroke-[2.5] ${
                isCustomPrimary
                  ? ''
                  : isOverviewDark
                  ? 'text-slate-950'
                  : 'text-white'
              }`}
              style={isCustomPrimary ? { color: primaryContrast } : undefined}
            />
            <span>Créer un projet</span>
          </button>
        </div>
      </header>

      {/* 3. Main Body (~90% Screen Height): Panoramic Project Cards (Zero Dummy Data) */}
      <main className="flex-1 flex flex-col justify-center overflow-hidden relative z-20 py-2">
        <HorizontalProjectList
          projects={projects}
          isLoading={isLoading}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenThemeSelector={(pId) => setThemeModalProjectId(pId)}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
        />
      </main>

      {/* 4. Mini Footer: Me déconnecter, Mon Plan/Abonnement, Personnalisation */}
      <footer className="h-16 px-4 md:px-8 pb-3 flex items-center justify-center shrink-0 relative z-30">
        <div
          className={`flex items-center gap-1.5 md:gap-3 p-1.5 rounded-full backdrop-blur-xl shadow-2xl transition-all border ${
            isOverviewDark
              ? 'bg-black/60 hover:bg-black/75 border-white/15 text-white/90'
              : 'bg-white/90 hover:bg-white border-slate-300 text-slate-900 shadow-xl'
          }`}
        >
          {/* Action 1: Me déconnecter */}
          <button
            onClick={() => logout()}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isOverviewDark
                ? 'text-slate-300 hover:text-rose-400 hover:bg-white/15'
                : 'text-slate-700 hover:text-rose-600 hover:bg-slate-900/10'
            }`}
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Me déconnecter</span>
          </button>

          <div className={`w-px h-4 ${isOverviewDark ? 'bg-white/20' : 'bg-slate-300'}`} />

          {/* Action 2: Mon Plan / Abonnement */}
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isOverviewDark
                ? 'text-slate-300 hover:text-white hover:bg-white/15'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-900/10'
            }`}
            title="Consulter mon abonnement et mes formules"
          >
            <CreditCard className={`w-3.5 h-3.5 ${isOverviewDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>Mon Plan / Abonnement</span>
          </button>

          <div className={`w-px h-4 ${isOverviewDark ? 'bg-white/20' : 'bg-slate-300'}`} />

          {/* Action 3: Personnalisation */}
          <button
            onClick={() => setIsCustomizationOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isOverviewDark
                ? 'text-slate-300 hover:text-white hover:bg-white/15'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-900/10'
            }`}
            title="Changer l'arrière-plan de l'overview, la couleur primaire et le thème"
          >
            <Palette
              className="w-3.5 h-3.5"
              style={{ color: isCustomPrimary ? primaryColor : isOverviewDark ? '#FFFFFF' : '#0F172A' }}
            />
            <span>Personnalisation</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        workspaceName={workspaceTitle}
      />

      <CreateProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      <ThemeSelectorModal
        isOpen={!!themeModalProjectId}
        onClose={() => setThemeModalProjectId(null)}
        projectId={themeModalProjectId}
        initialThemeId={currentThemeProject?.backgroundTheme}
        initialColor={currentThemeProject?.customColor}
        onSaveTheme={handleSaveTheme}
      />

      <OverviewCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

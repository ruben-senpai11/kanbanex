'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { HorizontalProjectList } from '@/components/overview/HorizontalProjectList';
import { CreateProjectModal } from '@/components/overview/CreateProjectModal';
import { ThemeSelectorModal } from '@/components/overview/ThemeSelectorModal';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { Plus, Sparkles, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OverviewPage() {
  const router = useRouter();
  const { user, currentWorkspace, isLoading: isAuthLoading } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [themeModalProjectId, setThemeModalProjectId] = useState<string | null>(null);

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
      setProjects(data);
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
    await api.createProject(currentWorkspace.id, data);
    await loadProjects();
  };

  const handleSaveTheme = async (projectId: string, themeId: string, customColor: string) => {
    await api.updateTheme(projectId, {
      backgroundTheme: themeId,
      customColor,
    });
    await loadProjects();
  };

  const currentThemeProject = projects.find((p) => p.id === themeModalProjectId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
      <AppHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          projects={projects.map((p) => ({ id: p.id, name: p.name, customColor: p.customColor }))}
        />

        {/* Main Overview Canvas (Gradient & Light Background) */}
        <main className="flex-1 flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-orange-50/20 relative">
          {/* Subtle Ambient Warm Glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-40 bg-orange-500/5 blur-3xl pointer-events-none" />

          {/* Panoramic Page Header */}
          <div className="px-6 md:px-10 pt-6 pb-2 shrink-0 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Univers de Projets
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Tous mes projets
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsNewProjectOpen(true)}
                className="brand-glow shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nouveau Projet
              </Button>
            </div>
          </div>

          {/* Panoramic Horizontal Projects List with Inertia, GSAP & Shimmer Skeletons */}
          <HorizontalProjectList
            projects={projects}
            isLoading={isLoading}
            onOpenNewProject={() => setIsNewProjectOpen(true)}
            onOpenThemeSelector={(pId) => setThemeModalProjectId(pId)}
          />
        </main>
      </div>

      {/* Modals */}
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

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

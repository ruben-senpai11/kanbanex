'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { AppLogo } from '@/components/ui/AppLogo';
import { useAuth } from '@/lib/auth-context';
import { useClickOutside } from '@/hooks/useClickOutside';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import {
  ChevronDown,
  Filter,
  Palette,
  Share2,
  Bell,
  Check,
  LogOut,
  CreditCard,
  User as UserIcon,
  Crown,
  Plus,
  Zap,
} from 'lucide-react';

interface BoardSubHeaderProps {
  projectName: string;
  projectId: string;
  projectPriority?: string;
  allProjects?: Array<{ id: string; name: string; customColor?: string }>;
  onSelectProject?: (projectId: string) => void;
  onOpenNewProject?: () => void;
  members?: Array<{ id: string; fullName: string; avatarUrl?: string }>;
  onOpenFilter?: () => void;
  activeFilterCount?: number;
  onOpenThemeModal?: () => void;
  onOpenPlanModal?: () => void;
  isDarkTheme?: boolean;
}

export function BoardSubHeader({
  projectName,
  projectId,
  projectPriority,
  allProjects = [],
  onSelectProject,
  onOpenNewProject,
  members = [],
  onOpenFilter,
  activeFilterCount = 0,
  onOpenThemeModal,
  onOpenPlanModal,
  isDarkTheme = false,
}: BoardSubHeaderProps) {
  const { user, logout } = useAuth();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [copiedShare, setCopiedShare] = useState(false);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsAnchorRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useClickOutside(projectDropdownRef, () => setIsProjectDropdownOpen(false));
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const textPrimary = isDarkTheme ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkTheme ? 'text-slate-300' : 'text-slate-700';
  const btnHover = isDarkTheme
    ? 'hover:bg-white/10 text-white'
    : 'hover:bg-slate-200/70 text-slate-800';
  const bgGlass = isDarkTheme
    ? 'bg-black/35 backdrop-blur-md border-white/10'
    : 'bg-white/80 backdrop-blur-md border-slate-200/70';

  return (
    <header
      className={`h-12 px-3 md:px-4 border-b flex items-center justify-between shrink-0 select-none transition-colors relative z-40 ${bgGlass}`}
    >
      {/* ========================================================================= */}
      {/* GAUCHE : LOGO KANBANEX + SÉPARATEUR + CHANGER DE TABLEAU                  */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Logo officiel KanbanEx (Icône K + Nom KanbanEx) */}
        <Link
          href="/overview"
          className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
          title="Retour à l'aperçu de tous les projets"
        >
          <AppLogo size="sm" withText textClassName={`text-sm font-black ${textPrimary}`} />
        </Link>

        {/* Separator */}
        <div className={`h-4 w-px ${isDarkTheme ? 'bg-white/20' : 'bg-slate-300'}`} />

        {/* Project Selector Dropdown with Click-Outside handler */}
        <div ref={projectDropdownRef} className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-tight transition-colors ${btnHover}`}
            title="Changer de projet"
          >
            <span className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-[320px]">
              {projectName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                isProjectDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isProjectDropdownOpen && (
            <div
              className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-[#12151C] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-slate-800 dark:text-slate-200"
              onClick={() => setIsProjectDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Mes Projets
              </div>
              <div className="max-h-60 overflow-y-auto">
                {allProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProject?.(p.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${
                      p.id === projectId
                        ? 'font-bold bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: p.customColor || '#FF7A00' }}
                      />
                      <span className="truncate">{p.name}</span>
                    </div>
                    {p.id === projectId && (
                      <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Action: Ajouter un projet */}
              <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProjectDropdownOpen(false);
                    onOpenNewProject?.();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 flex items-center gap-2 transition-colors rounded-b-xl"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Ajouter un projet</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* The One Thing badge */}
        {projectPriority === 'URGENT' && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400/60 text-amber-500 dark:text-amber-300 shadow-xs">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>The One Thing</span>
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DROITE : PASSER À L'OFFRE PRO + NOTIFICATIONS + FILTRES + THÈME + AVATAR  */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* 1. Passer à l'offre Éclosion */}
        {onOpenPlanModal && (
          <button
            onClick={onOpenPlanModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all shadow-xs active:scale-95"
            title="Consulter les formules et passer au plan Éclosion"
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Passer à l&apos;offre Éclosion</span>
            <span className="sm:hidden">Éclosion</span>
          </button>
        )}

        {/* 2. Notifications System (Frontend + Backend) */}
        <div ref={notificationsAnchorRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-1.5 rounded-lg transition-colors relative ${btnHover}`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-black" />
            )}
          </button>

          <NotificationsPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onUnreadCountChange={(c) => setUnreadCount(c)}
          />
        </div>

        {/* 3. Filtres */}
        {onOpenFilter && (
          <button
            onClick={onOpenFilter}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${btnHover}`}
            title="Filtrer les tâches"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Filtres</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* 4. Thème / Palette */}
        {onOpenThemeModal && (
          <button
            onClick={onOpenThemeModal}
            className={`p-1.5 rounded-lg transition-colors ${btnHover}`}
            title="Personnaliser l'univers visuel de ce projet"
          >
            <Palette className="w-4 h-4" />
          </button>
        )}

        {/* 5. Partager le tableau (Copie propre du lien) */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            copiedShare
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : btnHover
          }`}
          title="Copier le lien d'accès au tableau"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {copiedShare ? 'Copié !' : 'Partager'}
          </span>
        </button>

        {/* 6. Avatar Utilisateur & Menu Déroulant (avec Click-Outside) */}
        <div ref={userMenuRef} className="relative ml-1">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm"
            title={user?.fullName || 'Mon profil'}
          >
            {user?.fullName?.slice(0, 2).toUpperCase() || 'U'}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/10 shadow-2xl py-1.5 z-50 animate-fade-in text-slate-800 dark:text-slate-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.fullName || 'Utilisateur'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || ''}
                </p>
              </div>

              {onOpenPlanModal && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenPlanModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mon Plan / Abonnement</span>
                </button>
              )}

              <Link
                href="/overview"
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Tous mes projets</span>
              </Link>

              <div className="border-t border-slate-100 dark:border-white/5 my-1" />

              <button
                onClick={() => logout()}
                className="w-full text-left px-3 py-2 text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Me déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

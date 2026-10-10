'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useClickOutside } from '@/hooks/useClickOutside';
import { AppLogo } from '@/components/ui/AppLogo';
import {
  Search,
  Bell,
  Plus,
  HelpCircle,
  Grid,
  ChevronDown,
  Layers,
  LogOut,
  Shield,
  CreditCard,
  User as UserIcon,
  Megaphone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AppHeaderProps {
  onOpenSearch?: () => void;
  onOpenNewProject?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export function AppHeader({
  onOpenSearch,
  onOpenNewProject,
  onOpenNotifications,
  unreadCount = 0,
}: AppHeaderProps) {
  const { user, currentWorkspace, workspaces, setCurrentWorkspace, logout } = useAuth();
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const wsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(wsRef, () => setIsWsOpen(false));
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  return (
    <header className="h-12 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#1D2125]/90 backdrop-blur-md sticky top-0 z-40 px-3 md:px-4 flex items-center justify-between shadow-xs">
      {/* Left: 9-dots App Launcher, Logo & Workspace Switcher */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* 9-dots app grid launcher */}
        <button
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          title="Écosystème Expansion"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Brand */}
        <Link href="/projects/current" className="flex items-center gap-2 group">
          <AppLogo size="sm" withText textClassName="group-hover:opacity-90 transition-opacity" />
        </Link>

        {/* Workspace Dropdown */}
        {currentWorkspace && (
          <div ref={wsRef} className="relative ml-1">
            <button
              onClick={() => setIsWsOpen(!isWsOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span className="max-w-[120px] truncate">{currentWorkspace.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

            {isWsOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-fade-in text-slate-800 dark:text-slate-200"
                onClick={() => setIsWsOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Espaces de travail
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.id === currentWorkspace.id && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center: Prominent Trello-style Search input */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 w-full rounded-lg bg-slate-100/90 dark:bg-[#22272B] hover:bg-slate-200/80 dark:hover:bg-[#282E33] border border-slate-200/60 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs text-slate-500 dark:text-slate-400 cursor-pointer transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
          <span className="flex-1 truncate">Rechercher</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-[#1D2125] text-[10px] text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right Actions: + Créer, Notification Bell, Help, User Avatar */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* + Créer button (Trello style) */}
        {onOpenNewProject && (
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-warm hover:brightness-105 text-white text-xs font-semibold shadow-xs interactive-scale transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer</span>
          </button>
        )}

        {/* Megaphone / Announcements (Trello style) */}
        <button
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors hidden sm:block"
          title="Nouveautés & Annonces"
        >
          <Megaphone className="w-4 h-4" />
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          title="Notifications & Activité"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          )}
        </button>

        {/* Help Icon */}
        <button
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          title="Aide & Raccourcis"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar (Circle with initials & online indicator) */}
        {user && (
          <div ref={userMenuRef} className="relative ml-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center focus:outline-none"
              title={user.fullName}
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs border-2 border-white hover:scale-105 transition-transform">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-2xs" />
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-fade-in text-slate-800 dark:text-slate-200"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  {user.role === 'SUPER_ADMIN' && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                      Super Admin
                    </span>
                  )}
                </div>

                <Link
                  href="/overview"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  Tous mes projets
                </Link>

                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  Abonnement & Facturation
                </Link>

                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-medium"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    Console Super Admin
                  </Link>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

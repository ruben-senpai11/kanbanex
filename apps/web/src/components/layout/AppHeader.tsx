'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
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

  return (
    <header className="h-12 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-3 md:px-4 flex items-center justify-between shadow-xs">
      {/* Left: 9-dots App Launcher, Logo & Workspace Switcher */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* 9-dots app grid launcher */}
        <button
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Écosystème Expansion"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Brand */}
        <Link href="/projects/current" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-orange-500/30 shadow-xs group-hover:scale-105 transition-transform bg-black flex items-center justify-center shrink-0">
            <Image
              src="/images/kabanex-logo.jpg"
              alt="KabanEx"
              width={28}
              height={28}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center">
            Kaban<span className="text-orange-500">Ex</span>
          </span>
        </Link>

        {/* Workspace Dropdown */}
        {currentWorkspace && (
          <div className="relative ml-1">
            <button
              onClick={() => setIsWsOpen(!isWsOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span className="max-w-[120px] truncate">{currentWorkspace.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isWsOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in"
                onClick={() => setIsWsOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Espaces de travail
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-800 hover:bg-slate-100 flex items-center justify-between"
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
          className="flex items-center gap-2.5 px-3 py-1.5 w-full rounded-lg bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/60 hover:border-slate-300 text-xs text-slate-500 cursor-pointer transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex-1 truncate">Rechercher</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 border border-slate-200 shadow-2xs font-mono">
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

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications & Activité"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          )}
        </button>

        {/* Help Icon */}
        <button
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Aide & Raccourcis"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar (Circle with initials) */}
        {user && (
          <div className="relative ml-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center focus:outline-none"
              title={user.fullName}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs border-2 border-white hover:scale-105 transition-transform">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  {user.role === 'SUPER_ADMIN' && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                      Super Admin
                    </span>
                  )}
                </div>

                <Link
                  href="/overview"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  Tous mes projets
                </Link>

                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  Abonnement & Facturation
                </Link>

                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50 font-medium"
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    Console Super Admin
                  </Link>
                )}

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
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

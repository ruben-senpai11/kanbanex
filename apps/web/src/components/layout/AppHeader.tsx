'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Bell,
  Plus,
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
}

export function AppHeader({ onOpenSearch, onOpenNewProject }: AppHeaderProps) {
  const { user, currentWorkspace, workspaces, setCurrentWorkspace, logout } = useAuth();
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B0D11]/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Workspace Switcher */}
      <div className="flex items-center gap-6">
        <Link href="/overview" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md shadow-orange-950/50 group-hover:scale-105 transition-transform">
            EX
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Kanban<span className="text-orange-500">EX</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase -mt-1">
              Expansion
            </span>
          </div>
        </Link>

        {/* Workspace Dropdown */}
        {currentWorkspace && (
          <div className="relative">
            <button
              onClick={() => setIsWsOpen(!isWsOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#15181F] hover:bg-[#1C2029] border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span className="max-w-[130px] truncate">{currentWorkspace.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isWsOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-[#12151C] border border-slate-700/80 rounded-xl shadow-xl py-1 z-40 animate-fade-in"
                onClick={() => setIsWsOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Espaces de travail
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/60 flex items-center justify-between"
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.id === currentWorkspace.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Quick Search Trigger */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-4 py-2 w-72 rounded-xl bg-[#12151C] hover:bg-[#181D26] border border-slate-800 text-xs text-slate-400 transition-colors justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Rechercher projets, tâches...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {onOpenNewProject && (
          <Button
            size="sm"
            onClick={onOpenNewProject}
            className="hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouveau Projet
          </Button>
        )}

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center font-bold text-white text-xs shadow">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-[#12151C] border border-slate-700/80 rounded-xl shadow-xl py-1 z-40 animate-fade-in"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  {user.role === 'SUPER_ADMIN' && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-950/70 text-amber-300 border border-amber-800/60 font-semibold">
                      Super Admin
                    </span>
                  )}
                </div>

                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800/60"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Abonnement & Facturation
                </Link>

                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-amber-300 hover:bg-amber-950/30 font-medium"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    Console Super Admin
                  </Link>
                )}

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/20"
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

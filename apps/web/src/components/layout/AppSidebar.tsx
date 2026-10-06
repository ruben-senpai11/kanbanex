'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  onOpenNewProject?: () => void;
  projects?: Array<{ id: string; name: string; customColor?: string }>;
}

export function AppSidebar({ onOpenNewProject, projects = [] }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, currentWorkspace } = useAuth();

  const navItems = [
    {
      label: 'Tous mes projets',
      href: '/overview',
      icon: LayoutDashboard,
      active: pathname === '/overview',
    },
    {
      label: 'Calendrier global',
      href: '/calendar',
      icon: Calendar,
      active: pathname === '/calendar',
    },
    {
      label: 'Abonnement & Plans',
      href: '/billing',
      icon: CreditCard,
      active: pathname === '/billing',
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-800/80 bg-[#0B0D11] transition-all duration-300 z-20 select-none',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  item.active
                    ? 'bg-gradient-warm-subtle text-orange-400 border border-orange-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#15181F]'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    item.active ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Super Admin Link */}
          {user?.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                pathname === '/admin'
                  ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/20'
              )}
              title={collapsed ? 'Super Admin' : undefined}
            >
              <Shield className="w-4 h-4 shrink-0 text-amber-400" />
              {!collapsed && <span>Super Admin</span>}
            </Link>
          )}
        </div>

        {/* Workspace Projects Quick List */}
        {!collapsed && (
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Projets</span>
              {onOpenNewProject && (
                <button
                  onClick={onOpenNewProject}
                  className="p-1 rounded text-slate-400 hover:text-orange-400 hover:bg-slate-800/60 transition-colors"
                  title="Créer un projet"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-0.5">
              {projects.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-slate-500 italic">
                  Aucun projet actif.
                </p>
              ) : (
                projects.map((p) => {
                  const isActive = pathname === `/projects/${p.id}`;
                  return (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors truncate',
                        isActive
                          ? 'bg-[#181D26] text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#12151C]'
                      )}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.customColor || '#F97316' }}
                      />
                      <span className="truncate">{p.name}</span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
        {!collapsed && currentWorkspace?.subscription?.plan && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-orange-950/60 text-orange-400 border border-orange-800/50">
              Plan {currentWorkspace.subscription.plan.name}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ml-auto"
          title={collapsed ? 'Agrandir la barre latérale' : 'Réduire'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}

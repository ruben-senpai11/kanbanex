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
        'hidden md:flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 z-20 select-none text-slate-700',
        collapsed ? 'w-16' : 'w-60'
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
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group',
                  item.active
                    ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    item.active ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'
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
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all group',
                pathname === '/admin'
                  ? 'bg-amber-100/70 text-amber-900 border border-amber-300 shadow-2xs'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
              )}
              title={collapsed ? 'Super Admin' : undefined}
            >
              <Shield className="w-4 h-4 shrink-0 text-amber-600" />
              {!collapsed && <span>Super Admin</span>}
            </Link>
          )}
        </div>

        {/* Workspace Projects Quick List */}
        {!collapsed && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Mes Tableaux</span>
              {onOpenNewProject && (
                <button
                  onClick={onOpenNewProject}
                  className="p-1 rounded text-slate-400 hover:text-orange-600 hover:bg-slate-100 transition-colors"
                  title="Créer un tableau"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-0.5">
              {projects.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-slate-400 italic">
                  Aucun tableau actif.
                </p>
              ) : (
                projects.map((p) => {
                  const isActive = pathname === `/projects/${p.id}`;
                  return (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors truncate',
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      )}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
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
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!collapsed && currentWorkspace?.subscription?.plan && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
              Plan {currentWorkspace.subscription.plan.name}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
          title={collapsed ? 'Agrandir la barre latérale' : 'Réduire'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}

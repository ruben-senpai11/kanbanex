'use client';

import React, { useState } from 'react';
import {
  Star,
  Zap,
  Filter,
  Share2,
  MoreHorizontal,
  ChevronDown,
  Palette,
  Check,
  UserPlus,
  Users,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';

interface BoardSubHeaderProps {
  projectName: string;
  projectId: string;
  allProjects?: Array<{ id: string; name: string; customColor?: string }>;
  onSelectProject?: (projectId: string) => void;
  members?: Array<{ id: string; fullName: string; avatarUrl?: string }>;
  isStarred?: boolean;
  onToggleStar?: () => void;
  onOpenFilter?: () => void;
  activeFilterCount?: number;
  onOpenThemeModal?: () => void;
  onShare?: () => void;
  isDarkTheme?: boolean;
}

export function BoardSubHeader({
  projectName,
  projectId,
  allProjects = [],
  onSelectProject,
  members = [],
  isStarred = false,
  onToggleStar,
  onOpenFilter,
  activeFilterCount = 0,
  onOpenThemeModal,
  onShare,
  isDarkTheme = false,
}: BoardSubHeaderProps) {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [starred, setStarred] = useState(isStarred);

  const handleStar = () => {
    setStarred(!starred);
    onToggleStar?.();
  };

  const textPrimary = isDarkTheme ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkTheme ? 'text-slate-300' : 'text-slate-700';
  const btnHover = isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200/70 text-slate-800';
  const bgGlass = isDarkTheme ? 'bg-black/20 backdrop-blur-md border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/60';

  return (
    <div className={`h-12 px-3 md:px-4 border-b flex items-center justify-between shrink-0 select-none transition-colors ${bgGlass}`}>
      {/* Left: Board Title & Switcher, Star */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-bold tracking-tight transition-colors ${btnHover}`}
          >
            <span className="truncate max-w-[200px] md:max-w-[320px]">{projectName}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isProjectDropdownOpen && (
            <div
              className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-fade-in text-slate-800"
              onClick={() => setIsProjectDropdownOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Changer de tableau
              </div>
              {allProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject?.(p.id)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 ${
                    p.id === projectId ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: p.customColor || '#FF7A00' }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                  {p.id === projectId && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Star */}
        <button
          onClick={handleStar}
          className={`p-1.5 rounded-lg transition-colors ${
            starred ? 'text-amber-400' : isDarkTheme ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-700'
          }`}
          title={starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Star className={`w-4 h-4 ${starred ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Right Tools: Avatars, Power-ups, Filtres, Partager, Theme, More */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Team Member Avatars (Overlapping style as in screenshot) */}
        {members.length > 0 && (
          <div className="flex items-center -space-x-1.5 mr-1">
            {members.slice(0, 4).map((m, idx) => (
              <div
                key={m.id || idx}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 border-2 border-white text-white font-bold text-[10px] flex items-center justify-center shadow-xs cursor-pointer hover:scale-110 transition-transform"
                title={m.fullName}
              >
                {m.fullName.slice(0, 2).toUpperCase()}
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white text-slate-700 font-bold text-[10px] flex items-center justify-center shadow-xs">
                +{members.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Power-Ups / Automations */}
        <button
          className={`p-1.5 rounded-lg transition-colors ${btnHover}`}
          title="Automatisations & Power-Ups"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* Filters Button */}
        <button
          onClick={onOpenFilter}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${btnHover} ${
            activeFilterCount > 0 ? 'bg-orange-500/20 text-orange-600 font-bold' : ''
          }`}
          title="Filtrer les cartes"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtres</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Background / Theme Switcher (Palette) */}
        {onOpenThemeModal && (
          <button
            onClick={onOpenThemeModal}
            className={`p-1.5 rounded-lg transition-colors ${btnHover}`}
            title="Personnaliser l'arrière-plan (Blanc, Dégradé, Soie...)"
          >
            <Palette className="w-4 h-4" />
          </button>
        )}

        {/* Share Button (Partager) */}
        <button
          onClick={onShare}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isDarkTheme
              ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>

        {/* More Actions Menu */}
        <button
          className={`p-1.5 rounded-lg transition-colors ${btnHover}`}
          title="Menu du tableau"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CINEMATIC_THEMES, getThemeById } from '@/lib/themes';
import { usePreferences, ThemeMode } from '@/lib/preferences-context';
import {
  Check,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Laptop,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  Eye,
} from 'lucide-react';

interface OverviewCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Orange KanbanEx', value: '#FF7A00' },
  { name: 'Ambre Solaire', value: '#F59E0B' },
  { name: 'Rouge Flamboyant', value: '#EF4444' },
  { name: 'Émeraude Agile', value: '#10B981' },
  { name: 'Bleu Azur', value: '#0284C7' },
  { name: 'Indigo Futuriste', value: '#6366F1' },
  { name: 'Violet Impérial', value: '#8B5CF6' },
  { name: 'Rose Cyber', value: '#EC4899' },
];

export function OverviewCustomizationModal({
  isOpen,
  onClose,
}: OverviewCustomizationModalProps) {
  const {
    themeMode,
    setThemeMode,
    primaryColor,
    setPrimaryColor,
    overviewBackground,
    setOverviewBackground,
  } = usePreferences();

  const [tempThemeMode, setTempThemeMode] = useState<ThemeMode>(themeMode);
  const [tempColor, setTempColor] = useState(primaryColor);
  const [tempBg, setTempBg] = useState(overviewBackground);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempThemeMode(themeMode);
      setTempColor(primaryColor);
      setTempBg(overviewBackground);
    }
  }, [isOpen, themeMode, primaryColor, overviewBackground]);

  const handleApply = () => {
    setThemeMode(tempThemeMode);
    setPrimaryColor(tempColor);
    setOverviewBackground(tempBg);
    onClose();
  };

  const handleResetDefaults = () => {
    setTempThemeMode('system');
    setTempColor('#FF7A00');
    setTempBg('kanbanex-horizon');
  };

  const activeThemeObj = getThemeById(tempBg);

  const filteredThemes = CINEMATIC_THEMES.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'cinematic') return t.category === 'cinematic';
    if (selectedCategory === 'gradient') return t.category === 'gradient';
    if (selectedCategory === 'minimal') return t.category === 'minimal';
    if (selectedCategory === 'nature') return t.category === 'nature' || t.category === 'celestial';
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Studio de Personnalisation & Thèmes"
      description="Personnalisez l'affichage, l'ambiance visuelle et l'arrière-plan de votre espace de travail"
      maxWidth="screen-85"
    >
      <div className="flex flex-col h-full min-h-0 justify-between">
        {/* Main 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 overflow-y-auto flex-1 pr-1 pb-4">
          {/* LEFT COLUMN: Interface Theme & Primary Color & Live Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. Theme Mode (Système / Sombre / Clair) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Mode d&apos;affichage global
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Auto / System */}
                <button
                  type="button"
                  onClick={() => setTempThemeMode('system')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    tempThemeMode === 'system'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#12151C] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Laptop className="w-5 h-5" />
                  <span className="text-[11px] text-center">Système</span>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => setTempThemeMode('dark')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    tempThemeMode === 'dark'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#12151C] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-[11px] text-center">Sombre</span>
                </button>

                {/* Light */}
                <button
                  type="button"
                  onClick={() => setTempThemeMode('light')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    tempThemeMode === 'light'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#12151C] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-[11px] text-center">Clair</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                L&apos;interface bascule rigoureusement entre les surfaces claires et sombres sans aucun mélange incongru.
              </p>
            </div>

            {/* 2. Primary Accent Color */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-500" />
                  Couleur d&apos;accent primaire
                </label>
                <div className="flex items-center gap-2 bg-white dark:bg-[#12151C] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{tempColor}</span>
                  <input
                    type="color"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                    title="Choisir une couleur sur mesure"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = tempColor.toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setTempColor(preset.value)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-[#1A1F29] bg-white dark:bg-[#12151C] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Live Miniature Studio Preview */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-orange-500" />
                  Aperçu en direct
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {activeThemeObj.name}
                </span>
              </div>

              <div
                className="h-28 rounded-xl border border-slate-300 dark:border-slate-700/80 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner select-none"
                style={{ background: activeThemeObj.previewBg }}
              >
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />
                <div className="relative z-10 flex items-center justify-between text-white">
                  <span className="text-xs font-black tracking-tight drop-shadow-xs">Mon Espace KanbanEx</span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: tempColor }}
                  >
                    + Créer un projet
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-20 h-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 p-1.5 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-white truncate">Projet Alpha</span>
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full w-2/3" style={{ backgroundColor: tempColor }} />
                    </div>
                  </div>
                  <div className="w-20 h-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 p-1.5 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-white truncate">Sprint V2</span>
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full w-1/2" style={{ backgroundColor: tempColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Defaults button */}
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors w-fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rétablir les valeurs par défaut officielles</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Expansive Wallpapers & Themes Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                Arrière-plans cinématiques de l&apos;Overview ({filteredThemes.length})
              </label>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'cinematic', label: 'Officiel' },
                  { id: 'gradient', label: 'Dégradés' },
                  { id: 'minimal', label: 'Minimalistes' },
                  { id: 'nature', label: 'Nature & Ciel' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-[#15181F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallpaper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[52vh] overflow-y-auto pr-1">
              {filteredThemes.map((theme) => {
                const isSelected = tempBg === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setTempBg(theme.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-36 relative overflow-hidden group select-none ${
                      isSelected
                        ? 'border-orange-500 ring-3 ring-orange-500/40 shadow-xl scale-[1.01]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:scale-[1.005]'
                    }`}
                    style={{
                      background: theme.previewBg,
                    }}
                  >
                    {/* Background Scrim for high contrast title and description */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/75 transition-colors" />

                    {/* Top Row: Title & Active Badge */}
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-white drop-shadow-md truncate">
                        {theme.name}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-white/40 bg-black/30 group-hover:border-white/80 transition-colors shrink-0" />
                      )}
                    </div>

                    {/* Bottom Row: Description & Category Tag */}
                    <div className="relative z-10 space-y-1">
                      <p className="text-[10px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow-xs">
                        {theme.description}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/50 text-orange-300 border border-white/10">
                        {theme.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Les changements sont immédiatement sauvegardés dans vos préférences locales.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="ghost" onClick={onClose} size="md">
              Annuler
            </Button>
            <Button
              onClick={handleApply}
              size="md"
              className="bg-gradient-warm hover:brightness-105 text-white font-bold px-6 rounded-xl shadow-lg shadow-orange-950/20 active:scale-95 transition-all"
            >
              Appliquer les modifications
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

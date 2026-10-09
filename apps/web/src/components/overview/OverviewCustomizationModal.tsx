'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CINEMATIC_THEMES } from '@/lib/themes';
import { usePreferences, ThemeMode } from '@/lib/preferences-context';
import { Check, Sparkles, Palette, Sun, Moon, Laptop, Image as ImageIcon } from 'lucide-react';

interface OverviewCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Orange KabanEx', value: '#FF7A00' },
  { name: 'Ambre Solaire', value: '#F59E0B' },
  { name: 'Rouge Flamboyant', value: '#EF4444' },
  { name: 'Émeraude Agile', value: '#10B981' },
  { name: 'Bleu Azur', value: '#0284C7' },
  { name: 'Indigo Futuriste', value: '#6366F1' },
  { name: 'Violet Impérial', value: '#8B5CF6' },
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
    setTempBg('kabanex-horizon');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personnalisation de l'espace"
      description="Configurez l'arrière-plan de l'Overview, la couleur primaire et le thème d'affichage"
      maxWidth="lg"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* 1. Theme Mode (Système / Sombre / Clair) */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Thème de l&apos;interface
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTempThemeMode('system')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                tempThemeMode === 'system'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Automatique (Système)</span>
            </button>

            <button
              type="button"
              onClick={() => setTempThemeMode('dark')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                tempThemeMode === 'dark'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Sombre</span>
            </button>

            <button
              type="button"
              onClick={() => setTempThemeMode('light')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                tempThemeMode === 'light'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Clair</span>
            </button>
          </div>
        </div>

        {/* 2. Primary Color Picker */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              Couleur d&apos;accent primaire (Par défaut : Orange)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{tempColor}</span>
              <input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = tempColor.toLowerCase() === preset.value.toLowerCase();
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setTempColor(preset.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: preset.value }}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Overview Background Wallpaper Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
            Arrière-plan de la page Overview (Par défaut : KabanEx Horizon)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CINEMATIC_THEMES.map((theme) => {
              const isSelected = tempBg === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setTempBg(theme.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-24 relative overflow-hidden group ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg'
                      : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                  style={{
                    background: theme.previewBg,
                  }}
                >
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10 flex items-start justify-between">
                    <span className="text-xs font-bold text-white drop-shadow truncate">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="relative z-10 text-[9px] text-slate-300 line-clamp-2 leading-tight">
                    {theme.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline underline-offset-4"
          >
            Rétablir les valeurs par défaut
          </button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleApply}>
              Appliquer les modifications
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

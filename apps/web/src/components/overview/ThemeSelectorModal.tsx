'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { CINEMATIC_THEMES } from '@/lib/themes';
import { Check, Palette } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
  onSaveTheme: (projectId: string, themeId: string, customColor: string) => Promise<void>;
  initialThemeId?: string;
  initialColor?: string;
}

export function ThemeSelectorModal({
  isOpen,
  onClose,
  projectId,
  onSaveTheme,
  initialThemeId,
  initialColor,
}: ThemeSelectorModalProps) {
  const [selectedTheme, setSelectedTheme] = useState(initialThemeId || CINEMATIC_THEMES[0].id);
  const [customColor, setCustomColor] = useState(initialColor || '#F97316');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      await onSaveTheme(projectId, selectedTheme, customColor);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du thème');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personnalisation de l'identité visuelle"
      description="Sélectionnez un univers cinématographique sobre et élégant pour votre projet"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Modern Color picker */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-[#15181F] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-500" />
              Couleur d&apos;accent personnalisée
            </span>
          </div>
          <ColorPicker
            value={customColor}
            onChange={setCustomColor}
          />
        </div>

        {/* Themes presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-orange-500" />
            Bibliothèque d&apos;univers cinématographiques
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CINEMATIC_THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setCustomColor(theme.accentColor);
                  }}
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
                      <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} isLoading={isLoading} className="brand-glow">
            Appliquer le thème
          </Button>
        </div>
      </div>
    </Modal>
  );
}

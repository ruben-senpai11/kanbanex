'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CINEMATIC_THEMES } from '@/lib/themes';
import { Palette, Check } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(CINEMATIC_THEMES[0].id);
  const [customColor, setCustomColor] = useState('#FF7A00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        plannedStartDate: plannedStartDate ? new Date(plannedStartDate).toISOString() : undefined,
        plannedEndDate: plannedEndDate ? new Date(plannedEndDate).toISOString() : undefined,
        backgroundTheme: selectedTheme,
        customColor,
      });
      // Reset form
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau projet"
      description="Configurez votre projet et choisissez son identité visuelle cinématographique"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <Input
          label="Nom du projet *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex. Expansion Alpha V2"
          required
        />

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Objectifs et périmètre du projet..."
            rows={2}
            className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Priorité
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-500/80"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Élevée</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Couleur d'accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{customColor}</span>
            </div>
          </div>
        </div>

        {/* Planned Dates */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date de début planifiée"
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
          />
          <Input
            label="Date de fin planifiée"
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
          />
        </div>

        {/* Cinematic Universe Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              Univers visuel cinématographique
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CINEMATIC_THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-20 relative overflow-hidden group ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-sm'
                      : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                  style={{
                    background: theme.previewBg,
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white drop-shadow truncate">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading} className="brand-glow">
            Créer le projet
          </Button>
        </div>
      </form>
    </Modal>
  );
}

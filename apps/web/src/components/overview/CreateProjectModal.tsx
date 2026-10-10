'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Select, SelectOption } from '@/components/ui/Select';
import { CINEMATIC_THEMES } from '@/lib/themes';
import { Palette, Check, Zap, Target, Sparkles, Compass } from 'lucide-react';
import { evaluateOneThingProject } from '@/lib/the-one-thing';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'LOW', label: 'Basse (Incubateur Someday/Maybe)', colorDot: '#10B981' },
  { value: 'MEDIUM', label: 'Moyenne (Opérationnel)', colorDot: '#3B82F6' },
  { value: 'HIGH', label: 'Élevée (File Active)', colorDot: '#F59E0B' },
  { value: 'URGENT', label: 'Urgent (⚡ The One Thing)', colorDot: '#EF4444' },
];

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('URGENT');
  const [dominoEffect, setDominoEffect] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [essentialAlignment, setEssentialAlignment] = useState<'ABSOLUTE_YES' | 'MAYBE' | 'NICE_TO_HAVE'>('ABSOLUTE_YES');
  const [initialNextAction, setInitialNextAction] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(CINEMATIC_THEMES[0].id);
  const [customColor, setCustomColor] = useState('#FF7A00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Evaluate the project based on The One Thing & Essentialism
  const evaluation = evaluateOneThingProject({
    dominoEffect,
    essentialAlignment,
    gtdActionable: Boolean(initialNextAction.trim()),
  });

  const handleDominoChange = (val: 'HIGH' | 'MEDIUM' | 'LOW') => {
    setDominoEffect(val);
    const ev = evaluateOneThingProject({
      dominoEffect: val,
      essentialAlignment,
      gtdActionable: Boolean(initialNextAction.trim()),
    });
    setPriority(ev.priority);
  };

  const handleEssentialChange = (val: 'ABSOLUTE_YES' | 'MAYBE' | 'NICE_TO_HAVE') => {
    setEssentialAlignment(val);
    const ev = evaluateOneThingProject({
      dominoEffect,
      essentialAlignment: val,
      gtdActionable: Boolean(initialNextAction.trim()),
    });
    setPriority(ev.priority);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      if (evaluation.isTheOneThing && typeof window !== 'undefined') {
        localStorage.setItem('kanbanex_the_one_thing_title', name.trim());
      }

      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        plannedStartDate: plannedStartDate ? new Date(plannedStartDate).toISOString() : undefined,
        plannedEndDate: plannedEndDate ? new Date(plannedEndDate).toISOString() : undefined,
        backgroundTheme: selectedTheme,
        customColor,
        initialNextAction: initialNextAction.trim() || undefined,
      });
      // Reset form
      setName('');
      setDescription('');
      setInitialNextAction('');
      setPlannedStartDate('');
      setPlannedEndDate('');
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
            className="w-full px-3.5 py-2.5 bg-slate-100/90 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
          />
        </div>

        {/* Le Tamis "The One Thing" (GTD & Essentialism) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span>Tamis « The One Thing » (GTD & Essentialism)</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                evaluation.isTheOneThing
                  ? 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-500/50 shadow-xs'
                  : evaluation.category === 'ACTIVE_BACKLOG'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}
            >
              {evaluation.isTheOneThing ? '⚡ ' : ''}{evaluation.priorityLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Question 1: Domino Effect 10x */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Target className="w-3 h-3 text-orange-500" />
                Effet Domino (Gary Keller)
              </label>
              <select
                value={dominoEffect}
                onChange={(e) => handleDominoChange(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#151921] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="HIGH">🚀 Levier 10x (Rend tout plus facile)</option>
                <option value="MEDIUM">⚡ Projet d&apos;appui utile</option>
                <option value="LOW">⏳ Secondaire (Nice-to-have)</option>
              </select>
            </div>

            {/* Question 2: Essentialism 90% Rule */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Règle du 90% (Essentialism)
              </label>
              <select
                value={essentialAlignment}
                onChange={(e) => handleEssentialChange(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#151921] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="ABSOLUTE_YES">✨ OUI Absolu (&ge; 90% vital)</option>
                <option value="MAYBE">🤔 Peut-être (Utile)</option>
                <option value="NICE_TO_HAVE">💡 Optionnel (Incubateur)</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            💡 {evaluation.recommendation}
          </p>

          {/* GTD Next Physical Action */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-1">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-500" />
              Prochaine action physique concrète GTD (&lt; 30 min)
            </label>
            <input
              type="text"
              value={initialNextAction}
              onChange={(e) => setInitialNextAction(e.target.value)}
              placeholder="ex. Rédiger les 3 points clés, réserver 45 min de deep work..."
              className="w-full px-3 py-1.5 bg-white dark:bg-[#151921] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priorité évaluée"
            value={priority}
            onChange={setPriority}
            options={PRIORITY_OPTIONS}
          />

          <ColorPicker
            label="Couleur d'accent"
            value={customColor}
            onChange={setCustomColor}
            align="right"
          />
        </div>

        {/* Modern Date Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Date de début planifiée"
            value={plannedStartDate}
            onChange={setPlannedStartDate}
            placeholder="Choisir une date..."
          />
          <DatePicker
            label="Date de fin planifiée"
            value={plannedEndDate}
            onChange={setPlannedEndDate}
            placeholder="Choisir une date..."
            align="right"
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

'use client';

import React, { useState } from 'react';
import { AppLogo } from '@/components/ui/AppLogo';
import { CINEMATIC_THEMES } from '@/lib/themes';
import { usePreferences } from '@/lib/preferences-context';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Plus,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  GtdIdea,
  ENTREPRENEURIAL_TEMPLATES,
  evaluateOneThingProject,
} from '@/lib/the-one-thing';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    name: string;
    description?: string;
    priority?: string;
    initialTaskTitle?: string;
    backgroundTheme: string;
    customColor: string;
  }) => Promise<void>;
  workspaceName?: string;
}

export function OnboardingWizardModal({
  isOpen,
  onClose,
  onComplete,
  workspaceName = 'Mon Espace',
}: OnboardingWizardModalProps) {
  const { setOverviewBackground, setPrimaryColor } = usePreferences();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // GTD Phase 1: Capture List
  const [ideas, setIdeas] = useState<GtdIdea[]>([
    { id: '1', title: 'Lancement de la Nouvelle Offre & GTM' },
    { id: '2', title: 'Acquisition Client & Pipeline B2B' },
    { id: '3', title: 'Automatisation & Système Opérationnel' },
  ]);
  const [newIdeaInput, setNewIdeaInput] = useState('');

  // Phase 2: The One Thing selection
  const [selectedOneThingId, setSelectedOneThingId] = useState<string>('1');
  const [dominoScore, setDominoScore] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [essentialScore, setEssentialScore] = useState<'ABSOLUTE_YES' | 'MAYBE' | 'NICE_TO_HAVE'>('ABSOLUTE_YES');

  // Phase 3: GTD Next Action
  const [nextAction, setNextAction] = useState('Contacter 3 prospects cibles pour valider le pitch');

  // Phase 4: Theme
  const [selectedThemeId, setSelectedThemeId] = useState('gradient-orange-chaud');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const premiumGradients = CINEMATIC_THEMES.slice(0, 4);
  const activeTheme =
    CINEMATIC_THEMES.find((t) => t.id === selectedThemeId) || CINEMATIC_THEMES[0];

  const currentOneThing = ideas.find((i) => i.id === selectedOneThingId) || ideas[0];

  // Quick Add a custom idea
  const handleAddIdea = () => {
    if (!newIdeaInput.trim()) return;
    const newId = String(Date.now());
    setIdeas((prev) => [...prev, { id: newId, title: newIdeaInput.trim() }]);
    setNewIdeaInput('');
  };

  const handleAddTemplate = (tpl: { title: string }) => {
    if (ideas.some((i) => i.title.toLowerCase() === tpl.title.toLowerCase())) return;
    const newId = String(Date.now());
    setIdeas((prev) => [...prev, { id: newId, title: tpl.title }]);
  };

  const handleRemoveIdea = (id: string) => {
    if (ideas.length <= 1) return;
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    if (selectedOneThingId === id) {
      const remaining = ideas.filter((i) => i.id !== id);
      if (remaining.length > 0) setSelectedOneThingId(remaining[0].id);
    }
  };

  const handleNext = () => {
    if (step === 1 && ideas.length > 0) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleFinish = async () => {
    if (!currentOneThing?.title.trim()) return;
    setIsSubmitting(true);
    try {
      setOverviewBackground(selectedThemeId);
      if (activeTheme.accentColor) {
        setPrimaryColor(activeTheme.accentColor);
      }
      localStorage.setItem('kanbanex_onboarding_completed', 'true');
      localStorage.setItem('kanbanex_the_one_thing_title', currentOneThing.title.trim());

      await onComplete({
        name: currentOneThing.title.trim(),
        description: 'Projet qualifié comme The One Thing • Effet Domino #1 pour l\'entreprise.',
        priority: 'URGENT',
        initialTaskTitle: nextAction.trim() || undefined,
        backgroundTheme: selectedThemeId,
        customColor: activeTheme.accentColor || '#FF7A00',
      });
      onClose();
    } catch (err) {
      console.error('Erreur lors de la complétion de l\'onboarding', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('kanbanex_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0E121A] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Progress & Branding Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" priority />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                The One Thing
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Étape {step} sur 4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-6 bg-orange-500'
                      : s < step
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-200 dark:bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSkip}
              className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Passer l'onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================================= */}
          {/* ÉTAPE 1 : BOÎTE DE CAPTURE GTD (Videz votre esprit)                       */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Zap className="w-3 h-3" />
                  <span>Principes GTD — Étape 1 : Capture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Videz votre esprit d&apos;entrepreneur
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  Votre esprit est fait pour concevoir des idées, pas pour les retenir. Notez les projets et ambitions qui occupent votre tête. Nous allons les tamiser objectivement.
                </p>
              </div>

              {/* Quick Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newIdeaInput}
                  onChange={(e) => setNewIdeaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIdea()}
                  placeholder="ex. Lancement podcast B2B, Partenariat stratégique..."
                  className="flex-1 h-11 px-3.5 bg-slate-100/90 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddIdea}
                  className="h-11 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Captured Ideas List */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Idées capturées ({ideas.length})
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {ideas.map((idea, idx) => (
                    <div
                      key={idea.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#141822] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {idea.title}
                        </span>
                      </div>
                      {ideas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIdea(idea.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                          title="Supprimer cette idée"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions chips */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Exemples d&apos;initiatives clés pour entrepreneurs :
                </span>
                <div className="flex flex-wrap gap-2">
                  {ENTREPRENEURIAL_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.title}
                      type="button"
                      onClick={() => handleAddTemplate(tpl)}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200/80 dark:border-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3 text-orange-500" />
                      <span>{tpl.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 2 : LE TAMIS "THE ONE THING" & ESSENTIALISM                         */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Flame className="w-3 h-3" />
                  <span>The One Thing & Essentialism</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Isolez votre Domino #1 (The One Thing)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  <em>&ldquo;Quelle est l&apos;UNIQUE chose que vous pouvez faire de telle sorte qu&apos;en la faisant, tout le reste deviendra plus facile ou inutile ?&rdquo;</em> (Gary Keller)
                </p>
              </div>

              {/* Ideas Selection for The One Thing */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Sélectionnez votre levier stratégique #1 :
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {ideas.map((idea) => {
                    const isSelected = selectedOneThingId === idea.id;
                    return (
                      <div
                        key={idea.id}
                        onClick={() => setSelectedOneThingId(idea.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 shadow-md'
                            : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-[#121620]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'border border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {idea.title}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-md bg-orange-500 text-white tracking-wider shadow-xs">
                            ⚡ THE ONE THING
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Essential Filter Questions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141822] border border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  Critères de décision objective
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Domino Question */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#181D28] border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      1. Effet Domino (Levier 10x)
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Rend-il les autres projets plus faciles ou obsolètes ?
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {(['HIGH', 'MEDIUM', 'LOW'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDominoScore(s)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            dominoScore === s
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {s === 'HIGH' ? 'Majeur' : s === 'MEDIUM' ? 'Moyen' : 'Faible'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Essentialism 90% Rule */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#181D28] border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      2. Règle du 90% (Essentialisme)
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Est-ce un &ldquo;OUI&rdquo; indiscutable pour vos 3 ans ?
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {(['ABSOLUTE_YES', 'MAYBE'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEssentialScore(s)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            essentialScore === s
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {s === 'ABSOLUTE_YES' ? 'OUI Absolu' : 'Peut-être'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Verdict :</strong> Ce projet est qualifié comme votre <strong>Domino #1</strong>. Les autres projets basculent automatiquement en incubation pour vous garantir un focus total (Off Balance).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 3 : LA PREMIÈRE ACTION PHYSIQUE GTD (Next Action)                   */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Target className="w-3 h-3" />
                  <span>GTD — Prochaine Action Physique</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Quelle est votre Première Action Physique ?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  David Allen (GTD) : Un projet sans geste physique immédiat génère de la friction mentale. Définissez la toute première tâche concrète (&lt; 30 min) pour faire basculer ce premier domino.
                </p>
              </div>

              {/* Project Headline Card */}
              <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block">
                    The One Thing sélectionné
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {currentOneThing?.title}
                  </span>
                </div>
                <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  #1
                </span>
              </div>

              {/* Next Action Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Votre première action concrète *
                </label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="ex. Rédiger l'email d'annonce aux 5 premiers clients test"
                  className="w-full h-12 px-4 bg-slate-100/90 dark:bg-[#12151C] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              {/* Quick Inspiration suggestions */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Suggestions d&apos;actions concrètes rapides :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Contacter 3 prospects cibles pour valider le pitch',
                    'Bloquer 2h de deep work demain matin à 9h',
                    'Rédiger le brief opérationnel d\'une page',
                    'Valider la maquette avec le premier collaborateur',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNextAction(sug)}
                      className="p-2.5 text-left rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-white/10 text-xs font-medium transition-colors"
                    >
                      &rarr; {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 4 : ANCRAGE DE LA VISION & UNIVERS CINÉMATOGRAPHIQUE               */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>Off Balance — Vision & Flow</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Activez votre Vision à Long Terme
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                  Choisissez l&apos;ambiance visuelle signature de votre espace. KanbanEx est taillé pour vous maintenir dans le flow et exécuter sans dispersion.
                </p>
              </div>

              {/* 4 Premium Gradients Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Univers visuel signature (4 Dégradés Premiums)</span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {activeTheme.name}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {premiumGradients.map((g) => {
                    const isSelected = selectedThemeId === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedThemeId(g.id)}
                        className={`h-28 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden select-none border ${
                          isSelected
                            ? 'ring-3 ring-orange-500 border-transparent scale-[1.03] shadow-xl'
                            : 'border-slate-300/80 dark:border-white/15 hover:scale-[1.01]'
                        }`}
                        style={{ background: g.previewBg }}
                      >
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[11px] font-black text-white drop-shadow-md truncate">
                            {g.name.split(' ')[0]} {g.name.split(' ')[1]}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <span className="relative z-10 text-[9px] text-white/90 drop-shadow-xs font-medium">
                          {g.isDark ? 'Ambiance Sombre' : 'Ambiance Claire'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Executive Summary Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-white/15 relative overflow-hidden text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
                style={{ background: activeTheme.previewBg }}
              >
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-orange-300 block">
                    ⚡ The One Thing • Domino #1
                  </span>
                  <span className="text-lg font-black text-white drop-shadow-md block">
                    {currentOneThing?.title}
                  </span>
                  <span className="text-xs text-white/80 block">
                    Première action : <em>{nextAction}</em>
                  </span>
                </div>
                <div className="relative z-10 shrink-0">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-white text-slate-950 shadow-md inline-block">
                    Vision #1 Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-white/5">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && ideas.length === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-90 text-white flex items-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer brand-glow"
            >
              <span>{isSubmitting ? 'Activation en cours...' : 'Activer ma vision et entrer dans le Flow'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

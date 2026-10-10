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
  Briefcase,
  Code2,
  Palette,
  Target,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    name: string;
    description?: string;
    backgroundTheme: string;
    customColor: string;
  }) => Promise<void>;
  workspaceName?: string;
}

const USE_CASES = [
  {
    id: 'team',
    title: 'Gestion d\'équipe & Entreprise',
    desc: 'Collaborer, assigner des tâches, piloter des projets et coordonner les équipes.',
    icon: Briefcase,
    suggestedProject: 'Lancement Produit & Stratégie',
  },
  {
    id: 'tech',
    title: 'Développement Tech & SaaS',
    desc: 'Roadmap produit, sprints agiles, backlogs et gestion des déploiements.',
    icon: Code2,
    suggestedProject: 'Roadmap Technique & Sprints',
  },
  {
    id: 'creative',
    title: 'Création & Design Freelance',
    desc: 'Clients, livrables, suivi des contenus créatifs et rétroplanning.',
    icon: Palette,
    suggestedProject: 'Projets Clients & Créations',
  },
  {
    id: 'personal',
    title: 'Productivité Personnelle',
    desc: 'Objectifs trimestriels, to-do list quotidienne et organisation des tâches.',
    icon: Target,
    suggestedProject: 'Mes Objectifs & Priorités',
  },
];

export function OnboardingWizardModal({
  isOpen,
  onClose,
  onComplete,
  workspaceName = 'Mon Espace',
}: OnboardingWizardModalProps) {
  const { setOverviewBackground, setPrimaryColor } = usePreferences();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedUseCase, setSelectedUseCase] = useState('team');
  const [projectName, setProjectName] = useState('Lancement Produit & Stratégie');
  const [projectDesc, setProjectDesc] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('gradient-orange-chaud');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // The 4 requested signature premium gradients
  const premiumGradients = CINEMATIC_THEMES.slice(0, 4);
  const activeTheme = CINEMATIC_THEMES.find((t) => t.id === selectedThemeId) || CINEMATIC_THEMES[0];

  const handleSelectUseCase = (uc: typeof USE_CASES[0]) => {
    setSelectedUseCase(uc.id);
    setProjectName(uc.suggestedProject);
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleFinish = async () => {
    if (!projectName.trim()) return;
    setIsSubmitting(true);
    try {
      // Sync global preferences with the chosen gradient
      setOverviewBackground(selectedThemeId);
      if (activeTheme.accentColor) {
        setPrimaryColor(activeTheme.accentColor);
      }
      localStorage.setItem('kanbanex_onboarding_completed', 'true');

      await onComplete({
        name: projectName.trim(),
        description: projectDesc.trim() || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0E121A] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Progress & Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" priority />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Bienvenue sur KanbanEx
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Étape {step} sur 3
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-6 bg-slate-900 dark:bg-white'
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
          {/* ÉTAPE 1 : OBJECTIF & CAS D'USAGE                                         */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 mb-1">
                  <Zap className="w-3 h-3" />
                  <span>Configuration personnalisée</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Comment souhaitez-vous utiliser KanbanEx ?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                  Choisissez votre cas d&apos;usage principal pour préparer votre premier tableau de bord.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {USE_CASES.map((uc) => {
                  const Icon = uc.icon;
                  const isSelected = selectedUseCase === uc.id;
                  return (
                    <div
                      key={uc.id}
                      onClick={() => handleSelectUseCase(uc)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/10 ring-2 ring-slate-900/20 dark:ring-white/20 shadow-md'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25 bg-white dark:bg-[#121620]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-white/20" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {uc.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {uc.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 2 : NOM & AMBIANCE DÉGRADÉE PREMIUM                                */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Nommez votre projet & choisissez son ambiance
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sélectionnez parmi nos 4 dégradés premiums signés KanbanEx.
                </p>
              </div>

              {/* Project Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nom du premier projet *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="ex. Ma Feuille de Route 2026"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#121620] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                />
              </div>

              {/* 4 Premium Gradients Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Univers visuel par défaut (4 Dégradés Premiums)</span>
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
                            ? 'ring-3 ring-slate-900 dark:ring-white border-transparent scale-[1.03] shadow-xl'
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

              {/* Live Preview Bar */}
              <div
                className="p-4 rounded-2xl border border-slate-300 dark:border-white/15 relative overflow-hidden text-white flex items-center justify-between shadow-inner"
                style={{ background: activeTheme.previewBg }}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
                <div className="relative z-10">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                    Aperçu de votre tableau
                  </span>
                  <span className="text-base font-black text-white drop-shadow-md">
                    {projectName || 'Nouveau Projet'}
                  </span>
                </div>
                <div className="relative z-10 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-950 shadow-md">
                    À faire (0)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 text-white backdrop-blur-md">
                    En cours (0)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ÉTAPE 3 : STRUCTURE DES COLONNES & LANCEMENT                              */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Prêt à organiser votre travail !
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Voici le workflow standard qui sera initialisé pour votre tableau.
                </p>
              </div>

              {/* Preview columns grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'À faire', count: 0, color: '#94A3B8' },
                  { name: 'En cours', count: 0, color: '#38BDF8' },
                  { name: 'En review', count: 0, color: '#F59E0B' },
                  { name: 'Terminé', count: 0, color: '#10B981' },
                ].map((col, idx) => (
                  <div
                    key={col.name}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between h-28"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {col.name}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: col.color }}
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[10px] text-slate-400 italic text-center">
                      + Glisser-déposer
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-3">
                <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">
                    Personnalisation totale à tout moment
                  </strong>
                  Vous pourrez ajouter autant de colonnes que souhaité, inviter des collaborateurs et basculer entre la vue Kanban, Gantt et Calendrier.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-white/5">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Passer pour le moment
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Création en cours...' : 'Finaliser et lancer mon projet 🚀'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

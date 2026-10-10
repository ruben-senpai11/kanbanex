'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'En quoi KanbanEx est-il spécialement conçu pour les entrepreneurs ?',
    answer:
      'Contrairement aux outils Kanban génériques qui encouragent l’accumulation désordonnée de tâches, KanbanEx intègre la philosophie « The One Thing » (Gary Keller), Getting Things Done (GTD) et Essentialism (Greg McKeown). Lors de l’onboarding et de la création de projet, chaque initiative passe par un tamis objectif (effet domino 10x, règle du 90%, action physique concrète) pour identifier sans ambiguïté votre priorité vitale (#1 Domino) et préserver votre bande passante mentale.',
  },
  {
    question: 'Comment fonctionne l\'attribution du statut Super Administrateur ?',
    answer:
      'Conformément aux spécifications, le tout premier utilisateur à créer un compte sur la plateforme se voit automatiquement attribuer le rôle de Super Administrateur (Super Admin). Ce compte bénéficie d\'emblée de la formule Expansion avec un accès complet à la console de gestion globale.',
  },
  {
    question: 'Puis-je personnaliser les arrière-plans sur grand écran et smartphone ?',
    answer:
      'Oui ! KanbanEx est conçu pour une adaptation responsive totale. L\'image officielle KanbanEx s\'affiche en panorama 16:9 cinématographique sur ordinateur et s\'adapte au format 9:16 portrait sur smartphone. Vous pouvez également ajuster le thème de chaque projet ou choisir un thème système automatique.',
  },
  {
    question: 'Comment basculer entre le tableau Kanban, le diagramme de Gantt et le calendrier ?',
    answer:
      'Grâce à notre mini-dock flottant inférieur inspiré de Trello et ClickUp, vous passez d\'une vue à l\'autre en un clic sans rechargement de page. Vos données et vos dates restent parfaitement synchronisées.',
  },
  {
    question: 'Comment sont traités les paiements pour changer de formule ?',
    answer:
      'Tous les paiements et souscriptions d\'abonnements sont traités via des passerelles bancaires et financières cryptées certifiées de bout en bout. L\'activation de votre formule est instantanée dès validation de la transaction.',
  },
  {
    question: 'Puis-je inviter mon équipe et collaborer en temps réel ?',
    answer:
      'Absolument. Vous pouvez inviter des collaborateurs au sein de vos espaces de travail, leur assigner des tâches, partager des dates d\'échéance et suivre la progression globale de chaque projet en direct.',
  },
];

export function InteractiveFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-8 select-none">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          Foire Aux Questions
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Questions Fréquentes
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Tout ce que vous devez savoir pour démarrer sereinement sur KanbanEx.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-orange-500/50 bg-orange-50/60 dark:bg-[#161B24]'
                  : 'border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#12151C]/70 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm md:text-base font-bold text-slate-900 dark:text-white"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-white/5 pt-3 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * The One Thing, Getting Things Done (GTD) & Essentialism Engine for KanbanEx
 * Designed specifically for entrepreneurs to filter ideas and establish laser-sharp long-term focus.
 */

export interface GtdIdea {
  id: string;
  title: string;
  dominoScore?: number; // 1 to 5 (Effet Domino / Levier 10x)
  clarityScore?: number; // 1 to 5 (Clarté d'exécution GTD)
  essentialScore?: number; // 1 to 5 (Règle du 90% Essentialism)
  nextAction?: string; // Première action physique concrète
}

export type EvaluatedPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface OneThingEvaluationResult {
  priority: EvaluatedPriority;
  priorityLabel: string;
  isTheOneThing: boolean;
  category: 'THE_ONE_THING' | 'ACTIVE_BACKLOG' | 'SOMEDAY_MAYBE';
  recommendation: string;
}

export const ENTREPRENEURIAL_TEMPLATES: Array<{ title: string; desc: string }> = [
  {
    title: 'Lancement de la Nouvelle Offre & GTM',
    desc: 'Lancer l\'offre maîtresse sur le marché pour valider le product-market fit et générer les premiers flux de trésorerie.',
  },
  {
    title: 'Acquisition Client & Pipeline B2B',
    desc: 'Mettre en place un système d\'acquisition prévisible pour sécuriser 10 nouveaux clients réguliers.',
  },
  {
    title: 'Automatisation & Système Opérationnel',
    desc: 'Documenter les processus et automatiser la livraison pour libérer 15 heures par semaine au fondateur.',
  },
  {
    title: 'Refonte Produit & Rétention Utilisateurs',
    desc: 'Résoudre les points de friction majeurs pour doubler la valeur perçue et le taux de réachat.',
  },
];

/**
 * Objective scoring algorithm based on Gary Keller's The One Thing,
 * Greg McKeown's Essentialism (90% rule), and David Allen's GTD.
 */
export function evaluateOneThingProject(params: {
  dominoEffect: 'HIGH' | 'MEDIUM' | 'LOW'; // Does it make everything else easier/unnecessary?
  essentialAlignment: 'ABSOLUTE_YES' | 'MAYBE' | 'NICE_TO_HAVE'; // 90% Rule
  gtdActionable: boolean; // Clear next physical action available
}): OneThingEvaluationResult {
  const { dominoEffect, essentialAlignment, gtdActionable } = params;

  // The 90% Rule: If it's a clear 10x domino and an absolute yes, it's THE ONE THING
  if (dominoEffect === 'HIGH' && essentialAlignment === 'ABSOLUTE_YES') {
    return {
      priority: 'URGENT',
      priorityLabel: 'The One Thing (Domino #1)',
      isTheOneThing: true,
      category: 'THE_ONE_THING',
      recommendation:
        'C\'est votre levier stratégique #1. Toute votre énergie doit converger ici jusqu\'à son aboutissement.',
    };
  }

  // High leverage but needs timing or secondary execution
  if (dominoEffect === 'HIGH' || essentialAlignment === 'ABSOLUTE_YES') {
    return {
      priority: 'HIGH',
      priorityLabel: 'Priorité Élevée (File Active)',
      isTheOneThing: false,
      category: 'ACTIVE_BACKLOG',
      recommendation:
        'Projet stratégique à exécuter immédiatement après la chute de votre premier domino.',
    };
  }

  // Actionable secondary project
  if (gtdActionable && essentialAlignment === 'MAYBE') {
    return {
      priority: 'MEDIUM',
      priorityLabel: 'Priorité Moyenne (Opérationnel)',
      isTheOneThing: false,
      category: 'ACTIVE_BACKLOG',
      recommendation:
        'Projet opérationnel utile. À déléguer ou planifier dans un créneau secondaire.',
    };
  }

  // Not vital right now -> GTD Someday / Maybe
  return {
    priority: 'LOW',
    priorityLabel: 'Un jour / Peut-être (Incubateur GTD)',
    isTheOneThing: false,
    category: 'SOMEDAY_MAYBE',
    recommendation:
      'Idée précieuse mais non essentielle aujourd\'hui. Stockée dans votre incubateur pour préserver votre bande passante mentale.',
  };
}

export interface ProjectTheme {
  id: string;
  name: string;
  category: 'cinematic' | 'futuristic' | 'celestial' | 'nature' | 'minimal';
  gradient: string;
  accentColor: string;
  overlay: string;
  previewBg: string;
  description: string;
}

export const CINEMATIC_THEMES: ProjectTheme[] = [
  {
    id: 'vast-skies',
    name: 'Vastes Ciels',
    category: 'celestial',
    gradient: 'from-sky-900/90 via-slate-900/95 to-neutral-950',
    accentColor: '#38BDF8',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/75 to-sky-950/40',
    previewBg: 'linear-gradient(135deg, #0369A1 0%, #0F172A 60%, #020617 100%)',
    description: 'Ouverture contemplative sur les étendues célestes d\'azur et d\'infini.',
  },
  {
    id: 'downhill',
    name: 'Downhill Horizon',
    category: 'nature',
    gradient: 'from-amber-900/85 via-orange-950/90 to-neutral-950',
    accentColor: '#F97316',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-amber-950/40',
    previewBg: 'linear-gradient(135deg, #78350F 0%, #451A03 50%, #0B0D11 100%)',
    description: 'Vigueur des crêtes rocheuses et perspectives au couchant.',
  },
  {
    id: 'horizons',
    name: 'Horizons Infinis',
    category: 'cinematic',
    gradient: 'from-orange-800/80 via-rose-950/90 to-neutral-950',
    accentColor: '#FB923C',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-rose-950/40',
    previewBg: 'linear-gradient(135deg, #EA580C 0%, #881337 60%, #0B0D11 100%)',
    description: 'Ligne d\'horizon solaire à l\'aube d\'une ère nouvelle.',
  },
  {
    id: 'futurism',
    name: 'Futurisme Expansion',
    category: 'futuristic',
    gradient: 'from-violet-900/85 via-fuchsia-950/90 to-neutral-950',
    accentColor: '#C084FC',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/85 to-violet-950/40',
    previewBg: 'linear-gradient(135deg, #581C87 0%, #701A75 55%, #0B0D11 100%)',
    description: 'Architectures et interfaces spatiales d\'avant-garde.',
  },
  {
    id: 'lumiere',
    name: 'Lumière Première',
    category: 'celestial',
    gradient: 'from-amber-600/75 via-yellow-950/90 to-neutral-950',
    accentColor: '#FBBF24',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-amber-900/35',
    previewBg: 'linear-gradient(135deg, #B45309 0%, #713F12 50%, #0B0D11 100%)',
    description: 'Rayonnement divin traversant l\'immensité et éclairant chaque œuvre.',
  },
  {
    id: 'exploration',
    name: 'Exploration Épique',
    category: 'cinematic',
    gradient: 'from-teal-900/80 via-cyan-950/90 to-neutral-950',
    accentColor: '#2DD4BF',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-teal-950/40',
    previewBg: 'linear-gradient(135deg, #115E59 0%, #083344 60%, #0B0D11 100%)',
    description: 'Traversée de paysages grandioses et territoires inexplorés.',
  },
  {
    id: 'ascension',
    name: 'Ascension Céleste',
    category: 'celestial',
    gradient: 'from-indigo-900/85 via-slate-900/90 to-neutral-950',
    accentColor: '#818CF8',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-indigo-950/40',
    previewBg: 'linear-gradient(135deg, #3730A3 0%, #1E1B4B 60%, #0B0D11 100%)',
    description: 'Élévation majestueuse vers la splendeur des hauteurs éternelles.',
  },
  {
    id: 'architecture',
    name: 'Architecture Moderne',
    category: 'minimal',
    gradient: 'from-zinc-800/90 via-stone-900/95 to-neutral-950',
    accentColor: '#E2E8F0',
    overlay: 'bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/85 to-zinc-900/40',
    previewBg: 'linear-gradient(135deg, #3F3F46 0%, #1C1917 60%, #0B0D11 100%)',
    description: 'Lignes épurées, géométrie sobre et matériaux nobles.',
  },
];

export function getThemeById(id?: string | null): ProjectTheme {
  const found = CINEMATIC_THEMES.find((t) => t.id === id);
  return found || CINEMATIC_THEMES[0];
}

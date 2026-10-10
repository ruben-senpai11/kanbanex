export interface ProjectTheme {
  id: string;
  name: string;
  category: 'cinematic' | 'silk' | 'minimal' | 'gradient' | 'celestial' | 'nature';
  backgroundClass: string;
  backgroundStyle?: React.CSSProperties;
  accentColor: string;
  isDark?: boolean;
  isWallpaper?: boolean;
  desktopBg?: string;
  mobileBg?: string;
  previewBg: string;
  description: string;
}

export const CINEMATIC_THEMES: ProjectTheme[] = [
  {
    id: 'gradient-orange-chaud',
    name: 'Orange Chaud (Solaire & Ambre)',
    category: 'gradient',
    backgroundClass: 'bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900',
    backgroundStyle: {
      background: `radial-gradient(ellipse at 20% 15%, rgba(251, 146, 60, 0.55) 0%, transparent 65%),
                   radial-gradient(ellipse at 85% 85%, rgba(245, 158, 11, 0.45) 0%, transparent 60%),
                   radial-gradient(ellipse at 50% 30%, rgba(254, 215, 170, 0.25) 0%, transparent 70%),
                   linear-gradient(135deg, #431407 0%, #7C2D12 35%, #9A3412 65%, #351408 100%)`,
    },
    accentColor: '#FF7A00',
    isDark: true,
    previewBg: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 50%, #431407 100%)',
    description: 'Dégradé ambré chaleureux et solaire, alliant éclat lumineux et profondeur raffinée.',
  },
  {
    id: 'gradient-orange-doux',
    name: 'Orange Doux (Pêche & Aurore)',
    category: 'gradient',
    backgroundClass: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/60',
    backgroundStyle: {
      background: `radial-gradient(ellipse at 20% 15%, rgba(254, 215, 170, 0.75) 0%, transparent 55%),
                   radial-gradient(ellipse at 85% 85%, rgba(253, 186, 116, 0.45) 0%, transparent 50%),
                   linear-gradient(135deg, #FFFBF5 0%, #FFF7ED 40%, #FEF3C7 100%)`,
    },
    accentColor: '#EA580C',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 50%, #FFEDD5 100%)',
    description: 'Dégradé pêche et pastel lumineux pour une clarté aérée et une élégance douce.',
  },
  {
    id: 'gradient-blanc-sobre',
    name: 'Blanc Sobre (Minimaliste & Clarté)',
    category: 'minimal',
    backgroundClass: 'bg-slate-50',
    backgroundStyle: {
      background: `radial-gradient(ellipse at 50% 0%, rgba(241, 245, 249, 0.9) 0%, transparent 60%),
                   linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 45%, #F1F5F9 100%)`,
    },
    accentColor: '#0F172A',
    isDark: false,
    previewBg: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)',
    description: 'Pureté graphique et minimalisme contemporain, focus total sur la lisibilité.',
  },
  {
    id: 'gradient-noir-epure',
    name: 'Noir Épuré (Obsidienne & Carbone)',
    category: 'minimal',
    backgroundClass: 'bg-neutral-950',
    backgroundStyle: {
      background: `radial-gradient(ellipse at 50% 10%, rgba(30, 41, 59, 0.45) 0%, transparent 65%),
                   linear-gradient(180deg, #090B0E 0%, #0F1318 50%, #07090C 100%)`,
    },
    accentColor: '#F8FAFC',
    isDark: true,
    previewBg: 'linear-gradient(180deg, #1A1F26 0%, #0E1217 60%, #07090C 100%)',
    description: 'Noir profond architectural et textures feutrées pour une immersion nocturne haut de gamme.',
  },
  {
    id: 'kanbanex-horizon',
    name: 'KanbanEx Horizon (Photo Panoramique)',
    category: 'cinematic',
    backgroundClass: 'bg-kanbanex-wallpaper',
    accentColor: '#FF7A00',
    isDark: true,
    isWallpaper: true,
    desktopBg: '/images/kanbanex-desktop.jpg',
    mobileBg: '/images/kanbanex-mobile.jpg',
    previewBg: 'url(/images/kanbanex-desktop.jpg) center/cover',
    description: 'Arrière-plan signature panoramique responsive (desktop & mobile).',
  },
  {
    id: 'pure-white',
    name: 'Blanc Épuré & Trame Fine',
    category: 'minimal',
    backgroundClass: 'bg-slate-50',
    backgroundStyle: {
      backgroundColor: '#F8FAFC',
      backgroundImage: `radial-gradient(#E2E8F0 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    },
    accentColor: '#FF7A00',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
    description: 'Fond blanc épuré haute clarté, contraste maximal et focus absolu sur les tâches.',
  },
  {
    id: 'silk-flow',
    name: 'Courbes de Soie Métallique',
    category: 'silk',
    backgroundClass: 'bg-silk-pattern',
    backgroundStyle: {
      backgroundColor: '#1E232A',
      backgroundImage: `radial-gradient(at 0% 0%, rgba(55, 65, 81, 0.4) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(30, 41, 59, 0.7) 0px, transparent 50%),
                        linear-gradient(135deg, #181C24 0%, #222834 40%, #151820 100%)`,
    },
    accentColor: '#FF7A00',
    isDark: true,
    previewBg: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
    description: 'Courbes soyeuses et ondes métalliques contemporaines inspirées de l\'élégance Trello.',
  },
  {
    id: 'warm-sunrise',
    name: 'Aurore Expansion (Dégradé Chaud)',
    category: 'gradient',
    backgroundClass: 'bg-gradient-to-br from-orange-50 via-amber-50/50 to-slate-100',
    backgroundStyle: {
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 35%, #F8FAFC 100%)',
    },
    accentColor: '#EA580C',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FFF7ED 100%)',
    description: 'Dégradé solaire chaleureux reflétant l\'énergie et la signature de la marque Expansion.',
  },
  {
    id: 'azure-sky',
    name: 'Ciel Clair & Azur',
    category: 'gradient',
    backgroundClass: 'bg-gradient-to-br from-sky-50 via-blue-50/40 to-slate-100',
    backgroundStyle: {
      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 40%, #F8FAFC 100%)',
    },
    accentColor: '#0284C7',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    description: 'Horizon lumineux et apaisant offrant une clarté visuelle reposante.',
  },
  {
    id: 'soft-mesh',
    name: 'Mesh Gradient Moderne',
    category: 'gradient',
    backgroundClass: 'bg-slate-100',
    backgroundStyle: {
      background: `radial-gradient(at 10% 10%, rgba(254, 215, 170, 0.4) 0px, transparent 50%),
                   radial-gradient(at 90% 15%, rgba(186, 230, 253, 0.4) 0px, transparent 50%),
                   radial-gradient(at 50% 90%, rgba(233, 213, 255, 0.3) 0px, transparent 50%),
                   #F8FAFC`,
    },
    accentColor: '#F97316',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #FED7AA 0%, #BAE6FD 50%, #E9D5FF 100%)',
    description: 'Dégradé mesh multicouche contemporain aux reflets pastel subtils.',
  },
  {
    id: 'mineral-slate',
    name: 'Brume Minérale & Argent',
    category: 'minimal',
    backgroundClass: 'bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-200',
    backgroundStyle: {
      background: 'linear-gradient(145deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)',
    },
    accentColor: '#475569',
    isDark: false,
    previewBg: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)',
    description: 'Tons minéraux équilibrés pour une concentration sans distraction visuelle.',
  },
  {
    id: 'vast-skies',
    name: 'Vastes Ciels Célestes',
    category: 'celestial',
    backgroundClass: 'bg-slate-900',
    backgroundStyle: {
      background: 'linear-gradient(135deg, #0F172A 0%, #0369A1 50%, #020617 100%)',
    },
    accentColor: '#38BDF8',
    isDark: true,
    previewBg: 'linear-gradient(135deg, #0369A1 0%, #0F172A 60%, #020617 100%)',
    description: 'Ouverture contemplative sur les étendues célestes d\'azur et d\'infini.',
  },
  {
    id: 'downhill',
    name: 'Downhill Crépuscule',
    category: 'nature',
    backgroundClass: 'bg-neutral-900',
    backgroundStyle: {
      background: 'linear-gradient(135deg, #78350F 0%, #451A03 50%, #0B0D11 100%)',
    },
    accentColor: '#F97316',
    isDark: true,
    previewBg: 'linear-gradient(135deg, #78350F 0%, #451A03 50%, #0B0D11 100%)',
    description: 'Vigueur des crêtes rocheuses et perspectives au couchant.',
  },
];

export function getThemeById(id?: string | null): ProjectTheme {
  const found = CINEMATIC_THEMES.find((t) => t.id === id || (id === 'kabanex-horizon' && t.id === 'kanbanex-horizon'));
  // Default to KanbanEx Horizon official brand wallpaper
  return found || CINEMATIC_THEMES[0];
}

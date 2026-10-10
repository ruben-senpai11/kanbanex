import { PrismaClient, SystemRole, BillingInterval } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('--- KanbanEX: Initialisation Système (Strict Zero Dummy Data) ---');

  // 1. Seed Subscription Plans (System defined, admin configurable)
  const defaultPlans = [
    {
      slug: 'starter',
      name: 'Visionnaire',
      description: 'Pour les créateurs, fondateurs et indépendants',
      price: 0,
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: false,
      maxProjects: -1,
      maxMembersPerProject: 3,
      features: {
        unlimitedBoards: true,
        calendarView: true,
        signatureThemes: true,
        maxMembers: 3,
      },
      isActive: true,
    },
    {
      slug: 'pro',
      name: 'Éclosion',
      description: 'Pour les équipes et projets en pleine éclosion',
      price: 5000,
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: false,
      maxProjects: -1,
      maxMembersPerProject: -1,
      features: {
        starterFeatures: true,
        ganttChart: true,
        unlimitedMembers: true,
        fullCinematicThemes: true,
        instantSecurePayment: true,
      },
      isActive: true,
    },
    {
      slug: 'entreprise',
      name: 'Expansion',
      description: 'Pour les grandes organisations & le Super Admin',
      price: 15000,
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: true,
      maxProjects: -1,
      maxMembersPerProject: -1,
      features: {
        proFeatures: true,
        superAdminConsole: true,
        unlimitedWorkspaces: true,
        advancedPricing: true,
        dedicatedSupport247: true,
      },
      isActive: true,
    },
  ];

  for (const plan of defaultPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
      },
      create: plan,
    });
    console.log(`Plan vérifié: ${plan.name} (${plan.price} ${plan.currency})`);
  }

  // 2. Seed System Settings
  const defaultSettings = [
    {
      key: 'FEDAPAY_ENABLED',
      value: { enabled: true, environment: 'sandbox' },
      description: 'Configuration du module de paiement FedaPay',
    },
    {
      key: 'REGISTRATION_OPEN',
      value: { enabled: true },
      description: 'Autoriser les nouvelles inscriptions sur KanbanEX',
    },
    {
      key: 'DEFAULT_THEME_LIBRARY',
      value: {
        themes: [
          { id: 'downhill', name: 'Downhill Horizon', gradient: 'from-amber-600 to-orange-950', isPremium: true },
          { id: 'vast-skies', name: 'Vastes Ciels', gradient: 'from-sky-700 via-indigo-900 to-slate-950', isPremium: true },
          { id: 'horizons', name: 'Horizons Infinis', gradient: 'from-orange-500 via-rose-700 to-slate-900', isPremium: true },
          { id: 'futurism', name: 'Futurisme EX', gradient: 'from-violet-600 via-fuchsia-900 to-black', isPremium: true },
          { id: 'lumiere', name: 'Lumière Divine', gradient: 'from-amber-400 via-orange-600 to-stone-900', isPremium: true },
          { id: 'exploration', name: 'Exploration Cosmique', gradient: 'from-cyan-600 via-blue-900 to-slate-950', isPremium: true },
          { id: 'ascension', name: 'Ascension Céleste', gradient: 'from-amber-500 via-yellow-700 to-slate-900', isPremium: true },
          { id: 'architecture', name: 'Architecture Moderne', gradient: 'from-zinc-600 via-stone-800 to-black', isPremium: true },
        ],
      },
      description: 'Bibliothèque des univers visuels cinématographiques',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('--- Initialisation Système KanbanEX terminée avec succès (0 donnée fictive) ---');
}

main()
  .catch((e) => {
    console.error('Erreur seed KanbanEX:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

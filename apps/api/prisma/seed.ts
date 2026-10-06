import { PrismaClient, SystemRole, BillingInterval } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('--- KanbanEX: Initialisation Système (Strict Zero Dummy Data) ---');

  // 1. Seed Subscription Plans (System defined, admin configurable)
  const defaultPlans = [
    {
      slug: 'basic',
      name: 'Basic',
      description: 'Pour démarrer et organiser vos projets personnels.',
      price: 0,
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: false,
      maxProjects: 3,
      maxMembersPerProject: 2,
      features: {
        customThemes: false,
        advancedOverview: false,
        ganttExport: false,
        unlimitedCollaborators: false,
        prioritySupport: false,
      },
      isActive: true,
    },
    {
      slug: 'eclosion',
      name: 'Eclosion',
      description: 'Pour les équipes dynamiques exigeant l\'univers visuel et la puissance de planification.',
      price: 5000, // 5000 FCFA as specified
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: false,
      maxProjects: 25,
      maxMembersPerProject: 15,
      features: {
        customThemes: true,
        advancedOverview: true,
        ganttExport: true,
        unlimitedCollaborators: false,
        prioritySupport: true,
      },
      isActive: true,
    },
    {
      slug: 'entreprise',
      name: 'Entreprise',
      description: 'L\'expérience intégrale sans compromis pour les organisations à forte croissance.',
      price: 25000, // Configurable via Admin
      currency: 'XOF',
      billingInterval: BillingInterval.MONTHLY,
      isCustomPrice: true,
      maxProjects: -1, // Unlimited
      maxMembersPerProject: -1, // Unlimited
      features: {
        customThemes: true,
        advancedOverview: true,
        ganttExport: true,
        unlimitedCollaborators: true,
        prioritySupport: true,
        auditLogs: true,
        dedicatedAccountManager: true,
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

  // 2. Seed Super Admin (Single initial system administrator)
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'admin@kanbanex.expansion.io';
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!Secure';
  const superAdminName = process.env.SUPERADMIN_NAME || 'Expansion SuperAdmin';

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const passwordHash = await argon2.hash(superAdminPassword);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash,
        fullName: superAdminName,
        role: SystemRole.SUPER_ADMIN,
        isEmailVerified: true,
      },
    });
    console.log(`Compte Super Admin système créé: ${superAdminEmail}`);
  } else {
    console.log(`Compte Super Admin existant: ${superAdminEmail}`);
  }

  // 3. Seed System Settings
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

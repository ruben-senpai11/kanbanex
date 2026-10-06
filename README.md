# KanbanEX — Écosystème Expansion

> **SaaS commercial de gestion de projets premium**, combinant la fluidité visuelle de Trello avec la puissance d'une suite de pilotage stratégique : vue panoramique signature **Projects Overview**, triple synchronisation temps réel (**Kanban Classic**, **Gantt interactif**, **Calendrier**), personnalisation cinématographique, multi-tenancy sécurisé, facturation **FedaPay** en FCFA et console **Super Admin**.

---

## 1. Vision & Fonctionnalité Signature : Projects Overview

### A. "Tous mes projets" (Vue Panoramique Horizontale)
* **Présentation panoramique** : cartes verticales occupant ~25% de la largeur d'écran, alignées horizontalement.
* **Navigation multi-modale** :
  1. Molette de souris / trackpad horizontal
  2. Glissement de souris interactif avec **inertie naturelle**
  3. Barre de défilement horizontale stylisée
  4. Flèches de navigation flottantes gauche / droite
  5. Swipe tactile sur mobile & tablette
* **Cartes Projets Riches** :
  * Identité visuelle cinématographique propre
  * Période planifiée vs dates réelles de démarrage/fin
  * Métriques de tâches réelles : total, terminées, en cours, et alerte dynamique de tâches en retard
  * Barre de progression globale en pourcentage
  * Avatars de l'équipe et de l'initiateur
  * Prochaine échéance imminente et dernière activité enregistrée

### B. Univers Visuels Cinématographiques Intégrés
Bibliothèque de thèmes exclusifs (sans surcharge ni kitsch) :
* *Vastes Ciels*, *Downhill Horizon*, *Horizons Infinis*, *Futurisme Expansion*, *Lumière Première*, *Exploration Épique*, *Ascension Céleste*, *Architecture Moderne*.
* Sélecteur de couleur d'accent hexadécimale personnalisée.

---

## 2. Triple Vues Synchronisées (Source Unique de Vérité)

Toutes les vues partagent strictement les mêmes données métier :

1. **Kanban Classic** :
   * Colonnes configurables avec indicateur couleur (*À faire*, *En cours*, *En review*, *Terminé*...)
   * Glisser-déposer (Drag & Drop) fluide des cartes et des colonnes
   * Création rapide inline de cartes
   * Badges d'échéances avec alerte visuelle de retard, ratios de checklists (ex: 3/5), commentaires et collaborateurs
2. **Gantt Interactif** :
   * Timeline avec zoom temporel (*Jours*, *Semaines*, *Mois*)
   * Barres de tâches positionnées sur les dates réelles (`startDate`, `dueDate`)
   * Manipulation directe : déplacement de période par glissement, redimensionnement des dates par poignées latérales
   * Remplissage de progression intégré dans chaque barre
   * Liens et flèches de dépendances entre tâches
3. **Calendrier de Projet & Global** :
   * Vues *Mois*, *Semaine*, *Jour*
   * Rendu des tâches par date d'échéance et pastille de statut
4. **Tiroir Latéral de Tâche (Task Drawer)** :
   * Panneau coulissant sans rupture de contexte
   * Titre éditable inline, sélecteur de colonne, statut et priorité
   * Planification temporelle (`startDate`, `dueDate`, `dueTime`, `estimatedHours`, slider de progression)
   * Assignation multi-collaborateurs
   * Étiquettes colorées avec recherche
   * Listes de contrôle (Checklists) multiples avec sous-tâches et progression
   * Fil de discussion et commentaires horodatés
   * Historique d'audit des modifications

---

## 3. SaaS, Facturation FedaPay & Espace Super Admin

* **Zéro Donnée Fictive (Zero Dummy Data)** : Strictement aucun faux projet, fausse tâche ou faux utilisateur créé artificiellement. De vrais *Empty States* guidant l'utilisateur.
* **Plans d'abonnement dynamiques** :
  * **Basic** : Gratuit
  * **Eclosion** : **5 000 FCFA** / mois (par défaut)
  * **Entreprise** : Configurable
  * *Note : Les prix ne sont jamais codés en dur dans le frontend ; ils proviennent dynamiquement de la base de données PostgreSQL.*
* **Intégration FedaPay** :
  * Création de sessions de paiement et redirection FedaPay
  * Vérification côté serveur (source de vérité absolue)
  * Webhook idempotent (`transaction.approved`) avec mise à niveau immédiate de l'espace de travail
* **Console Super Admin** :
  * Statistiques de plateforme : total utilisateurs, workspaces, projets actifs, volume FCFA collecté
  * Gestionnaire de prix et quotas en direct (modification des tarifs en FCFA sans redéploiement)
  * Gestion des utilisateurs et bascule de rôles (`USER` / `SUPER_ADMIN`)
  * Audit des transactions FedaPay globales

---

## 4. Architecture Technique

```
KanbanEx/
├── apps/
│   ├── api/                   # Backend NestJS + Fastify + Prisma (PostgreSQL + UUIDv7)
│   │   ├── prisma/            # Schéma Prisma, migrations et seed Super Admin
│   │   ├── src/
│   │   │   ├── modules/       # Auth (Argon2id + JWT), Workspaces, Projects, Boards,
│   │   │   │                  # Tasks, Labels, Gantt, Calendar, Comments, Activity,
│   │   │   │                  # Billing (FedaPay), Admin, Entitlements, Search
│   │   │   └── main.ts        # Bootstrap Fastify, Swagger (/api/docs), Helmet, CORS
│   │   └── test/              # Tests Jest unitaires et d'intégration
│   ├── web/                   # Frontend Next.js (App Router, React 18, TailwindCSS)
│   │   ├── src/
│   │   │   ├── app/           # Routes: /overview, /projects/[id], /calendar, /billing, /admin, /login, /signup
│   │   │   ├── components/    # Projects Overview panoramique, Kanban, Gantt, Calendar, Drawer
│   │   │   └── lib/           # API client, AuthContext, thèmes cinématographiques, tokens
│   └── desktop/               # Configuration Tauri prête pour Windows native app
├── .env.example               # Template de configuration d'environnement complet
└── package.json               # Workspaces npm racine
```

---

## 5. Démarrage Rapide

### Prérequis
* Node.js v20+ ou v24+
* PostgreSQL (ou instance PostgreSQL distante via `DATABASE_URL`)

### Installation & Génération Prisma
```bash
npm install
npx prisma generate --schema=apps/api/prisma/schema.prisma
```

### Initialisation de la Base de Données (Seed Strict)
```bash
# Applique le schéma et lance le seed système (Super Admin et plans par défaut)
npm --workspace=apps/api run prisma:push
npm --workspace=apps/api run prisma:seed
```

### Lancement en Développement
```bash
# Lance simultanément le backend Fastify (port 4000) et le frontend Next.js (port 3000)
npm run dev:api
npm run dev:web
```

* **Frontend Web** : [http://localhost:3000](http://localhost:3000)
* **Documentation OpenAPI Swagger** : [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
* **API REST** : [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

---

## 6. Vérification & Validation

Tous les tests et builds compilent avec succès :

```bash
# Vérification des types TypeScript et Linting
npm run lint

# Exécution des suites de tests unitaires et d'intégration
npm run test

# Compilation du build de production Next.js et NestJS
npm run build
```

---

## 7. Identité Visuelle & Tokens
* **Charte** : Dégradé orange chaud `linear-gradient(135deg, #FF7A00 0%, #FF4500 100%)` couplé à une palette neutre sombre cinématographique (`#0B0D11`, `#12151C`, `#181D26`).
* **Design System** : Typographie claire, contrastes élevés respectant WCAG AA, gestion du `prefers-reduced-motion`.

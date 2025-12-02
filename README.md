# 🎨 Design System Generator

> **Générateur de design system moderne** avec exports multiples (CSS Variables, Tailwind Config, JSON, PDF)

Une application web élégante permettant de créer rapidement un design system complet : palettes de couleurs harmonieuses, typographie, espacement, ombres, et composants UI. Exportez votre système dans plusieurs formats pour l'intégrer immédiatement dans vos projets.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-1.11-EF4444?logo=turborepo)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!-- ![Design System Generator Screenshot](screenshot.png) -->
<!-- TODO: Ajouter une capture d'écran de l'application -->
<img width="1903" height="852" alt="image" src="https://github.com/user-attachments/assets/6fc1a4e1-ec19-48de-9dad-ee6717d15561" />


[LIEN VERS LA DEMO](https://design-system-app-docs.vercel.app/)

---

## 🎯 Problématique

Ce projet résout le problème de **création manuelle et chronophage de design systems** :

- **Créer des palettes cohérentes** : Générer automatiquement 11 nuances (50-950) à partir de 2 couleurs principales
- **Définir une typographie harmonieuse** : Choisir parmi 22 Google Fonts populaires avec preview en temps réel
- **Établir un système d'espacement** : Échelle cohérente basée sur un module de base
- **Exporter dans tous les formats** : CSS Variables, Tailwind Config, JSON, PDF complet
- **Gagner du temps** : 5 minutes vs 2 heures de configuration manuelle

### Cas d'usage concrets :
- 🎨 **Designers** : Créer rapidement une identité visuelle cohérente
- 💻 **Développeurs web** : Intégrer un design system dans un projet React/Vue/Angular
- 🏢 **Agences** : Standardiser l'apparence de plusieurs sites clients
- 📚 **Équipes produit** : Documenter les tokens design dans un PDF partageable

## ✨ Fonctionnalités

- 🎨 **Palettes de couleurs automatiques** : 6 palettes (Primary, Secondary, Neutral, Success, Warning, Error) avec 11 nuances chacune
- 🔤 **22 Google Fonts** avec recherche instantanée et chargement dynamique
- 📏 **Système d'espacement** : Échelle de xs à 4xl basée sur un module configurable
- 🎭 **Ombres portées** : 4 niveaux (sm, md, lg, xl) générés automatiquement
- 📐 **Border-radius** : Scale de none à full pour tous vos besoins
- 👁️ **Preview en temps réel** : Visualisez vos composants (Button, Input, Card) instantanément
- 📤 **Exports multiples** :
  - **CSS Variables** : Prêt à copier dans votre `styles.css`
  - **Tailwind Config** : Configuration `tailwind.config.js` complète
  - **JSON** : Structure complète pour import programmatique
  - **PDF** : Documentation complète avec toutes les palettes et tokens
- 🌙 **Mode sombre** élégant avec toggle et persistance localStorage
- 📱 **Responsive** : Interface adaptée mobile, tablette, desktop
- 🎯 **Layout 30/70** : Configuration compacte, preview spacieux
- 🖱️ **Scrollbar custom** : Gradient indigo-purple assorti au thème
- ⚡ **Monorepo Turborepo** : Architecture scalable et modulaire

## 🛠️ Technologies

### Frontend
- **React 18.2** avec hooks modernes (useState, useEffect)
- **TypeScript 5.3** pour le typage fort et la maintenabilité
- **Vite 5.0** pour un build ultra-rapide et HMR instantané
- **Tailwind CSS 3.4** avec configuration custom
- **react-colorful** pour les color pickers intuitifs
- **chroma-js** pour la génération de palettes harmonieuses
- **jsPDF** pour l'export PDF professionnel
- **webfontloader** pour le chargement dynamique de Google Fonts

### Packages Internes
- **@design-system/tokens** : Engine de génération de tokens (colors, typography, spacing, shadows)
- **@design-system/ui** : Composants React réutilisables (Button, Input, Card) avec Storybook 7.6

### Build & DevOps
- **Turborepo 1.11** pour la gestion de monorepo performante
- **tsup 8.0** pour le build des packages TypeScript
- **Vercel** ready pour déploiement en un clic
- **Git** pour le versioning

### Documentation
- **Astro 4.0** pour la documentation statique ultra-rapide

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Git

### Installation rapide

```powershell
# Cloner le repository
git clone https://github.com/Atangui/design-system-generator.git
cd design-system-generator

# Installer toutes les dépendances (monorepo)
npm install

# Lancer en mode développement
npm run dev
```

L'application sera disponible sur :
- **Generator** : `http://localhost:3000`
- **Documentation** : `http://localhost:4000`

### Build pour production

```powershell
# Build de tout le monorepo
npm run build

# Preview de la version production
cd apps/generator
npm run preview
```

## 📖 Guide d'utilisation

### 1️⃣ Configurer vos couleurs

1. **Couleurs principales** :
   - Cliquez sur le sélecteur **Primary Color** pour votre couleur dominante
   - Cliquez sur **Secondary Color** pour votre couleur d'accentuation
   - L'algorithme génère automatiquement 11 nuances pour chaque couleur (50-950)

2. **Couleurs sémantiques** :
   - **Success** (vert) pour les actions positives
   - **Warning** (orange) pour les alertes
   - **Error** (rouge) pour les erreurs
   - Ajustez chaque couleur selon votre charte graphique

💡 **Astuce** : Une palette **Neutral** (gris) est automatiquement générée pour les backgrounds et textes

### 2️⃣ Choisir votre typographie

1. **Font principale** : Utilisez la recherche pour filtrer parmi 22 Google Fonts populaires
2. **Font titres** : Sélectionnez une police d'accentuation (peut être identique à la principale)
3. **Preview en temps réel** : "The quick brown fox jumps over the lazy dog" s'affiche avec votre police

💡 **Fonts disponibles** : Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Source Sans Pro, Raleway, Nunito, Ubuntu, Work Sans, Merriweather, PT Sans, Fira Sans, DM Sans, Space Grotesk, Plus Jakarta Sans, Outfit, Manrope, IBM Plex Sans, Sora, Epilogue

### 3️⃣ Définir votre espacement

1. **Module de base** : Ajustez le slider entre 4px et 16px
2. **Échelle générée** : xs, sm, md, lg, xl, 2xl, 3xl, 4xl (multiples du module)
3. **Preview** : Les espacements s'affichent visuellement dans l'onglet Espacement

💡 **Recommandé** : 8px pour une échelle standard, 4px pour plus de précision, 16px pour du "large spacing"

### 4️⃣ Visualiser les composants

- **Button** : Variantes Primary, Secondary, Danger avec vos couleurs
- **Input** : Champs de formulaire stylisés
- **Card** : Carte avec titre, description, ombre

Tous les composants utilisent automatiquement votre design system !

### 5️⃣ Exporter votre système

1. **Cliquez sur un bouton d'export** en haut de l'interface :

   **📄 CSS Variables** :
   ```css
   :root {
     --color-primary-500: #6366f1;
     --color-secondary-500: #a855f7;
     --spacing-md: 16px;
     --font-sans: 'Inter', sans-serif;
   }
   ```

   **⚙️ Tailwind Config** :
   ```javascript
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: { 500: '#6366f1', ... },
         },
       },
     },
   };
   ```

   **📋 JSON** :
   ```json
   {
     "config": { "primaryColor": "#6366f1", ... },
     "tokens": { "colors": { ... }, "typography": { ... } }
   }
   ```

   **📑 PDF** :
   - Documentation complète avec toutes les palettes
   - Typographie, espacement, ombres, border-radius
   - Prêt à partager avec votre équipe

2. **Fichier téléchargé automatiquement** 🎉

---

## 🎬 Exemple de scénario complet

1. **Définissez vos couleurs** : Primary #6366f1 (indigo), Secondary #a855f7 (purple)
2. **Choisissez Inter** pour la typographie (body et headings)
3. **Réglez l'espacement** à 8px (standard)
4. **Visualisez** vos composants Button/Input/Card avec ces couleurs
5. **Exportez en Tailwind Config** pour intégrer dans votre projet React
6. ✅ **Design system prêt en 5 minutes** !

---

## 🚀 Démarrage rapide

### Option 1 : Lancer avec npm scripts (recommandé)

```powershell
# Depuis la racine du monorepo
npm run dev
```

Turborepo lance automatiquement tous les workspaces en parallèle.

### Option 2 : Lancer uniquement le generator

```powershell
cd apps/generator
npm run dev
```

**Accès :**
- Generator : http://localhost:3000
- Docs : http://localhost:4000 (si lancé)

---

## 🎨 Architecture

```
design-system-generator/
├── apps/
│   ├── generator/          # Application principale React
│   │   ├── src/
│   │   │   ├── App.tsx           # Composant racine + gestion état
│   │   │   ├── index.css         # Styles globaux + scrollbar custom
│   │   │   └── main.tsx          # Point d'entrée React
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── docs/               # Documentation Astro
│       ├── src/
│       │   ├── pages/
│       │   │   └── index.astro   # Page d'accueil docs
│       │   └── layouts/
│       │       └── Layout.astro  # Layout principal
│       ├── astro.config.mjs
│       └── package.json
│
├── packages/
│   ├── tokens/             # Engine de génération de tokens
│   │   ├── src/
│   │   │   └── index.ts          # generateDesignTokens(), exports
│   │   ├── tsup.config.ts
│   │   └── package.json
│   │
│   └── ui/                 # Composants React réutilisables
│       ├── src/
│       │   ├── Button.tsx        # Composant Button
│       │   ├── Input.tsx         # Composant Input
│       │   ├── Card.tsx          # Composant Card
│       │   ├── *.stories.tsx     # Stories Storybook
│       │   └── index.ts          # Exports publics
│       ├── tsup.config.ts
│       └── package.json
│
├── turbo.json              # Configuration Turborepo
├── package.json            # Root package (workspaces)
├── vercel.json             # Config déploiement Vercel
└── README.md
```

### Flux de données

```
User Input (App.tsx)
  ↓
DesignConfig (state)
  ↓
generateDesignTokens() (@design-system/tokens)
  ↓
Design Tokens (colors, typography, spacing, shadows)
  ↓
Preview Components (Button, Input, Card)
  ↓
Export (CSS / Tailwind / JSON / PDF)
```

## 📡 API du package @design-system/tokens

### `generateDesignTokens(config)`

Génère un design system complet à partir d'une configuration.

**Paramètres :**
```typescript
interface DesignConfig {
  primaryColor: string;      // Couleur principale (hex)
  secondaryColor: string;    // Couleur secondaire (hex)
  successColor: string;      // Couleur succès (hex)
  warningColor: string;      // Couleur warning (hex)
  errorColor: string;        // Couleur erreur (hex)
  baseSpacing: number;       // Module d'espacement (px)
  fontFamily: string;        // Font body (ex: 'Inter')
  headingFont: string;       // Font headings (ex: 'Inter')
}
```

**Retourne :**
```typescript
interface DesignTokens {
  colors: {
    primary: { 50: string, 100: string, ..., 950: string },
    secondary: { ... },
    neutral: { ... },
    success: { ... },
    warning: { ... },
    error: { ... }
  },
  typography: {
    fontSize: { xs: string, sm: string, ..., '5xl': string },
    fontFamily: { sans: string, serif: string, mono: string },
    fontWeight: { light: number, normal: number, ..., bold: number },
    lineHeight: { tight: number, normal: number, relaxed: number }
  },
  spacing: { xs: string, sm: string, ..., '4xl': string },
  borderRadius: { none: string, sm: string, ..., full: string },
  shadows: { sm: string, md: string, lg: string, xl: string }
}
```

### `exportToCSSVariables(tokens)`

Exporte les tokens en CSS Variables.

**Retourne :**
```css
:root {
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  /* ... */
  --spacing-md: 16px;
  --font-sans: 'Inter', sans-serif;
}
```

### `exportToTailwindConfig(tokens)`

Exporte les tokens en configuration Tailwind.

**Retourne :**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          // ...
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        // ...
      },
    },
  },
};
```

## 🔮 Améliorations futures

- [ ] **Undo/Redo** : Historique des modifications avec Ctrl+Z
- [ ] **Presets** : Bibliothèque de design systems pré-configurés (Material, iOS, Fluent)
- [ ] **Import** : Charger un design system existant depuis JSON
- [ ] **Thème sombre/clair** : Générer automatiquement les 2 modes
- [ ] **Variables CSS** : Support des modes avec `prefers-color-scheme`
- [ ] **Composants avancés** : Modal, Dropdown, Tabs, Accordion
- [ ] **Export Figma** : Plugin pour synchroniser avec Figma
- [ ] **Export Sketch** : Format .sketch pour designers
- [ ] **Tests automatisés** : Vitest (unit) + Playwright (E2E)
- [ ] **CI/CD** : GitHub Actions pour tests et déploiement auto
- [ ] **Authentification** : Sauvegarder et partager vos design systems
- [ ] **Collaboration** : Édition multi-utilisateurs en temps réel
- [ ] **Analytics** : Dashboard d'utilisation des tokens dans vos projets
- [ ] **CLI** : `npx design-system-generator init` pour scaffolding

---

## 📝 Licence

MIT License - Open Source

Vous êtes libre d'utiliser, modifier et distribuer ce projet.

---

## 👨‍💻 Auteur

**Développé avec une approche AI-Augmented Engineering**

Ce projet démontre :
- ✅ Architecture monorepo moderne et scalable (Turborepo)
- ✅ Maîtrise des technologies React, TypeScript, Tailwind CSS
- ✅ Algorithmes de génération de couleurs (chroma-js, HSL)
- ✅ Pratiques de développement modernes (composants réutilisables, typage fort)
- ✅ Résolution de problèmes complexes (export PDF multi-pages, font loading dynamique)
- ✅ Orchestration d'outils d'IA pour accélérer le développement
- ✅ Capacité à créer des outils pour designers et développeurs

💡 **Note :** Ce projet a été développé en utilisant l'IA (GitHub Copilot, Claude) comme assistants de développement, sous ma supervision technique et architecturale complète.

**Approche :**
- 🎯 **Architecture** : Conception humaine (stack, structure, flux)
- 🤖 **Implémentation** : AI-augmented (génération de code, boilerplate)
- 🔍 **Validation** : Review humaine (tests, refactoring, optimisation)
- 📚 **Documentation** : Collaboration AI + expertise technique

---

## 📫 Contact

Pour toute question ou opportunité professionnelle :
- GitHub : [Atangui](https://github.com/Atangui)
- LinkedIn : [Charles A.](https://www.linkedin.com/in/charlesatangui/)
- Email : atanguicharles[at]gmail[dot]com

---

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile sur GitHub !**

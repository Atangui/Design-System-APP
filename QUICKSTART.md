# Quick Start Guide

## 🚀 Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer tous les projets

```bash
npm run dev
```

Cela va démarrer :
- **Generator** sur http://localhost:3000
- **Docs** sur http://localhost:4000
- Vous pouvez lancer Storybook séparément avec `npm run storybook` sur http://localhost:6006

### 3. Build le projet

```bash
npm run build
```

## 📂 Structure du Projet

```
design-system-generator/
├── apps/
│   ├── generator/     # Application principale (React + Vite)
│   │   ├── src/
│   │   │   ├── App.tsx          # Interface du générateur
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   └── package.json
│   │
│   └── docs/          # Documentation (Astro)
│       ├── src/
│       │   ├── pages/
│       │   │   └── index.astro  # Page d'accueil
│       │   └── layouts/
│       └── package.json
│
├── packages/
│   ├── tokens/        # Génération de design tokens
│   │   ├── src/
│   │   │   └── index.ts         # Fonctions de génération
│   │   └── package.json
│   │
│   └── ui/            # Composants React
│       ├── src/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Input.tsx
│       │   └── index.ts
│       ├── .storybook/           # Configuration Storybook
│       └── package.json
│
└── package.json       # Configuration racine
```

## 🎨 Utilisation

### Générateur (localhost:3000)

1. Choisissez votre couleur primaire
2. Configurez votre couleur secondaire
3. Ajustez l'espacement de base (2-16px)
4. Sélectionnez votre police de caractères
5. Prévisualisez votre design system en temps réel
6. Exportez en CSS, Tailwind ou JSON

### Documentation (localhost:4000)

- Vue d'ensemble du projet
- Exemples de composants
- Guide d'utilisation
- Démos interactives

### Storybook (localhost:6006)

```bash
cd packages/ui
npm run storybook
```

Visualisez et testez les composants React :
- Button (4 variantes)
- Input (avec labels, erreurs)
- Card (3 styles)

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev           # Lance tous les projets
npm run build        # Build tous les projets
npm run clean        # Nettoie les dossiers dist

# Format
npm run format       # Formatte le code avec Prettier

# Storybook
npm run storybook    # Lance Storybook
```

## 📦 Packages

### @design-system/tokens

Générez des design tokens à partir de configurations personnalisées.

```typescript
import { generateDesignTokens } from '@design-system/tokens';

const tokens = generateDesignTokens({
  primaryColor: '#0ea5e9',
  secondaryColor: '#64748b',
  baseSpacing: 4,
  fontFamily: 'Inter'
});
```

### @design-system/ui

Composants React avec TypeScript et props typées.

```tsx
import { Button, Card, Input } from '@design-system/ui';

function MyApp() {
  return (
    <Card variant="elevated">
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## 🐛 Résolution de Problèmes

### Erreur lors de l'installation

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install
```

### Erreur de build

```bash
# Nettoyez et rebuildez
npm run clean
npm run build
```

### Port déjà utilisé

Modifiez les ports dans :
- `apps/generator/vite.config.ts` (port 3000)
- `apps/docs/astro.config.mjs` (port 4000)
- `packages/ui/.storybook/main.ts` (port 6006)

## 📝 Prochaines Étapes

1. Personnalisez les composants dans `packages/ui/src/`
2. Ajoutez de nouveaux tokens dans `packages/tokens/src/`
3. Créez de nouvelles pages dans `apps/docs/src/pages/`
4. Améliorez l'interface dans `apps/generator/src/App.tsx`

## 🤝 Contribution

Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines de contribution.

## 📄 License

MIT - Voir [LICENSE](./LICENSE)

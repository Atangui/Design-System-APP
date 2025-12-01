# Contributing to Design System Generator

Merci de votre intérêt pour contribuer au Design System Generator ! 🎉

## Comment Contribuer

### Rapporter des Bugs

Si vous trouvez un bug, veuillez créer une issue avec :
- Une description claire du problème
- Les étapes pour reproduire le bug
- Le comportement attendu vs le comportement actuel
- Des captures d'écran si applicable
- Votre environnement (OS, Node version, etc.)

### Proposer des Fonctionnalités

Pour proposer une nouvelle fonctionnalité :
1. Vérifiez qu'elle n'existe pas déjà dans les issues
2. Créez une nouvelle issue avec le tag "enhancement"
3. Décrivez clairement la fonctionnalité et son utilité
4. Attendez les retours avant de commencer le développement

### Pull Requests

1. Fork le projet
2. Créez une branche depuis `main` :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. Faites vos modifications en suivant les standards du projet
4. Testez vos changements
5. Committez avec des messages clairs :
   ```bash
   git commit -m "feat: ajout de la fonctionnalité X"
   ```
6. Pushez vers votre fork :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
7. Ouvrez une Pull Request

### Standards de Code

- Utilisez TypeScript pour tout nouveau code
- Suivez les conventions de nommage existantes
- Ajoutez des types pour tout nouveau code
- Formatez avec Prettier (`npm run format`)
- Assurez-vous que le build passe (`npm run build`)

### Convention de Commits

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation uniquement
- `style:` Changements de formatage
- `refactor:` Refactoring de code
- `test:` Ajout ou modification de tests
- `chore:` Maintenance du projet

## Code de Conduite

Soyez respectueux et bienveillant envers tous les contributeurs.

## Questions ?

N'hésitez pas à ouvrir une issue pour toute question !

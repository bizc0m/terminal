# TERMINAL

Application web statique mobile-first pour délivrer des codes d’accès fictifs à utiliser dans Coopro.

TERMINAL ne prend aucune photo, ne génère aucun rapport et n’envoie aucun e-mail. Cette V1 ne contient aucun backend, aucun paiement réel, aucun script tiers de production, aucun cookie, aucun localStorage, aucun IndexedDB, aucun analytics, aucun pixel, aucun tracker, aucune publicité.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Vitest
- GitHub Pages

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvrir ensuite `/terminal` en local. Sur GitHub Pages, l’app est servie sous `/terminal/` et les pages internes utilisent le hash routing, par exemple `/terminal/#/privacy`.

## Tests

```bash
npm test
```

Les tests couvrent la génération de codes démo, la copie presse-papiers, le fallback de copie, le téléchargement `.txt`, la modale Coopro et l’absence d’utilisation de localStorage, cookies, IndexedDB et trackers.

## Build

```bash
npm run build
```

## GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit l’application et publie `dist`. Après build, `dist/index.html` est copié en `dist/404.html` comme filet de sécurité, mais la navigation publique utilise `/#/` pour éviter les statuts 404 sur GitHub Pages.

Configurer GitHub Pages sur “GitHub Actions”.

## API future

Cette version statique ne crée jamais de vrais codes utilisables côté navigateur. Les endpoints prévus sont :

- `POST /issue-paid-pack`
- `POST /issue-soul-pack`
- `POST /issue-solidarity-pack`

Une future API serveur sera seule responsable de créer les codes réels, de les stocker sous hash et de les rendre utilisables une fois.

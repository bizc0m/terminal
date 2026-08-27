# TERMINAL Design System

## Direction

TERMINAL utilise un langage rétro-futuriste industriel : borne murale, écran CRT, typographie monospace, lignes techniques et contraste phosphore. Le rendu évite tout logo, symbole, nom ou interface protégée d’un jeu existant.

## Palette

- Charbon : `#121511`
- Surface : `#1b2119`
- Ligne technique : `#506044`
- Phosphore : `#b8ff71`
- Ambre : `#ffc966`
- Texte secondaire : `#8ca579`
- Alerte douce : `#ff8e66`

Une seule famille d’accent est utilisée : phosphore vert avec ambre pour les lignes système.

## Typographie

Police système monospace uniquement :

```css
ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace
```

Aucune police externe n’est appelée en production.

## Composants

- `brand` : bouton de retour au terminal, aspect plaque de machine.
- `pack-card` : module d’offre, bordure fine et fond CRT.
- `output-panel` : baie de sortie, séquence système et ticket virtuel.
- `primary-action` : bouton phosphore, fort contraste.
- `secondary-action` : bouton sombre à bord phosphore.
- `modal-panel` : handoff Coopro sans URL contenant les codes.

Les coins restent presque carrés (`2px`) pour garder l’esthétique industrielle.

## Animations

- Apparition ligne par ligne des séquences terminal.
- Feedback tactile sur les boutons.
- Overlay scanline fixe.
- Respect de `prefers-reduced-motion` : les animations sont quasi instantanées quand la réduction de mouvement est demandée.

## Ton

Le ton est fonctionnel, français, direct. Les lignes système peuvent être en anglais pour l’effet terminal. Les textes ne prétendent jamais connaître les choix de l’utilisateur ailleurs, ne vérifient aucun don et n’indiquent aucun paiement réel.

## Règles de confidentialité UI

Le design affiche explicitement les compteurs statiques :

- `PERSONAL DATA REQUESTED: 0`
- `PERSONAL DATA STORED: 0`
- `PROFILES CREATED: 0`
- `DATA SOLD: 0`

Ces compteurs ne sont pas stockés et ne mesurent rien en réel.

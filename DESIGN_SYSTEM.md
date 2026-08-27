# TERMINAL Design System

## Direction

TERMINAL utilise un langage arcade industriel : coque de borne physique, écran CRT pixelisé, typographie monospace, lignes techniques et contraste phosphore. Le rendu évite tout logo, symbole, nom ou interface protégée d’un jeu existant.

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

- `arcade-cabinet` : coque de borne avec rivets, cadre métallique et marquee.
- `crt-shell` / `crt-glass` : écran rétro avec bombé visuel, grille pixel et scanlines.
- `pack-card` : module d’offre placé sur le deck de commandes.
- `output-panel` : baie de sortie cartridge, séquence système et tokens.
- `token-stats` : panneaux dédiés `TOKENS ISSUED`, `TOKENS REMAINING`, `ACCESS VALUE`, `COOPRO READY`.
- `primary-action` : bouton arcade phosphore avec relief mécanique.
- `secondary-action` : bouton arcade ambre avec relief mécanique.
- `modal-panel` : handoff Coopro sans URL contenant les codes.

La coque et les boutons utilisent des arrondis contrôlés pour évoquer une borne physique, tandis que l’écran et les tickets gardent des lignes pixel/CRT plus strictes.

## Animations

- Apparition ligne par ligne des séquences de boot jeu vidéo.
- Impression courte des tickets token.
- Feedback tactile sur les boutons arcade.
- Grille pixel et scanlines fixes.
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

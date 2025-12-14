# test01

Permet de tester la plateforme.

## Points d'entrée

Les fonctions suivantes regroupent la logique dans des modules JS simples et peuvent être importées directement depuis `src/js/index.js` :

- `initGame(config)` : initialise l'état à partir d'une configuration (joueurs, thème, son, chronomètre, joueur de départ).
- `resetGame()` : réinitialise l'état avec les valeurs par défaut.
- `applySettings(formValues)` : applique des réglages (valeurs issues d'un formulaire) en conservant la structure de configuration.
- `nextTurn()` : avance d'un tour et passe au joueur suivant.
- `getCurrentPlayer()` : expose le joueur actif courant.

### Modules
- `src/js/state.js` : store minimal avec abonnements et réinitialisation.
- `src/js/turns.js` : gestion des tours et du joueur courant.
- `src/js/config.js` : normalisation et application des paramètres de configuration.
- `src/js/index.js` : oriente les points d'entrée et relie la démo HTML.

## Styles

Le CSS est structuré avec des variables pour permettre des thèmes/skins ultérieurs :

- Variables globales : `src/css/variables.css`
- Styles principaux : `src/css/styles.css`

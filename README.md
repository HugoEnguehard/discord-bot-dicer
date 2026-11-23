# Dicer
Dicer is a Discord bot used to roll dices

The command is sent by the user with the "!roll" with "xdy" parametres, x being the number of dice and y the maximum value.
Dice's values are minimum equal to 0.

You can add or substract multiple dices like the following example: "!roll 2d3+1d5-2d2"
It's also possible to add or substract constants values like the following example: "!roll 1d100+5-12"

# Quick start
Change the path in StartBot.bat to the discord-bot-dicer/ folder

# Start project
"npm i" to import all modules for the project
"npm run dev:start" for development start
"npm run start" for casual start
# Combinaison Power UP
La commande `!raf` choisit une option au hasard dans chaque catégorie de `src/data/raf.json` et affiche la combinaison avec le nom du joueur.
Le fichier est relu à chaque commande : les changements sont pris en compte sans redémarrage.
Ajoutez autant de catégories que souhaité ; chaque clé sert de libellé et doit contenir une liste non vide de chaînes non vides.
Un fichier absent ou invalide produit un message d'erreur sans tirage partiel.

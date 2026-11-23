# Docker

Image Node 24 Debian Bookworm, npm ci --omit=dev, utilisateur node 1000. Secrets injectés à l’exécution, données exclues de l’image. Compose commun : tfoh-admin/deploy/discord-bots/compose.yaml. Guides : tfoh-admin/docs/discord-bots.md. Copier src/data dans data/dicer avant démarrage. TOKEN obligatoire ; autres variables dans .env.example. SIGTERM ferme le client Discord. Ne jamais démarrer avec un token déjà utilisé par PM2.


Sauvegarde et restauration complètes : tfoh-admin/docs/discord-bots-sauvegarde.md. Copier source/. pour inclure les fichiers cachés ; ne pas utiliser source/*. Les sources de production sont /srv/discord-bots/data/dicer, indépendantes des clones et images.
Le démarrage contrôle les ressources JSON, toutes les statistiques hebdomadaires et la possibilité d’écriture avant connexion Discord. Une migration vide ou incomplète échoue explicitement. Les statistiques sont remplacées atomiquement après synchronisation du fichier temporaire.

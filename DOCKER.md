# Docker

Image Node 24 Debian Bookworm, npm ci --omit=dev, utilisateur node 1000. Secrets injectés à l’exécution, données exclues de l’image. Compose commun : tfoh-admin/deploy/discord-bots/compose.yaml. Guides : tfoh-admin/docs/discord-bots.md. Copier src/data dans data/dicer avant démarrage. TOKEN obligatoire ; autres variables dans .env.example. SIGTERM ferme le client Discord. Ne jamais démarrer avec un token déjà utilis? par PM2.

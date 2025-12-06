module.exports = {
  name: 'help',
  description: 'Liste les commandes disponibles.',
  async execute(message, args) {
    try {
      const pageArg = args && args[0] ? args[0].trim() : '1';
      const page = pageArg === '2' ? 2 : 1;

      let reponse;

      if (page === 1) {
        reponse = `${'```'}Aide (page 1/2) - Commandes principales :

    - !roll [expression] :
        Lance un ou plusieurs dés et affiche le résultat ainsi que certains détails.
        Exemples :
          !roll 1d6
          !roll 2d8+3
          !roll 1d100 (messages spéciaux pour 1d100 très hauts / très bas)

    - !ping :
        Répond "Pong" avec une insulte aléatoire.

    - !fate [Option A / Option B / ...] :
        Laisse le destin choisir entre plusieurs options.
        Sans argument : répond OUI ou NON.
        Exemples :
          !fate
          !fate gauche / droite
          !fate A / B / C / D

    - !truth :
        Affiche une vérité universelle aléatoire (meta-JDR).

    - !between X Y :
        Donne un nombre aléatoire entre X et Y (inclus).
        Exemple :
          !between 1 20

    - !coin :
        Lance une pièce (pile ou face).

    (Tape !help 2 pour voir la page 2/2 : commandes avancées)
${'```'}`;
      } else {
        reponse = `${'```'}Aide (page 2/2) - Commandes avancées / utilitaires :

    - !stats all :
        Statistiques moyennes de tous les jets de 1d100 de tous les joueurs.

    - !stats JJ-MM-AAAA :
        Statistiques moyennes des 1d100 sur une date précise.
        Exemple :
          !stats 01-12-2025

    - !stats week [JJ-MM-AAAA] :
        Moyennes des 1d100 sur une période de 7 jours.
        Sans date : semaine courante.
        Avec date : semaine glissante à partir de cette date.
        Exemples :
          !stats week
          !stats week 01-12-2025

    - !stats month [MM-AAAA] :
        Moyennes des 1d100 sur un mois.
        Sans date : mois courant.
        Avec date : mois visé.
        Exemples :
          !stats month
          !stats month 12-2025

    - !randomplayer :
        Choisit un joueur aléatoire dans le vocal configuré (hors MJ / bots).

    - !timer [secondes] :
        Lance un compte à rebours avec un petit délai de démarrage.
        Exemple :
          !timer 10

    - !insult @Pseudo :
        Commence à insulter un joueur en message privé à intervalles réguliers.
        Accessible uniquement à certains utilisateurs selon le serveur.

    - !stopinsults :
        Arrête toutes les campagnes d'insultes en cours.
        Accessible uniquement à certains utilisateurs selon le serveur.

    - !showinsult :
        Affiche la liste des utilisateurs actuellement se faisant insulter en MP.
        Accessible uniquement à certains utilisateurs selon le serveur.

    (Tape !help pour revenir à la page 1/2)
${'```'}`;
      }

      return message.reply(reponse);
    } catch (error) {
      console.error('Erreur dans !help:', error.message);
      return message.reply('Erreur survenue...');
    }
  },
};

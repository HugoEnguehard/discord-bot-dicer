const {
  canStartNewTimer,
  startTimer,
  MAX_TIMERS,
} = require('../services/timer');

const timerPermissions = {
  [process.env.FTT_ID]: [ // ID de Feed The Tardos
    process.env.ADMIN_ID, // ID de Darkaine
  ],
  [process.env.OPLS_ID]: [ // ID de One PLS
    process.env.HELIX_ID, // ID de Helix
    process.env.ADMIN_ID, // ID de Darkaine
  ],
}

module.exports = {
  name: 'timer',
  description: 'Lance un compte à rebours.',

  async execute(message, args) {
    try {
      const guildId = message.guild?.id || null;
      const authorId = message.author.id;

      if (guildId && timerPermissions[guildId]) {
        const allowedUsers = timerPermissions[guildId];

        // si le serveur (guild) est configuré, seul les users listés sont autorisés
        if (!allowedUsers.includes(authorId)) {
          return message.reply(
            "Tu n'es pas autorisé à lancer des timers sur ce serveur."
          );
        }
      }

      const seconds = parseInt(args[0], 10);

      if (isNaN(seconds) || seconds <= 0) {
        return message.reply("Format attendu : !timer [secondes], exemple : !timer 10");
      }

      // Vérifie la limite globale de timers
      if (!canStartNewTimer()) {
        return message.reply(
          `Il y a déjà ${MAX_TIMERS} timer en cours, attends qu’il se termine avant d’en lancer un autre.`
        );
      }

      // Délègue toute la logique au service
      await startTimer(message, seconds);

    } catch (err) {
      console.error("Erreur dans !timer :", err);
      return message.reply("Une erreur est survenue dans TIMER.");
    }
  }
};

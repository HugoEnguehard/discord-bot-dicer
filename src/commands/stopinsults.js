const { stopAllInsults } = require('../services/insults/attack');

const { canUseInsultsCommand } = require('../services/insults/permissions');

module.exports = {
  name: 'stopinsults',
  description: 'Arrête toutes les insultes en cours.',
  async execute(message) {
    try {
      const guildId = message.guild?.id || null;
      const authorId = message.author.id;

      if (!canUseInsultsCommand(guildId, authorId)) {
        return message.reply(
          "Tu n'es pas autorisé à arrêter les insultes sur ce serveur."
        );
      }

      stopAllInsults();
      return message.reply("Toutes les insultes en cours ont été arrêtées. Pour l'instant...");
    } catch (err) {
      console.error("Erreur dans !stopinsults :", err);
      return message.reply("Une erreur est survenue dans STOPINSULTS.");
    }
  },
};

const {
  getActiveInsultedUserIds,
} = require('../services/insults/attack');

const {
  canUseInsultsCommand,
} = require('../services/insults/permissions');

module.exports = {
  name: 'showinsults',
  description: 'Liste les utilisateurs actuellement en train de se faire insulter en MP.',
  async execute(message) {
    try {
      const guildId = message.guild?.id || null;
      const authorId = message.author.id;

      // Vérification des permissions
      if (!canUseInsultsCommand(guildId, authorId)) {
        return message.reply(
          "Tu n'es pas autorisé à consulter la liste des victimes d'insultes sur ce serveur."
        );
      }

      const ids = getActiveInsultedUserIds();

      if (ids.length === 0) {
        return message.reply("Personne ne se fait insulter pour le moment. Ils ont de la chance...");
      }
      
      const list = ids.map((id) => `- <@${id}>`).join('\n');

      const reply = `\`\`\`INSULT VICTIMS\`\`\`
${list}`;

      return message.reply(reply);
    } catch (err) {
      console.error("Erreur dans !showinsult :", err);
      return message.reply("Une erreur est survenue dans SHOWINSULT.");
    }
  },
};

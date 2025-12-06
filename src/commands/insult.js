const {
  startInsultingUser,
  isUserBeingInsulted,
  INSULT_INTERVAL_SECONDS,
} = require('../services/insults/attack');

const {
  canUseInsultsCommand,
} = require('../services/insults/permissions');

module.exports = {
  name: 'insult',
  description: 'Commence à insulter un joueur en MP régulièrement.',
  async execute(message, _args) {
    try {
      // Vérification des permissions
      const guildId = message.guild?.id || null;
      const authorId = message.author.id;

      if (!canUseInsultsCommand(guildId, authorId)) {
        return message.reply(
          "Tu n'es pas autorisé à déclencher les insultes sur ce serveur."
        );
      }

      const target = message.mentions.users.first();

      if (!target) {
        return message.reply(
          "Mentionne quelqu'un, bouffon. Exemple : `!insult @Pseudo`"
        );
      }

      if (target.bot) {
        return message.reply("Je ne gaspille pas mes insultes sur un confrère bot.");
      }

      if (isUserBeingInsulted(target.id)) {
        return message.reply(
          `Ce pauvre ${target.username} se fait déjà insulter, c'est suffisant pour l’instant.`
        );
      }

      const started = startInsultingUser(target);

      if (!started) {
        return message.reply(
          "Impossible de démarrer les insultes sur cette cible (déjà active ?)."
        );
      }

      return message.reply(
        `Très bien. ${target.username} va recevoir une insulte toutes les ${INSULT_INTERVAL_SECONDS} secondes en MP.`
      );
    } catch (err) {
      console.error("Erreur dans !insult :", err);
      return message.reply("Une erreur est survenue dans INSULT.");
    }
  },
};

const { handleTruthEasterEgg } = require('../services/truths/handleEasterEgg');
const { getRandomTruth } = require('../services/truths/loader');

module.exports = {
  name: 'truth',
  description: 'Répond une vérité aléatoire.',
  async execute(message) {
    try {
      const truth = getRandomTruth(true, message.guild.id);

      // Réponse publique
      const reply = `${'```'}${truth}${'```'}`;
      await message.reply(reply);

      // Vérification des Easter Eggs
      await handleTruthEasterEgg(message, truth);

      return;
    } catch (error) {
      console.error('Erreur dans !truth', error.message);
      return message.reply('Une erreur est survenue dans TRUTH.');
    }
  },
};

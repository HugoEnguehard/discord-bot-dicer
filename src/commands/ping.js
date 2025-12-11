const { getRandomInsult } = require('../services/insults/loader');
const { handlePingEasterEgg } = require('../services/pingEasterEgg');

module.exports = {
  name: 'ping',
  description: 'Répond pong avec une insulte aléatoire.',
  async execute(message) {
    try {
      const insult = getRandomInsult(true, message.guild.id);

      // Réponse publique
      const reply = `${'```'}Pong ${insult} !${'```'}`;
      await message.reply(reply);

      // Vérification des Easter Eggs
      await handlePingEasterEgg(message, insult);

      return;
    } catch (error) {
      console.error('Erreur dans !ping', error.message);
      return message.reply('Une erreur est survenue dans PING.');
    }
  },
};

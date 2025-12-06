const { getRandomInsult } = require('../services/insults/loader');

module.exports = {
  name: 'ping',
  description: 'Répond pong avec une insulte aléatoire.',
  async execute(message) {
    try {
      const insult = getRandomInsult(true);
      const reply = `${'```'}Pong ${insult} !${'```'}`;

      return message.reply(reply);
    } catch (error) {
      console.error('Erreur dans !ping', error.message);
      return message.reply('Une erreur est survenue dans PING.');
    }
  },
};

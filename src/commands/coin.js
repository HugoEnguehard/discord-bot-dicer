module.exports = {
  name: 'coin',
  description: 'Lance une pièce : pile ou face.',
  async execute(message) {
    try {
      const isHeads = Math.random() < 0.5;
      const result = isHeads ? 'PILE' : 'FACE';

      const reply = `${'```'}${result}${'```'}`;

      return message.reply(reply);

    } catch (err) {
      console.error("Erreur dans !coin :", err);
      return message.reply("Une erreur est survenue dans COIN.");
    }
  },
};

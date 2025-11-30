module.exports = {
  name: 'timer',
  description: 'Lance un compte à rebours.',
  async execute(message, args) {
    try {
      const seconds = parseInt(args[0], 10);

      if (isNaN(seconds) || seconds <= 0) {
        return message.reply("Format attendu : !timer [secondes], exemple : !timer 10");
      }

      let remaining = seconds;

      // Message initial : annonce du buffer
      const sent = await message.reply(`${'```'}TIMER : Démarrage dans 3 sec...${'```'}`);

      // Petite pause avant le début du timer
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Premier affichage avant le vrai setInterval
      await sent.edit(`${'```'}TIMER : ${remaining} sec${'```'}`);

      const interval = setInterval(async () => {
        remaining--;

        if (remaining <= 0) {
          clearInterval(interval);
          return sent.edit(`${'```'}TIMER TERMINÉ !${'```'}`);
        }

        sent.edit(`${'```'}TIMER : ${remaining} sec${'```'}`);
      }, 1000);

    } catch (err) {
      console.error("Erreur dans !timer :", err.message);
      return message.reply("Une erreur est survenue dans TIMER.");
    }
  }
};

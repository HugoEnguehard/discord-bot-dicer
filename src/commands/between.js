module.exports = {
  name: 'between',
  description: 'Donne un nombre aléatoire entre deux valeurs.',
  async execute(message, args) {
    try {
      if (args.length < 2) {
        return message.reply(
          "Format attendu : !between X Y\nExemple : !between 1 10"
        );
      }

      const min = parseInt(args[0], 10);
      const max = parseInt(args[1], 10);

      if (isNaN(min) || isNaN(max) || min > max) {
        return message.reply("Valeurs incorrectes. Exemple : !between 5 20");
      }

      const result = Math.floor(Math.random() * (max - min + 1)) + min;

      const reply = `${'```'}BETWEEN
Entre ${min} et ${max} → ${result}
${'```'}`;

      return message.reply(reply);

    } catch (err) {
      console.error("Erreur dans !between :", err.message);
      return message.reply("Une erreur est survenue dans BETWEEN.");
    }
  },
};

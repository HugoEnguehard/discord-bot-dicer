const { resolveDiceExpressionWithDetails } = require('../services/dice');
const { addRoll } = require('../services/storage');

module.exports = {
  name: 'roll',
  description: 'Lance un ou plusieurs dés et affiche le résultat et les détails.',
  async execute(message, args) {
    const rawExpression = args.join(' '); // tout ce qui vient après !roll
    const expression = rawExpression.replace(/\s/g, ''); // on nettoie les espaces

    if (!expression) {
      return message.reply('Erreur : Veuillez fournir une expression de dés après la commande `!roll`. Exemple : `!roll 2d6+3`');
    }

    try {
      const result = resolveDiceExpressionWithDetails(expression);
      await addRoll(message.author.tag, expression, result);

      let reply = `${'```'}Résultat total : ${result.total} ${result.bonus ? result.bonus : ''}
Détails des dés : ${result.details}
Constantes : ${result.constants}${'```'}`;

      return message.reply(reply);
    } catch (error) {
      console.error('Erreur dans !roll:', error.message);
      return message.reply('Expression de dés invalide ou trop grande.');
    }
  },
};

// commands/stats.js
const {
  getStatsAll,
  getStatsDay,
  getStatsWeek,
  getStatsMonth,
} = require('../services/stats');

module.exports = {
  name: 'stats',
  description: 'Affiche les moyennes des jets de 1d100 par joueur.',
  async execute(message, args) {
    if (args.length === 0) {
      return message.reply(
        "Utilisation :\n" +
        "```" +
        "!stats all                 -> moyenne générale\n" +
        "!stats dd-mm-yyyy          -> moyenne d'une date précise\n" +
        "!stats week                -> moyenne de la semaine courante\n" +
        "!stats week dd-mm-yyyy     -> moyenne de la semaine (à partir du lundi donné)\n" +
        "!stats month               -> moyenne du mois courant\n" +
        "!stats month mm-yyyy       -> moyenne du mois visé\n" +
        "```"
      );
    }

    const mode = args[0].toLowerCase();
    let averages;
    let label;

    try {
      if (mode === 'all') {
        // !stats all
        averages = getStatsAll();
        label = 'générales (tout l’historique)';
      } else if (mode === 'week') {
        // !stats week [dd-mm-yyyy]
        const dateStr = args[1];
        if (dateStr) {
          averages = getStatsWeek(dateStr);
          label = `de la semaine à partir du ${dateStr}`;
        } else {
          averages = getStatsWeek(); // semaine courante
          label = 'de la semaine courante';
        }
      } else if (mode === 'month') {
        // !stats month [mm-yyyy]
        const monthStr = args[1];
        if (monthStr) {
          averages = getStatsMonth(monthStr);
          label = `du mois ${monthStr}`;
        } else {
          averages = getStatsMonth(); // mois courant
          label = 'du mois courant';
        }
      } else {
        // !stats dd-mm-yyyy (date précise)
        const dateStr = args[0];
        averages = getStatsDay(dateStr);
        label = `du ${dateStr}`;
      }
    } catch (error) {
      console.error('Erreur dans !stats :', error.message);
      return message.reply(
        "Paramètres invalides. Formats attendus :\n" +
        "```" +
        "!stats all\n" +
        "!stats dd-mm-yyyy\n" +
        "!stats week [dd-mm-yyyy]\n" +
        "!stats month [mm-yyyy]\n" +
        "```"
      );
    }

    if (!averages || Object.keys(averages).length === 0) {
      return message.reply('Aucune donnée disponible pour cette période.');
    }

    let response = `${'```'}Moyennes sur les dés 100 des joueurs ${label}\n\n`;
    Object.keys(averages).forEach((pseudo) => {
      response += `${pseudo}: ${averages[pseudo]}\n`;
    });
    response += `${'```'}`;

    return message.reply(response);
  },
};

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'truth',
  description: 'Révèle une vérité universelle aléatoire.',
  async execute(message) {
    try {
      // Chargement du JSON
      const filePath = path.join(__dirname, '..', 'data', 'truths.json');

      if (!fs.existsSync(filePath)) {
        return message.reply("Erreur : Le fichier truths.json est introuvable.");
      }

      const raw = fs.readFileSync(filePath, 'utf8');
      const truths = JSON.parse(raw);

      if (!Array.isArray(truths) || truths.length === 0) {
        return message.reply("Aucune vérité disponible dans truths.json.");
      }

      // Tirage aléatoire
      const pick = truths[Math.floor(Math.random() * truths.length)];

      const reply = `${'```'}TRUTH
${pick}
${'```'}`;

      return message.reply(reply);

    } catch (err) {
      console.error("Erreur dans !truth :", err);
      return message.reply("Une erreur est survenue dans TRUTH.");
    }
  },
};

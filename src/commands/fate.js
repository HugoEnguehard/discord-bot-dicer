module.exports = {
  name: 'fate',
  description: 'Laisse le destin choisir entre plusieurs options (ou répondre oui/non).',
  async execute(message, args) {
    try {
      const content = args.join(' ').trim();

      // Aucun argument -> simple OUI / NON
      if (!content) {
        const isYes = Math.random() < 0.5;
        const yesNoText = isYes ? 'OUI' : 'NON';

        const reply = `${'```'}FATE
Réponse : ${yesNoText}
${'```'}`;
        return message.reply(reply);
      }

      // On découpe sur "/" et on nettoie
      const options = content
        .split('/')
        .map(opt => opt.trim())
        .filter(Boolean);

      if (options.length < 2) {
        const reply = `${'```'}Format attendu :
!fate Option A / Option B [/ Option C / Option D ...]

Exemples :
!fate gauche / droite
!fate rouge / bleu / vert
${'```'}`;
        return message.reply(reply);
      }

      // Choix aléatoire dans la liste
      const index = Math.floor(Math.random() * options.length);
      const chosen = options[index];

      let reply = `${'```'}FATE
Options :\n`;

      options.forEach((opt, i) => {
        reply += `  ${i + 1}. ${opt}\n`;
      });

      reply += `\nRésultat : ${index + 1}. ${chosen}\n`;
      reply += `${'```'}`;

      return message.reply(reply);
    } catch (error) {
      console.error('Erreur dans !fate :', error.message);
      return message.reply('Une erreur est survenue dans FATE.');
    }
  },
};

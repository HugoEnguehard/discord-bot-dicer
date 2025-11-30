module.exports = {
  name: 'truth',
  description: 'Révèle une vérité universelle aléatoire.',
  async execute(message) {
    try {
      const truths = [
        "Le MJ a toujours raison.",
        "Quand un joueur dit : J'ai un super plan => C'est faux.",
        "Les dés complotent contre vous.",
        "La seule constante dans ce jeu est le chaos.",
        "Le silence du MJ est toujours inquiétant.",
        "Un échec critique arrive toujours quand il ne faut pas.",
        "Le prochain échec critique n'est jamais loin...",
        "Un échec critique peu en cacher un autre",
        "Plus un joueur dit 'ça va passer', moins ça passe.",
        "Les règles sont des suggestions, pas des lois.",
        "Le hasard est le vrai maître de ce monde.",
        "Le MJ définit les règles.",
        "Dieu en intérim est toujours plus puissant que vous.",
        "Hylia vous regarde... et vous juge.",
        "Ce coffre est un mimique de Shrödinger : Il dépend de l'humeur du MJ.",
        "Vos pires théories seront toujours loin du compte.",
        "Les résumés de Guillaume sont les meilleurs.",
        "La violence n'est pas toujours la solution... mais souvent oui.",
        "Tuer un PNJ aura toujours de répercussions."
      ];

      const pick = truths[Math.floor(Math.random() * truths.length)];

      const reply = `${'```'}TRUTH
${pick}
${'```'}`;

      return message.reply(reply);

    } catch (err) {
      console.error("Erreur dans !truth :", err.message);
      return message.reply("Une erreur est survenue dans TRUTH.");
    }
  },
};

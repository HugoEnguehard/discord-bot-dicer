const fs = require('fs/promises');
const path = require('path');

module.exports = {
  name: 'raf',
  description: 'Génère une combinaison Power UP aléatoire pour Aska.',
  async execute(message) {
    let categories;
    try {
      const raw = await fs.readFile(path.join(__dirname, '..', 'data', 'raf.json'), 'utf8');
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Le JSON doit être un objet de catégories.');
      }
      categories = Object.entries(data);
      if (categories.length === 0) {
        throw new Error('Le JSON doit contenir au moins une catégorie.');
      }
      for (const [category, options] of categories) {
        if (!category.trim() || !Array.isArray(options) || options.length === 0 ||
            !options.every(option => typeof option === 'string' && option.trim().length > 0)) {
          throw new Error(`Catégorie invalide : ${category}. Chaque catégorie doit contenir une liste non vide de chaînes non vides.`);
        }
      }
    } catch (error) {
      console.error('Erreur dans !raf :', error.message);
      return message.reply('Impossible de générer la combinaison Power UP : le fichier raf.json est introuvable ou invalide.');
    }

    const selections = categories.map(([category, options]) => {
      const selected = options[Math.floor(Math.random() * options.length)];
      return `• ${category} : ${selected}`;
    });
    return message.reply({
      content: `Combinaison Power UP aléatoire pour **Aska** :\n\n` + '```\n' + selections.join('\n') + '\n```',
      allowedMentions: { parse: [], repliedUser: false },
    });
  },
};

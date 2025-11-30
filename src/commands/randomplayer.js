const { ChannelType } = require('discord.js');

// Config par serveur
const serverConfigs = {
  "451675976879964172": { // ID de Feed The Tardos
    voiceChannelId: "700526149544968292", // ID du salon vocal
    mjId: "316620118610280448", // ID du MJ
  },
  "1230231833975984160": { // ID de One PLS
    voiceChannelId: "1230231833975984164", // ID du salon vocal
    mjId: "603932446727208975", // ID du MJ
  },
};

module.exports = {
  name: 'randomplayer',
  description: 'Sélectionne un joueur aléatoire dans un canal vocal spécifique.',
  async execute(message) {
    try {
      const guild = message.guild;

      if (!guild) {
        return message.reply("Cette commande doit être utilisée dans un serveur.");
      }

      const config = serverConfigs[guild.id];

      if (!config) {
        return message.reply(
          "Aucune configuration trouvée pour ce serveur.\n" +
          "Le MJ doit ajouter la config du serveur dans randomplayer.js."
        );
      }

      const voiceChannel = await guild.channels.fetch(config.voiceChannelId);

      if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
        return message.reply("Le salon configuré n'est pas un canal vocal valide.");
      }

      // Récupère les membres dans le vocal
      const membersInVoice = voiceChannel.members.filter(member => {
        if (member.user.bot) return false;
        if (member.id === config.mjId) return false;
        return true;
      });

      if (membersInVoice.size === 0) {
        return message.reply("Aucun joueur (hors MJ/bots) n'est dans le vocal configuré.");
      }

      const membersArray = [...membersInVoice.values()];
      const chosen = membersArray[Math.floor(Math.random() * membersArray.length)];

      const displayName = chosen.displayName || chosen.user.username;

      const reply = `${'```'}RANDOM PLAYER
→ ${displayName} a été choisi !
${'```'}`;

      return message.reply(reply);

    } catch (err) {
      console.error("Erreur dans !randomplayer :", err);
      return message.reply("Une erreur est survenue dans RANDOM PLAYER.");
    }
  },
};
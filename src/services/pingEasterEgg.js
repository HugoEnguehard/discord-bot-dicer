  const { sendPrivateMessage } = require('./sendPrivateMessage');

  async function handlePingEasterEgg(message, insult) {
    const easterEggs = [
      {
        value: process.env.FTT_EASTER_EGG,
        targetId: process.env.ADMIN_ID,
        label: 'FTT',
      },
      {
        value: process.env.OPLS_EASTER_EGG,
        targetId: process.env.HELIX_ID,
        label: 'OPLS',
      }
    ];

    for (const easterEgg of easterEggs) {
      if (!easterEgg.value || !easterEgg.targetId) continue;
      if (insult !== easterEgg.value) continue;

      const reward = await getEasterEggReward();

      const textMJ =
        `━━━ ✦ EASTER EGG ✦ ━━━\n` +
        `Le joueur **${message.member.displayName} (${message.author.tag})** ` +
        `a trouvé l'Easter Egg de la commande **ping** sur le serveur **${message.guild.name}**.` +
        `\n\nSa récompense est la suivante :` +
        `\n\t***${reward}***`;

      await sendPrivateMessage(message.client, easterEgg.targetId, textMJ);

      const textPlayer =
        `━━━ ✦ EASTER EGG ✦ ━━━\n` +
        `Bravo **${message.member.displayName} (${message.author.tag})** pour avoir troué l'Easter Egg sur le serveur **${message.guild.name}** !` +
        `\n\nVotre récompense est la suivante :` + 
        `\n\t***${reward}***`;

      await sendPrivateMessage(message.client, message.author.id, textPlayer);
    }
  }

  async function getEasterEggReward() {
    const rewards = [
      "Une réussite critique pour l'action de son choix au cours de la séance",
      "Un échec critique pour l'action de son choix au cours de la séance"
    ];

    if (rewards.length === 0) return null;

    const index = Math.floor(Math.random() * rewards.length);
    return rewards[index];
  }

  module.exports = { handlePingEasterEgg, getEasterEggReward };

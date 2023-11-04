require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
client.on("ready", (c) => {
    console.log(`Bot ${c.user.tag} is online waiting for dices to roll !`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    
    if (message.content.startsWith("!roll")) {
        const content = message.content.substring(6).trim(); // Pour enlever "!roll " du début et supprimer les espaces
        if (content) {
            const result = await resolveDiceExpressionWithDetails(content);
            message.reply(result);
        } else {
            message.reply("Erreur : Veuillez fournir une expression de dés après la commande !roll.");
        }
    }
});



client.login(process.env.TOKEN);

function resolveDiceExpressionWithDetails(expression) {
    expression = expression.replace(/\s/g, '');
  
    const regex = /([+\-])?(\d*d\d+|\d+)/g;
    let diceTotal = 0;
    let constantTotal = 0;
    const diceDetails = [];
  
    let match;
    while ((match = regex.exec(expression)) !== null) {
      const sign = match[1] === '-' ? -1 : 1;
      const value = match[2];
  
      if (value.includes('d')) {
        const [numDice, maxRoll] = value.split('d').map(Number);
        const rolls = [];
        const numTimes = numDice || 1; // Par défaut, si aucun nombre précède le "d", lancez le dé une fois
  
        for (let i = 0; i < numTimes; i++) {
          const roll = Math.floor(Math.random() * maxRoll) + 1;
          rolls.push(roll);
          diceTotal += sign * roll;
        }
  
        diceDetails.push({ sign, rolls });
      } else {
        const constantValue = sign * parseInt(value, 10);
        constantTotal += constantValue;
        diceTotal += constantValue;
      }
    }
  
    return `${"```"}Résultat total : ${diceTotal} \nDétails des dés : (${diceDetails.map(item => `${item.sign === 1 ? '+' : '-'} ${item.rolls.join(` ${item.sign === 1 ? '+' : '-'} `)}`).join(' ')}) \nConstantes : ${constantTotal}${"```"}`;
}
  
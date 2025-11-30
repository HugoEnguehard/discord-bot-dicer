require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { commands } = require('./commands');
const { initCurrentWeekFile } = require('./services/storage');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

client.on('ready', (c) => {
  // Initialise le fichier de la semaine (création si besoin)
  initCurrentWeekFile();
  console.log(`Bot ${c.user.tag} is online waiting for dices to roll for you !`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const [commandName, ...args] = message.content.slice(1).trim().split(/\s+/); // enlève le "!" et découpe
  const command = commands[commandName.toLowerCase()];

  if (!command) return; // commande inconnue => ignore

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`Erreur dans la commande !${commandName}:`, error);
    message.reply('Une erreur est survenue lors de l’exécution de la commande.');
  }
});

client.login(process.env.TOKEN);

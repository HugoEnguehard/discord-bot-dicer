require('./runtime');
require('dotenv').config();
require('./services/dataCheck');
const { Client, IntentsBitField } = require('discord.js');
const { commands } = require('./commands');
const { initCurrentWeekFile } = require('./services/storage');
const { stopTimerForMessage } = require('./services/timer');

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

/**
 * On vérifie si le message supprimé a un auteur, et si cet auteur est bien le bot.
 * Si oui on transfert l'id du message à la fonction pour stopper le timer.
 */
client.on('messageDelete', (deletedMessage) => {
  if (!deletedMessage.author) return;

  if (deletedMessage.author.id !== client.user.id) return;

  stopTimerForMessage(deletedMessage.id);
});

let closing=false;
async function shutdown(){if(closing)return;closing=true;setTimeout(()=>process.exit(1),10000).unref();await client.destroy();process.exit(0);}
process.once('SIGTERM',()=>void shutdown());process.once('SIGINT',()=>void shutdown());
if(!process.env.TOKEN){console.error('TOKEN manquant.');process.exitCode=1;}else client.login(process.env.TOKEN).catch(()=>{console.error('Connexion Discord impossible.');void client.destroy();process.exitCode=1;});

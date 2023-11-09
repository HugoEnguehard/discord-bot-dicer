require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const fs = require('fs');
const path = require('path');

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
        const content = retirerEspaces(message.content.substring(6).trim()); // Pour enlever "!roll " du début et supprimer les espaces
        if (content) {
            const result = await resolveDiceExpressionWithDetails(content);
            enregistrerResultat(message.author.tag, content, result);
            message.reply(`${"```"}Résultat total : ${result.total} \nDétails des dés : (${result.details}) \nConstantes : ${result.constants}${"```"}`);
        } else {
            message.reply("Erreur : Veuillez fournir une expression de dés après la commande !roll.");
        }
    }

    if (message.content.startsWith("!stats")) {
      const parametre = retirerEspaces(message.content.substring(7).trim());

      const moyennes = await getGeneralStat(parametre);
  
      // Vérifiez si les données sont vides
      if (Object.keys(moyennes).length === 0) {
        message.reply("Aucune donnée disponible pour le moment.");
      } else {
        let response = `${"```"}Moyennes sur les dés 100 des joueurs`;
        if(parametre) response += ` pour le ${parametre}\n\n`;
        else response += `\n\n`;
        Object.keys(moyennes).forEach(pseudo => {
          response += `${pseudo}: ${moyennes[pseudo]}\n`;
        });
        response += `${"```"}`;

        message.reply(response);
      }
    }

    if (message.content === "!backup") {
      try {
        if(message.author.tag === process.env.ADMIN) {
          createBackup();
          message.reply("Backup créée avec succès !");
        } else message.reply("Erreur: Vous n'avez pas la permission d'effectuer cette commande.")
        
      } catch (error) {
        console.log(error.message);
        message.reply("Un problème est survenu lors de la création de la backup...");
      }
    }

    if (message.content === "!help") {
      try {
        let reponse = `${"```"}Liste des commandes :\n`;
        reponse += `\t- !roll [xdx+x] => Lance un ou plusieurs dés et affiche le résultats ainsi que certains détails.\n`;
        reponse += `\t- !stats {optionnel: date au format JJ-MM-AAAA} => Permet de récupérer les statistiques moyennes de dés 100 des joueurs.\n`;
        reponse += `\t- !backup => Pour créer une backup des jets de dés des joueurs.\n`;
        reponse += `${"```"}`;
        message.reply(reponse);
      } catch (error) {
        console.log(error.message);
        message.reply("Erreur survenue...");
      }
    }
});

client.login(process.env.TOKEN);


function resolveDiceExpressionWithDetails(expression) {
  // Prochaine ligne pas obligatoire, mais on laisse par sécurité
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
  
    // return `${"```"}Résultat total : ${diceTotal} \nDétails des dés : (${diceDetails.map(item => `${item.sign === 1 ? '+' : '-'} ${item.rolls.join(` ${item.sign === 1 ? '+' : '-'} `)}`).join(' ')}) \nConstantes : ${constantTotal}${"```"}`;

    return {
      total: diceTotal,
      details: `${diceDetails.map(item => `(${item.sign === 1 ? '+' : '-'} ${item.rolls.join(` ${item.sign === 1 ? '+' : '-'} `)})`).join(' ')}`,
      constants: constantTotal,
    }
}

async function chargerDonnees() {
  try {
    const cheminFichier = await getFilePath();
    // Vérifiez si le fichier JSON existe
    if (fs.existsSync(cheminFichier)) {
      // Si le fichier existe, lisez-le et retournez les données
      return require(cheminFichier);
    } else {
      // Si le fichier n'existe pas, retournez un objet vide
      return {};
    }
  } catch (err) {
    console.error('Erreur lors de la lecture du fichier JSON :', err.message);
    return {};
  }
}

// Fonction pour enregistrer les données dans le fichier JSON
async function enregistrerDonnees(donnees) {
  try {
    const cheminFichier = await getFilePath();
    // Enregistrez les données dans le fichier JSON
    fs.writeFileSync(cheminFichier, JSON.stringify(donnees, null, 2));
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du fichier JSON :', err.message);
  }
}

// Fonction principale pour enregistrer un résultat
async function enregistrerResultat(pseudo, des, resultat) {
  const dateActuelle = await getCurrentDate();
  // Chargez les données existantes depuis le fichier JSON
  const donnees = await chargerDonnees();

  // Ajoutez les nouvelles données
  const nouvelleEntree = { pseudo, des, resultat };
  donnees[dateActuelle] = donnees[dateActuelle] || [];
  donnees[dateActuelle].push(nouvelleEntree);

  // Enregistrez les données mises à jour dans le fichier JSON
  await enregistrerDonnees(donnees);
}

async function getGeneralStat(dateFiltre = '') {
  const donnees = await chargerDonnees();

  // Créez un objet pour stocker la somme et le nombre d'occurrences pour chaque pseudo
  const sommeTotaleParPseudo = {};
  const nombreOccurrencesParPseudo = {};

  // Parcourez les données
  Object.keys(donnees).forEach(date => {
    // Si une date de filtre est fournie, vérifiez si elle correspond à la date en cours d'itération
    if (dateFiltre && date !== dateFiltre) {
      return; // Passez à la prochaine itération si la date ne correspond pas
    }

    donnees[date].forEach(entry => {
      const { pseudo, resultat, des } = entry;

      // Vérifiez si le des est "1d100"
      if (des === "1d100") {
        // Ajoutez le total au cumul pour le pseudo
        sommeTotaleParPseudo[pseudo] = (sommeTotaleParPseudo[pseudo] || 0) + resultat.total;
        // Incrémente le nombre d'occurrences pour le pseudo
        nombreOccurrencesParPseudo[pseudo] = (nombreOccurrencesParPseudo[pseudo] || 0) + 1;
      }
    });
  });

  // Calculez la moyenne pour chaque pseudo
  const moyenneTotaleParPseudo = {};
  Object.keys(sommeTotaleParPseudo).forEach(pseudo => {
    const somme = sommeTotaleParPseudo[pseudo];
    const occurrences = nombreOccurrencesParPseudo[pseudo];
    const moyenne = somme / occurrences;

    // Arrondissez la moyenne au dixième
    moyenneTotaleParPseudo[pseudo] = parseFloat(moyenne.toFixed(1));
  });

  return moyenneTotaleParPseudo;
}

function retirerEspaces(chaine) {
  return chaine.replace(/\s/g, '');
}

const getCurrentDate = async () => {
  const dateActuelle = new Date().toLocaleDateString('fr-FR').split('/').join('-');
  
  return dateActuelle;
}

const getFilePath = async () => {
  const nomFichier = `players_dice_data.json`;
  const cheminFichier = path.join(__dirname+"/data", nomFichier);
  
  return cheminFichier;
}

async function createBackup() {
    const filePath = await getFilePath();

    // Vérifiez si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new Error('Le fichier n\'existe pas.');
    }

    // Obtenez l'extension du fichier
    const fileExtension = path.extname(filePath);

    // Construisez le nouveau nom de fichier avec la date actuelle
    const currentDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }).replace(/[\/\s:,]/g, '-').replace("--", "_");
    const newFileName = `backup_${currentDate}${fileExtension}`;

    // Construisez le chemin du nouveau fichier
    const newFilePath = path.join(path.dirname(filePath), newFileName);

    // Lisez le contenu du fichier d'origine
    const fileContent = fs.readFileSync(filePath);

    // Écrivez le contenu dans le nouveau fichier
    fs.writeFileSync(newFilePath, fileContent);
}
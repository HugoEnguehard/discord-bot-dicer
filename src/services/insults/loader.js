const fs = require('fs');
const path = require('path');

function loadInsults() {
  const filePath = path.join(__dirname, '..', '..', 'data', 'insults.json');

  if (!fs.existsSync(filePath)) {
    console.warn("[Insults] Le fichier insults.json n'existe pas.");
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const insults = JSON.parse(raw);

    if (!Array.isArray(insults)) {
      console.error("[Insults] Le JSON n'est pas un tableau.");
      return [];
    }

    return insults;
  } catch (err) {
    console.error("[Insults] Erreur de lecture du JSON :", err.message);
    return [];
  }
}

function getRandomInsult(isPingCommand = false, serverID = "") {
  let insults = loadInsults();
  if(isPingCommand) {
    if(serverID === process.env.FTT_ID) insults = [...insults, process.env.FTT_EASTER_EGG];
    if(serverID === process.env.OPLS_ID) insults = [...insults, process.env.OPLS_EASTER_EGG];
  }

  if (insults.length === 0) return "Connard";

  const index = Math.floor(Math.random() * insults.length);
  return insults[index];
}

module.exports = {
  getRandomInsult,
};

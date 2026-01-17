const fs = require('fs');
const path = require('path');

function loadTruths() {
  const filePath = path.join(__dirname, '..', '..', 'data', 'truths.json');

  if (!fs.existsSync(filePath)) {
    console.warn("[Truths] Le fichier truths.json n'existe pas.");
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const insults = JSON.parse(raw);

    if (!Array.isArray(insults)) {
      console.error("[Truths] Le JSON n'est pas un tableau.");
      return [];
    }

    return insults;
  } catch (err) {
    console.error("[Truths] Erreur de lecture du JSON :", err.message);
    return [];
  }
}

function getRandomTruth(isPingCommand = false, serverID = "") {
  let truths = loadTruths();
  if(isPingCommand) {
    if(serverID === process.env.FTT_ID) truths = [...truths, process.env.FTT_EASTER_EGG];
    if(serverID === process.env.OPLS_ID) truths = [...truths, process.env.OPLS_EASTER_EGG];
  }

  if (truths.length === 0) return "Si c'est pas faux, c'est que c'est vrai";

  const index = Math.floor(Math.random() * truths.length);
  return truths[index];
}


module.exports = {
  getRandomTruth,
};

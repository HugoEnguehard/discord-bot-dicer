const fs = require('fs');
const path = require('path');

let cached = null;
function loadTruths() {
  const filePath = process.env.TRUTHS_FILE || path.join(__dirname, '..', '..', 'data', 'truths.json');

  if (!fs.existsSync(filePath)) {
    console.warn("[Truths] Le fichier truths.json n'existe pas.");
    return [];
  }

  try {
    const stat = fs.statSync(filePath);
    const key = [filePath, stat.ino, stat.mtimeMs, stat.ctimeMs, stat.size].join(':');
    if (cached?.key === key) return cached.truths;
    const raw = fs.readFileSync(filePath, 'utf8');
    const truths = JSON.parse(raw);

    if (!Array.isArray(truths)) {
      console.error("[Truths] Le JSON n'est pas un tableau.");
      return [];
    }

    const valid = truths.filter(value => typeof value === 'string' && value.trim());
    cached = {key, truths: valid};
    return valid;
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

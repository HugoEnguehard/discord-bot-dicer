const fs = require('fs');
const path = require('path');

let insultsCache = null;

function loadInsults() {
  if (insultsCache) return insultsCache;

  const filePath = path.join(__dirname, '..', 'data', 'insults.json');

  if (!fs.existsSync(filePath)) {
    console.warn("[Insults] Le fichier insults.json n'existe pas.");
    insultsCache = [];
    return insultsCache;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    insultsCache = JSON.parse(raw);
  } catch (err) {
    console.error("[Insults] Erreur de lecture du JSON :", err.message);
    insultsCache = [];
  }

  return insultsCache;
}

function getRandomInsult() {
  const insults = loadInsults();
  if (insults.length === 0) return "Connard";

  const index = Math.floor(Math.random() * insults.length);
  return insults[index];
}

module.exports = {
  getRandomInsult,
};

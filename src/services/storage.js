// services/storage.js
const fs = require('fs');
const path = require('path');
const { getWeekMonday, formatFrDate, parseFrDate } = require('./dateUtils');

const dataDir = path.join(__dirname, '..', 'data');

// Cache en mémoire : { [weekKey]: { filePath, data } }
const weekCache = {};

// Nombre max de semaines en cache en même temps
const MAX_WEEKS_IN_CACHE = 1;

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Calcule la clé de semaine + chemin de fichier pour une date donnée
function getWeekInfoForDate(date = new Date()) {
  ensureDataDir();

  const monday = getWeekMonday(date);
  const mondayStr = formatFrDate(monday); // "JJ-MM-AAAA"
  const filePath = path.join(dataDir, `dice_${mondayStr}.json`);
  const weekKey = mondayStr;

  return { weekKey, filePath };
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf8') || '{}';
  return JSON.parse(raw);
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Supprime les semaines les plus anciennes du cache s'il y en a trop
function evictOldWeeks(currentWeekKey) {
  const keys = Object.keys(weekCache);

  if (keys.length <= MAX_WEEKS_IN_CACHE) return;

  // On ne veut PAS supprimer la semaine actuelle
  const otherKeys = keys.filter((k) => k !== currentWeekKey);
  if (otherKeys.length === 0) return;

  // On trie les autres semaines par date (lundi) croissante
  otherKeys.sort((a, b) => {
    const da = parseFrDate(a); // a est du type "JJ-MM-AAAA"
    const db = parseFrDate(b);
    return da - db;
  });

  // Tant qu'on dépasse le max, on supprime la plus ancienne
  while (Object.keys(weekCache).length > MAX_WEEKS_IN_CACHE && otherKeys.length > 0) {
    const oldestKey = otherKeys.shift();
    delete weekCache[oldestKey];
  }
}

// Récupère (ou charge) les données de la semaine correspondant à la date
function getWeekData(date = new Date()) {
  const { weekKey, filePath } = getWeekInfoForDate(date);

  if (!weekCache[weekKey]) {
    // Première fois qu'on touche cette semaine → on charge le fichier s'il existe, sinon {}
    const data = readJsonFile(filePath);
    weekCache[weekKey] = { filePath, data };

    // On évite de garder trop de semaines en mémoire
    evictOldWeeks(weekKey);
  }

  return weekCache[weekKey];
}

// Ajoute un jet dans la semaine correspondant à la date du jet
function addRoll(pseudo, des, resultat, date = new Date()) {
  const { data, filePath } = getWeekData(date);
  const dayStr = formatFrDate(date); // "JJ-MM-AAAA"

  if (!data[dayStr]) {
    data[dayStr] = [];
  }

  data[dayStr].push({ pseudo, des, resultat });

  // On écrit directement, mais sans re-lire le fichier
  writeJsonFile(filePath, data);
}

// Récupère toutes les données de tous les fichiers de semaine
function getAllData() {
  ensureDataDir();
  const files = fs
    .readdirSync(dataDir)
    .filter((name) => name.startsWith('dice_') && name.endsWith('.json'));

  const allData = {};

  files.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const fileData = readJsonFile(filePath);

    Object.keys(fileData).forEach((date) => {
      if (!allData[date]) {
        allData[date] = [];
      }
      allData[date].push(...fileData[date]);
    });
  });

  return allData;
}

// Juste pour s'assurer que le dossier existe et que la semaine courante est initialisée
function initCurrentWeekFile() {
  getWeekData(new Date());
}

module.exports = {
  addRoll,
  getAllData,
  initCurrentWeekFile,
};

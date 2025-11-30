// services/stats.js
const { getAllData } = require('./storage');
const { parseFrDate, parseMonthYear, getWeekMonday } = require('./dateUtils');

// Fonction générique : applique un filtre sur la date et calcule les moyennes
function aggregateStats(dateFilterFn = null) {
  const donnees = getAllData();

  const sommeTotaleParPseudo = {};
  const nombreOccurrencesParPseudo = {};

  Object.keys(donnees).forEach((dateStr) => {
    const dateObj = parseFrDate(dateStr); // les clés sont du type JJ-MM-AAAA

    if (dateFilterFn && !dateFilterFn(dateObj, dateStr)) return;

    donnees[dateStr].forEach((entry) => {
      const { pseudo, resultat, des } = entry;

      // On ne garde que les "1d100"
      if (des === '1d100') {
        sommeTotaleParPseudo[pseudo] =
          (sommeTotaleParPseudo[pseudo] || 0) + resultat.total;
        nombreOccurrencesParPseudo[pseudo] =
          (nombreOccurrencesParPseudo[pseudo] || 0) + 1;
      }
    });
  });

  const moyenneTotaleParPseudo = {};
  Object.keys(sommeTotaleParPseudo).forEach((pseudo) => {
    const somme = sommeTotaleParPseudo[pseudo];
    const occurrences = nombreOccurrencesParPseudo[pseudo];
    const moyenne = somme / occurrences;
    moyenneTotaleParPseudo[pseudo] = parseFloat(moyenne.toFixed(1));
  });

  return moyenneTotaleParPseudo;
}

// 1) Moyenne générale (tout l'historique)
function getStatsAll() {
  return aggregateStats(); // pas de filtre
}

// 2) Moyenne d'une date précise "JJ-MM-AAAA"
function getStatsDay(dateStr) {
  // Si la date est invalide, parseFrDate va throw → on laisse remonter l'erreur
  parseFrDate(dateStr);
  return aggregateStats((_, storedDateStr) => storedDateStr === dateStr);
}

// 3) Moyenne de la semaine
// - si mondayStr est fourni : semaine à partir de ce lundi "JJ-MM-AAAA"
// - si mondayStr est vide/undefined : semaine COURANTE (lundi de la semaine actuelle)
function getStatsWeek(mondayStr) {
  let monday;

  if (mondayStr) {
    monday = parseFrDate(mondayStr);
  } else {
    monday = getWeekMonday(new Date());
  }

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return aggregateStats((dateObj) => dateObj >= monday && dateObj <= sunday);
}

// 4) Moyenne du mois
// - si monthStr est fourni : "MM-AAAA"
// - sinon : mois COURANT
function getStatsMonth(monthStr) {
  let month;
  let year;

  if (monthStr) {
    const parsed = parseMonthYear(monthStr); // month = 1-12
    month = parsed.month;
    year = parsed.year;
  } else {
    const now = new Date();
    month = now.getMonth() + 1; // 1-12
    year = now.getFullYear();
  }

  return aggregateStats((dateObj) => {
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1
    );
  });
}

module.exports = {
  getStatsAll,
  getStatsDay,
  getStatsWeek,
  getStatsMonth,
};

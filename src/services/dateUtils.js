function getWeekMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche, 1 = lundi, ...
  const diff = day === 0 ? -6 : 1 - day; // remonter au lundi
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatFrDate(date) {
  return date.toLocaleDateString('fr-FR').split('/').join('-');
}

function getTodayFrDate() {
  return formatFrDate(new Date());
}

// "JJ-MM-AAAA" -> Date
function parseFrDate(str) {
  const match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    throw new Error('Format de date invalide, attendu JJ-MM-AAAA');
  }
  const [, jourStr, moisStr, anneeStr] = match;
  const jour = Number(jourStr);
  const mois = Number(moisStr);
  const annee = Number(anneeStr);

  // mois - 1 car Date utilise 0-11
  const d = new Date(annee, mois - 1, jour);
  // Optionnel : petite vérif
  if (
    d.getFullYear() !== annee ||
    d.getMonth() !== mois - 1 ||
    d.getDate() !== jour
  ) {
    throw new Error('Date invalide');
  }

  d.setHours(0, 0, 0, 0);
  return d;
}

// "MM-AAAA" -> { month, year }
function parseMonthYear(str) {
  const match = str.match(/^(\d{2})-(\d{4})$/);
  if (!match) {
    throw new Error('Format de mois invalide, attendu MM-AAAA');
  }
  const [, moisStr, anneeStr] = match;
  const mois = Number(moisStr);
  const annee = Number(anneeStr);

  if (mois < 1 || mois > 12) {
    throw new Error('Mois invalide');
  }

  return { month: mois, year: annee };
}

module.exports = {
  getWeekMonday,
  formatFrDate,
  getTodayFrDate,
  parseFrDate,
  parseMonthYear,
};
/**
 * Vérifie qu'une valeur est un objet simple.
 * Retourne false pour les tableaux, null, etc.
 *
 * @param {*} v - Valeur à tester
 * @returns {boolean} True si c'est un objet simple
 */
function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

/**
 * Convertit une valeur en entier.
 * Retourne 0 si la valeur n'est pas un nombre valide.
 *
 * @param {*} v - Valeur à convertir
 * @returns {number} Nombre entier
 */
function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

/**
 * Additionne les statistiques d'un objet dans un autre.
 *
 * Exemple :
 * target = { pv: 10 }
 * add = { pv: 5 }
 * => target = { pv: 15 }
 *
 * @param {Object} target - Objet contenant les stats de base
 * @param {Object} add - Objet contenant les stats à ajouter
 * @returns {Object} Objet target modifié
 */
function addStats(target, add) {
  if (!isPlainObject(add)) return target;
  for (const [k, v] of Object.entries(add)) {
    target[k] = toInt(target[k]) + toInt(v);
  }
  return target;
}

/**
 * Calcule le total des statistiques gagnées par une classe
 * du niveau 1 jusqu'au niveau demandé.
 *
 * Exemple :
 * Niveau 1 : +5 PV
 * Niveau 2 : +3 PV
 * Niveau 3 : +2 PV
 * => Total = 10 PV
 *
 * @param {Object} classesJson - JSON contenant toutes les classes
 * @param {string} classKey - Clé de la classe à utiliser
 * @param {number} level - Niveau du personnage
 * @returns {Object} Totaux des statistiques gagnées
 * @throws {Error} Si la classe ou perLevel est introuvable
 */
function computeClassTotals(classesJson, classKey, level) {
  const cls = classesJson?.[classKey];
  if (!cls) throw new Error(`Classe introuvable: ${classKey}`);

  const perLevel = cls.perLevel;
  if (!isPlainObject(perLevel)) throw new Error(`perLevel manquant/invalide pour ${classKey}`);

  const totals = {
    pv: 0,
    mana: 0,
    secStats: 0,
    magStats: 0,
    skillsGeneral: 0,
    skillsSpecific: 0,
  };

  for (let lv = 1; lv <= level; lv++) {
    const gains = perLevel[String(lv)];
    if (!isPlainObject(gains)) continue; // tolérant si un niveau est absent
    addStats(totals, gains);
  }

  return totals;
}

/**
 * Calcule les statistiques finales d'un personnage.
 *
 * Les statistiques finales sont composées :
 * - des stats de base de la race
 * - des gains cumulés de la classe par niveau
 *
 * Exemple :
 * Race : 50 PV
 * Classe niveau 3 : +20 PV
 * => Total final : 70 PV
 *
 * @param {Object} params - Paramètres de calcul
 * @param {Object} params.racesJson - JSON contenant les races
 * @param {Object} params.classesJson - JSON contenant les classes
 * @param {string} params.raceKey - Clé de la race
 * @param {string} params.classKey - Clé de la classe
 * @param {number} params.level - Niveau du personnage
 *
 * @returns {Object} Objet contenant :
 * - raceMin : stats de base de la race
 * - classTotals : gains cumulés de la classe
 * - finalTotals : statistiques finales
 *
 * @throws {Error} Si la race est introuvable
 */
function computeFinalStats({ racesJson, classesJson, raceKey, classKey, level }) {
  const race = racesJson?.[raceKey];
  if (!race) throw new Error(`Race introuvable: ${raceKey}`);

  const raceMin = race.stats || {};
  const classTotals = computeClassTotals(classesJson, classKey, level);

  // Stats finales = base raciale + progression de classe
  const finalTotals = { ...classTotals };
  finalTotals.pv = toInt(raceMin.pv) + toInt(classTotals.pv);
  finalTotals.mana = toInt(raceMin.mana) + toInt(classTotals.mana);

  return { raceMin: { pv: toInt(raceMin.pv), mana: toInt(raceMin.mana) }, classTotals, finalTotals };
}

module.exports = { computeClassTotals, computeFinalStats };

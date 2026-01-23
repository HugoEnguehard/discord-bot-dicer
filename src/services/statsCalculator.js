function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function addStats(target, add) {
  if (!isPlainObject(add)) return target;
  for (const [k, v] of Object.entries(add)) {
    target[k] = toInt(target[k]) + toInt(v);
  }
  return target;
}

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

function computeFinalStats({ racesJson, classesJson, raceKey, classKey, level }) {
  const race = racesJson?.[raceKey];
  if (!race) throw new Error(`Race introuvable: ${raceKey}`);

  const raceMin = race.stats || {};
  const classTotals = computeClassTotals(classesJson, classKey, level);

  // Règle: PV/Mana final = max(min race, total classe)
  const finalTotals = { ...classTotals };
  finalTotals.pv = Math.max(toInt(raceMin.pv), toInt(classTotals.pv));
  finalTotals.mana = Math.max(toInt(raceMin.mana), toInt(classTotals.mana));

  return { raceMin: { pv: toInt(raceMin.pv), mana: toInt(raceMin.mana) }, classTotals, finalTotals };
}

module.exports = { computeClassTotals, computeFinalStats };

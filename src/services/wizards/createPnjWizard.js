const path = require("node:path");
const { loadJson } = require("../jsonStore");
const { makeSelect, makeCancelRow, row, pretty } = require("../ui");
const { makeSessionId } = require("../wizard");
const { computeFinalStats } = require("../statsCalculator");

function buildLabelsFromJson(obj) {
  const keys = Object.keys(obj);
  const labels = Object.fromEntries(keys.map((k) => [k, obj[k]?.label || pretty(k)]));
  return { keys, labels };
}

function makeFinalReply(state, raceLabels, classLabels, racesJson, classesJson) {
  const { finalTotals } = computeFinalStats({
    racesJson,
    classesJson,
    raceKey: state.raceKey,
    classKey: state.classKey,
    level: state.level,
  });

  const spellSlots = finalTotals.spellSlots ?? 0;

  return (
    "```" +
    `PNJ CRÉÉ\n` +
    `Race   : ${raceLabels[state.raceKey]}\n` +
    `Classe : ${classLabels[state.classKey]}\n` +
    `Niveau : ${state.level}\n` +
    "\n" +
    `STATS FINALES\n` +
    `PV: ${finalTotals.pv}\n` +
    `Mana: ${finalTotals.mana}\n` +
    `Emplacements de sort: ${spellSlots}\n` +
    `Secondaires: ${finalTotals.secStats}\n` +
    `Magiques: ${finalTotals.magStats}\n` +
    `Comp. générales: ${finalTotals.skillsGeneral}\n` +
    `Comp. spécialisées: ${finalTotals.skillsSpecific}\n` +
    "```"
  );
}

function createPnjWizard(message) {
  const sessionId = makeSessionId(message.author.id);

  const ids = {
    race: `pnj:${sessionId}:race`,
    cls: `pnj:${sessionId}:class`,
    lvl: `pnj:${sessionId}:level`,
    cancel: `pnj:${sessionId}:cancel`,
  };

  // charge JSON
  const racesPath = path.join(__dirname, "..", "..", "data", "races.json");
  const classesPath = path.join(__dirname, "..", "..", "data", "classes.json");

  const racesJson = loadJson(racesPath);
  const classesJson = loadJson(classesPath);

  const { keys: raceKeys, labels: raceLabels } = buildLabelsFromJson(racesJson);
  const { keys: classKeys, labels: classLabels } = buildLabelsFromJson(classesJson);

  const state = { step: "race", raceKey: null, classKey: null, level: null };

  function render(s) {
    const cancelRow = makeCancelRow(ids.cancel);

    if (s.step === "race") {
      return {
        content: "**Création PNJ (1/3)** — Choisis une race",
        components: [row(makeSelect(ids.race, "Race…", raceKeys, raceLabels)), cancelRow],
      };
    }

    if (s.step === "class") {
      return {
        content: "**Création PNJ (2/3)** — Choisis une classe",
        components: [row(makeSelect(ids.cls, "Classe…", classKeys, classLabels)), cancelRow],
      };
    }

    if (s.step === "level") {
      const levels = Array.from({ length: 10 }, (_, i) => String(i + 1));
      const levelLabels = Object.fromEntries(levels.map((v) => [v, `Niveau ${v}`]));
      return {
        content: "**Création PNJ (3/3)** — Choisis un niveau (1–10)",
        components: [row(makeSelect(ids.lvl, "Niveau…", levels, levelLabels)), cancelRow],
      };
    }

    return { content: "Wizard terminé.", components: [] };
  }

  async function onInteraction(i, s) {
    if (i.customId === ids.cancel) return { cancel: true };

    if (i.customId === ids.race) {
      s.raceKey = i.values[0];
      s.step = "class";
      return { update: render(s) };
    }

    if (i.customId === ids.cls) {
      s.classKey = i.values[0];
      s.step = "level";
      return { update: render(s) };
    }

    if (i.customId === ids.lvl) {
      const lvl = parseInt(i.values[0], 10);
      if (!Number.isInteger(lvl) || lvl < 1 || lvl > 10) {
        return { cancel: true };
      }

      s.level = lvl;

      return {
        done: true,
        finalReply: makeFinalReply(s, raceLabels, classLabels, racesJson, classesJson),
      };
    }

    return null;
  }

  return { state, render, onInteraction };
}

module.exports = { createPnjWizard };

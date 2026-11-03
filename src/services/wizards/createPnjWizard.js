const path = require("node:path");
const { loadJson } = require("../jsonStore");
const { makeSelect, makeCancelRow, row, pretty } = require("../ui");
const { makeSessionId } = require("../wizard");
const { computeFinalStats } = require("../statsCalculator");

/**
 * Construit une liste de clés et de labels à partir d'un objet JSON.
 *
 * Chaque clé correspond à une entrée du JSON.
 * Le label affiché est :
 * - obj[k].label si présent
 * - sinon une version plus lisible de la clé avec pretty(k)
 *
 * @param {Object} obj - Objet JSON contenant les données à transformer
 * @returns {Object} Objet contenant :
 * - keys : liste des clés disponibles
 * - labels : dictionnaire associant chaque clé à son label affichable
 */
function buildLabelsFromJson(obj) {
  const keys = Object.keys(obj);
  const labels = Object.fromEntries(keys.map((k) => [k, obj[k]?.label || pretty(k)]));
  return { keys, labels };
}

/**
 * Génère le message final affiché après la création du PNJ.
 *
 * Cette fonction calcule les statistiques finales du PNJ à partir de :
 * - sa race
 * - sa classe
 * - son niveau
 *
 * Puis elle retourne un texte formaté dans un bloc de code Discord.
 *
 * @param {Object} state - État actuel du wizard
 * @param {Object} raceLabels - Labels lisibles des races
 * @param {Object} classLabels - Labels lisibles des classes
 * @param {Object} racesJson - JSON contenant les races
 * @param {Object} classesJson - JSON contenant les classes
 *
 * @returns {string} Message final formaté à envoyer dans Discord
 */
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
    `Stats Secondaires: ${finalTotals.secStats}\n` +
    `Stats Magiques: ${finalTotals.magStats}\n` +
    `Comp. générales: ${finalTotals.skillsGeneral}\n` +
    `Comp. spécialisées: ${finalTotals.skillsSpecific}\n` +
    "```"
  );
}

/**
 * Crée le wizard de création d'un PNJ.
 *
 * Le wizard guide l'utilisateur en 3 étapes :
 * 1. Choix de la race
 * 2. Choix de la classe
 * 3. Choix du niveau
 *
 * Il charge les fichiers JSON des races et des classes,
 * prépare les menus déroulants Discord,
 * conserve l'état de progression,
 * puis génère la réponse finale une fois le PNJ créé.
 *
 * @param {Object} message - Message Discord ayant déclenché le wizard
 * @returns {Object} Objet contenant :
 * - state : état initial du wizard
 * - render : fonction qui affiche l'étape actuelle
 * - onInteraction : fonction qui gère les interactions utilisateur
 */
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

  /**
   * Génère l'affichage Discord correspondant à l'étape actuelle du wizard.
   *
   * Selon l'étape, la fonction retourne :
   * - un menu de sélection de race
   * - un menu de sélection de classe
   * - un menu de sélection de niveau
   *
   * @param {Object} s - État courant du wizard
   * @returns {Object} Objet Discord contenant :
   * - content : texte affiché
   * - components : composants interactifs Discord
   */
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

  /**
   * Gère les interactions Discord du wizard.
   *
   * Cette fonction est appelée quand l'utilisateur :
   * - choisit une race
   * - choisit une classe
   * - choisit un niveau
   * - clique sur annuler
   *
   * Elle met à jour l'état du wizard,
   * change l'étape affichée,
   * ou termine la création du PNJ.
   *
   * @param {Object} i - Interaction Discord reçue
   * @param {Object} s - État courant du wizard
   *
   * @returns {Promise<Object|null>} Résultat de l'interaction :
   * - { cancel: true } si l'utilisateur annule
   * - { update: ... } si l'affichage doit être mis à jour
   * - { done: true, finalReply: ... } si le wizard est terminé
   * - null si l'interaction ne correspond pas à ce wizard
   */
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

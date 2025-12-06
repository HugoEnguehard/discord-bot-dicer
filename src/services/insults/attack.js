const { getRandomInsult } = require('./loader');

const INSULT_INTERVAL_SECONDS = 30;

const activeInsults = new Map();

/**
 * Démarre une "campagne d'insultes" en MP sur un user.
 * Retourne:
 * - true si ça a démarré
 * - false si l'user était déjà en train de se faire insulter
 */
function startInsultingUser(user) {
  if (!user || !user.id) return false;

  // Déjà ciblé -> on ne double pas
  if (activeInsults.has(user.id)) {
    return false;
  }

  const tick = async () => {
    // Si entre temps on a tout stoppé
    if (!activeInsults.has(user.id)) return;

    try {
      const insult = getRandomInsult();
      await user.send(`\`\`\`INSULT
${insult}
\`\`\``);
    } catch (err) {
      console.error(`[Insults] Impossible d'envoyer un MP à ${user.tag} :`, err.message);
      // Optionnel : si tu veux, tu peux arrêter ici pour éviter de spammer un user qui bloque les MP :
      // clearTimeout(activeInsults.get(user.id));
      // activeInsults.delete(user.id);
      // return;
    }

    // Replanifie le prochain envoi
    const timeoutId = setTimeout(tick, INSULT_INTERVAL_SECONDS * 1000);
    activeInsults.set(user.id, timeoutId);
  };

  // Premier envoi dans X secondes
  const firstTimeoutId = setTimeout(tick, INSULT_INTERVAL_SECONDS * 1000);
  activeInsults.set(user.id, firstTimeoutId);

  return true;
}

/**
 * Arrête toutes les insultes en cours.
 */
function stopAllInsults() {
  for (const timeoutId of activeInsults.values()) {
    clearTimeout(timeoutId);
  }
  activeInsults.clear();
}

/**
 * Optionnel : arrêter pour UN user précis.
 */
function stopInsultsForUser(userId) {
  const timeoutId = activeInsults.get(userId);
  if (!timeoutId) return false;
  clearTimeout(timeoutId);
  activeInsults.delete(userId);
  return true;
}

/**
 * Savoir si un user est déjà en train de se faire insulter.
 */
function isUserBeingInsulted(userId) {
  return activeInsults.has(userId);
}

/**
 * Récupérer la liste des userId actuellement insultés.
 */
function getActiveInsultedUserIds() {
  return Array.from(activeInsults.keys());
}

module.exports = {
  INSULT_INTERVAL_SECONDS,
  startInsultingUser,
  stopAllInsults,
  stopInsultsForUser,
  isUserBeingInsulted,
  getActiveInsultedUserIds,
};

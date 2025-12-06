// À remplacer par TON user ID Discord
const OWNER_ID = process.env.ADMIN_ID;

const insultsPermissions = {
  [process.env.FTT_ID]: [
    process.env.ADMIN_ID,
  ],
  [process.env.OPLS_ID]: [
    process.env.HELIX_ID,
    process.env.ADMIN_ID,
  ],
}

/**
 * Vérifie si un user est autorisé à utiliser les commandes liées aux insultes
 * (insult, stopinsults) sur un serveur donné.
 *
 * Règles :
 * - Si guildId est dans insultsPermissions:
 *    - on autorise uniquement les userId listés
 *    - si le tableau est vide => personne
 * - Sinon (serveur non listé):
 *    - seul OWNER_ID est autorisé
 */
function canUseInsultsCommand(guildId, userId) {
  // DM ou contexte sans serveur -> on limite au OWNER_ID
  if (!guildId) {
    return userId === OWNER_ID;
  }

  const allowed = insultsPermissions[guildId];

  if (Array.isArray(allowed)) {
    // Serveur connu : on applique strictement la liste
    return allowed.includes(userId);
  }

  // Serveur non listé : seul OWNER_ID est autorisé
  return userId === OWNER_ID;
}

module.exports = {
  OWNER_ID,
  insultsPermissions,
  canUseInsultsCommand,
};

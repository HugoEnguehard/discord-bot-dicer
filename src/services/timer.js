const MAX_TIMERS = 1;

// Mémoire cache des timers en cours
const timersByMessage = new Map();

/**
 * Vérifie si on peut lancer un nouveau timer (limite globale).
 */
function canStartNewTimer() {
  return timersByMessage.size < MAX_TIMERS;
}

/**
 * Arrête un timer associé à un message du bot (appelé depuis bot.js sur messageDelete).
 */
function stopTimerForMessage(messageId) {
  const timer = timersByMessage.get(messageId);
  if (!timer) return;

  if (timer.timeoutId) {
    clearTimeout(timer.timeoutId);
  }
  timersByMessage.delete(messageId);
}

/**
 * Lance un timer attaché à un message utilisateur.
 * - envoie le message du bot
 * - gère l'affichage du compte à rebours
 * - prend en compte les suppressions de message / erreurs d'edit
 */
async function startTimer(message, seconds) {
  const sent = await message.reply("```TIMER : Démarrage dans 3 sec...```");

  // On réserve une place dans timersByMessage dès le lancement
  timersByMessage.set(sent.id, {
    timeoutId: null,
    endTime: null,
    lastShown: null
  });

  // Petite pause avant le début du compte à rebours à cause des limitations discord
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Premier affichage : valeur initiale
  try {
    await sent.edit(`\`\`\`TIMER : ${seconds} sec\`\`\``);
  } catch (err) {
    console.error("Impossible d'éditer le message du TIMER (début) :", err.message);
    // si le message n'existe déjà plus, on nettoie et on stoppe
    timersByMessage.delete(sent.id);
    return;
  }

  // On fixe maintenant l'heure de fin (à partir de *maintenant*)
  const endTime = Date.now() + seconds * 1000;

  const timerData = timersByMessage.get(sent.id);
  if (!timerData) {
    // Le timer a été supprimé entre temps
    return;
  }
  timerData.endTime = endTime;
  timerData.lastShown = seconds;

  const tick = async () => {
    const current = timersByMessage.get(sent.id);
    if (!current) return; // timer annulé

    // Combien de secondes restent réellement ?
    const msLeft = current.endTime - Date.now();
    const remaining = Math.ceil(msLeft / 1000);

    // Timer terminé ou dépassé
    if (remaining <= 0) {
      timersByMessage.delete(sent.id);
      try {
        await sent.edit("```TIMER TERMINÉ !```");
      } catch (err) {
        console.error("Impossible d'éditer le message du TIMER (fin) :", err.message);
      }
      return;
    }

    // On n'édite que si la valeur affichée change vraiment
    if (remaining !== current.lastShown) {
      current.lastShown = remaining;
      try {
        await sent.edit(`\`\`\`TIMER : ${remaining} sec\`\`\``);
      } catch (err) {
        console.error("Impossible d'éditer le message du TIMER (tick) :", err.message);
        // Si message supprimé -> on arrête
        timersByMessage.delete(sent.id);
        return;
      }
    }

    // On reprogramme un tick dans ~1 seconde
    current.timeoutId = setTimeout(tick, 1000);
  };

  // Premier tick dans 1 seconde
  timerData.timeoutId = setTimeout(tick, 1000);
}

module.exports = {
  canStartNewTimer,
  startTimer,
  stopTimerForMessage,
  MAX_TIMERS,
};

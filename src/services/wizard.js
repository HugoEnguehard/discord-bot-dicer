function makeSessionId(authorId) {
  return `${authorId}-${Date.now()}`;
}

async function runWizard({ message, initialState, render, onInteraction, timeMs = 120_000 }) {
  const channel = message.channel;
  const authorId = message.author.id;

  const { content, components } = render(initialState);
  const wizardMsg = await channel.send({ content, components });

  const collector = wizardMsg.createMessageComponentCollector({ time: timeMs });

  collector.on("collect", async (i) => {
    // lock auteur
    if (i.user.id !== authorId) {
      return i.reply({ content: "❌ Ce wizard ne t’appartient pas.", ephemeral: true });
    }

    try {
      const result = await onInteraction(i, initialState, { channel, wizardMsg, collector });

      // Convention simple :
      // - result = { update: {content, components} } -> i.update(...)
      // - result = { done: true, finalReply?: string } -> stop + clean + send
      // - result = { cancel: true } -> stop + clean
      if (result?.cancel) {
        collector.stop("cancel");
        return i.update({ content: "✅ Création annulée.", components: [] });
      }

      if (result?.done) {
        collector.stop("done");
        await i.update({ content: "✅ Terminé.", components: [] });
        if (result.finalReply) await channel.send(result.finalReply);
        return;
      }

      if (result?.update) {
        return i.update(result.update);
      }

      // fallback
      return i.reply({ content: "Interaction inattendue.", ephemeral: true });
    } catch (err) {
      console.error("Wizard interaction error:", err);
      if (!i.replied && !i.deferred) {
        return i.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }
  });

  collector.on("end", async (_c, reason) => {
    if (reason === "time") {
      try {
        await wizardMsg.edit({ content: "⏱ Temps écoulé. Création annulée.", components: [] });
      } catch {}
    }
  });

  return wizardMsg;
}

module.exports = { runWizard, makeSessionId };

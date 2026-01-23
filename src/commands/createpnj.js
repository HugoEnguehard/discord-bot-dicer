const { runWizard } = require("../services/wizard");
const { createPnjWizard } = require("../services/wizards/createPnjWizard");

module.exports = {
  name: "createpnj",
  description: "Création de PNJ via wizard (menus).",
  async execute(message) {
    try {
      const { state, render, onInteraction } = createPnjWizard(message);
      await runWizard({ message, initialState: state, render, onInteraction, timeMs: 120_000 });
    } catch (err) {
      console.error("Erreur dans !createpnj :", err);
      return message.reply("Une erreur est survenue dans CREATEPNJ.");
    }
  },
};

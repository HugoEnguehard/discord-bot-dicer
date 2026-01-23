const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

function pretty(key) {
  return String(key).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function makeSelect(customId, placeholder, keys, labels) {
  return new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(
      keys.slice(0, 25).map((k) => ({
        label: labels?.[k] || pretty(k),
        value: k,
      }))
    );
}

function makeCancelRow(customId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(customId).setLabel("Annuler").setStyle(ButtonStyle.Danger)
  );
}

function row(component) {
  return new ActionRowBuilder().addComponents(component);
}

module.exports = { pretty, makeSelect, makeCancelRow, row };

const roll = require('./roll');
const stats = require('./stats');
const help = require('./help');
const ping = require('./ping');
const fate = require('./fate');

const commands = {
  [roll.name]: roll,
  [stats.name]: stats,
  [help.name]: help,
  [ping.name]: ping,
  [fate.name]: fate,
};

module.exports = { commands };

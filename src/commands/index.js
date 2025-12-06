const roll = require('./roll');
const stats = require('./stats');
const help = require('./help');
const ping = require('./ping');
const fate = require('./fate');
const randomplayer = require('./randomplayer');
const truth = require('./truth');
const timer = require('./timer');
const between = require('./between');
const coin = require('./coin');
const insult = require('./insult');
const stopinsults = require('./stopinsults');
const showinsults = require('./showinsults');

const commands = {
  [roll.name]: roll,
  [stats.name]: stats,
  [help.name]: help,
  [ping.name]: ping,
  [fate.name]: fate,
  [randomplayer.name]: randomplayer,
  [truth.name]: truth,
  [timer.name]: timer,
  [between.name]: between,
  [coin.name]: coin,
  [insult.name]: insult,
  [stopinsults.name]: stopinsults,
  [showinsults.name]: showinsults,
};

module.exports = { commands };

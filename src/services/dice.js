const MAX_DICE = 100;   // nombre max de dés par groupe
const MAX_FACES = 1000; // nombre max de faces

function resolveDiceExpressionWithDetails(expression) {
  expression = expression.replace(/\s/g, '');

  const isD100 =
    expression === '1d100' || expression === 'd100';

  const regex = /([+\-])?(\d*d\d+|\d+)/g;
  let diceTotal = 0;
  let constantTotal = 0;
  const diceDetails = [];

  let match;
  while ((match = regex.exec(expression)) !== null) {
    const sign = match[1] === '-' ? -1 : 1;
    const value = match[2];

    if (value.includes('d')) {
      const [numDice, maxRoll] = value.split('d').map(Number);
      const rolls = [];
      const numTimes = numDice || 1;

      for (let i = 0; i < numTimes; i++) {
        const roll = Math.floor(Math.random() * maxRoll) + 1;
        rolls.push(roll);
        diceTotal += sign * roll;
      }

      diceDetails.push({ sign, rolls });
    } else {
      const constantValue = sign * parseInt(value, 10);
      constantTotal += constantValue;
      diceTotal += constantValue;
    }
  }

  let bonusMessage = "";

  // Conditions spéciales pour un jet de 1d100
  if (isD100) {
    if (diceTotal >= 95) {
      bonusMessage = "(Coup dur...)";
    } else if (diceTotal <= 5) {
      bonusMessage = "(EPIC !!!)";
    }
  }

  return {
    total: diceTotal,
    details: `${diceDetails
      .map(
        (item) =>
          `(${item.sign === 1 ? '+' : '-'} ${item.rolls.join(
            ` ${item.sign === 1 ? '+' : '-'} `
          )})`
      )
      .join(' ')}`,
    constants: constantTotal,
    bonus: bonusMessage,
  };
}


module.exports = {
  resolveDiceExpressionWithDetails,
};

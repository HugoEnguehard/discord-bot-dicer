const MAX_DICE = 100;   // nombre max de dés par groupe (ex : 100d6)
const MAX_FACES = 1000; // nombre max de faces (ex : d1000 max)

function resolveDiceExpressionWithDetails(expression) {
  expression = expression.replace(/\s/g, '');

  const isD100 = expression === '1d100' || expression === 'd100';

  // match : +2d6-1d10+3 etc.
  const regex = /([+\-])?(\d*d\d+|\d+)/g;
  let diceTotal = 0;
  let constantTotal = 0;
  const diceDetails = [];

  let match;
  while ((match = regex.exec(expression)) !== null) {
    const sign = match[1] === '-' ? -1 : 1;
    const value = match[2];

    if (value.includes('d')) {
      // ---- PARTIE DÉS ----
      const [numDiceStr, maxRollStr] = value.split('d');

      // numDiceStr peut être "" (cas "d6") -> on considère 1
      const numDice = numDiceStr === '' ? 1 : Number(numDiceStr);
      const maxRoll = Number(maxRollStr);

      // 🔒 Validation des valeurs
      if (!Number.isInteger(numDice) || numDice < 1 || numDice > MAX_DICE) {
        throw new Error(`Nombre de dés invalide (${numDice}) ou supérieur à ${MAX_DICE}`);
      }
      if (!Number.isInteger(maxRoll) || maxRoll < 2 || maxRoll > MAX_FACES) {
        throw new Error(`Nombre de faces invalide (${maxRoll}) ou supérieur à ${MAX_FACES}`);
      }

      const rolls = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * maxRoll) + 1;
        rolls.push(roll);
        diceTotal += sign * roll;
      }

      diceDetails.push({ sign, rolls });
    } else {
      // ---- PARTIE CONSTANTES ----
      const constantValue = sign * parseInt(value, 10);
      if (!Number.isFinite(constantValue)) {
        throw new Error('Constante invalide dans l’expression de dés.');
      }
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
  MAX_DICE,
  MAX_FACES,
};

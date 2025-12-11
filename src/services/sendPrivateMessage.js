async function sendPrivateMessage(client, userId, content) {
  if (!client) {
    console.error('sendPrivateMessage: client Discord manquant.');
    return false;
  }

  if (!userId) {
    console.error('sendPrivateMessage: userId manquant.');
    return false;
  }

  try {
    const user = await client.users.fetch(userId);
    await user.send(content);
    return true;
  } catch (err) {
    console.error(`sendPrivateMessage: impossible d'envoyer un MP à ${userId} :`, err);
    return false;
  }
}

module.exports = { sendPrivateMessage };
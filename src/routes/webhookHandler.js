const { verifySignature, replyMessage } = require('../services/lineClient');
const { sendMessageToDify } = require('../services/difyClient');
const { getConversationId, setConversationId } = require('../services/conversationStore');

async function processEvent(event) {
  if (event.type !== 'message' || event.message?.type !== 'text') {
    return;
  }

  const userId = event.source?.userId;
  const replyToken = event.replyToken;
  const userMessage = event.message.text;

  if (!userId || !replyToken) {
    return;
  }

  try {
    const conversationId = getConversationId(userId);
    const { answer, conversationId: newConversationId } = await sendMessageToDify({
      message: userMessage,
      userId,
      conversationId,
    });

    setConversationId(userId, newConversationId);
    await replyMessage(replyToken, answer || '回答を取得できませんでした。');
  } catch (error) {
    console.error('Failed to process LINE event:', error.message);
    await replyMessage(
      replyToken,
      'エラーが発生しました。しばらくしてから再度お試しください。'
    ).catch((fallbackError) => {
      console.error('Failed to send fallback reply:', fallbackError.message);
    });
  }
}

async function handleLineWebhook(rawBody, signature) {
  if (!verifySignature(rawBody, signature)) {
    return { statusCode: 401, body: { error: 'Invalid signature' } };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf-8'));
  } catch {
    return { statusCode: 400, body: { error: 'Invalid request body' } };
  }

  const events = payload.events || [];
  await Promise.all(events.map(processEvent));

  return { statusCode: 200, body: { status: 'ok' } };
}

module.exports = { handleLineWebhook };

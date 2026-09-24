const { Client, validateSignature } = require('@line/bot-sdk');
const { loadEnv } = require('../config/env');

let client;

function getClient() {
  if (!client) {
    const env = loadEnv();
    client = new Client({
      channelAccessToken: env.lineChannelAccessToken,
      channelSecret: env.lineChannelSecret,
    });
  }
  return client;
}

function verifySignature(rawBody, signature) {
  if (!signature) {
    return false;
  }
  const env = loadEnv();
  return validateSignature(rawBody, env.lineChannelSecret, signature);
}

async function replyMessage(replyToken, text) {
  try {
    await getClient().replyMessage(replyToken, {
      type: 'text',
      text,
    });
  } catch (error) {
    // error.originalErrorにはAuthorizationヘッダーが含まれるため、
    // ステータスとレスポンス本文だけを取り出してログに出す
    const status = error.statusCode ?? 'unknown';
    const detail = error.originalError?.response?.data ?? error.message;
    console.error(`LINE Reply API request failed (status: ${status}):`, detail);
    throw new Error(`LINE Reply API request failed (status: ${status})`);
  }
}

module.exports = { verifySignature, replyMessage };

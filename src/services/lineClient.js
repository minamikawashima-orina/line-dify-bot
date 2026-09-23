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
  await getClient().replyMessage(replyToken, {
    type: 'text',
    text,
  });
}

module.exports = { verifySignature, replyMessage };

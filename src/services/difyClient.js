const axios = require('axios');
const { loadEnv } = require('../config/env');

async function sendMessageToDify({ message, userId, conversationId }) {
  const env = loadEnv();

  try {
    const response = await axios.post(
      env.difyApiUrl,
      {
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${env.difyApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return {
      answer: response.data.answer,
      conversationId: response.data.conversation_id,
    };
  } catch (error) {
    // axiosのエラーオブジェクトにはAuthorizationヘッダーが含まれるため、
    // ステータスとメッセージだけを取り出して新しいErrorにする
    const status = error.response?.status ?? 'unknown';
    const detail = error.response?.data?.message || error.message;
    console.error(`Dify API request failed (status: ${status}):`, detail);
    throw new Error(`Dify API request failed (status: ${status}): ${detail}`);
  }
}

module.exports = { sendMessageToDify };

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'LINE_CHANNEL_ACCESS_TOKEN',
  'LINE_CHANNEL_SECRET',
  'DIFY_API_KEY',
  'DIFY_API_URL',
];

function loadEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    lineChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
    difyApiKey: process.env.DIFY_API_KEY,
    difyApiUrl: process.env.DIFY_API_URL,
  };
}

module.exports = { loadEnv };

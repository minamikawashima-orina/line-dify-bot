const getRawBody = require('raw-body');
const { handleLineWebhook } = require('../src/routes/webhookHandler');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-line-signature'];
  const result = await handleLineWebhook(rawBody, signature);
  res.status(result.statusCode).json(result.body);
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

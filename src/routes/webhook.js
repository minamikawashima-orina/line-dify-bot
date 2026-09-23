const express = require('express');
const { handleLineWebhook } = require('./webhookHandler');

const router = express.Router();

router.post('/', express.raw({ type: '*/*' }), async (req, res) => {
  const signature = req.headers['x-line-signature'];
  const result = await handleLineWebhook(req.body, signature);
  res.status(result.statusCode).json(result.body);
});

module.exports = router;

const express = require('express');
const { loadEnv } = require('./config/env');
const webhookRouter = require('./routes/webhook');

loadEnv();

const app = express();

app.get('/', (_req, res) => {
  res.send('LINE x Dify bot is running.');
});

app.use('/webhook', webhookRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

# line-dify-bot

LINEで送ったメッセージをDify APIに送り、Difyの回答をLINEに返信するチャットボット。

## セットアップ

```bash
npm install
cp .env.example .env
```

`.env` に以下を設定する（値は絶対にコミットしない）。

```
LINE_CHANNEL_ACCESS_TOKEN=（LINE Developersコンソールで発行）
LINE_CHANNEL_SECRET=（LINE Developersコンソールで発行）
DIFY_API_KEY=（DifyのAPPで発行するAPIキー）
DIFY_API_URL=https://api.dify.ai/v1/chat-messages
```

## ローカルでの起動

```bash
npm run dev
```

`http://localhost:3000` でサーバーが起動し、`POST /webhook` がLINEからのWebhookを受け付ける。

LINEはローカルホストに直接アクセスできないため、外部からアクセスできるURLが必要。`ngrok` などでトンネルを作る。

```bash
ngrok http 3000
```

表示された `https://xxxx.ngrok-free.app/webhook` をLINE Developersコンソールの「Webhook URL」に設定し、「Verify」で200が返ることを確認する。

## テスト方法

1. LINE Developersコンソールでボットを友だち追加する
2. LINE公式アプリからボットにメッセージを送る
3. Dify経由の回答が返ってくることを確認する
4. 続けて別のメッセージを送り、Difyの会話が継続している（文脈を保持している）ことを確認する

署名検証のロジックだけを単体で試したい場合、正しい署名を自分で計算する必要があるため、実際のLINEアプリからのメッセージで確認するのが最も簡単。

## Vercelへのデプロイ方法

1. このリポジトリをGitHubにpushする（`.env` は `.gitignore` により含まれない）
2. Vercelのダッシュボードで「Add New Project」からこのリポジトリをImportする
3. Vercelの「Environment Variables」に以下を設定する（`.env` の値をそのままコピー）
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
   - `DIFY_API_KEY`
   - `DIFY_API_URL`
4. Deployを実行する
5. デプロイ完了後のURL（例: `https://line-dify-bot.vercel.app`）に `/webhook` を付けたURLをLINE Developersコンソールの「Webhook URL」に設定する
   - 例: `https://line-dify-bot.vercel.app/webhook`
6. 「Verify」で200が返ることを確認し、実際にLINEでメッセージを送って動作確認する

## 注意点

- 会話の継続（`conversation_id`）はメモリ上（`src/services/conversationStore.js`）に保存しているため、Vercelのサーバーレス関数が再起動・スケールした場合は履歴が失われる。本番運用する場合はRedisなどの永続的なストアに置き換える必要がある。

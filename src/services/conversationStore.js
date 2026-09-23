// メモリ上の保存なので、サーバーレス関数の再起動やスケールアウトで会話履歴は失われる。
// 本番運用ではRedisやDBなど永続的なストアに置き換える必要がある。
const conversations = new Map();

function getConversationId(userId) {
  return conversations.get(userId);
}

function setConversationId(userId, conversationId) {
  if (conversationId) {
    conversations.set(userId, conversationId);
  }
}

module.exports = { getConversationId, setConversationId };

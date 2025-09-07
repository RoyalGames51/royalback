// index.js
const http = require("http");
const app = require("./src/server");
const { conn } = require("./src/database");
const { setupChat } = require("./src/chat");

const port = process.env.PORT || 3001;
console.log("USING PORT:", port);

// asegura tabla chat_messages
async function ensureChatTable(sequelize) {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL,
      nick TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
      ON chat_messages(created_at DESC);
  `);
}

(async () => {
  try {
    await conn.authenticate();
    await conn.sync({ force: false });
    await ensureChatTable(conn);

    const httpServer = http.createServer(app);

    // 👇 monta el WS /chat en el MISMO server/puerto
    setupChat(httpServer, conn);

    httpServer.listen(port, () => {
      console.log(`🚀 HTTP+WS server on :${port} (path /chat)`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();

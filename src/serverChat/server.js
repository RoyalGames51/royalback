// src/chat.js
const { WebSocketServer } = require('ws');

// --- utils ---
const sanitize = (s) => ('' + s).slice(0, 500).trim();
function heartbeat() { this.isAlive = true; }

function setupChat(httpServer, db /* sequelize conn o pg pool */) {
  const wss = new WebSocketServer({ server: httpServer, path: '/chat' });
  const RATE_LIMIT_WINDOW_MS = 3000;
  const lastMessageAt = new Map(); // userId -> ts

  // --- helpers ---
  function currentUsers() {
    // Evita duplicados por userId
    const map = new Map();
    wss.clients.forEach(ws => {
      if (ws.readyState === 1 && ws.user) {
        map.set(ws.user.id, { id: ws.user.id, nick: ws.user.nick });
      }
    });
    return Array.from(map.values());
  }

  function broadcast(obj) {
    const data = JSON.stringify(obj);
    wss.clients.forEach(c => { if (c.readyState === 1) c.send(data); });
  }

  function broadcastPresence() {
    broadcast({ type: 'presence', users: currentUsers() });
  }

  async function sendHistory(ws, limit = 50) {
    try {
      // Sequelize conn.query devuelve [rows, metadata]
      const [rows] = await db.query(`
        SELECT user_id, nick, text, EXTRACT(EPOCH FROM created_at) AS ts
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT ${Number(limit) || 50}
      `);
      ws.send(JSON.stringify({ type: 'history', messages: rows.reverse() }));
    } catch (e) {
      console.error('History error', e);
    }
  }

  // --- conexión ---
  wss.on('connection', async (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const jugadorID = sanitize(url.searchParams.get('jugadorID') || '');
    const nickQ     = sanitize(url.searchParams.get('nick') || 'Jugador');

    if (!jugadorID) {
      ws.send(JSON.stringify({ type: 'system', error: 'Falta jugadorID' }));
      ws.close();
      return;
    }

    ws.user = { id: jugadorID, nick: nickQ || 'Jugador' };

    // 1) Manda historial al recién llegado
    await sendHistory(ws, 50);

    // 2) Mensaje de sistema opcional
    broadcast({ type: 'system', text: `${ws.user.nick} se unió al chat.` });

    // 3) Presencia: primero al recién llegado, luego a todos
    ws.send(JSON.stringify({ type: 'presence', users: currentUsers() }));
    broadcastPresence();

    // 4) Mensajes entrantes
    ws.on('message', async (buf) => {
      let msg;
      try { msg = JSON.parse(buf.toString()); } catch { return; }
      if (msg.type !== 'chat:send') return;

      // Rate limit muy simple
      const now = Date.now();
      const last = lastMessageAt.get(ws.user.id) || 0;
      if (now - last < RATE_LIMIT_WINDOW_MS) {
        ws.send(JSON.stringify({ type: 'system', warn: 'No tan rápido 😅' }));
        return;
      }
      lastMessageAt.set(ws.user.id, now);

      const text = sanitize(msg.text || '');
      if (!text) return;

      try {
        // Guarda en DB con created_at = NOW()
        await db.query(
          `INSERT INTO chat_messages (user_id, nick, text, created_at)
           VALUES ($1, $2, $3, NOW())`,
          { bind: [ws.user.id, ws.user.nick, text] }
        );
      } catch (e) {
        console.error('Save error', e);
      }

      // Retransmite a todos
      broadcast({
        type: 'chat:new',
        user_id: ws.user.id,
        nick: ws.user.nick,
        text,
        ts: Math.floor(Date.now() / 1000),
      });
    });

    ws.on('close', () => {
      broadcast({ type: 'system', text: `${ws.user.nick} salió del chat.` });
      broadcastPresence();
    });
  });

  // --- keepalive (Render, proxies, etc.) ---
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  console.log('✅ WebSocket /chat listo');
  return wss;
}

module.exports = { setupChat };

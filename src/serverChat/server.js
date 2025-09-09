// src/chat.js
const { WebSocketServer } = require('ws');

// helper para sanitizar
const sanitize = (s) => ('' + s).slice(0, 500).trim();

// ping/pong para mantener vivo en Render
function heartbeat() { this.isAlive = true; }

function setupChat(httpServer, db /* <- conn de Sequelize o un Pool de pg */, opts = {}) {

  const wss = new WebSocketServer({ server: httpServer, path: '/chat' });
  const RATE_LIMIT_WINDOW_MS = 3000;
  const lastMessageAt = new Map(); // userId -> ts

  // Dentro de setupChat(...)
function currentUsers(wss) {
  const map = new Map();
  wss.clients.forEach(ws => {
    if (ws.user) map.set(ws.user.id, { id: ws.user.id, nick: ws.user.nick });
  });
  return Array.from(map.values());
}

function broadcast(wss, obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(data); });
}

function broadcastPresence(wss) {
  broadcast(wss, { type: 'presence', users: currentUsers(wss) });
}

wss.on('connection', async (ws, req) => {
  // ... tu código existente ...

  // Enviá presencia al nuevo y a todos
  ws.send(JSON.stringify({ type: 'presence', users: currentUsers(wss) }));
  broadcastPresence(wss);

  ws.on('close', () => {
    broadcastPresence(wss);
  });
});


  wss.on('connection', async (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const jugadorID = sanitize(url.searchParams.get('jugadorID') || '');
    const nick = sanitize(url.searchParams.get('nick') || 'Jugador');

    if (!jugadorID) {
      ws.send(JSON.stringify({ type: 'system', error: 'Falta jugadorID' }));
      ws.close();
      return;
    }

    ws.user = { id: jugadorID, nick };

    // Enviar historial
    try {
      const [rows] = await db.query(`
        SELECT user_id, nick, text, EXTRACT(EPOCH FROM created_at) AS ts
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT 50
      `);
      ws.send(JSON.stringify({ type: 'history', messages: rows.reverse() }));
    } catch (e) {
      console.error('History error', e);
    }

    broadcast(wss, { type: 'system', text: `${nick} se unió al chat.` });

    ws.on('message', async (buf) => {
      let msg; try { msg = JSON.parse(buf.toString()); } catch { return; }
      if (msg.type !== 'chat:send') return;

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
       await db.query(
  `INSERT INTO chat_messages (user_id, nick, text, created_at)
   VALUES ($1, $2, $3, NOW())`,
  { bind: [ws.user.id, ws.user.nick, text] }
);

      } catch (e) {
        console.error('Save error', e);
      }

      broadcast(wss, {
        type: 'chat:new',
        user_id: ws.user.id,
        nick: ws.user.nick,
        text,
        ts: Math.floor(Date.now() / 1000),
      });
    });

    ws.on('close', () => {
      broadcast(wss, { type: 'system', text: `${nick} salió del chat.` });
    });
  });

  // keepalive
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

function broadcast(wss, obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
}


function getPresence() {
  const users = [];
  wss.clients.forEach(c => {
    if (c.readyState === 1 && c.user) {
      users.push({ id: c.user.id, nick: c.user.nick });
    }
  });
  return { type: 'presence', users };
}





function broadcastPresence(){
  const msg = JSON.stringify(getPresence());
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const jugadorID = sanitize(url.searchParams.get('jugadorID') || '');
  const nickQ     = sanitize(url.searchParams.get('nick') || '');

  // fallback seguro
  ws.user = { id: jugadorID, nick: nickQ || 'Jugador' };

  // tras conectar, emite la presencia correcta
  broadcastPresence();

  ws.on('close', () => broadcastPresence());
});




module.exports = { setupChat };

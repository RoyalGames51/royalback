// en tus rutas/controladores
const { ChatMessage } = require("../database"); // el mismo donde exportas { ...sequelize.models, conn }

async function getHistory(req, res) {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const rows = await ChatMessage.findAll({
    order: [["created_at", "DESC"]],
    limit,
  });
  // devolver del más viejo al más nuevo
  res.json(rows.reverse());
}

async function postMessage(req, res) {
  const { user_id, nick, text } = req.body;
  if (!user_id || !nick || !text) {
    return res.status(400).json({ error: "Faltan campos." });
  }
  const msg = await ChatMessage.create({ user_id, nick, text });
  res.status(201).json(msg);
}

module.exports = {getHistory, postMessage}
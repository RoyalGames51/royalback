// /models/chatmessage.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      nick: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "chat_messages",
      timestamps: false, // usamos created_at manual
      underscored: true,
      indexes: [
        { name: "idx_chat_messages_created_at", fields: ["created_at"] },
      ],
    }
  );

  return ChatMessage;
};

const server = require("./src/server");
const { conn } = require('./src/database');

const port = process.env.PORT || 3001;

console.log("USING PORT:", port);

conn.sync({ force: false })
  .then(() => {
    console.log("✅ DB connected, syncing models...");
    server.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error("❌ Database connection failed:", error);
  });


const { Game } = require("../../database");

const createGame = async (name) => {
  

  try {
    const newGame = await Game.findOrCreate({ where: { name }} );
    return newGame;
  } catch (error) {
    throw new Error(`Error al crear el juego: ${error.message}`);
  }
};

module.exports = createGame;

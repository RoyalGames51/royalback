
const createGame = require("../../Controllers/gameControllers/createGame");

const createGameHandler = async (req, res) => {
  try {
    const {name} = req.body;
    const newGame= await createGame(name)
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createGameHandler;

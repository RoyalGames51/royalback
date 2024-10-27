const addChips = require('../../Controllers/chipsControllers/addChips');

module.exports = async (req, res) => {
    const { nick } = req.body;
    const { newChips } = req.body;
    
    try {
        const updChips = await addChips(nick, newChips);

        res.status(200).json(updChips);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
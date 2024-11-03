const addChips = require('../../Controllers/chipsControllers/addChips');

module.exports = async (req, res) => {
    const { id } = req.body;
    const { newChips } = req.body;
    
    try {
        const updChips = await addChips(id, newChips);

        res.status(200).json(updChips);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
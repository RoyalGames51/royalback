const removeChips = require('../../Controllers/chipsControllers/removeChips');

module.exports = async (req, res) => {
    const { id } = req.body;
    const { removeChip } = req.body;
    
    try {
        const updChips = await removeChips(id, removeChip);

        res.status(200).json(updChips);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
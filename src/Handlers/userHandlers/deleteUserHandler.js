const deleteUser = require('../../Controllers/userControllers/deleteUser');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUs = await deleteUser(id);

        if (deletedUs)
            return res.status(200).json(deletedUs);
        else
           return res.status(404).send(`No existe usuario con ID ${id}.`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
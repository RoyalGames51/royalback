const updateUser = require('../../Controllers/userControllers/updateUser');

module.exports = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Pasa el `req.body` directamente como `newData`
        const updUser = await updateUser(id, req.body);

        res.status(200).json(updUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

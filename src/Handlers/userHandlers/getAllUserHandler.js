const getAllUsers = require('../../Controllers/userControllers/getAllUsers');

module.exports = async (req, res) => {
    try {

        const users = await getAllUsers();

        res.status(200).json(users);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
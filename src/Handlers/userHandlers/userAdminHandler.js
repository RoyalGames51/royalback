const userAdmin = require('../../Controllers/userControllers/userAdmin');

module.exports = async (req, res) => {
    const  id = req.params;
    
    
    try {
        const updUser = await userAdmin(id);

        res.status(200).json(updUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
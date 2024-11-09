const banUser = require('../../Controllers/userControllers/banUser');

module.exports = async (req, res) => {
    const  {id} = req.body;
    
    
    try {
        const updUser = await banUser(id);

        res.status(200).json(updUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const inactiveUser = require('../../Controllers/userControllers/inactiveUser');

module.exports = async (req, res) => {
    const  {id} = req.body;
    
    
    try {
        const updUser = await inactiveUser(id);

        res.status(200).json(updUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
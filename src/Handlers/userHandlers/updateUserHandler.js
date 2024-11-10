const updateUser = require('../../Controllers/userControllers/updateUser');

module.exports = async (req, res) => {
    const { id} = req.params;
    const  newData  = req.body;
    console.log("newdata", newData);
    
    try {
        const updUser = await updateUser(id, newData);

        res.status(200).json(updUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
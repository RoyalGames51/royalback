const getUserById = require('../../Controllers/userControllers/getUserbyId');

module.exports = async (req, res) => {
    const {id} =req.params; 
    try {
        // const { id } = req.query;
        const usuario = await getUserById(id);

        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json(`Error al obtener usuario: ${error.message }`);
    }
}
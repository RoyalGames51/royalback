const getUserByNick = require('../../Controllers/userControllers/getUserByNick');

module.exports = async (req, res) => {
    try {
        const { nick } = req.query;
        const usuario = await getUserByNick(nick);
        console.log("usuariooo",usuario);

        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json(`Error al obtener usuario: ${error.message }`);
    }
}
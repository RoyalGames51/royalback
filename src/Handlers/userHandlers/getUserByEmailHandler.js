const getUserByEmail = require('../../Controllers/userControllers/getUserByEmail');

module.exports = async (req, res) => {
    try {
        console.log("llega acaaaa");
        const { email } = req.body;
        console.log("mailhanlder",email);
        const usuario = await getUserByEmail(email);
console.log(usuario, "usuariohd");
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json(`Error al obtener usuario: ${error.message }`);
    }
}
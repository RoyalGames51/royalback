const updateUser = require('../../Controllers/userControllers/updateUser');

module.exports = async (req, res) => {
    const { id } = req.params;
    const newData = req.body; // Corrección aquí

    try {
        console.log("Datos recibidos:", newData); // Log para verificar los datos recibidos
        const updUser = await updateUser(id, newData);

        res.status(200).json({ message: "Usuario actualizado", user: updUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

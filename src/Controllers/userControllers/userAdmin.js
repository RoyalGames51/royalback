const { User } = require('../../database'); 

const userAdmin = async (id) => {
    try {
        const userToUpdate = await User.findByPk(id);

        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }

        // Actualizamos la propiedad admin a true
        await userToUpdate.update({ admin: true });
        await userToUpdate.reload();

        return {
            message: 'Usuario actualizado a administrador',
            userToUpdate
        };
    } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

module.exports = userAdmin;

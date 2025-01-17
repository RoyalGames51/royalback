const { User } = require('../../database');

const updateUser = async (id, newData) => {
    try {
        const userToUpdate = await User.findByPk(id);

        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }

        // Actualiza solo los campos proporcionados en `newData`
        await userToUpdate.update(newData);

        // Retorna los datos actualizados
        const updatedUser = await userToUpdate.reload();

        return {
            message: 'Usuario actualizado',
            user: updatedUser
        };
    } catch (error) {
        console.error(`Error en updateUser:`, error);
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

module.exports = updateUser;

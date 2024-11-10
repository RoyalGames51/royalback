const { User } = require('../../database');

const updateUser = async (id, newData) => {
    try {
        const userToUpdate = await User.findByPk(id);
      
        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }

        // Actualiza solo los campos presentes en `newData`
        await userToUpdate.update(Object.assign({}, userToUpdate.toJSON(), newData));
        
        // No necesitas `reload()` a menos que necesites confirmar los cambios
        return {
            message: 'Usuario actualizado',
            user: userToUpdate
        };
    } catch (error) {
        console.error(`Error en updateUser:`, error);
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

module.exports = updateUser;

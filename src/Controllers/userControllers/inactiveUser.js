const { User } = require('../../database'); 

const inactiveUser = async (id) => {
    try {
       
        const userToUpdate = await User.findByPk(id);

        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }

        // Actualizamos la propiedad admin a true
        await userToUpdate.update({ inactive: true });
        await userToUpdate.reload();

        return {
            message: 'Usuario inactivado exitosamente',
            userToUpdate
        };
    } catch (error) {
        throw new Error(`Error al inactivar usuario: ${error.message}`);
    }
};

module.exports = inactiveUser;

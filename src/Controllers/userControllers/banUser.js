const { User } = require('../../database'); 

const banUser = async (id) => {
    try {
       
        const userToUpdate = await User.findByPk(id);

        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }

        // Actualizamos la propiedad admin a true
        await userToUpdate.update({ banned: true });
        await userToUpdate.reload();

        return {
            message: 'Usuario baneado exitosamente',
            userToUpdate
        };
    } catch (error) {
        throw new Error(`Error al banear usuario: ${error.message}`);
    }
};

module.exports = banUser;

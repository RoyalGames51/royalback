const { User } = require('../../database');

const addChips = async (id, newChips) => {
    try {
        const userToUpdate = await User.findByPk(id);
      
        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }
        const chipsToAdd = Number(newChips);
        if (isNaN(chipsToAdd)) {
            throw new Error("El valor de fichas proporcionado no es un número válido");
        }
        // Suma las nuevas fichas a las fichas actuales del usuario
        const updatedChips = userToUpdate.chips + newChips;

        // Actualiza el campo de fichas
        await userToUpdate.update({ chips: updatedChips });
        await userToUpdate.reload();

        return {
            message: 'Usuario actualizado',
            userToUpdate
        };
    } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

module.exports = addChips;

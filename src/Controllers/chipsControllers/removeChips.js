const { User } = require('../../database');

const removeChips = async (id, removeChip) => {
    try {
        const userToUpdate = await User.findByPk(id);
      
        if (!userToUpdate) {
            throw new Error("Usuario inexistente");
        }
        const chipsToRemove = Number(removeChip);
        if (isNaN(chipsToRemove)) {
            throw new Error("El valor de fichas proporcionado no es un número válido");
        }
        // Suma las nuevas fichas a las fichas actuales del usuario
        const updatedChips = userToUpdate.chips - chipsToRemove;

        // Actualiza el campo de fichas
        await userToUpdate.update({ chips: updatedChips });
        await userToUpdate.reload();

        return {
            message: 'Fichas removidas correctamente',
            userToUpdate
        };
    } catch (error) {
        throw new Error(`Error al actualizar las fichas: ${error.message}`);
    }
};

module.exports = removeChips;

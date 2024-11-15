// const { User } = require('../../database'); 

// const firstChips = async (id) => {
//     try {
       
//         const userToUpdate = await User.findByPk(id);

//         if (!userToUpdate) {
//             throw new Error("Usuario inexistente");
//         }

//         // Actualizamos la propiedad admin a true
//         await userToUpdate.update({ firstChips: true });
//         await userToUpdate.reload();

//         return {
//             message: 'Usuario premiado exitosamente',
//             userToUpdate
//         };
//     } catch (error) {
//         throw new Error(`Error al premiar usuario: ${error.message}`);
//     }
// };

// module.exports = firstChips;

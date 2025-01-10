const { User, Game } = require('../../database');

// Obtener juegos favoritos del usuario
const getFavorites = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
          include: {
            model: Game,
            through: { attributes: [] }, // No incluir datos adicionales de la tabla intermedia
          },
        });
    
        return user ? user.Games : [];
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);
      }
};

// Agregar un juego a favoritos
const addFavorite = async (userId, gameId) => {
    try {
        // Busca el usuario y el juego
        const user = await User.findByPk(userId);
        const game = await Game.findByPk(gameId);
    
        // Si ambos existen, agrega la relación en la tabla intermedia
        if (user && game) {
          await user.addGame(game);
          console.log('Juego agregado a favoritos');
        } else {
          console.log('Usuario o juego no encontrado');
        }
      } catch (error) {
        console.error('Error al agregar favorito:', error);
      }
};

// Eliminar un juego de favoritos
const removeFavorite = async (userId, gameId) => {
    try {
        const user = await User.findByPk(userId);
        const game = await Game.findByPk(gameId);
        if (!user || !game) throw new Error('Usuario o juego no encontrado.');

        await user.removeGame(game); // Método generado por la relación Sequelize
        return gameId; // Retorna el ID del juego eliminado
    } catch (error) {
        throw new Error(`Error al eliminar favorito: ${error.message}`);
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };

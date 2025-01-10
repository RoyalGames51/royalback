const { User, Game } = require('../../database');

// Obtener juegos favoritos del usuario
const getFavorites = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Game,
                attributes: ['id', 'name', 'image', 'description'], // Ajusta según tus columnas
                through: { attributes: [] }, // Excluye la tabla intermedia
            },
        });
        if (!user) throw new Error('Usuario no encontrado.');
        return user.Games; // Juegos favoritos
    } catch (error) {
        throw new Error(`Error al obtener favoritos: ${error.message}`);
    }
};

// Agregar un juego a favoritos
const addFavorite = async (userId, gameId) => {
    try {
        const user = await User.findByPk(userId);
        const game = await Game.findByPk(gameId);
        if (!user || !game) throw new Error('Usuario o juego no encontrado.');

        await user.addGame(game); // Método generado por la relación Sequelize
        console.log('juego en bd', game)

        // Devuelve el juego completo
        return await Game.findByPk(gameId, {
            attributes: ['id', 'name'], // Ajusta según tus columnas
        });
    } catch (error) {
        throw new Error(`Error al agregar favorito: ${error.message}`);
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

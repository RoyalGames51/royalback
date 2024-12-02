const { getFavorites, addFavorite, removeFavorite } = require('../Controllers/userControllers/favoriteControllers');

const getFavoritesHandler = async (req, res) => {
    const { userId } = req.params;
    try {
        const favorites = await getFavorites(userId);
        res.status(200).json(favorites);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addFavoriteHandler = async (req, res) => {
    const { userId, gameId } = req.body;
    try {
        const favorite = await addFavorite(userId, gameId);
        res.status(201).json(favorite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeFavoriteHandler = async (req, res) => {
    const { userId, gameId } = req.params;
    try {
        const removedGameId = await removeFavorite(userId, gameId);
        res.status(200).json({ removedGameId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getFavoritesHandler, addFavoriteHandler, removeFavoriteHandler };

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Game = sequelize.define('Game', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    // Relación muchos a muchos entre Game y User
    Game.associate = (models) => {
        Game.belongsToMany(models.User, {
          through: 'userGames', // Tabla intermedia
          foreignKey: 'gameId',
        });
      };

    return Game;
};

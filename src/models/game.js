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
            allowNull: false
        }
    },
    { timestamps: false });

    Game.associate = (models) => {
        
        Game.belongsToMany(models.User, { foreignKey: 'UserFavGames' })
  
    }
    return Game //relacion con avatar
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const Pay= sequelize.define('Pay', {
        paymentId: {
           type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        paymentPlataform: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false

        },
        chips: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })
    Pay.associate = (models) => {
        Pay.belongsTo(models.User, { foreignKey: 'userId' });};
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    const Pay= sequelize.define('Pay', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
        },
        paymentPlataform: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.NUMBER,
            allowNull: false

        },
        chips: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
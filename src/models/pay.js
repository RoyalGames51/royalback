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
            type: DataTypes.STRING,
            allowNull: false

        },
        chips: {
            type: DataTypes.STRING,
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
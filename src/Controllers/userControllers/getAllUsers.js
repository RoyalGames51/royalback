const { User, Pay, Game } = require('../../database');

const getAllUsers = async () => {
    try {

        const users = await User.findAll({
            include: [
                {
                    model: Game,
                    attributes: ['id', 'userId', 'name'],
                },
                {
                    model: Pay, 
                    attributes: ['paymentId', 'date', 'paymentPlataform', 'chips', 'price', 'userId'],
                }
            ]
        });           

        return users;

    } catch (error) {
        throw Error(`Error al obtener usuarios: ${error.message}`); 
    }
};

module.exports = getAllUsers;
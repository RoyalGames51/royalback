const postUser = require('../../Controllers/userControllers/postUser');

module.exports = async (req, res) => {

    try {
        const { nick, email, password, image,
            avatar,
            age, 
            country, 
            chips } = req.body;
        if( !nick || !email){
            throw new Error(`Error, no se recibieron los datos para crear el usuario ${error.message}`) 
        }
        const newUser = await postUser(nick.toLowerCase(), email, password,image,
        avatar, 
        age, 
        country, 
        chips);
         
        res.status(201).json(newUser);
    } catch (error) {
        
        res.status(400).json(`Error al crear usuario (handler): ${error.message}`)
    }
}
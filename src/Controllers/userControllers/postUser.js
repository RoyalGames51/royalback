const { User } = require("../../database")
// const sendMailHandler = require('../../utils/mailing/sendMailHandler');

const postUser = async ( nick, email, password,avatar,age,country,chips ) => {
    
    try {
     console.log(nick,email);
        const [newUser, created] = await User.findOrCreate({
            where: { email },
            defaults: { nick, email, password,age,avatar,country,chips }
        });
        
          
        // if(created){      
        //     const welcomeEmail = await sendMailHandler({
        //         id: newUser.id,
        //         name, surname, email, phone, dni, image, 
        //         option: "signIn"
        //     });
        // }
                   
        return  newUser.dataValues

    } catch (error) {
        throw new Error(`Error al crear el usuario (controller): ${error.message}`)
    }
}

module.exports = postUser;

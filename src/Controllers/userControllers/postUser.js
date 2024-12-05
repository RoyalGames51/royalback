const { User } = require("../../database");
const sendMailHandler = require("../../Mailing/sendMailHandler");

const postUser = async (nick, email, password, image, avatar, age, country, chips) => {
    try {
        // Convertir el nick a minúsculas
        const normalizedNick = nick.toLowerCase();

        // Verificar si el nick ya existe en la base de datos
        const existingNick = await User.findOne({ where: { nick: normalizedNick } });
        if (existingNick) {
            throw new Error(`El nick '${nick}' ya está en uso.`);
        }

        // Crear el usuario en la base de datos
        const [newUser, created] = await User.findOrCreate({
            where: { email },
            defaults: { 
                nick: normalizedNick, 
                email, 
                password, 
                image,
                avatar, 
                age, 
                country, 
                chips 
            }
        });

        // Enviar el correo de bienvenida si se creó el usuario
        if (created) {
            const register = {
                nick: normalizedNick,
                email,
                option: "signIn"
            };

            await sendMailHandler(register);
        }

        return newUser.dataValues;
    } catch (error) {
        throw new Error(`Error al crear el usuario (controller): ${error.message}`);
    }
};

module.exports = postUser;

const { User } = require("../../database");
const sendMailHandler = require("../../Mailing/sendMailHandler");

const postUser = async (nick, email, password, image, avatar, age, country, chips, sexo) => {
    try {
        // Convertir el nick a minúsculas
        const normalizedNick = nick.toLowerCase();

        // Verificar si el nick ya existe en la base de datos
        const existingNick = await User.findOne({ where: { nick: normalizedNick } });
        if (existingNick) {
            throw new Error(`El nick '${nick}' ya está en uso.`);
        }

        // Asignar imagen predeterminada si no se proporciona
        if (!image) {
            image = sexo === 'M' 
                ? 'https://lumiere-a.akamaihd.net/v1/images/cg_avatar_rerelease_mobile_785_f561a1e6.jpeg?region=0,0,1024,576&width=960' 
                : 'https://i.pinimg.com/236x/9a/92/cc/9a92cc07d4bcf692f510248b849c4389.jpg';
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
                chips,
                sexo
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

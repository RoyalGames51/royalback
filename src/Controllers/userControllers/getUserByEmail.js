const { User,Game } = require('../../database');

module.exports = async(email)=>{
    try{
        const usuario = await User.findOne({
            where:{email: email},
            include: [{
                model: Game,
                attributes: ['id', 'name'],
            }]
        });

        if(!usuario)
            throw new Error(`No existe usuario con email ${email} en base de datos.`);

        return usuario;

    }catch(error){
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
}
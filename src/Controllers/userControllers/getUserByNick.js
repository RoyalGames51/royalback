const { User} = require('../../database');

module.exports = async(nick)=>{
    try{
        const usuario = User.findOne({
            where:{nick: nick}
            // include: [{
            //     model: Game,
            //     attributes: ['id', 'name'],
            // }]
        });

        if(!usuario)
            throw new Error(`No existe usuario con nick ${nick} en la base de datos.`);

        return usuario;

    }catch(error){
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
}
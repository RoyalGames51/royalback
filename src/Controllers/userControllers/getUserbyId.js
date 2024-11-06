const { User} = require('../../database');
module.exports = async(id)=>{
    try{
        const usuario = await User.findByPk(id);

        if(!usuario)
            throw new Error(`No existe usuario con id ${id}`);

        return usuario;

    }catch(error){
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
}
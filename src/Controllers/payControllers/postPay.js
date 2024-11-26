const {User, Pay} =require('../../database')

const postPay = async ({paymentPlataform,price,chips,userId,date})=>{
   console.log(chips,price,userId);
   

    try {
        const [newPay, created] = await Pay.findOrCreate({
            where: {
                userId: userId.toString(),
                date: date.toString(),
                paymentPlataform: paymentPlataform.toString(),
                chips:chips,
                price:price.toString()
            },
            defaults: {
                userId:userId.toString(),
                date:date.toString(),
                price:price.toString(),
                chips,
                paymentPlataform:paymentPlataform.toString()
            }
        });
        const user = await User.findByPk(userId);
        if (user) {
            await user.addPay(newPay);
        } else {
            throw new Error('No se encontró el usuario.');
        }


        return newPay;
    } catch (error) {
        throw new Error(`Error al crear pedido: ${error.message}`);
    }
}

module.exports =postPay;
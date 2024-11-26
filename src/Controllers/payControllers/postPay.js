const {User, Pay} =require('../../database')

const postPay = async ({paymentPlataform,price,chips,userId,date})=>{
   console.log(chips,price,userId);
   

    try {
        const [newPay, created] = await Pay.findOrCreate({
            where: {
                userId: userId,
                date: date,
                paymentPlataform: paymentPlataform,
                chips:chips,
                price:price.toString()
            },
            defaults: {
                userId,
                date,
                price:price.toString(),
                chips,
                paymentPlataform
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
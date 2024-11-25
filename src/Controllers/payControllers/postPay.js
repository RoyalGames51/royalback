const {User, Pay} =require('../../database')

const postPay = async ({paymentPlataform,price,chips,userId,date})=>{
    const chipString = chips ? chips.toString() : "0";

    try {
        const [newPay, created] = await Pay.findOrCreate({
            where: {
                userId: userId,
                date: date,
                paymentPlataform: paymentPlataform,
                chips:chipString,
                price:price
            },
            defaults: {
                userId,
                date,
                price,
                chips:chipString,
                paymentPlataform
            }
        });

        // if (!created)
        //     throw new Error(`Ya existe un viaje para el usuario, mismo día, hora, origen y destino en la base de datos.`);

        const user = await User.findByPk(userId);
        

        if (user) {
            await user.addPay(newPay);
        } else {
            throw new Error('No se encontró el usuario.');
        }
        
        //************PARA ENVIAR MENSAJE AL RESERVAR VIAJE ********************/
        // const mailReserve = {
        //          userId: userId,
        //          tripId: newTrip.id,
        //          option: "reserve",

        //          email:user.email,
        //          name:user.name
        //      }
        //      console.log(mailReserve)
        // await sendMailHandler(mailReserve)
        //**************************************************************************/


        return newPay;
    } catch (error) {
        throw new Error(`Error al crear pedido: ${error.message}`);
    }
}

module.exports =postPay;
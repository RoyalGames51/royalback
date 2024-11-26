const { Pay } = require("../../database");
const postPay = require("../payControllers/postPay");
const { sequelize } = require("../../database");
const getUserById = require('../../Controllers/userControllers/getUserbyId');
const mercadopago = require("mercadopago");
const addChips = require("../chipsControllers/addChips");
require("dotenv").config();



const createOrder = async (req, res) => { 

  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
    // client_id: process.env.CLIENT_ID,
    // client_secret: process.env.CLIENT_SECRET,
  });
  const {
    userId,
    
    price,date,paymentPlataform,chips} = req.body;
 console.log(userId,date,paymentPlataform,price,chips);
 
  try {
    let preference = {

      metadata: { userId: userId,
        
        date: date,
        paymentPlataform: paymentPlataform,
        chips:chips,
        price:  price },



       items: [
        {
          title: chips.toString(),
          unit_price: price,
          currency_id: "ARS",
          quantity: 1,
          //  description: product.quantityPassengers, 
          // picture_url: "",
        }],
      back_urls: {
        success: "https://royalgames.me",
        pending: "https://royalgames.me",
         failure: "https://royalgames.me"
         
      },

      notification_url: "https://royalback-f340.onrender.com/mepago/webhook",


      auto_return: "all"
    }
   
   
    const respuesta = await mercadopago.preferences.create(preference);
 
 
    res.status(200).json(respuesta.response.init_point);

    
  } catch (error) {
    return res.status(500).json(`Error en payment controller Create Order: ${error.message}`);
  }

};

const receiveWebhook = async (req, res) => {
    try {
        const payment = req.query;

        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment["data.id"]);

            const pay = {
                userId: data.body.metadata.user_id, // Verifica el nombre correcto del campo
                chips: data.body.metadata.chips,
                paymentPlataform: data.body.metadata.payment_plataform,
                date: data.body.metadata.date,
                price: data.body.metadata.price
            };

            // Verifica si el pago ya fue procesado
         

            // Transacción para garantizar consistencia
            if(pay.paymentPlataform==="MercadoPago"){
                await addChips(pay.userId, Number(pay.chips));

                // Registrar el pago
                await postPay(pay);
            }
                // Añadir fichas
              
          

            res.status(204).json({ message: "Pago procesado con éxito." });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json(`Error en payment controller Receive Webhook: ${error.message}`);
    }
};
module.exports = { createOrder, receiveWebhook }













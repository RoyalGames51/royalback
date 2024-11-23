const { Pay } = require("../../database");
const postPay = require("../payControllers/postPay");

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
        success: "https://vamos.pe/paymentStatus",
        pending: "https://vamos.pe/pending",
         failure: "https://vamos.pe/paymentFailed"
         
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
    // const {date_created, user_id} = req.body

    

    if (payment.type === "payment" ) {
       const data = await mercadopago.payment.findById(payment["data.id"]);
      // const userPayment = await Trip.findOne({ where: { id: data.body.metadata.trip_id } });//BUSCA EL TRIP
      //  await newTrip.update({ stateOfTrip: "reserved" }); //CAMBIA DE OFFER A RESERVED
     console.log(data.body.metadata);
     
      const pay ={
        userId: data.body.metadata.user_id,
        chips: data.body.metadata.chips,
        paymentPlataform:  data.body.metadata.payment_plataform,
        date: data.body.metadata.date,
        price:  data.body.metadata.price
      }
      await addChips(data.body.metadata.user_id,Number(data.body.metadata.chips))
    
      // await userPayment.reload();
      
      // await deleteTrip(newTrip.id);
      const resp = await postPay(pay)
      const usuario = await getUserById(data.body.metadata.user_id)
      console.log(usuario, "usuario")
    //   const mailReserve = {
    //     userId: data.body.metadata.user_id,
    //     tripId: resp.id,
    //     option: "reserve",
    //     email: usuario.email,
    //     name: usuario.name
    // }
//     console.log(mailReserve)
// await sendMailHandler(mailReserve);
    
      localStorage.clear();
      // AGREGAR LO DE ENVIAR MAIL
res.status(204).json(resp);
    } 
    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json(`Error en payment controller Receive Webhook: ${error.message}`);
  }
};

module.exports = { createOrder, receiveWebhook }













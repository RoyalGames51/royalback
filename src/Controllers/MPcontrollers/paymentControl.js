const mercadopago = require("mercadopago");
// import { MERCADOPAGO_API_KEY } from "../config.js";
const dotenv = require("dotenv");
const User = require("../../models/user");
const { User } = require("../../database");
// const postTrip = require("../tripsControllers/postTrip");
// const {postTrip} = require('../../controllers/tripsControllers/postTrip');
dotenv.config();
const getUserById =require('../userControllers/getUserbyId')
// const sendMailHandler = require("../../utils/mailing/sendMailHandler")



const createOrder = async (req, res) => {

  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });
  const {
    userId,
    
    price,chips} = req.body
 
  try {
    let preference = {

      metadata: { userId: userId,
        
        chips:chips,
        price:  price },



       items: [
        {
          title: fichas,
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

      notification_url: "https://royalback-du3v.onrender.com/mepago/webhook",


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
     
      const trip ={
        userId: data.body.metadata.user_id,
        chips: data.body.metadata.chips,
       
        price:  data.body.metadata.price
      }
    
      // await userPayment.reload();
      
      // await deleteTrip(newTrip.id);
      const resp = await postTrip(trip)
      const usuario = await getUserById(data.body.metadata.user_id)
      console.log(usuario, "usuario")
      const mailReserve = {
        userId: data.body.metadata.user_id,
        tripId: resp.id,
        option: "reserve",
        email: usuario.email,
        name: usuario.name
    }
    console.log(mailReserve)
await sendMailHandler(mailReserve);
    
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






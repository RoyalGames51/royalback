const postPay = require("../payControllers/postPay");
const getUserById = require('../../Controllers/userControllers/getUserbyId');
const mercadopago = require("mercadopago");
const addChips = require("../chipsControllers/addChips");
require("dotenv").config();
const { Pay } = require("../../database");



const createOrderMx = async (req, res) => { 


  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_2,
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
          currency_id: "MXN",
          quantity: 1,
          //  description: product.quantityPassengers, 
          // picture_url: "",
        }],
      back_urls: {
        success: "https://ROYALGAMES.ME/",
        pending: "https://royalgames.me",
         failure: "https://royalgames.me"
         
      },

      notification_url: "https://royalback-f340.onrender.com/mepago/webhook/mx",


      auto_return: "all"
    }
   
   
    const respuesta = await mercadopago.preferences.create(preference);
 
 
    res.status(200).json(respuesta.response.init_point);

    
  } catch (error) {
    return res.status(500).json(`Error en payment controller Create Order: ${error.message}`);
  }

};

const receiveWebhookMx = async (req, res) => {
    try {
      const payment = req.query;
  
      if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment["data.id"]);
  
        const pay = {
          userId: data.body.metadata.user_id,
          chips: data.body.metadata.chips,
          paymentPlataform: data.body.metadata.payment_plataform,
          date: data.body.metadata.date,
          price: data.body.metadata.price,
          paymentId: data.body.id, // Se añade para evitar duplicados
        };
  
        // Verificar si el pago ya fue procesado
        const existingPay = await Pay.findOne({ where: { paymentId: data.body.id } });
        if (existingPay) {
          return res.status(200).json({ message: "El pago ya fue procesado." });
        }
  
        // Operaciones secuenciales con validaciones
        const chipsAdded = await addChips(pay.userId, Number(pay.chips));
        if (!chipsAdded) {
          throw new Error("Error al añadir fichas.");
        }
  
        const paymentRecorded = await postPay(pay);
        if (!paymentRecorded) {
          // Si no se registra el pago, revertir fichas añadidas
          await addChips(pay.userId, -Number(pay.chips));
          throw new Error("Error al registrar el pago, operación revertida.");
        }
  
  
       
  
        return res.status(204).json({ message: "Pago procesado con éxito." });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json(`Error en payment controller Receive Webhook: ${error.message}`);
    }
  };
  
  module.exports = { createOrderMx, receiveWebhookMx };
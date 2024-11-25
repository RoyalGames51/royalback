const paypal = require('@paypal/checkout-server-sdk');
require("dotenv").config();

const CLIENTID = process.env.CLIENTID;
const SECRETKEY = process.env.SECRETKEY

// Configuración del cliente de PayPal
const environment = new paypal.core.SandboxEnvironment(
  CLIENTID,
  SECRETKEY
);
const client = new paypal.core.PayPalHttpClient(environment);

// Crear orden de pago
exports.createPaypalOrder = async (req, res) => {
  const { price, userId, chips } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: price,
        },
        description: `Compra de ${chips} chips por el usuario ${userId}`,
        custom_id: JSON.stringify(   userId, chips ),
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear la orden de PayPal');
  }
};

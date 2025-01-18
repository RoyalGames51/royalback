const paypal = require('@paypal/checkout-server-sdk');


const capturePaypalOrder = async (req, res) => {
    const { orderId } = req.body;
  
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
  
    try {
      const capture = await client.execute(request);
      console.log('Captura exitosa:', capture.result);
      res.json({ status: 'success', capture: capture.result });
    } catch (err) {
      console.error('Error al capturar la orden:', err);
      res.status(500).send('Error al capturar la orden de PayPal');
    }
  };

  module.exports= capturePaypalOrder;
  
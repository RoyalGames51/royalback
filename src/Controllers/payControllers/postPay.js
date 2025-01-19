const { User, Pay } = require('../../database');

const postPay = async ({ paymentPlataform, price, chips, userId, date, paymentId }) => {
  console.log(chips, price, userId);

  try {
    // Eliminar cualquier carácter que no sea un número del paymentId
    const sanitizedPaymentId = typeof paymentId === 'string' 
    ? paymentId.replace(/\D/g, '') // Solo números
    : paymentId.toString().replace(/\D/g, ''); // Convierte a string y elimina letras
   // \D coincide con todo lo que no es un dígito

    
console.log(sanitizedPaymentId);

    const [newPay, created] = await Pay.findOrCreate({
      where: {
        paymentId: Number(sanitizedPaymentId),
        userId: userId.toString(),
        date: date.toString(),
        paymentPlataform: paymentPlataform.toString(),
        chips,
        price: price.toString(),
      },
      defaults: {
        paymentId: sanitizedPaymentId,
        userId: userId.toString(),
        date: date.toString(),
        price: price.toString(),
        chips,
        paymentPlataform: paymentPlataform.toString(),
      },
    });
console.log("llega aca");

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
};

module.exports = postPay;

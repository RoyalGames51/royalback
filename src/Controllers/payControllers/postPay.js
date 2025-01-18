const { User, Pay } = require('../../database');

const postPay = async ({ paymentPlataform, price, chips, userId, date, paymentId }) => {
  console.log(chips, price, userId);

  try {
    // Eliminar cualquier carácter que no sea un número del paymentId
    const sanitizedPaymentId = paymentId.replace(/\D/g, ''); // \D coincide con todo lo que no es un dígito

    if (!sanitizedPaymentId) {
      throw new Error('El paymentId no contiene números válidos.');
    }

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

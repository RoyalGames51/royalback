const postPay = require('../../Controllers/payControllers/postPay');

module.exports = async (req, res) => {
    const { paymentPlataform,price,chips,userId,date,paymentId} = req.body;

    try {
        const newPay = await postPay(paymentPlataform,price,chips,userId,date,paymentId);

        res.status(200).json(newPay);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
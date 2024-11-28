const postPay = require('../../Controllers/payControllers/postPay');

module.exports = async (req, res) => {
    const pay = req.body;
console.log(pay);

    try {
        const newPay = await postPay(pay);

        res.status(200).json(newPay);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const Order = require("../models/order.model");
const Transaction = require("../models/transaction.model")

const createTransaction = async (req, res) => {
    try {
        const deliveredProduct = await Order.find({ status: 'delivered' })
        // const data = await Transaction({ ...req.body });
        console.log(deliveredProduct)
    } catch (error) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
}

module.exports = {
    createTransaction
}
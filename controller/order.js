const { Order, validateOrder } = require("../model/orderSchema")

exports.getOrders = async (req, res) => {
    try {
        const allOrders = await Order.find()
        res.status(200).json({ variant: "success", msg: "Barcha Buyurtmalar ", innerData: allOrders })
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { error } = validateOrder(req.body)
        if (error) {
            return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null })
        }
        const newOrder = await Order.create(req.body)
        res.status(201).json({ variant: "success", msg: "Buyurtma Qo'shildi", innerData: newOrder })
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}


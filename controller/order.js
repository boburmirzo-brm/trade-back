const { Customers } = require("../model/customerSchema");
const { Order, validateOrder } = require("../model/orderSchema")

exports.getOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().sort({ _id: -1 })
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

        let { customerId, totalPrice } = req.body
        let customer = await Customers.findById(customerId)

        if (customer && customer.isActive === true) {
            let updateCustomer = await Customers.updateOne({ _id: customerId }, { $set: { budget: customer.budget + totalPrice } })
            let newOrder = await Order.create(req.body)
            return res.status(201).json({ variant: "success", msg: "Buyurtma Yaratildi", innerData: newOrder })
        } else {
            return res.status(400).json({ variant: "warning", msg: "Mijoz Topilmadi ", innerData: null })
        }
    }
    catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(400).json({ variant: "warning", msg: "Mijoz Idsi Xato", innerData: null })
        } else {
            res.status(500).json({ variant: "error", msg: "server error", innerData: null });
        }
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const { error } = validateOrder(req.body)
        if(error){
            return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null })
        }

        let { id } = req.params
        let { customerId, finalDate, totalPrice } = req.body
        let customer = await Customers.findById(customerId)
        let oneOrder = await Order.findById(id)

        if(customer.isActive === true){
            let updateCustomer = await Customers.updateOne({ _id: customerId }, { $set: { budget: customer.budget + totalPrice } })

            oneOrder.customerId = customerId
            oneOrder.totalPrice = totalPrice
            oneOrder.finalDate = finalDate
            oneOrder.updatedAt = new Date().toISOString()

            const updateOrder = await oneOrder.save()
            res.status(200).json({ variant: "success", msg: "Malumot Tahrirlandi", innerData: updateOrder })
        } else {
            res.status(400).json({ variant: "warning", msg: "Sotuvchi Topilmadi", innerData: null })
        }
    }
    catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(400).json({ variant: "warning", msg: "Mijoz Idsi Xato", innerData: null })
        } else {
            res.status(500).json({ variant: "error", msg: "server error", innerData: null });
        }
    }
}
const { Customers } = require("../model/customerSchema");
const { Payments, validatePayment } = require("../model/paymentSchema");

exports.getOnePayment = async (req, res) => {
    try {
        const onePayment = await Payments.findById(req.params.id)
        if (!onePayment) {
            return res.status(404).json({
                variant: "warning",
                msg: "To'lov topilmadi",
                innerData: null
            });
        }
        res.status(200).json({
            variant: "success",
            msg: "To'lov topildi",
            innerData: updatedCustomer
        });
    }
    catch {
        res.status(500).json({
            variant: "error",
            msg: "Serverda xatolik",
            innerData: null
        })
    }
}
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payments.find();
        res
            .status(200)
            .json({ variant: "success", msg: "Barcha to'lovlar", innerData: payments });
    } catch {
        res
            .status(500)
            .json({ variant: "error", msg: "server error", innerData: null });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { error } = validatePayment(req.body);
        if (error) {
            return res.status(400).json({
                variant: "warning",
                msg: error.details[0].message,
                innerData: null,
            });
        }

        const { customerId, amount } = req.body
        const updatedCustomerOne = await Customers.findById(customerId)
        
        // const oldPayment = await Payments.findById(paymentId)
        // 100 000 - 150 000 = -50 000
        // let result = oldPayment.amount - amount

        await Customers.updateOne(
            { _id: customerId },
            {
                $set: {
                    budget: updatedCustomerOne.budget + amount
                }
            }
        )
        const newPayment = await Payments.create(req.body);
        res.status(201).json({
            variant: "success",
            msg: "To'lov muvaffaqiyatli qo'shildi",
            innerData: newPayment,
        });
    } catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null,
        });
    }
};
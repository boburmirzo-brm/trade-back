const { Payments, validatePayment } = require("../model/paymentSchema");

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
const { Customers, validateCustomer } = require("../model/customerSchema");

exports.getCustomer = async (req, res, next) => {
    try {
        const customers = await Customers.find();
        res.status(200).json({
            variant: "success",
            msg: "Barcha mijozlar",
            innerData: customers
        });
    } catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null
        });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { error } = validateCustomer(req.body);
        if (error) {
            return res.status(400).json({
                variant: "warning",
                msg: error.details[0].message,
                innerData: null,
            });
        }
        const newCustomer = await Customers.create(req.body);
        res.status(201).json({
            variant: "success",
            msg: "Mijoz muvaffaqiyatli qo'shildi",
            innerData: newCustomer,
        });
    } catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null,
        });
    }
};
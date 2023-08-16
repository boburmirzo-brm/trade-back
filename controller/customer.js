const { Customers, validateCustomer } = require("../model/customerSchema");
const { dateQuery } = require("../utils/dateQuery")

exports.getOneCustomer = async (req, res, next) => {
    try {
        const oneCustomer = await Customers.findById(req.params.id)
        if (!oneCustomer) {
            return res.status(404).json({
                variant: "warning",
                msg: "Mijoz topilmadi",
                innerData: null
            });
        }
        res.status(200).json({
            variant: "success",
            msg: "Mijoz topildi",
            innerData: oneCustomer
        });
    }
    catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null
        });
    }
}
exports.getCustomer = async (req, res, next) => {
    try {
        const customers = await Customers.find(dateQuery(req.query)).sort({ _id: -1 });
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

exports.createCustomer = async (req, res, next) => {
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
            msg: "Serverda xatolik",
            innerData: null,
        });
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params
        const oneCustomer = await Customers.findById(id)
        if (!oneCustomer) {
            return res.status(404).json({
                variant: "warning",
                msg: "Mijoz topilmadi",
                innerData: null
            });
        }
        const updatedCustomer = await Customers.findByIdAndUpdate(id, req.body)
        const updatedCustomerOne = await Customers.findById(id)
        await Customers.updateOne(
            { _id: id },
            {
                $set: {
                    updatedAt: updatedCustomerOne.updatedAt = new Date().toISOString()
                }
            }
        )
        res.status(200).json({
            variant: "success",
            msg: "Mijoz muvaffaqiyatli tahrirlandi",
            innerData: updatedCustomer
        });
    }
    catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null
        });
    }
};

exports.isActiveCustomer = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedCustomerOne = await Customers.findById(id)
        await Customers.updateOne(
            { _id: id },
            {
                $set: {
                    isActive: !(updatedCustomerOne.isActive)
                }
            }
        )
        res.status(200).json({
            variant: "success",
            msg: "Arxivga solindi yoki chiqarildi",
            innerData: updatedCustomerOne
        })
    }
    catch {
        res.status(500).json({
            variant: "error",
            msg: "Serverda xatolik",
            innerData: null
        });
    }
}
const { Sellers, validateSeller } = require("../model/sellerSchema")

exports.getSellers = async (req, res) => {
    try {
        let { from, to } = req.query
       const sellers = await Sellers.find(from && to && { createdAt: { $gte: new Date(from).toISOString(), $lt: new Date(to).toISOString() } }).sort({ _id: -1 })
       res
          .status(200)
          .json({variant: "success", msg: "Barcha sotuvchlar", innerData: sellers});
    } 
    catch {
        res
           .status(500)
           .json({variant: "error", msg: "Serverda xatolik kuzatildi", innerData: null});
    }
}

exports.createSeller = async (req, res) => {
    try {
        const { error } = validateSeller(req.body)
        if (error) {
            return res
                    .status(400)
                    .json({variant: "warning", msg: error.details[0].message, innerData: null
                })
        }
        const newSeller = await Sellers.create(req.body)
        res
           .status(201)
           .json({variant: "success", msg: "Sotuvchi muvaffaqiyatli qo'shildi", innerData: newSeller});
    } 
    catch {
        res
           .status(500)
           .json({variant: "error", msg: "Serverda xatolik kuzatildi", innerData: null});
    }
}
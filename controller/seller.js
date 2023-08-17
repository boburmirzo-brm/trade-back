const { Sellers, validateSeller } = require("../model/sellerSchema")
const { dateQuery } = require("../utils/dateQuery")

exports.getSellers = async (req, res) => {
    try {
       const sellers = await Sellers.find(dateQuery(req.query)).sort({ _id: -1 })
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

exports.getSellersById = async (req, res) => {
    try {
        let { id } = req.params
        const sellers = await Sellers.findById(id)
        if (!sellers) {
            return res
                    .status(404)
                    .json({ variant: "warning", msg: "Sotuvchi topilmadi", innerData: null});
        }
        res
          .status(200)
          .json({variant: "success", msg: "Sotuvchi topildi", innerData: sellers});
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
exports.updateSeller = async (req, res) => {
    try {
        const { id } = req.params
       
        const updateSeller = await Sellers.findByIdAndUpdate(id, req.body, {new: true})
        res
            .status(200)
            .json({variant: "success", msg: "Sotuvchi muvaffaqiyatli yangilandi", innerData: updateSeller });
    }
    catch {
        res
            .status(500)
            .json({variant: "error", msg: "server error", innerData: null});
    }
};

exports.isActiveSeller = async (req, res) => {
    try {
        const { id } = req.params
        const updateIsActive = await Sellers.findById(id)
        await Sellers.updateOne(
            { _id: id },
            {
                $set: {
                    isActive: !(updateIsActive.isActive)
                }
            }
        )
        res.status(200).json({
            variant: "success",
            msg: "Arxivga solindi yoki chiqarildi",
            innerData: updateIsActive
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

exports.deleteSeller = async (req, res) => {
    try {
      const { id } = req.params;
      await Sellers.findByIdAndDelete(id, req.body);
      res
            .status(200)
            .json({ variant: 'success', msg: "Sotuvchi muvaffaqiyatli o'chirildi", innerData: null});
    } catch {
      res
          .status(500)
          .json({variant: 'error', msg: 'server error', innerData: null,});
    }
  };
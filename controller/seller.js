const { Sellers, validateSeller } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");

class SellerController {
  async getAll(req, res) {
    try {
      let { isActive = true } = req.query;
      const sellers = await Sellers.find({
        isActive,
        ...dateQuery(req.query),
      }).sort({
        createdAt: -1,
      });
      if (!sellers.length) {
        return handleResponse(res, 404, "warning", "Sotuvchilar topilmadi", null);
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha sotuvchilar",
        sellers,
        sellers.length
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async getById(req, res) {
    try {
      let { id } = req.params;
      const seller = await Sellers.findById(id);
      if (!seller) {
        return handleResponse(res, 404, "warning", "Sotuvchi topilmadi", null);
      }
      handleResponse(res, 200, "success", "Sotuvchi topildi", seller);
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async createNew(req, res) {
    try {
      const { error } = validateSeller(req.body);
      if (error) {
        return handleResponse(
          res,
          400,
          "warning",
          error.details[0].message,
          null
        );
      }
      const newSeller = await Sellers.create(req.body);
      handleResponse(
        res,
        201,
        "success",
        "Sotuvchi muvaffaqiyatli qo'shildi",
        newSeller
      );
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Serverda xatolik kuzatildi",
        innerData: null,
      });
    }
  }
  async updateById(req, res) {
    try {
      const { id } = req.params;
      const seller = await Sellers.findById(id);
      if (!seller) {
        return handleResponse(res, 404, "warning", "Sotuvchi topilmadi", null);
      }
      const updateSeller = await Sellers.findByIdAndUpdate(
        id,
        { ...req.body, budget: seller.budget },
        {
          new: true,
        }
      );
      handleResponse(
        res,
        200,
        "success",
        "Sotuvchi muvaffaqiyatli o'zgartirildi",
        updateSeller
      );
    } catch {
      res
        .status(500)
        .json({ variant: "error", msg: "serverda xatolik", innerData: null });
    }
  }
  async isActive(req, res) {
    try {
      const { id } = req.params;
      const seller = await Sellers.findById(id);
      if (!seller) {
        return handleResponse(res, 404, "warning", "Sotuvchi topilmadi", null);
      }
      let updatedSeller = await Sellers.findByIdAndUpdate(id, {
        $set: {
          isActive: !seller.isActive,
        },
      });
      handleResponse(
        res,
        200,
        "success",
        `Sotuvchi arxiv${seller.isActive ? "ga qo'shildi" : "dan chiqarildi"}`,
        updatedSeller
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const seller = await Sellers.exists({_id: id});
      if (!seller) {
        return handleResponse(res, 404, "warning", "Sotuvchi topilmadi", null); 
      }
      await Sellers.findByIdAndDelete(id);
      handleResponse(
        res,
        200,
        "success",
        "Sotuvchi muvaffaqiyatli o'chirildi",
        null
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
}

module.exports = new SellerController
const { Sellers, validateSeller } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");
const { debtFinding, paidTodayFinding } = require("../utils/findQuery");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone");

class SellerController {
  async getAll(req, res) {
    try {
      let {
        isActive = true,
        isArchive = false,
        limit = 10,
        skip = 0,
        // defaultDayEgo = 10,
        debt,
        budget,
        createdAt = -1,
        paidToday,
      } = req.query;
      const query = {
        isActive,
        isArchive,
        // ...dateQuery(req.query, defaultDayEgo),
        ...debtFinding(debt),
        ...paidTodayFinding(paidToday),
      };
      let sorting = Number(budget) ? { budget } : { pin: -1, createdAt };

      const sellers = await Sellers.find(query)
        .sort(sorting)
        .limit(limit)
        .skip(skip * limit);
      if (!sellers.length) {
        return handleResponse(
          res,
          400,
          "warning",
          "Sotuvchilar topilmadi",
          null
        );
      }
      const total = await Sellers.countDocuments(query);
      handleResponse(res, 200, "success", "Barcha sotuvchilar", sellers, total);
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async search(req, res) {
    try {
      let { isActive = true, value = "", limit = 10 } = req.query;
      let text = value.trim();
      if (!text) {
        return handleResponse(res, 400, "warning", "Biror nima yozing", null);
      }
      const sellers = await Sellers.find({
        isActive,
        // ...dateQuery(req.query),
        $or: [
          { index: { $regex: text, $options: "i" } },
          { fname: { $regex: text, $options: "i" } },
          { lname: { $regex: text, $options: "i" } },
          { phone_primary: { $regex: text, $options: "i" } },
          { phone_secondary: { $regex: text, $options: "i" } },
        ],
      })
        .sort({
          createdAt: -1,
        })
        .limit(limit);
      if (!sellers.length) {
        return handleResponse(
          res,
          400,
          "warning",
          "Sotuvchilar topilmadi",
          null
        );
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
      const seller = await Sellers.findById(id).populate([
        { path: "adminId", select: ["fname", "lname"] },
      ]);
      if (!seller) {
        return handleResponse(res, 400, "warning", "Sotuvchi topilmadi", null);
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
      let existSeller = await Sellers.findOne({
        phone_primary: req.body.phone_primary,
      });
      if (existSeller) {
        return handleResponse(
          res,
          400,
          "warning",
          "Bu telefon raqam avval foydalanilgan",
          null
        );
      }
      const totalCustomerCount = await Sellers.countDocuments();

      const newSeller = await Sellers.create({
        ...req.body,
        adminId: req.admin._id,
        index: (totalCustomerCount + 1).toString().padStart(4, "0"),
      });
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
        return handleResponse(res, 400, "warning", "Sotuvchi topilmadi", null);
      }
      let existSeller = await Sellers.findOne({
        phone_primary: req.body.phone_primary,
      });
      if (seller && existSeller) {
        if (seller.phone_primary !== existSeller.phone_primary) {
          return handleResponse(
            res,
            400,
            "warning",
            "Bu telefon raqam avval foydalanilgan",
            null
          );
        }
      }
      const updateSeller = await Sellers.findByIdAndUpdate(
        id,
        { ...req.body, budget: seller.budget, updatedAt: timeZone() },
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
        return handleResponse(res, 400, "warning", "Sotuvchi topilmadi", null);
      }
      if (seller.budget !== 0) {
        return handleResponse(res, 400, "warning", "Sotuvchini hisobi yopilmagan", null);
      }
      let updatedSeller = await Sellers.findByIdAndUpdate(id, {
        $set: {
          isActive: !seller.isActive,
          updatedAt: timeZone(),
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
      const seller = await Sellers.exists({ _id: id });
      if (!seller) {
        return handleResponse(res, 400, "warning", "Sotuvchi topilmadi", null);
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

module.exports = new SellerController();

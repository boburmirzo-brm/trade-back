const { Customers, validateCustomer } = require("../model/customerSchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");
const { debtFinding, paidTodayFinding } = require("../utils/findQuery");
const { timeZone } = require("../utils/timeZone");

class CustomerController {
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
      const customers = await Customers.find(query)
        .sort(sorting)
        .limit(limit)
        .skip(skip * limit);

      if (!customers.length) {
        return handleResponse(res, 400, "warning", "Mijozlar topilmadi", null);
      }
      const total = await Customers.countDocuments(query);
      handleResponse(res, 200, "success", "Barcha mijozlar", customers, total);
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
      const customers = await Customers.find({
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
        .sort({ createdAt: -1 })
        .limit(limit);
      if (!customers.length) {
        return handleResponse(res, 400, "warning", "Mijozlar topilmadi", null);
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha mijozlar",
        customers,
        customers.length
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      // const oneCustomer = await Customers.findOne({_id:id})
      const customer = await Customers.findById(id).populate([
        { path: "adminId", select: ["fname", "lname"] },
      ]);
      if (!customer) {
        return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
      }
      handleResponse(res, 200, "success", "Mijoz topildi", customer);
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async createNew(req, res) {
    try {
      const { error } = validateCustomer(req.body);
      if (error) {
        return handleResponse(
          res,
          400,
          "warning",
          error.details[0].message,
          null
        );
      }
      let existCustomer = await Customers.findOne({
        phone_primary: req.body.phone_primary,
      });
      if (existCustomer) {
        return handleResponse(
          res,
          400,
          "warning",
          "Bu telefon raqam avval foydalanilgan",
          null
        );
      }
      const totalCustomerCount = await Customers.countDocuments()
      const newCustomer = await Customers.create({
        ...req.body,
        adminId: req.admin._id,
        index: (totalCustomerCount+1).toString().padStart(4, "0")
      });
      handleResponse(
        res,
        201,
        "success",
        "Mijoz muvaffaqiyatli qo'shildi",
        newCustomer
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async updateById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customers.findById(id);
      if (!customer) {
        return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
      }
      let existCustomer = await Customers.findOne({
        phone_primary: req.body.phone_primary,
      });
      if(customer && existCustomer){
        if(customer.phone_primary !== existCustomer.phone_primary){
          return handleResponse(
            res,
            400,
            "warning",
            "Bu telefon raqam avval foydalanilgan",
            null
          );
        }
      }
      const updatedCustomer = await Customers.findByIdAndUpdate(
        id,
        {
            ...req.body,
            budget: customer.budget,
            updatedAt: timeZone(),
        },
        { new: true }
      );
      handleResponse(
        res,
        200,
        "success",
        "Mijoz muvaffaqiyatli o'zgartirildi",
        updatedCustomer
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async isActive(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customers.findById(id);
      if (!customer) {
        return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
      }
      let updatedCustomer = await Customers.findByIdAndUpdate(id, {
        $set: {
          isActive: !customer.isActive,
          updatedAt: timeZone(),
        },
      });
      handleResponse(
        res,
        200,
        "success",
        `Arxiv${customer.isActive ? "ga qo'shildi" : "dan chiqarildi"}`,
        updatedCustomer
      );
    } catch {
      handleResponse(res, 500, "error", "server error", null);
    }
  }
  // hali to'liq bitmagan delete
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customers.exists({ _id: id });
      if (!customer) {
        return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
      }
      await Customers.findByIdAndDelete(id);
      handleResponse(
        res,
        200,
        "success",
        "Mijoz muvaffaqiyatli o'chirildi",
        null
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
}

module.exports = new CustomerController();

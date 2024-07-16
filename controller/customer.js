const { Customers, validateCustomer } = require("../model/customerSchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone");

class CustomerController {
  async getAll(req, res) {
    try {
      let { isActive = true } = req.query;
      const customers = await Customers.find({
        isActive,
        ...dateQuery(req.query),
      }).sort({ pin: -1, createdAt: -1 });
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
  async search(req, res) {
    try {
      let { isActive = true, value = "" } = req.query;
      let text = value.trim();
      if (!text) {
        return handleResponse(res, 400, "warning", "Biror nima yozing", null);
      }
      const customers = await Customers.find({
        isActive,
        ...dateQuery(req.query),
        $or: [
          { fname: { $regex: text, $options: "i" } },
          { lname: { $regex: text, $options: "i" } },
          { phone_primary: { $regex: text, $options: "i" } },
          { phone_secondary: { $regex: text, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });
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
      const newCustomer = await Customers.create({
        ...req.body,
        adminId: req.admin._id,
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
      const existCustomer = await Customers.findById(id);
      if (!existCustomer) {
        return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
      }
      const updatedCustomer = await Customers.findByIdAndUpdate(
        id,
        {
          ...req.body,
          budget: existCustomer.budget,
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

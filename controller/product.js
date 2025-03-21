const { Products, validationProduct } = require("../model/productSchema");
const { BuyOrSells, validateBuyOrSell } = require("../model/buyOrSellSchema");
const { Sellers } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");
const mongoose = require("mongoose");
const { timeZone } = require("../utils/timeZone");

class ProductController {
  async getAll(req, res) {
    try {
      const { isActive = true, limit = 10, skip = 0 } = req.query;
      const products = await Products.find()
        // .populate([
        //   { path: "adminId", select: ["fname", "lname"] },
        //   { path: "sellerId", select: ["fname", "lname"] }
        // ])
        .sort({
          createdAt: -1,
        }).limit(limit).skip(skip*limit)
      if (!products.length) {
        return handleResponse(
          res,
          400,
          "warning",
          "Mahsulotlar topilmadi",
          null
        );
      }
      const total = await Products.countDocuments()
      handleResponse(
        res,
        200,
        "success",
        "Barcha mahsulotlar",
        products,
        total
      );
    } catch {
      res
        .status(500)
        .json({ variant: "error", msg: "serverda xatolik", innerData: null });
    }
  }
  async search(req, res) {
    try {
      const { isActive = true, value = "", limit = 10 } = req.query;
      let text = value.trim();
      if (!text) {
        return handleResponse(res, 400, "warning", "Biror nima yozing", null);
      }
      const products = await Products.find({
        isActive,
        // ...dateQuery(req.query),
        $or: [
          { title: { $regex: text, $options: "i" } }
        ],
      })
        .sort({
          createdAt: -1,
        }).limit(limit)

      if (!products.length) {
        return handleResponse(
          res,
          400,
          "warning",
          "Mahsulotlar topilmadi",
          null
        );
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha mahsulotlar",
        products,
        products.length,
      );
    } catch {
      res
        .status(500)
        .json({ variant: "error", msg: "serverda xatolik", innerData: null });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { limit = 10, skip = 0 } = req.query;

      const product = await Products.findById(id);
      if (!product) {
        return handleResponse(res, 400, "warning", "Mahsulot topilmadi", null);
      }

      let query = {
        productId: id,
      }
      const buyOrSells = await BuyOrSells.find(query)
        .populate([
          { path: "sellerId", select: ["fname", "lname"] },
          { path: "customerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
        ])
        .sort({
          createdAt: -1,
        }).limit(limit).skip(skip*limit)
        const total = await BuyOrSells.countDocuments(query)
      handleResponse(res, 200, "success", "Mahsulot tarixi", {
        product,
        buyOrSells,
        totalCount: total
      });
    } catch {
      res
        .status(500)
        .json({ variant: "error", msg: "serverda xatolik", innerData: null });
    }
  }
  async createNew(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { error } = validationProduct(req.body);
        if (error) {
          return handleResponse(
            res,
            400,
            "warning",
            error.details[0].message,
            null
          );
        }
        let existProduct = await Products.findOne({title: req.body.title})
        if(existProduct){
          return handleResponse(
            res,
            400,
            "warning",
            "Bu mahsulot allaqachon mavjud",
            null
          );
        }
        const {price, expense, quantity} = req.body
        req.body.price = price + (expense / quantity)
        const newProduct = await Products.create({...req.body, adminId: req.admin._id});
        const buyOrSellItems = {
          status: "input",
          sellerId: req.body.sellerId,
          adminId: req.admin._id,
          productId: newProduct._id.toString(),
          price: price,
          expense: req.body.expense,
          quantity: req.body.quantity,
        };
        const buyError = validateBuyOrSell(buyOrSellItems);
        if (buyError.error) {
          return handleResponse(
            res,
            400,
            "warning",
            buyError.error.details[0].message,
            null
          );
        }
        await BuyOrSells.create(buyOrSellItems);
        await Sellers.findByIdAndUpdate(
          req.body.sellerId,
          {
            $inc: {
              budget: +(req.body.price * req.body.quantity),
            },
          },
          { session, new: true }
        );
        handleResponse(res, 201, "success", "Mahsulot qo'shildi", newProduct);
      });
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async updateById(req, res) {
    try {
      const { id } = req.params;
      const product = await Products.findById(id);
      if (!product) {
        return handleResponse(res, 400, "warning", "Mahsulot topilmadi", null);
      }
      const updatedProduct = await Products.findByIdAndUpdate(
        id,
        {
          ...req.body,
          price: product.price,
          quantity: product.quantity,
          updatedAt: timeZone(),
        },
        { new: true }
      );
      handleResponse(
        res,
        200,
        "success",
        "Mahsulot muvaffaqiyatli o'zgartirildi",
        updatedProduct
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async deleteById(req, res) {
      const { id } = req.params;
      let productHistory = await BuyOrSells.find({  
        productId: id
      })
      if(productHistory.length){
        return handleResponse(res, 400, "warning", `Mahsulotni o'chirolmaysiz chunki "kirim-chiqim" tarixi mavjud`, null);
      }
      await Products.findByIdAndDelete(id);
      handleResponse(res, 200, "success", "Mahsulot muvaffaqiyatli o'chirildi", null)
   
  }
}

module.exports = new ProductController();


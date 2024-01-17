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
      const { count = 1, pagination = 10 } = req.query;
      const products = await Products.find(dateQuery(req.query))
        .populate([{ path: "adminId", select: ["fname", "lname"] }])
        .sort({
          createdAt: -1,
        });
      if (!products.length) {
        return handleResponse(
          res,
          404,
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
        products.slice(0, count * pagination),
        products.length
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
      const { count = 1, pagination = 10 } = req.query;

      const product = await Products.findById(id);
      if (!product) {
        return handleResponse(res, 404, "warning", "Mahsulot topilmadi", null);
      }
      const buyOrSells = await BuyOrSells.find({
        ...dateQuery(req.query),
        productId: id,
      })
        .populate([
          { path: "sellerId", select: ["fname", "lname"] },
          { path: "customerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
        ])
        .sort({
          createdAt: -1,
        });
      handleResponse(res, 200, "success", "Mahsulot tarixi", {
        product,
        buyOrSells: buyOrSells.slice(0, count * pagination),
        totalCount: buyOrSells.length,
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
        const newProduct = await Products.create(req.body);
        const buyOrSellItems = {
          status: "input",
          sellerId: req.body.sellerId,
          adminId: req.body.adminId,
          productId: newProduct._id.toString(),
          price: req.body.price,
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
        return handleResponse(res, 404, "warning", "Mahsulot topilmadi", null);
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


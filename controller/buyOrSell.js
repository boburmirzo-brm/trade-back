const { BuyOrSells, validateBuyOrSell } = require("../model/buyOrSellSchema");
const { Sellers } = require("../model/sellerSchema");
const { Customers } = require("../model/customerSchema");
const { Products } = require("../model/productSchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");
const mongoose = require("mongoose");

class BuyOrSellController {
  async getAll(req, res) {
    try {
      const { count = 1, pagination = 10, status=["input", "output"] } = req.query;
      const buyOrSells = await BuyOrSells.find({ ...dateQuery(req.query), status: { $in: status} })
        .populate([
          { path: "sellerId", select: ["fname", "lname"] },
          { path: "customerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
          { path: "productId", select: ["title", "units"] },
        ])
        .sort({
          createdAt: -1,
        });
      if (!buyOrSells.length) {
        return handleResponse(
          res,
          404,
          "warning",
          "Kirim-chiqimlar topilmadi",
          null
        );
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha kirim-chiqimlar",
        buyOrSells.slice(0, count * pagination),
        buyOrSells.length
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getByCustomerId(req, res) {
    try {
      const { id } = req.params;
      const { count = 1, pagination = 10 } = req.query;
      const buyOrSells = await BuyOrSells.find({
        ...dateQuery(req.query),
        customerId: id,
      })
        .populate([
          { path: "customerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
          { path: "productId", select: ["title", "units"] },
        ])
        .sort({
          createdAt: -1,
        });
      if (!buyOrSells.length) {
        return handleResponse(
          res,
          404,
          "warning",
          "Kirim-chiqimlar topilmadi",
          null
        );
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha kirim-chiqimlar",
        buyOrSells.slice(0, count * pagination),
        buyOrSells.length
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getBySellerId(req, res) {
    try {
      const { id } = req.params;
      const { count = 1, pagination = 10 } = req.query;
      const buyOrSells = await BuyOrSells.find({
        ...dateQuery(req.query),
        sellerId: id,
      })
        .populate([
          { path: "sellerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
          { path: "productId", select: ["title", "units"] },
        ])
        .sort({
          createdAt: -1,
        });
      if (!buyOrSells.length) {
        return handleResponse(
          res,
          404,
          "warning",
          "Kirim-chiqimlar topilmadi",
          null
        );
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha kirim-chiqimlar",
        buyOrSells.slice(0, count * pagination),
        buyOrSells.length
      );
    } catch {
      handleResponse(res, 500, "error", "Server error", null);
    }
  }
  async createInput(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { error } = validateBuyOrSell({ ...req.body, status: "input" });
        if (error) {
          return handleResponse(
            res,
            400,
            "warning",
            error.details[0].message,
            null
          );
        }
        const { sellerId, price, quantity, productId } = req.body;

        const product = await Products.findById(productId);
        if (!product) {
          return handleResponse(res, 404, "error", "Kirim-chiqimlar toplimadi", null);
        }

        let { singlePrice } = totalCalculate(product, {price,quantity}, "plus")

        await Products.findByIdAndUpdate(
          productId,
          {
            price: singlePrice,
            $inc: { quantity: quantity },
          },
          { session }
        );
        await Sellers.findByIdAndUpdate(
          sellerId,
          {
            $inc: { budget: price * quantity },
          },
          { session }
        );
        const BuyOrSell = await BuyOrSells.create({
          ...req.body,
          status: "input",
        });

        handleResponse(
          res,
          201,
          "success",
          "Mahsulot kirim bo'ldi",
          BuyOrSell
        );
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async createOutput(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { error } = validateBuyOrSell({
          ...req.body,
          status: "output",
          originalPrice: 1,
        });
        if (error) {
          return res.status(400).json({
            variant: "warning",
            msg: error.details[0].message,
            innerData: null,
          });
        }

        const { price, quantity, productId, customerId } = req.body;
        const product = await Products.findById(productId);

        if (!product) {
          return handleResponse(
            res,
            404,
            "warning",
            "kirim-chiqimlar topilmadi",
            null
          );
        }
        if (product.quantity < quantity) {
          return handleResponse(
            res,
            400,
            "warning",
            `${product.title} ${product.quantity} ${product.units} bor halos`,
            null
          );
        }

        await Products.findByIdAndUpdate(
          productId,
          {
            quantity: product.quantity - quantity,
          },
          { session }
        );

        await Customers.findByIdAndUpdate(
          customerId,
          {
            $inc: { budget: -(price * quantity) },
          },
          { session }
        );

        const BuyOrSell = await BuyOrSells.create({
          ...req.body,
          originalPrice: product.price,
          status: "output",
        });
        handleResponse(res, 201, "success", "Mahsulot sotildi", BuyOrSell);
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  // async returnedItem(req, res) {
  //   const session = await mongoose.startSession();
  //   try {
  //     await session.withTransaction(async () => {
  //       const { id } = req.params;
  //       let buyOrSell = await BuyOrSells.findById(id);
  //       if (!buyOrSell) {
  //         return handleResponse(
  //           res,
  //           404,
  //           "warning",
  //           "Kirim-chiqimlar topilmadi",
  //           null
  //         );
  //       }
  
  //       let product = await Products.findById(buyOrSell.productId);
  //       let isInput = buyOrSell.status === "input";
  //       let isReturned = buyOrSell.returnedItem;
  
  //       let priceDiffSeller = isReturned
  //         ? +(buyOrSell.price * buyOrSell.quantity)
  //         : -(buyOrSell.price * buyOrSell.quantity);
  
  //       let priceDiffCustomer = isReturned
  //         ? -(buyOrSell.price * buyOrSell.quantity)
  //         : +(buyOrSell.price * buyOrSell.quantity);
  
  //       if (isInput) {
  //         await Sellers.findByIdAndUpdate(
  //           buyOrSell.sellerId,
  //           { $inc: { budget: priceDiffSeller } },
  //           { session }
  //         );
  //       } else {
  //         await Customers.findByIdAndUpdate(
  //           buyOrSell.customerId,
  //           { $inc: { budget: priceDiffCustomer } },
  //           { session }
  //         );
  //       }
  
  //       let { singlePrice } = totalCalculate(
  //         product,
  //         buyOrSell,
  //         (isInput && !isReturned) || (!isInput && isReturned) ? "plus" : "minus"
  //       );
        
  //       let quantity = (isInput && !isReturned) || (!isInput && isReturned) ? -buyOrSell.quantity : +buyOrSell.quantity
  
  //       await Products.findByIdAndUpdate(
  //         buyOrSell.productId,
  //         {
  //           price: singlePrice,
  //           $inc: { quantity: quantity },
  //         },
  //         { session }
  //       );
  
  //       await BuyOrSells.findByIdAndUpdate(
  //         id,
  //         { $set: { returnedItem: !isReturned } },
  //         { session }
  //       );
  
  //       handleResponse(
  //         res,
  //         200,
  //         "success",
  //         "Kirim-chiqim muvaffaqiyatli qaytarildi",
  //         null
  //       );
  //     });
  //   } catch (error) {
  //     handleResponse(res, 500, "error", "Server error", null);
  //   } finally {
  //     session.endSession();
  //   }
  // }
  async returnedItem(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id } = req.params;
        let buyOrSell = await BuyOrSells.findById(id);
        if (!buyOrSell) {
          return handleResponse(
            res,
            404,
            "warning",
            "Kirim-chiqimlar topilmadi",
            null
          );
        }
        let product = await Products.findById(buyOrSell.productId);

        if (buyOrSell.status === "input") {
          if(buyOrSell.returnedItem){
            // Sellerdan olish
            await Sellers.findByIdAndUpdate(
              buyOrSell.sellerId,
              {
                $inc: { budget: +(buyOrSell.price * buyOrSell.quantity) },
              },
              { session }
            );
            let { singlePrice } = totalCalculate(product, buyOrSell, "plus")
            await Products.findByIdAndUpdate(
              buyOrSell.productId,
              {
                price: singlePrice,
                $inc: { quantity: +buyOrSell.quantity },
              },
              { session }
            );
          }else{
              // Sellerga qaytarish
              await Sellers.findByIdAndUpdate(
                buyOrSell.sellerId,
                {
                  $inc: { budget: -(buyOrSell.price * buyOrSell.quantity) },
                },
                { session }
              );
              let { singlePrice } = totalCalculate(product, buyOrSell, "minus")
              await Products.findByIdAndUpdate(
                buyOrSell.productId,
                {
                  price: singlePrice,
                  $inc: { quantity: -buyOrSell.quantity },
                },
                { session }
              );
            }
        } else {
          if(buyOrSell.returnedItem){
            // Customerga sotish
            await Customers.findByIdAndUpdate(
              buyOrSell.customerId,
              {
                $inc: { budget: -(buyOrSell.price * buyOrSell.quantity) },
              },
              { session }
            );
            await Products.findByIdAndUpdate(
              buyOrSell.productId,
              {
                $inc: { quantity: -buyOrSell.quantity },
              },
              { session }
            );
          }else{
            // Customerdan qaytin olish
            await Customers.findByIdAndUpdate(
              buyOrSell.customerId,
              {
                $inc: { budget: +(buyOrSell.price * buyOrSell.quantity) },
              },
              { session }
            );
            await Products.findByIdAndUpdate(
              buyOrSell.productId,
              {
                $inc: { quantity: +buyOrSell.quantity },
              },
              { session }
            );

          }
        }
        await BuyOrSells.findByIdAndUpdate(id, {
          $set:{returnedItem: !buyOrSell.returnedItem}
        },{ session });
        handleResponse(
          res,
          200,
          "success",
          "Kirim-chiqim muvaffaqiyatli qaytarildi",
          null
        );
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async deleteById(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id } = req.params;
        let buyOrSell = await BuyOrSells.findById(id);
        if (!buyOrSell) {
          return handleResponse(
            res,
            404,
            "warning",
            "Kirim-chiqimlar topilmadi",
            null
          );
        }
        let product = await Products.findById(buyOrSell.productId);
        if (buyOrSell.status === "input") {
          await Sellers.findByIdAndUpdate(
            buyOrSell.sellerId,
            {
              $inc: { budget: -(buyOrSell.price * buyOrSell.quantity) },
            },
            { session }
          );

          let { singlePrice } = totalCalculate(product, buyOrSell, "minus")

          await Products.findByIdAndUpdate(
            buyOrSell.productId,
            {
              price: singlePrice,
              $inc: { quantity: -buyOrSell.quantity },
            },
            { session }
          );
        } else {
          await Customers.findByIdAndUpdate(
            buyOrSell.customerId,
            {
              $inc: { budget: +(buyOrSell.price * buyOrSell.quantity) },
            },
            { session }
          );

          await Products.findByIdAndUpdate(
            buyOrSell.productId,
            {
              $inc: { quantity: +buyOrSell.quantity },
            },
            { session }
          );
        }
        await BuyOrSells.findByIdAndDelete(id);
        handleResponse(
          res,
          200,
          "success",
          "Kirim-chiqim muvaffaqiyatli o'chirildi",
          null
        );
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
}

module.exports = new BuyOrSellController();

function totalCalculate(storeAmount, newAmount, plus){
  let totalStore = storeAmount.quantity * storeAmount.price;
  let totalNew = newAmount.price * newAmount.quantity;
  let total =  totalStore + (plus === "plus" ? totalNew : -totalNew);
  let quantity = storeAmount.quantity +  (plus === "plus" ? newAmount.quantity : -newAmount.quantity);
  let singlePrice = total / (quantity ? quantity : 1);
  return {quantity, singlePrice}
}
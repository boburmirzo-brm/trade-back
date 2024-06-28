const { Expense, validateExpense } = require("../model/expenseSchema");
const { Sellers } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");
const mongoose = require("mongoose");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone");

class ExpenseController{
  async getAll (req, res) {
    try {
      const { count = 1, pagination = 10 } = req.query;
      const payments = await Expense.find(dateQuery(req.query))
      .populate([
        { path: "sellerId", select: ["fname", "lname"] },
        { path: "adminId", select: ["fname", "lname"] },
      ])
      .sort({
        createdAt: -1,
      });
  
      if (!payments.length) {
        return handleResponse(res, 404, "warning", "To'lovlar topilmadi", null);
      }
  
      handleResponse(
        res,
        200,
        "success",
        "Barcha to'lovlar",
        payments.slice(0, count * pagination),
        payments.length
      );
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getBySellerId(req, res){
    try {
      const { sellerId } = req.params;
      const { count = 1, pagination = 10 } = req.query;
      if (sellerId.length !== 24) {
        return handleResponse(
          res,
          404,
          "warning",
          "Id noto'g'ri berildi",
          null
        );
      }
      const expenses = await Expense.find({
        sellerId,
        ...dateQuery(req.query),
      }).sort({
        createdAt: -1,
      });
  
      if (!expenses.length) {
        return handleResponse(res, 404, "warning", "To'lovlar topilmadi", null);
      }
  
      handleResponse(
        res,
        200,
        "success",
        "Barcha to'lovlar",
        expenses.slice(0, count * pagination),
        expenses.length
      );
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async createNew (req, res){
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { error } = validateExpense(req.body);
        if (error) {
          return handleResponse(
            res,
            400,
            "warning",
            error.details[0].message,
            null
          );
        }
        const { sellerId, amount } = req.body;
        const seller = await Sellers.exists({_id: sellerId})
        if(!seller){
          return handleResponse(res, 400, "error", "Seller is not defined", null)
        }
        await Sellers.findByIdAndUpdate(
          sellerId,
          {
            $inc: {
              budget: -amount,
            },
          },
          { session }
        );
  
        const newExpense = await Expense.create(req.body);
  
        handleResponse(res, 201, "success", "Tolov qabul qilindi", newExpense);
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async updateById (req, res){
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id: expenseId } = req.params;
        const { sellerId, amount, comment } = req.body;
  
        // Validate IDs
        if ([expenseId, sellerId].some((el) => el.length !== 24)) {
          return handleResponse(
            res,
            404,
            "warning",
            "Id noto'g'ri berildi",
            null
          );
        }
        const { error } = validateExpense(req.body);
        if (error) {
          return handleResponse(
            res,
            400,
            "warning",
            error.details[0].message,
            null
          );
        }
        // Fetch payment and customer
        const expenses = await Expense.findById(expenseId);
        const sellers = await Sellers.findById(sellerId);
  
        // Check if payment and customer exist, and if the customer ID matches the payment's customer ID
        if (
          !expenses ||
          !sellers ||
          sellers._id.toString() !== expenses.sellerId.toString()
        ) {
          return handleResponse(res, 404, "warning", "To'lov topilmadi", null);
        }
  
        // Update payment
        let updatedExpense = await Expense.findByIdAndUpdate(
          expenseId,
          {
            $set: {
              amount,
              comment,
              updatedAt: timeZone()
            },
          },
          { session, new: true }
        );
  
        // Update customer's budget
        await Sellers.findByIdAndUpdate(
          sellerId,
          {
            $inc: {
              budget: +expenses.amount - amount,
            },
          },
          { session, new: true }
        );
  
        handleResponse(
          res,
          201,
          "success",
          "To'lov muvaffaqiyatli o'zgartirildi",
          updatedExpense
        );
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async deleteById(req, res){
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id } = req.params;
  
        // Validate ID
        if (id.length !== 24) {
          return handleResponse(
            res,
            404,
            "warning",
            "Id noto'g'ri berildi",
            null
          );
        }
  
        // Fetch expense
        const expense = await Expense.findById(id);
  
        // Check if the expense exists
        if (!expense) {
          return handleResponse(res, 404, "warning", "To'lov topilmadi", null);
        }
  
        // Update seller's budget
        await Sellers.findByIdAndUpdate(
          expense.sellerId,
          {
            $inc: {
              budget: +expense.amount,
            },
          },
          { session }
        );
        
        // Delete the expense
        await Expense.findByIdAndDelete(id, { session });
  
        handleResponse(
          res,
          200,
          "success",
          "To'lov muvaffaqiyatli o'chirildi",
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

module.exports = new ExpenseController()
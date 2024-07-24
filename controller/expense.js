const { Expense, validateExpense } = require("../model/expenseSchema");
const { Sellers } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");
const mongoose = require("mongoose");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone");

class ExpenseController{
  async getAll (req, res) {
    try {
      const { limit = 10, skip = 0 } = req.query;
      const query = {
        ...dateQuery(req.query),
      }
      const payments = await Expense.find(query)
      .populate([
        { path: "sellerId", select: ["fname", "lname"] },
        { path: "adminId", select: ["fname", "lname"] },
      ])
      .sort({
        createdAt: -1,
      }).limit(limit).skip(skip*limit)
  
      if (!payments.length) {
        return handleResponse(res, 400, "warning", "To'lovlar topilmadi", null);
      }
      const total = await Expense.countDocuments(query)
      handleResponse(
        res,
        200,
        "success",
        "Barcha to'lovlar",
        payments,
        total
      );
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getBySellerId(req, res){
    try {
      const { sellerId } = req.params;
      const { limit = 10, skip = 0 } = req.query;
      const query = {
        sellerId,
        // ...dateQuery(req.query),
      }
     
      const expenses = await Expense.find(query)
      .populate([
        { path: "sellerId", select: ["fname", "lname"] },
        { path: "adminId", select: ["fname", "lname"] },
      ])
      .sort({
        createdAt: -1,
      }).limit(limit).skip(limit*skip)
  
      if (!expenses.length) {
        return handleResponse(res, 400, "warning", "To'lovlar topilmadi", null);
      }
      const total = await Expense.countDocuments(query)
      handleResponse(
        res,
        200,
        "success",
        "Barcha to'lovlar",
        expenses,
        total
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
            isPaidToday: timeZone(),
            updatedAt: timeZone(),
          },
          { session }
        );
  
        const newExpense = await Expense.create({...req.body, adminId: req.admin._id});
  
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
        const expenses = await Expense.findById(expenseId);
        const sellers = await Sellers.findById(sellerId);
  
        // Check if payment and customer exist, and if the customer ID matches the payment's customer ID
        if (
          !expenses ||
          !sellers ||
          sellers._id.toString() !== expenses.sellerId.toString()
        ) {
          return handleResponse(res, 400, "warning", "To'lov topilmadi", null);
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
            updatedAt: timeZone()
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
  async reterned(req, res){
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id } = req.params;
  
        const expense = await Expense.findById(id);
        if (!expense) {
          return handleResponse(res, 400, "warning", "To'lov topilmadi", null);
        }

        const seller = await Sellers.exists({_id:expense.sellerId});
        if (!seller) {
          return handleResponse(res, 400, "warning", "Mijoz topilmadi", null);
        }

        if(expense.isActive){
          await Sellers.findByIdAndUpdate(
            expense.sellerId,
            {
              $inc: {
                budget: +expense.amount,
              },
            },
            { session }
          );
        }else{
          await Sellers.findByIdAndUpdate(
            expense.sellerId,
            {
              $inc: {
                budget: -expense.amount,
              },
            },
            { session }
          );
        }
        
        await Expense.findByIdAndUpdate(
          id,
          {
            isActive: !expense.isActive,
            updatedAt: timeZone()
          },
          { session }
        );
  
        handleResponse(
          res,
          200,
          "success",
          "To'lov muvaffaqiyatli qaytarildi",
          null
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
            400,
            "warning",
            "Id noto'g'ri berildi",
            null
          );
        }
  
        // Fetch expense
        const expense = await Expense.findById(id);
  
        // Check if the expense exists
        if (!expense) {
          return handleResponse(res, 400, "warning", "To'lov topilmadi", null);
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
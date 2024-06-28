const { Customers } = require("../model/customerSchema");
const { Payments, validatePayment } = require("../model/paymentSchema");
const { dateQuery } = require("../utils/dateQuery");
const mongoose = require("mongoose");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone")

class PaymentController {
  async getAll(req, res) {
    try {
      const { count = 1, pagination = 10 } = req.query;
      const payments = await Payments.find(dateQuery(req.query))
        .populate([
          { path: "customerId", select: ["fname", "lname"] },
          { path: "adminId", select: ["fname", "lname"] },
        ])
        .sort({
          createdAt: -1,
        });

        // await Payments.countDocuments()
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
  async getByCustomerId(req, res) {
    try {
      const { customerId } = req.params;
      const { count = 1, pagination = 10 } = req.query;
      if (customerId.length !== 24) {
        return handleResponse(
          res,
          404,
          "warning",
          "Id noto'g'ri berildi",
          null
        );
      }
      const payments = await Payments.find({
        customerId,
        ...dateQuery(req.query),
      })
      .populate([
        { path: "customerId", select: ["fname", "lname"] },
        { path: "adminId", select: ["fname", "lname"] },
      ])
      .sort({ createdAt: -1 });

      if (!payments.length) {
        return handleResponse(res, 404, "warning", "To'lov topilmadi", null);
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
  async createNew(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { error } = validatePayment(req.body);
        if (error) {
          return handleResponse(
            res,
            400,
            "warning",
            error.details[0].message,
            null
          );
        }

        const { customerId, amount } = req.body;
        const customer = await Customers.exists({_id: customerId})
        if(!customer){
          return handleResponse(res, 400, "error", "Mijoz topilmadi", null)
        }
        // Update customer's budget
        await Customers.findByIdAndUpdate(
          customerId,
          {
            $inc: {
              budget: +amount,
            },
          },
          { session }
        );

        // Create new payment
        const newPayment = await Payments.create(req.body);

        handleResponse(
          res,
          201,
          "success",
          "To'lov muvaffaqiyatli qo'shildi",
          newPayment
        );
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    } finally {
      session.endSession();
    }
  }
  async updateById(req, res) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { id: paymentId } = req.params;
        const { customerId, amount, comment } = req.body;

        // Validate IDs
        if ([paymentId, customerId].some((el) => el.length !== 24)) {
          return handleResponse(
            res,
            404,
            "warning",
            "Id noto'g'ri berildi",
            null
          );
        }
        const { error } = validatePayment(req.body);
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
        const payment = await Payments.findById(paymentId);
        const customer = await Customers.findById(customerId);

        // Check if payment and customer exist, and if the customer ID matches the payment's customer ID
        if (
          !payment ||
          !customer ||
          customer._id.toString() !== payment.customerId.toString()
        ) {
          return handleResponse(res, 404, "warning", "To'lov topilmadi", null);
        }

        // Update payment
        let updatedPayment = await Payments.findByIdAndUpdate(
          paymentId,
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
        await Customers.findByIdAndUpdate(
          customerId,
          {
            $inc: {
              budget: -payment.amount + amount,
            },
          },
          { session, new: true }
        );

        handleResponse(
          res,
          201,
          "success",
          "To'lov muvaffaqiyatli o'zgartirildi",
          updatedPayment
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
        const { id: paymentId } = req.params;

        // Validate the ID
        if (paymentId.length !== 24) {
          return handleResponse(
            res,
            404,
            "warning",
            "Invalid ID provided",
            null
          );
        }

        // Fetch the payment
        const payment = await Payments.findById(paymentId);
        // Check if the payment exists
        if (!payment) {
          return handleResponse(res, 404, "warning", "Payment not found", null);
        }

        // Update customer's budget (subtract the payment amount)
        await Customers.findByIdAndUpdate(
          payment.customerId,
          {
            $inc: {
              budget: -payment.amount,
            },
          },
          { session }
        );

        // Delete the payment
        await Payments.findByIdAndDelete(paymentId, { session });

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
module.exports = new PaymentController
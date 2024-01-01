const { Customers } = require("../model/customerSchema");
const { Payments, validatePayment } = require("../model/paymentSchema");
const { dateQuery } = require("../utils/dateQuery");
const mongoose = require("mongoose");

const handleResponse = (res, status, variant, msg, innerData, totalCount) => {
  res.status(status).json({
    variant,
    msg,
    innerData,
    totalCount,
  });
};

exports.getPayments = async (req, res) => {
  try {
    const { count = 1, pagination = 10 } = req.query;
    const payments = await Payments.find(dateQuery(req.query))
      .populate([
        { path: "customerId", select: ["fname", "lname"] },
        { path: "adminId", select: ["fname", "lname"] }
      ])
      .sort({
        createdAt: -1,
      });
  

    if (!payments) {
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
};

exports.getPaymentByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { count = 1, pagination = 10 } = req.query;

    const payments = await Payments.find({
      customerId,
      ...dateQuery(req.query),
    }).sort({ createdAt: -1 });

    if (!payments) {
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
};

exports.createPayment = async (req, res) => {
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
        "Payment successfully added",
        newPayment
      );
    });
  } catch (error) {
    handleResponse(res, 500, "error", "Server error", null);
  } finally {
    session.endSession();
  }
};

exports.updatePayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.params;
      const { customerId, amount, comment } = req.body;

      // Validate IDs
      if ([id, customerId].some((el) => el.length !== 24)) {
        return handleResponse(
          res,
          404,
          "warning",
          "Id noto'g'ri berildi",
          null
        );
      }

      // Fetch payment and customer
      const payment = await Payments.findById(id);
      const customer = await Customers.findById(customerId);

      // Check if payment and customer exist, and if the customer ID matches the payment's customer ID
      if (
        !payment ||
        !customer ||
        customer._id.toString() !== payment.customerId
      ) {
        return handleResponse(res, 404, "warning", "To'lov topilmadi", null);
      }

      // Update payment
      let updatedPayment = await Payments.findByIdAndUpdate(
        id,
        {
          $set: {
            amount,
            comment,
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
        "To'lov muvaffaqiyatli tahrirlandi",
        updatedPayment
      );
    });
  } catch (error) {
    handleResponse(res, 500, "error", "Server error", null);
  } finally {
    session.endSession();
  }
};

exports.deletePayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.params;

      // Validate the ID
      if (id.length !== 24) {
        return handleResponse(res, 404, "warning", "Invalid ID provided", null);
      }

      // Fetch the payment
      const payment = await Payments.findById(id);

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
      await Payments.findByIdAndDelete(id, { session });

      handleResponse(res, 200, "success", "Payment successfully deleted", null);
    });
  } catch (error) {
    handleResponse(res, 500, "error", "Server error", null);
  } finally {
    session.endSession();
  }
};

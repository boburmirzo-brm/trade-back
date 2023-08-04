const mongoose = require("mongoose"),
  JOI = require("joi");

const buyOrSellSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["input", "output"],
      required: true,
    },
    orderId: {
      type: String,
      default: "",
    },
    sellerId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    units: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    adminId: {
      type: String,
      required: true,
    },
    returnedItem: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BuyOrSells = mongoose.model("BuyOrSell", buyOrSellSchema);

const validateBuyOrSell = (body) => {
  JOI.object({
    status: JOI.string().valid("input", "output").required(),
    orderId: JOI.string().when("status", {
      is: "output",
      then: JOI.required(),
    }),
    sellerId: JOI.string().when("status", {
      is: "input",
      then: JOI.required(),
    }),
    title: JOI.string().required(),
    price: JOI.number().required(),
    quantity: JOI.number().required(),
    units: JOI.string().required(),
    comment: Joi.string().allow(""),
    adminId: JOI.string().required(),
    returnedItem: JOI.boolean().required(),
  });
  return schema.validate(body);
};

module.exports = {
  BuyOrSells,
  validateBuyOrSell,
};

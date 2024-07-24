const { Schema, model } = require('mongoose');
const JOI = require('joi');
const {timeZone} = require("../utils/timeZone")

const buyOrSellSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['input', 'output'],
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      required: false,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: function () {
        return this.status === 'output';
      },
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'sellers',
      required: function () {
        return this.status === 'input';
      },
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: function () {
        return this.status === 'output';
      },
    },
    expense: {
      type: Number,
      default: 0,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: false,
      default: '',
    },
    returnedItem: {
      type: Boolean,
      required: false,
      default: false,
    },
    createdAt: {
      type: Date,
      required: false,
      default: ()=> timeZone()
    },
    updatedAt: {
      type: Date,
      required: false,
      default: ()=> timeZone()
    },
    isActive: {
      type: Boolean,
      default: true
    },
    payCheck: {
      type: Date,
      required: function () {
        return this.status === 'output';
      },
    }
  },
);

const BuyOrSells = model('BuyOrSell', buyOrSellSchema);

const validateBuyOrSell = (body) => {
  const schema = JOI.object({
    status: JOI.string().valid('input', 'output').required(),
    customerId: JOI.when('status', {
      is: 'output',
      then: JOI.string().required(),
      otherwise: JOI.string().allow(''),
    }),
    sellerId: JOI.when('status', {
      is: 'input',
      then: JOI.string().required(),
      otherwise: JOI.string().allow(''),
    }),
    productId: JOI.string().required(),
    price: JOI.number().required(),
    originalPrice: JOI.when('status', {
      is: 'output',
      then: JOI.number().required(),
      otherwise: JOI.number().allow(0),
    }),
    quantity: JOI.number().required(),
    comment: JOI.string().allow(''),
    expense: JOI.number(),
    adminId: JOI.string(),
    returnedItem: JOI.boolean(),
    isActive: JOI.boolean(),
    createdAt: JOI.string(),
    updatedAt: JOI.string(),
    payCheck:JOI.when('status', {
      is: 'output',
      then: JOI.string().required(),
      otherwise: JOI.string().allow(""),
    }),

  });

  return schema.validate(body);
};

module.exports = { BuyOrSells, validateBuyOrSell };

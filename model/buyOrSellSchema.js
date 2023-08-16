const { Schema, model, default: mongoose } = require('mongoose');
const JOI = require('joi');

const buyOrSellSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['input', 'output'],
      required: true,
    },
    orderId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'customers',
      required: function () {
        return this.status === 'output';
      },
    },
    sellerId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'sellers',
      required: function () {
        return this.status === 'input';
      },
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
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
      default: '',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
      required: true,
    },
    returnedItem: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const BuyOrSells = model('BuyOrSell', buyOrSellSchema);

const validateBuyOrSell = (body) => {
  const schema = JOI.object({
    status: JOI.string().valid('input', 'output').required(),
    orderId: JOI.when('status', {
      is: 'output',
      then: JOI.string().required(),
      otherwise: JOI.string().allow(''),
    }),
    sellerId: JOI.when('status', {
      is: 'input',
      then: JOI.string().required(),
      otherwise: JOI.string().allow(''),
    }),
    title: JOI.string().required(),
    productId: JOI.string().required(),
    price: JOI.number().required(),
    quantity: JOI.number().required(),
    units: JOI.string().required(),
    comment: JOI.string().allow(''),
    adminId: JOI.string().required(),
    returnedItem: JOI.boolean().required(),
  });

  return schema.validate(body);
};

module.exports = { BuyOrSells, validateBuyOrSell };

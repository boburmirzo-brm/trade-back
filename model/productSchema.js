const { Schema, model } = require("mongoose");
const Joi = require("joi");

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    units: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: false,
        default: new Date().toISOString()
    },
    comment: {
        type: String,
        required: false
    },
    adminId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: false
    }
});

const Products = model("product", productSchema);

const validationProduct = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        category: Joi.string().required(),
        units: Joi.string().required(),
        createdAt: Joi.string(),
        comment: Joi.string(),
        adminId: Joi.string(),
        sellerId: Joi.string()
    });
    return schema.validate(body);
}

module.exports = { Products, validationProduct };
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
    quontity: {
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
        default: Date.now
    },
    comment: String,
    adminId: {
        type: String,
        required: true
    },
});

const Products = model("product", productSchema);

const validationProduct = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        quontity: Joi.number().required(),
        category: Joi.string().required(),
        units: Joi.string().required(),
        createdAt: Joi.string(),
        comment: Joi.string(),
        adminId: Joi.string().required(),
    });
    return schema.validate(body);
}

module.exports = { Products, validationProduct };
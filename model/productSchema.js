const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {timeZone} = require("../utils/timeZone")

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
        type: Date,
        required: false,
        default:()=> timeZone()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: ()=> timeZone()
    },
    comment: {
        type: String,
        required: false,
        default: ""
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        required: false
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "sellers",
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const Products = model("products", productSchema);

const validationProduct = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        category: Joi.string().required(),
        units: Joi.string().required(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        comment: Joi.string().allow(""),
        adminId: Joi.string().optional(),
        sellerId: Joi.string().required(),
        isActive: Joi.boolean()
    });
    return schema.validate(body);
}

module.exports = { Products, validationProduct };
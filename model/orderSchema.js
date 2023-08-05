const { Schema, model } = require("mongoose")
const Joi = require("joi")

const orderSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: false,
        default: new Date()
    },
    finalDate: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
})

const Order = model("orders", orderSchema)

const validateOrder = (body) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        createdAt: Joi.string(),
        finalDate: Joi.string().required(),
        totalPrice: Joi.number().required(),
    })
    return schema.validate(body)
}

module.exports = { Order, validateOrder }
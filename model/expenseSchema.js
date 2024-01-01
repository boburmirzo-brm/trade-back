const { Schema, model } = require("mongoose")
const Joi = require("joi")
const { timeZone } = require("../utils/timeZone")

const expenseSchema = new Schema({
    adminId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        required: false,
        default:()=> timeZone()
    },
    updatedAt: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    }
})

const Expense = model("expenses", expenseSchema)

const validateExpense = (body) => {
    const schema = Joi.object({
        adminId: Joi.string().required(),
        sellerId: Joi.string().required(),
        amount: Joi.number().required(),
        createdAt: Joi.string(),
        comment: Joi.string(),
    })
    return schema.validate(body)
}

module.exports = { Expense, validateExpense }
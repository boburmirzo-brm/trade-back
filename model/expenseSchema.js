const { Schema, model } = require("mongoose")
const Joi = require("joi")
const { timeZone } = require("../utils/timeZone")

const expenseSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        required: false
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "sellers",
        required: true
    },
    amount: {
        type: Number,
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
        default:()=> timeZone()
    },
    comment: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

const Expense = model("expenses", expenseSchema)

const validateExpense = (body) => {
    const schema = Joi.object({
        adminId: Joi.string().optional(),
        sellerId: Joi.string().required(),
        amount: Joi.number().required(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        comment: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
    })
    return schema.validate(body)
}

module.exports = { Expense, validateExpense }
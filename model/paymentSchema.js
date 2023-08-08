const { Schema, model } = require("mongoose"),
    JOI = require("joi")


const PaymentSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    adminId: {
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
        default: new Date().toISOString()
    },
    comment: {
        type: String,
        required: false
    }
})

const Payments = model("payments", PaymentSchema)

const validatePayment = (body) => {
    const schema = JOI.object({
        customerId: JOI.string().required(),
        adminId: JOI.string().required(),
        amount: JOI.number().required(),
        createdAt: JOI.string(),
        comment: JOI.string()
    })
    return schema.validate(body)
}

module.exports = { Payments, validatePayment }
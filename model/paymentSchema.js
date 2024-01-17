const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const PaymentSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customers",
        required: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: () => timeZone()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: () => timeZone()
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
        updatedAt: JOI.string(),
        comment: JOI.string().allow("")
    })
    return schema.validate(body)
}

module.exports = { Payments, validatePayment }
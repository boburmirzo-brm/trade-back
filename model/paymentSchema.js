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
        required: false
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
        default: ""
    },
    type: {
        type: String,
        enum: ['cash', 'card'],
        required: false,
        default: "cash"
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

const Payments = model("payments", PaymentSchema)

const validatePayment = (body) => {
    const schema = JOI.object({
        customerId: JOI.string().required(),
        adminId: JOI.string().allow(""),
        amount: JOI.number().required(),
        createdAt: JOI.string(),
        updatedAt: JOI.string(),
        comment: JOI.string().allow(""),
        type: JOI.string().allow("cash"),
        isActive: JOI.boolean()
    })
    return schema.validate(body)
}

module.exports = { Payments, validatePayment }
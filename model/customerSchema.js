const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const CustomerSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phones: {
        type: Array,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: ()=> timeZone()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: ()=> timeZone()
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Customers = model("customers", CustomerSchema)

const validateCustomer = (body) => {
    const schema = JOI.object({
        fname: JOI.string().required(),
        lname: JOI.string().required(),
        phones: JOI.array().required(),
        address: JOI.string().required(),
        budget: JOI.number().required(),
        adminId: JOI.string().required(),
        isActive: JOI.boolean(),
        createdAt: JOI.string(),
        updatedAt: JOI.string()
    })
    return schema.validate(body)
}

module.exports = { Customers, validateCustomer }
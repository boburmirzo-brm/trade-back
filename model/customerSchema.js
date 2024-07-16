const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const CustomerSchema = new Schema({
    // username: "",
    // password: "",
    // index: number,
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phone_primary: {
        type: String,
        required: true
    },
    phone_secondary: {
        type: String,
        default: "",
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
        required: false
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
    },
    pin: {
        type: Boolean,
        default: false
    },
    isArchive: {
        type: Boolean,
        default: false
    },
    isPaidToday: {
        type: Date,
        required: false,
        default: "2000-01-01T00:00:00.750Z"
    }
})

const Customers = model("customers", CustomerSchema)

const validateCustomer = (body) => {
    const schema = JOI.object({
        fname: JOI.string().required(),
        lname: JOI.string().required(),
        phone_primary: JOI.string().required(),
        phone_secondary: JOI.string().optional(),
        address: JOI.string().required(),
        budget: JOI.number().required(),
        adminId: JOI.string().optional(),
        isActive: JOI.boolean(),
        createdAt: JOI.string(),
        updatedAt: JOI.string()
    })
    return schema.validate(body)
}

module.exports = { Customers, validateCustomer }
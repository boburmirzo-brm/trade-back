const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const CustomerSchema = new Schema({
    index: {
        type: String,
        required: false
    },
    username: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: false,
        default: ""
    },
    phone_primary: {
        type: String,
        default: ""
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
        default: 0
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
        lname: JOI.string().allow(""),
        phone_primary: JOI.string().allow(""),
        phone_secondary: JOI.string().allow(""),
        address: JOI.string().required(),
        budget: JOI.number().allow(0),
        adminId: JOI.string(),
        isActive: JOI.boolean(),
        createdAt: JOI.string(),
        updatedAt: JOI.string(),
        pin: JOI.boolean(),
        isArchive: JOI.boolean(),
        isPaidToday: JOI.string(),
        index: JOI.string(),
    })
    return schema.validate(body)
}

module.exports = { Customers, validateCustomer }
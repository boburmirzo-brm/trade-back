const { Schema, model } = require("mongoose"),
    JOI = require("joi")


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
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: false,
        default: new Date().toISOString()
    },
    updatedAt: {
        type: String,
        required: false,
        default: "Tahrirlanmagan"
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
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
        isActive: JOI.boolean().required(),
        createdAt: JOI.string(),
        updatedAt: JOI.string()
    })
    return schema.validate(body)
}

module.exports = { Customers, validateCustomer }
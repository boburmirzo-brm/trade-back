const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const salarySchema = new Schema({
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
        default:()=> timeZone()
    },
    comment: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

const Salaries = model("salary", salarySchema)

const validateSalaries = (body) => {
    const schema = JOI.object({
        adminId: JOI.string().required(),
        amount: JOI.number().required(),
        createdAt: JOI.string(),
        comment: JOI.string(),
        isActive: JOI.boolean()
    })
    return schema.validate(body)
}

module.exports = { Salaries, validateSalaries }
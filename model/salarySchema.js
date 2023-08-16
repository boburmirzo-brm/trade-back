const { Schema, model } = require("mongoose"),
    JOI = require("joi")


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
        default: new Date().toISOString()
    },
    comment: {
        type: String,
        required: false
    }
})

const Salaries = model("salary", salarySchema)

const validateSalaries = (body) => {
    const schema = JOI.object({
        adminId: JOI.string().required(),
        amount: JOI.number().required(),
        createdAt: JOI.string(),
        comment: JOI.string()
    })
    return schema.validate(body)
}

module.exports = { Salaries, validateSalaries }
const { Schema, model } = require("mongoose"),
    JOI = require("joi")


const salarySchema = new Schema({
    adminId: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    createdAt: {
        type: String,
        require: false,
        default: new Date().toISOString()
    },
    comment: {
        type: String,
        require: false
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
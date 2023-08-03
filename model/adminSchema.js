const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    moment = require("moment")


const AdminSchema = new Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    phones: {
        type: Array,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdAt: {
        type: String,
        required: false,
        default: moment().format('LLLL')
    },
    isActive: {
        type: Boolean,
        require: true
    }
    // ,
    // salaries: {
    //     type: Array,
    //     require: true
    // },
    // expenses: {
    //     type: Array,
    //     require: true
    // }
})

const Admins = model("admins", AdminSchema)

const validateAdmin = (body) => {
    const schema = JOI.object({
        fname: JOI.string().required(),
        lname: JOI.string().required(),
        phones: JOI.array().required(),
        role: JOI.string().required(),
        username: JOI.string().required().min(4),
        password: JOI.string().required().min(8).max(32),
        createdAt: JOI.string(),
        isActive: JOI.boolean().required()
        // ,
        // salaries: JOI.array().required(),
        // expenses: JOI.array().required()
    })
    return schema.validate(body)
}

module.exports = { Admins, validateAdmin }
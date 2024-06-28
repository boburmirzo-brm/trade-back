const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const AdminSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phones: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
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
},
// { timestamps: true }
)

const Admins = model("admins", AdminSchema)

const validateAdmin = (body) => {
    const schema = JOI.object({
        fname: JOI.string().required(),
        lname: JOI.string().required(),
        phones: JOI.string().required(),
        role: JOI.string().required(),
        username: JOI.string().required().min(4),
        password: JOI.string().required().min(8).max(32),
        createdAt: JOI.string(),
        updatedAt: JOI.string(),
        isActive: JOI.boolean()
        // salaries: JOI.array().required(),
        // expenses: JOI.array().required()
    })
    return schema.validate(body)
}

module.exports = { Admins, validateAdmin }
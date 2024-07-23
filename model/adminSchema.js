const { Schema, model } = require("mongoose");
const JOI = require("joi");
const { timeZone } =  require("../utils/timeZone");



const AdminSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        default: ""
    },
    phone_primary: {
        type: String,
        required: true
    },
    phone_secondary: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: [process.env.OWNER_NAME, 'admin'],
        default: "admin"
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
        default: () => timeZone()
    },
    updatedAt: {
        type: Date,
        default: () => timeZone()
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
// { timestamps: true }
);

const Admins = model("admins", AdminSchema);

const validateAdmin = (body) => {
    const schema = JOI.object({
        fname: JOI.string().required(),
        lname: JOI.string().allow(""),
        phone_primary: JOI.string().required(),
        phone_secondary: JOI.string().optional(),
        role: JOI.string().optional(),
        username: JOI.string().required().min(4),
        password: JOI.string().required().min(8).max(32),
        createdAt: JOI.string(),
        updatedAt: JOI.string(),
        isActive: JOI.boolean()
    });
    return schema.validate(body);
};

module.exports = { Admins, validateAdmin };
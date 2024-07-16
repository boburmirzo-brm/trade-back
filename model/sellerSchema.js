const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const SellerSchema = new Schema({
    index: {
        type: Number,
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
        require: true 
    },
    lname: {
        type: String,
        require: true
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
        require: true
    },
    budget: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        require: false,
        default:()=> timeZone()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: ()=> timeZone()
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "admins",
        require: false
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
    },
})

const Sellers = model("sellers", SellerSchema)

const validateSeller = (body) => {
  const schema = JOI.object({
      fname: JOI.string().required(),
      lname: JOI.string().required(),
      phone_primary: JOI.string().required(),
      phone_secondary: JOI.string().allow(""),
      address: JOI.string().required(),
      budget: JOI.number().required(),
      createdAt: JOI.string(),
      updatedAt: JOI.string(),
      adminId: JOI.string().optional(),
      isActive: JOI.boolean()
  })
  return schema.validate(body)
}

module.exports = { Sellers, validateSeller }
const { Schema, model } = require("mongoose"),
    JOI = require("joi"),
    {timeZone} = require("../utils/timeZone")


const SellerSchema = new Schema({
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
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const Sellers = model("sellers", SellerSchema)

const validateSeller = (body) => {
  const schema = JOI.object({
      fname: JOI.string().required(),
      lname: JOI.string().required(),
      phones: JOI.array().required(),
      address: JOI.string().required(),
      budget: JOI.number().required(),
      createdAt: JOI.string(),
      updatedAt: JOI.string(),
      adminId: JOI.string().required(),
      isActive: JOI.boolean()
  })
  return schema.validate(body)
}

module.exports = { Sellers, validateSeller }
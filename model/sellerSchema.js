const { Schema, model } = require("mongoose"),
    JOI = require("joi")


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
        type: String,
        require: false,
        default: new Date()
    },
    // adminIn - xato bulib qopti
    adminId: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        require: true
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
      adminId: JOI.string().required(),
      isActive: JOI.boolean().required()
  })
  return schema.validate(body)
}

module.exports = { Sellers, validateSeller }
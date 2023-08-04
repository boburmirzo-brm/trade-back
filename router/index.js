const express = require("express")
const router = express.Router()
const { getAdmins, createAdmin } = require("../controller/admin")
const { getPayments, createPayment } = require("../controller/payment")
const { getCustomer, createCustomer } = require("../controller/customer")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)

// Payment route
router.get("/get/payment", getPayments)
router.post("/create/payment", createPayment)

// Customer route
router.get("/get/customer", getCustomer)
router.post("/create/customer", createCustomer)


// Order route


module.exports = router
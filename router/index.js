const express = require("express")
const router = express.Router()
const {getAdmins, createAdmin} = require("../controller/admin")
const { getOrders, createOrder } = require("../controller/order")
const { getExpenses, createExpense } = require("../controller/expense")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)


// Order route
router.get("/order/allorders", getOrders)
router.post("/order/createOrder", createOrder)

// Expense route
router.get("/expense/allexpense", getExpenses)
router.post("/expense/createExpense", createExpense)


module.exports = router
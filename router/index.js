const express = require("express")
const router = express.Router()
const {getAdmins, createAdmin} = require("../controller/admin")
const { getBuyOrSells } = require("../controller/buyOrSell")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)

// BuyOrSell route
router.get("/get/buy-or-sell", getBuyOrSells)


// Order route


module.exports = router
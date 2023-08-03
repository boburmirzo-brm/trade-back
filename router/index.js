const express = require("express")
const router = express.Router()
const {getAdmins, createAdmin} = require("../controller/admin")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)


// Order route


module.exports = router
const express = require("express")
const router = express.Router()
const { getAdmins, createAdmin } = require("../controller/admin")
const { getSalary, createSalary, updateSalary, deleteSalary } = require("../controller/salary")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)


// Order route


// Salary route
router.get("/get/salary", getSalary)
router.post("/create/salary", createSalary)
router.put("/update/salary", updateSalary)
router.delete("/delete/salary", deleteSalary)

module.exports = router
const express = require("express");
const router = express.Router();
const { getAdmins, createAdmin } = require("../controller/admin");

//? import product
const { getProducts, createProduct } = require("../controller/product");

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get("/get/admin", getAdmins)
router.post("/create/admin", createAdmin)

// Order route


//? product route
router.get("/get/product", getProducts);
router.post("/create/product", createProduct);

module.exports = router
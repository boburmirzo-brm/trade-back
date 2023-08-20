const express = require('express');
const router = express.Router();
const { getSellers, createSeller, getSellersById, patchSeller } = require('../controller/seller');
const {
  getBuyOrSells,
  createBuyOrSell,
  deleteBuyOrSell,
  // deleteAllBuyOrSells,
} = require('../controller/buyOrSell');
const { getAdmins, createAdmin, getSingleAdmin, signInAdmin, isActiceAdmin, updateAdmins } = require('../controller/admin');
const {
  getSalary,
  createSalary,
  updateSalary,
} = require('../controller/salary');
const { getOrders, createOrder, updateOrder } = require('../controller/order');
const { getExpenses, createExpense, updateExpense } = require('../controller/expense');

const {
  getPayments,
  getOnePayment,
  createPayment,
  updatePayment,
} = require('../controller/payment');
const {
  getCustomer,
  createCustomer,
  updateCustomer,
  getOneCustomer,
  isActiveCustomer
} = require('../controller/customer');
const { createProduct, getProducts } = require("../controller/product")

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get('/get/admin', getAdmins);
// router.get('/single/admin/:id', getAdmins);
router.get("/get/single/admin/:id", getSingleAdmin)
// router.create("/create/admin",createAdmin);
router.post('/admin/sign-up', createAdmin);
// router.post('/sign-in/admin', createAdmin);
router.post("/admin/sign-in", signInAdmin)
// router.patch('/update/admin', createAdmin);
router.patch("/update/admin/:id", updateAdmins)
// router.patch('/isactive/admin', createAdmin);
router.patch("/isactive/admin/:id", isActiceAdmin)


// BuyOrSell route
router.get('/get/buy-or-sell', getBuyOrSells);
router.post('/create/buy-or-sell', createBuyOrSell);
router.delete('/delete/buy-or-sell/:id', deleteBuyOrSell);
// router.delete('/delete-all/buy-or-sell', deleteAllBuyOrSells);

// Order route
router.get('/get/orders', getOrders);
router.post('/create/order', createOrder);
router.patch('/update/order/:id', updateOrder)

// Expense route
router.get('/get/expenses', getExpenses);
router.post('/create/expense', createExpense);
router.patch('/update/expense/:id', updateExpense);
// router.delete('/delete/expense/:id', createExpense);

// Seller route
router.get('/get/seller', getSellers);
router.get('/single/seller/:id', getSellersById); // single seller
router.post('/create/seller', createSeller);
router.patch('/update/seller/:id', patchSeller);
// router.patch('/isactive/seller/:id', lorem); // !boolean

// Salary route
router.get('/get/salary', getSalary);
router.post('/create/salary', createSalary);
router.patch('/update/salary/:id', updateSalary);

// Order route

//? product route
router.get('/get/product', getProducts);
router.post('/create/product', createProduct);

// Payment route
router.get('/get/payment', getPayments);
router.get('/get/payment/:id', getOnePayment);
router.post('/create/payment', createPayment);
router.patch('/update/payment/:id', updatePayment);

// Customer route
router.get('/get/customer', getCustomer);
router.get('/get/customer/:id', getOneCustomer);
router.post('/create/customer', createCustomer);
router.patch('/update/customer/:id', updateCustomer);
router.patch('/isactive/customer/:id', isActiveCustomer); // !boolean

module.exports = router;


const express = require('express');
const router = express.Router();
const { getSellers, createSeller } = require('../controller/seller');
const {
  getBuyOrSells,
  createBuyOrSell,
  deleteBuyOrSell,
  // deleteAllBuyOrSells,
} = require('../controller/buyOrSell');
const { getAdmins, createAdmin } = require('../controller/admin');
const {
  getSalary,
  createSalary,
  updateSalary,
  deleteSalary,
} = require('../controller/salary');
const { getProducts, createProduct } = require('../controller/product');
const { getPayments, createPayment } = require('../controller/payment');
const { getCustomer, createCustomer } = require('../controller/customer');
const { getOrders, createOrder } = require('../controller/order');
const { getExpenses, createExpense } = require('../controller/expense');

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get('/get/admin', getAdmins);
// router.get('/single/admin/:id', getAdmins);
router.post('/create/admin', createAdmin);
// router.post('/sign-in/admin', createAdmin);
// router.patch('/update/admin', createAdmin);
// router.patch('/isactive/admin', createAdmin); // !boolean

// BuyOrSell route
router.get('/get/buy-or-sell', getBuyOrSells);
router.post('/create/buy-or-sell', createBuyOrSell);
router.delete('/delete/buy-or-sell/:id', deleteBuyOrSell);
// router.delete('/delete-all/buy-or-sell', deleteAllBuyOrSells);

// Order route
router.get('/get/orders', getOrders);
router.post('/create/order', createOrder);

// Expense route
router.get('/get/expenses', getExpenses);
router.post('/create/expense', createExpense);
// router.patch('/update/expense/:id', createExpense);
// router.delete('/delete/expense/:id', createExpense);

// Seller route
router.get('/get/seller', getSellers);
// router.get('/single/seller/:id', getSellers); // single seller
router.post('/create/seller', createSeller);
// router.patch('/update/seller/:id', lorem);
// router.patch('/isactive/seller/:id', lorem); // !boolean

// Salary route
router.get('/get/salary', getSalary);
router.post('/create/salary', createSalary);
router.patch('/update/salary/:id', updateSalary);
router.delete('/delete/salary/:id', deleteSalary);
// Order route

//? product route
router.get('/get/product', getProducts);
router.post('/create/product', createProduct);

// Payment route
router.get('/get/payment', getPayments);
router.post('/create/payment', createPayment);

// Customer route
router.get('/get/customer', getCustomer);
router.post('/create/customer', createCustomer);
// router.patch('/update/customer', createCustomer);
// router.patch('/isactive/customer/:id', lorem); // !boolean

module.exports = router;

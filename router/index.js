const express = require('express');
const router = express.Router();
const {
  getSellers,
  createSeller,
  getSellersById,
  updateSeller,
  deleteSeller,
  isActiveSeller,
} = require('../controller/seller');
const {
  getBuyOrSells,
  createBuyOrSell,
  deleteBuyOrSell,
  createBuyOrSellInput,
  // deleteAllBuyOrSells,
} = require('../controller/buyOrSell');
const {
  getAdmins,
  createAdmin,
  getSingleAdmin,
  signInAdmin,
  isActiceAdmin,
  updateAdmins,
} = require('../controller/admin');
const {
  getSalary,
  createSalary,
  updateSalary,
} = require('../controller/salary');
const { getOrders, createOrder, updateOrder } = require('../controller/order');

const {
  getPayments,
  getPaymentByCustomerId,
  deletePayment,
  createPayment,
  updatePayment,
} = require('../controller/payment');
const {
  createCustomer,
  updateCustomer,
  getOneCustomer,
  isActiveCustomer,
  deleteCustomer,
  getCustomers,
} = require('../controller/customer');
const { createProduct, getProducts } = require('../controller/product');

// get -> get
// delete -> delete
// put -> update
// patch -> patch
// post -> create

// Admin route
router.get('/get/admins', getAdmins);
router.get('/get/admin/:id', getSingleAdmin);
router.post('/admin/sign-up', createAdmin);
router.post('/admin/sign-in', signInAdmin);
router.patch('/update/admin/:id', updateAdmins);
router.patch('/isactive/admin/:id', isActiceAdmin);

// Seller route
router.get('/get/sellers', getSellers);
router.get('/get/seller/:id', getSellersById); // single seller
router.post('/create/seller', createSeller);
router.patch('/update/seller/:id', updateSeller);
router.patch('/isactive/seller/:id', isActiveSeller); // !boolean
router.delete('/delete/seller/:id', deleteSeller);

// Customer route
router.get('/get/customers', getCustomers);
router.get('/get/customer/:id', getOneCustomer);
router.post('/create/customer', createCustomer);
router.patch('/update/customer/:id', updateCustomer);
router.patch('/isactive/customer/:id', isActiveCustomer); // !boolean
router.delete('/delete/customer/:id', deleteCustomer); 

// BuyOrSell route
router.get('/get/buy-or-sell', getBuyOrSells);
router.post('/create/buy-or-sell', createBuyOrSell);
router.post('/create/buy-or-sell/input', createBuyOrSellInput);
router.delete('/delete/buy-or-sell/:id', deleteBuyOrSell);

// Salary route
router.get('/get/salaries', getSalary);
router.post('/create/salary', createSalary);
router.patch('/update/salary/:id', updateSalary);

// Product route
router.get('/get/products', getProducts);
router.post("/create/product", createProduct);

// Payment route
router.get('/get/payments', getPayments);
router.get('/get/payments/:customerId', getPaymentByCustomerId);
router.post('/create/payment', createPayment);
router.patch('/update/payment/:id', updatePayment);
router.delete('/delete/payment/:id', deletePayment);

// Expense route
const expenseController = require("../controller/expense")
router.get('/get/expenses', expenseController.getAll);
router.get('/get/expenses/:sellerId', expenseController.getBySellerId);
router.post('/create/expense', expenseController.createNew);
router.patch('/update/expense/:id', expenseController.updateById);
router.delete('/delete/expense/:id', expenseController.deleteById);

module.exports = router;

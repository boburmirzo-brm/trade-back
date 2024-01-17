const express = require('express');
const router = express.Router();

// Admin route
const AdminController = require("../controller/admin")
router.get('/get/admins', AdminController.getAll);
router.get('/get/admin/:id', AdminController.getById);
router.post('/admin/sign-up', AdminController.signUp);
router.post('/admin/sign-in', AdminController.signIn);
router.patch('/update/admin/:id', AdminController.updateById);
router.patch('/isactive/admin/:id', AdminController.isActice);
router.delete('/delete/admin/:id', AdminController.deleteById);

// Seller route
const SellerController = require("../controller/seller")
router.get('/get/sellers', SellerController.getAll);
router.get('/get/seller/:id', SellerController.getById); // single seller
router.post('/create/seller', SellerController.createNew);
router.patch('/update/seller/:id', SellerController.updateById);
router.patch('/isactive/seller/:id', SellerController.isActive); // !boolean
router.delete('/delete/seller/:id', SellerController.deleteById);

// Customer route
const CustomerController = require("../controller/customer")
router.get('/get/customers', CustomerController.getAll);
router.get('/get/customer/:id', CustomerController.getById);
router.post('/create/customer', CustomerController.createNew);
router.patch('/update/customer/:id', CustomerController.updateById);
router.patch('/isactive/customer/:id', CustomerController.isActive); // !boolean
router.delete('/delete/customer/:id', CustomerController.deleteById); 

// Product route
const ProductController = require("../controller/product")
router.get('/get/products', ProductController.getAll);
router.get('/get/product/:id', ProductController.getById);
router.post("/create/product", ProductController.createNew);
router.patch("/update/product/:id", ProductController.updateById);
router.delete("/delete/product/:id", ProductController.deleteById);

// BuyOrSell route
const BuyOrSellController = require("../controller/buyOrSell")
router.get('/get/buy-or-sell', BuyOrSellController.getAll);
router.get('/get/buy-or-sell/customer/:id', BuyOrSellController.getByCustomerId);
router.get('/get/buy-or-sell/seller/:id', BuyOrSellController.getBySellerId);
router.post('/create/buy-or-sell/output', BuyOrSellController.createOutput);
router.post('/create/buy-or-sell/input', BuyOrSellController.createInput);
router.patch('/returned/buy-or-sell/:id', BuyOrSellController.returnedItem);
router.delete('/delete/buy-or-sell/:id', BuyOrSellController.deleteById);

// Payment route
const PaymentController = require("../controller/payment")
router.get('/get/payments', PaymentController.getAll);
router.get('/get/payments/:customerId', PaymentController.getByCustomerId);
router.post('/create/payment', PaymentController.createNew);
router.patch('/update/payment/:id', PaymentController.updateById);
router.delete('/delete/payment/:id', PaymentController.deleteById);

// Expense route
const ExpenseController = require("../controller/expense")
router.get('/get/expenses', ExpenseController.getAll);
router.get('/get/expenses/:sellerId', ExpenseController.getBySellerId);
router.post('/create/expense', ExpenseController.createNew);
router.patch('/update/expense/:id', ExpenseController.updateById);
router.delete('/delete/expense/:id', ExpenseController.deleteById);

// Salary route
const SalaryController = require("../controller/salary")
router.get('/get/salaries', SalaryController.getAll);
router.post('/create/salary', SalaryController.createNew);
router.patch('/update/salary/:id', SalaryController.updateById);

module.exports = router;

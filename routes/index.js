const express = require('express');
const router = express.Router();
const {auth} = require("../middleware/auth")
const {admin} = require("../middleware/admin")
const {owner} = require("../middleware/owner")

// Admin route
const AdminController = require("../controller/admin")
router.get('/get/admins',[auth, owner], AdminController.getAll);
router.get('/get/admin/:id',[auth, owner], AdminController.getById);
router.post('/admin/sign-up',[auth, owner], AdminController.signUp);
router.post('/admin/sign-in', AdminController.signIn);
router.patch('/update/admin/:id',[auth, owner], AdminController.updateById);
router.patch('/isactive/admin/:id',[auth, owner], AdminController.isActice);
router.delete('/delete/admin/:id',[auth, owner], AdminController.deleteById);

// Seller route
const SellerController = require("../controller/seller")
router.get('/get/sellers',[auth, admin], SellerController.getAll);
router.get('/get/sellers/search',[auth, admin], SellerController.search);
router.get('/get/seller/:id',[auth, admin], SellerController.getById); // single seller
router.post('/create/seller',[auth, admin], SellerController.createNew);
router.patch('/update/seller/:id',[auth, admin], SellerController.updateById);
router.patch('/isactive/seller/:id',[auth, admin], SellerController.isActive); // !boolean
router.delete('/delete/seller/:id',[auth, owner], SellerController.deleteById);

// Customer route
const CustomerController = require("../controller/customer")
router.get('/get/customers',[auth, admin], CustomerController.getAll);
router.get('/get/customers/search',[auth, admin], CustomerController.search);
router.get('/get/customer/:id',[auth, admin], CustomerController.getById);
router.post('/create/customer',[auth, admin], CustomerController.createNew);
router.patch('/update/customer/:id',[auth, admin], CustomerController.updateById);
router.patch('/isactive/customer/:id',[auth, admin], CustomerController.isActive); // !boolean
router.delete('/delete/customer/:id',[auth, owner], CustomerController.deleteById); 

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

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
router.get('/get/products',[auth, admin], ProductController.getAll);
router.get('/get/product/:id',[auth, admin], ProductController.getById);
router.post("/create/product",[auth, admin], ProductController.createNew);
router.patch("/update/product/:id",[auth, admin], ProductController.updateById);
router.delete("/delete/product/:id",[auth, owner], ProductController.deleteById);

// BuyOrSell route
const BuyOrSellController = require("../controller/buyOrSell")
router.get('/get/buy-or-sell', BuyOrSellController.getAll);
router.get('/get/buy-or-sell/customer/:id',[auth, admin], BuyOrSellController.getByCustomerId);
router.get('/get/buy-or-sell/seller/:id',[auth, admin], BuyOrSellController.getBySellerId);
router.post('/create/buy-or-sell/output',[auth, admin], BuyOrSellController.createOutput);
router.post('/create/buy-or-sell/input',[auth, admin], BuyOrSellController.createInput);
router.patch('/returned/buy-or-sell/:id',[auth, admin], BuyOrSellController.returnedItem);
router.delete('/delete/buy-or-sell/:id',[auth, owner], BuyOrSellController.deleteById);

// Payment route
const PaymentController = require("../controller/payment")
router.get('/get/payments',[auth, admin], PaymentController.getAll);
router.get('/get/payments/:customerId',[auth, admin], PaymentController.getByCustomerId);
router.post('/create/payment',[auth, admin], PaymentController.createNew);
router.patch('/update/payment/:id',[auth, admin], PaymentController.updateById);
router.delete('/delete/payment/:id',[auth, owner], PaymentController.deleteById);

// Expense route
const ExpenseController = require("../controller/expense")
router.get('/get/expenses',[auth, admin], ExpenseController.getAll);
router.get('/get/expenses/:sellerId',[auth, admin], ExpenseController.getBySellerId);
router.post('/create/expense', ExpenseController.createNew);
router.patch('/update/expense/:id',[auth, admin], ExpenseController.updateById);
router.delete('/delete/expense/:id',[auth, owner], ExpenseController.deleteById);

// Salary route
const SalaryController = require("../controller/salary")
router.get('/get/salaries',[auth, owner], SalaryController.getAll);
router.post('/create/salary',[auth, owner], SalaryController.createNew);
router.patch('/update/salary/:id',[auth, owner], SalaryController.updateById);

module.exports = router;


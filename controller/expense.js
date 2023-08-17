const { Expense, validateExpense } = require("../model/expenseSchema");
const { Sellers } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery")

exports.getExpenses = async (req, res) => {
    try {
        const allExpenses = await Expense.find(dateQuery(req.query)).sort({ _id: -1 })
        res.status(200).json({ variant: "success", msg: "Barcha Xarajatlar", innerData: allExpenses });
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}

exports.createExpense = async (req, res) => {
    try {
        const { error } = validateExpense(req.body)

        if (error) {
            return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null });
        }

        let { sellerId, amount } = req.body
        let seller = await Sellers.findById(sellerId)

//
//        const expensesId = await Expense.findById()
//        const oldExpense =  expensesId.amount + amount


        if (seller && seller.isActive === true) {
            // All Code Runs Here
            await Sellers.updateOne({ _id: sellerId }, { $set: { budget: seller.budget - amount } })
            let newExpense = await Expense.create(req.body)
            return res.status(201).json({ variant: "success", msg: "Xarajat Yaratildi", innerData: newExpense })
        } else {
            return res.status(404).json({ variant: "warning", msg: "Sotuvchi Topilmadi ", innerData: null })
        }
    }
    catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(404).json({ variant: "warning", msg: "Sotuvchi Idsi Xato", innerData: null })
        } else {
            res.status(500).json({ variant: "error", msg: "server error", innerData: null });
        }
    }
}

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params
       
        const updateExpense = await Expense.findByIdAndUpdate(id, req.body)
        res
            .status(200)
            .json({variant: "success", msg: "Expense muvaffaqiyatli yangilandi", innerData: updateExpense });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(404).json({ variant: "warning", msg: "Sotuvchi Idsi Xato", innerData: null })
        } else {
            res.status(500).json({ variant: "error", msg: "server error", innerData: null });
        }
    }
}
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

        let { sellerId } = req.body
        let { amount } = req.body
        let seller = await Sellers.findById(sellerId)

        if (seller && seller.isActive === true) {
            // All Code Runs Here
            let updateSeller = await Sellers.updateOne({ _id: sellerId }, { $set: { budget: seller.budget - amount } })
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
        const { error } = validateExpense(req.body)
        if(error){
            return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null });
        }

        let { id } = req.params
        let { amount, sellerId, comment, adminId} = req.body
        let seller = await Sellers.findById(sellerId)
        let oneExpense = await Expense.findById(id)


        if(seller.isActive === true){
            let updateSeller = await Sellers.updateOne({ _id: sellerId }, { $set: { budget: seller.budget - amount } })

            oneExpense.sellerId = sellerId
            oneExpense.amount = amount
            oneExpense.comment = comment
            oneExpense.adminId = adminId
            oneExpense.updatedAt = new Date().toISOString()

            const updatedExpense = await oneExpense.save()
            res.status(200).json({ variant: "success", msg: "Malumot Tahrirlandi", innerData: updatedExpense })
        } else {
            res.status(404).json({ variant: "warning", msg: "Sotuvchi Topilmadi", innerData: null })
        }

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(404).json({ variant: "warning", msg: "Sotuvchi Idsi Xato", innerData: null })
        } else {
            res.status(500).json({ variant: "error", msg: "server error", innerData: null });
        }
    }
}
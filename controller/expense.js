const { Expense, validateExpense } = require("../model/expenseSchema")

exports.getExpenses = async (req, res) => {
    try {
        let { from, to } = req.query
        const allExpenses = await Expense.find(from && to && { createdAt: { $gte: new Date(from).toISOString(), $lt: new Date(to).toISOString() } }).sort({ _id: -1 })
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
        const newExpense = await Expense.create(req.body)
        res.status(201).json({ variant: "success", msg: "Xarajat Yaratildi", innerData: newExpense });
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}
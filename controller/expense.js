const { Expense, validateExpense } = require("../model/expenseSchema");
const { Sellers } = require("../model/sellerSchema");
const { dateQuery } = require("../utils/dateQuery");

exports.getExpenses = async (req, res) => {
    try {
        const allExpenses = await Expense.find(dateQuery(req.query)).sort({
            _id: -1,
        });
        res.status(200).json({
            variant: "success",
            msg: "Barcha Xarajatlar",
            innerData: allExpenses,
        });
    } catch {
        res
            .status(500)
            .json({ variant: "error", msg: "server error", innerData: null });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const { error } = validateExpense(req.body);
        if (error) {
            return res
                .status(400)
                .json({
                    variant: "warning",
                    msg: error.details[0].message,
                    innerData: null,
                });
        }
        const { sellerId, amount } = req.body;
        const updateSeller = await Sellers.findById(sellerId);
        await Sellers.updateOne(
            { _id: sellerId },
            {$set: { budget: updateSeller.budget - amount},}
        );
        const newExpense = await Expense.create(req.body);
        res
        .status(201)
        .json({variant: "success",msg: "Expense muvaffaqiyatli qo'shildi",innerData: newExpense,});
    } catch {
        res.status(500).json({
            variant: "error",
            msg: "server error",
            innerData: null,
        });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const {error} = validateExpense(req.body)
        if (error) {
            if (error) {
                return res.status(400).json({
                    variant: "warning",
                    msg: error.details[0].message,
                    innerData: null,
                });
            }}
        const { id } = req.params;
        const expence = await Expense.findById(id);
        res
            .status(200)
            .json({
                variant: "success",
                msg: "Expense muvaffaqiyatli yangilandi",
                innerData: expence,
            });
    } catch (error) {
        if (error.name === "CastError" && error.kind === "ObjectId") {
            res
                .status(404)
                .json({
                    variant: "warning",
                    msg: "Sotuvchi Idsi Xato",
                    innerData: null,
                });
        } else {
            res
                .status(500)
                .json({ variant: "error", msg: "server error", innerData: null });
        }
    }
};

const { Salaries, validateSalaries } = require("../model/salarySchema"),
    { dateQuery } = require("../utils/dateQuery")

exports.getSalary = async (req, res) => {
    try {
        const salaries = await Salaries.find(dateQuery(req.query)).sort({ _id: -1 })
        // await Salaries.deleteMany({})
        return res
            .status(200)
            .json({ variant: "success", msg: "Barcha oyliklar to'plami", innerData: salaries })
    }
    catch {
        res
            .status(500)
            .json({ variant: "error", msg: "server xatolik yuz berdi", innerData: null });
    }
}

exports.createSalary = async (req, res) => {
    try {
        const { error } = validateSalaries(req.body);
        if (error) {
            return res.status(400).json({
                variant: "warning",
                msg: error.details[0].message,
                innerData: null,
            });
        }
        const newSalary = await Salaries.create(req.body)
        return res
            .status(201)
            .json({ variant: "succes", msg: "Ma'lumot muvaffaqiyatli yaratildi", innerData: newSalary })
    }
    catch {
        res
            .status(500)
            .json({ variant: "error", msg: "server xatolik yuz berdi", innerData: null })
    }
}

exports.updateSalary = async (req, res) => {
    try {
        const { id } = req.params
        await Salaries.updateOne({ _id: id }, {
            $set: {
                ...req.body
            }
        })
        const updatedSalaryOne = await Salaries.find({ _id: id })
        return res
            .status(200)
            .json({ variant: "succes", msg: "Ma'lumot qayta tahrirlandi", innerData: updatedSalaryOne })
    }
    catch {
        res
            .status(500)
            .json({ variant: "error", msg: "Serverda xatolik yuz berdi", innerData: null })
    }
}


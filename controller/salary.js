const { Salaries, validateSalaries } = require("../model/salarySchema")

exports.getSalary = async (req, res) => {
    try {
        const salaries = await Salaries.find().sort({ _id: -1 })
        res
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

        res
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
        const updatedSalary = await Salaries.findByIdAndUpdate(id, req.body)

        res
            .status(200)
            .json({ variant: "succes", msg: "Ma'lumot qayta tahrirlandi", innerData: updatedSalary })
    }
    catch {
        res
            .status(500)
            .json({ variant: "error", msg: "Serverda xatolik yuz berdi", innerData: null })
    }
}

exports.deleteSalary = async (req, res) => {
    try {
        const { id } = req.params
        await Salaries.findByIdAndDelete(id, req.body)
        res
            .status(200)
            .json({ variant: "succes", msg: "Ma'lumot o'chirib yuborildi", innerData: null })
    }
    catch {
        res
            .status(500)
            .json({ variant: "error", msg: "Serverda xatolik yuz berdi", innerData: null })
    }
}
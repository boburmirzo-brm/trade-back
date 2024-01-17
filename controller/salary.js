const { Salaries, validateSalaries } = require("../model/salarySchema");
const { dateQuery } = require("../utils/dateQuery");
const { handleResponse } = require("../utils/handleResponse");

class SalaryController {
  async getAll(req, res) {
    try {
      const { count = 1, pagination = 10 } = req.query;
      const salaries = await Salaries.find(dateQuery(req.query)).sort({
        createdAt: -1,
      });
      return handleResponse(
        res,
        200,
        "success",
        "Barcha oyliklar to'plami",
        salaries
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async createNew(req, res) {
    try {
      const { error } = validateSalaries(req.body);
      if (error) {
        return res.status(400).json({
          variant: "warning",
          msg: error.details[0].message,
          innerData: null,
        });
      }
      const newSalary = await Salaries.create(req.body);
      return res.status(201).json({
        variant: "succes",
        msg: "Ma'lumot muvaffaqiyatli yaratildi",
        innerData: newSalary,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "server xatolik yuz berdi",
        innerData: null,
      });
    }
  }
  async updateById(req, res) {
    try {
      const { id } = req.params;
      const updatedSalaryOne = await Salaries.findByIdAndUpdate(
        id ,
        req.body,
        {new: true}
      );
      // const updatedSalaryOne = await Salaries.find({ _id: id });
      return res
        .status(200)
        .json({
          variant: "succes",
          msg: "Ma'lumot qayta tahrirlandi",
          innerData: updatedSalaryOne,
        });
    } catch {
      res
        .status(500)
        .json({
          variant: "error",
          msg: "Serverda xatolik yuz berdi",
          innerData: null,
        });
    }
  }
}

module.exports = new SalaryController()
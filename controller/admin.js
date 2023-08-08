const { Admins, validateAdmin } = require("../model/adminSchema");
const { dateQuery } = require("../utils/dateQuery")
const bcrypt = require("bcrypt")

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admins.find(dateQuery(req.query)).sort({ _id: -1 });
    res
      .status(200)
      .json({ variant: "success", msg: "Barcha adminlar", innerData: admins });
  } catch {
    res
      .status(500)
      .json({ variant: "error", msg: "server error", innerData: null });
  }
};

exports.getSingleAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const singleAdmin = await Admins.findOne({ _id: id })
    res
      .status(200)
      .json({
        variant: "succes", msg: "Muvaffaqiyatli ma'lumot topildi", innerData: singleAdmin
      })
  }
  catch (error) {
    res
      .status(500)
      .json({
        variant: "error", msg: "Malumotlar kirgizishda hatolik", innerData: null
      })
  }
}

exports.createAdmin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error) {
      return res.status(400).json({
        variant: "warning",
        msg: error.details[0].message,
        innerData: null,
      });
    }

    const validUsername = await Admins.findOne({ username: req.body.username });
    if (validUsername) {
      return res.status(400).json({
        variant: "error",
        msg: "Bu username allaqachon mavjud",
        innerData: null,
      });
    }
    // req.body.password = await bcrypt.hash(req.body.password, 10); // buni gaplawamiz

    const newAdmin = await Admins.create(req.body);
    res.status(201).json({
      variant: "success",
      msg: "Foydalanuvchi muvaffaqiyatli qo'shildi",
      innerData: newAdmin,
    });
  } catch {
    res.status(500).json({
      variant: "error",
      msg: "server error",
      innerData: null,
    });
  }
};


exports.signInAdmin = async (req, res) => {
  try {
    const { username, password } = req.body
    const checkUsername = await Admins.findOne({ username: username })
    const checkPassword = await Admins.findOne({ password: password })
    if (checkUsername && checkPassword) {
      return res.status(201).json({
        variable: "succes",
        msg: "Muvaffaqiyatli hisobga kirildi",
        innerData: checkUsername
      })
    }
  }
  catch {
    res.status(500).json({
      variable: "error",
      msg: "username yoki password hato kiritildi",
      innerData: null
    })
  }
}

exports.updateAdmins = async (req, res) => {
  try {
    const { id } = req.params
    const { fname, lname, phones, role, username, password } = req.body
    const checkUsername = await Admins.findOne({ username })
    if (checkUsername) {
      return res.status(500).json({
        variable: "error",
        msg: "Username oldin ishlatilgan",
        innerData: null
      })
    }
    await Admins.updateOne({ _id: id }, {
      $set: {
        fname,
        lname,
        phones,
        role,
        username,
        password
      }
    })
    const updatedAdminOne = await Admins.find({ _id: id })
    return res.status(201).json({
      variable: "succes",
      msg: "Ma'lumotlar yangilandi",
      innerData: updatedAdminOne
    })

  }
  catch {
    res.status(500).json({
      variable: "error",
      msg: "Ma'lumotlarda Xatolik",
      innerData: null
    })
  }
}

exports.isActiceAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const isActiceAdmin = await Admins.find({ _id: id })
    await Admins.updateOne({ _id: req.params.id }, {
      $set: {
        isActive: !isActiceAdmin[0].isActive
      }
    })
    res.status(201).json({
      variable: "succes",
      msg: "Muvaffaqiyatli o'zgartirildi",
      innerData: isActiceAdmin
    })
  }
  catch {
    res.status(500).json({
      variable: "error",
      msg: "Ma'lumotlarda Xatolik",
      innerData: null
    })
  }
}
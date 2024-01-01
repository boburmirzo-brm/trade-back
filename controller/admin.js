const { Admins, validateAdmin } = require("../model/adminSchema"),
  { dateQuery } = require("../utils/dateQuery"),
  bcrypt = require("bcryptjs"),
  JWT = require("jsonwebtoken")

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
    if(!singleAdmin){
      return  res
        .status(404)
        .json({
          variant: "error", msg: "Admin topilmadi", innerData: null
        })
    }
    res
      .status(200)
      .json({
        variant: "success", msg: "Muvaffaqiyatli ma'lumot topildi", innerData: singleAdmin
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
    // const checkPassword = await Admins.findOne({ password: password })
    if (checkUsername && checkUsername.password === password) {
      const TOKEN = JWT.sign({
        username, _id: checkUsername._id, isAdmin: true, isOwner: false
      }, process.env.PRIVATE_KEY)
      return res.status(201).json({
        variant: "succes",
        msg: "Muvaffaqiyatli hisobga kirildi",
        innerData: { data: checkUsername, token: TOKEN }
      })
    }
  }
  catch {
    res.status(500).json({
      variant: "error",
      msg: "username yoki password hato kiritildi",
      innerData: null
    })
  }
}

exports.updateAdmins = async (req, res) => {
  try {
    const { id } = req.params
    const { username } = req.body
    const admin = await Admins.findById(id)
    const checkUsername = await Admins.findOne({ username })
    if (checkUsername && admin) {
      if (admin.username !== checkUsername.username) {
        return res.status(500).json({
          variant: "error",
          msg: "Username oldin ishlatilgan",
          innerData: null
        })
      }
    }

    let updatedAdminOne = await Admins.findOneAndUpdate({ _id: id },
      req.body,
      {
        new:true
      }
    )
    // const updatedAdminOne = await Admins.find({ _id: id })
    return res.status(201).json({
      variant: "succes",
      msg: "Ma'lumotlar yangilandi",
      innerData: updatedAdminOne
    })

  }
  catch {
    res.status(500).json({
      variant: "error",
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
      variant: "succes",
      msg: "Muvaffaqiyatli o'zgartirildi",
      innerData: isActiceAdmin
    })
  }
  catch {
    res.status(500).json({
      variant: "error",
      msg: "Ma'lumotlarda Xatolik",
      innerData: null
    })
  }
}
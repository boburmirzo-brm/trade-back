const { Admins, validateAdmin } = require("../model/adminSchema");
const bcrypt = require("bcrypt")

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admins.find();
    res
      .status(200)
      .json({ variant: "success", msg: "all admins", innerData: admins });
  } catch {
    res
      .status(500)
      .json({ variant: "error", msg: "server error", innerData: null });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error) {
      return res.status(400).json({
        variant: "error",
        msg: error.details[0].message,
        innerData: null,
      });
    }

    const validUsername = await Admins.findOne({ username: req.body.username });
    if (validUsername) {
      return res.status(400).json({
        variant: "error",
        msg: "Username was taken",
        innerData: null,
      });
    }
    // req.body.password = await bcrypt.hash(req.body.password, 10); // buni gaplawamiz
    
    const newAdmin = await Admins.create(req.body);
    res.status(201).json({
      variant: "success",
      msg: "user is created",
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

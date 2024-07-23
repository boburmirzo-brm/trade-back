const { Admins, validateAdmin } = require("../model/adminSchema");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { handleResponse } = require("../utils/handleResponse");
const { timeZone } = require("../utils/timeZone");
require("dotenv").config();

class AdminController {
  async getAll(req, res) {
    try {
      let { isActive = true } = req.query;
      const admins = await Admins.find({ role: "admin", isActive }).select("-password").sort({
        createdAt: -1,
      });
      if (!admins.length) {
        // throw new NotFoundError("Hodimlar topilmadi")
        return handleResponse(res, 400, "warning", "Hodimlar topilmadi", null);
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha hodimlar",
        admins,
        admins.length
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getProfile(req, res) {
    try {
      const id = req.admin._id;
      const admin = await Admins.findById(id).select("-password");
      if (!admin) {
        return handleResponse(res, 400, "warning", "Hodim topilmadi", null);
      }
      handleResponse(res, 200, "success", "Hodim malumotlari", {
        user: admin,
        date: timeZone(),
      });
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async updateProfile(req, res) {
    try {
      // const { error } = validateAdmin({ ...req.body, password: "12345678" });
      // if (error) {
      //   return handleResponse(
      //     res,
      //     400,
      //     "warning",
      //     error.details[0].message,
      //     null
      //   );
      // }
      const id = req.admin._id;
      const { username } = req.body;
      const admin = await Admins.findById(id);
      const checkUsername = await Admins.findOne({ username });
      if (checkUsername && admin) {
        if (admin.username !== checkUsername.username) {
          return handleResponse(
            res,
            400,
            "warning",
            `Bu "username" allaqachon mavjud shuning boshqa "username" bering`,
            null
          );
        }
      }
      let updatedAdmin = await Admins.findByIdAndUpdate(
        id,
        {
          ...req.body,
          password: admin.password,
          updatedAt:  timeZone()
        },
        {
          new: true,
        }
      );
      // const updatedAdminOne = await Admins.find({ _id: id })
      handleResponse(
        res,
        200,
        "success",
        "Ma'lumotlar yangilandi",
        updatedAdmin
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async resetPassword(req, res) {
    try {
      const id = req.admin._id;
      const admin = await Admins.findById(id);
      if(!admin){
        return handleResponse(
          res,
          400,
          "warning",
          `Malumotlar topilmadi`,
          null
        );
      }
      const {password, newPassword} = req.body

      bcrypt.compare(password, admin.password, async function (err, retults) {
        if (retults) {
          let hashPassword = await bcrypt.hash(newPassword, 10); 
          let updatedAdmin = await Admins.findByIdAndUpdate(
            id,
            {
              password: hashPassword,
              updatedAt:  timeZone()
            },
            {
              new: true,
            }
          );
          handleResponse(res, 200, "success", "Xush kelibsiz", updatedAdmin);
        } else {
          handleResponse(
            res,
            400,
            "error",
            "Parol noto'g'ri",
            null
          );
        }
    })
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.findById(id).select("-password");
      if (!admin) {
        return handleResponse(res, 400, "warning", "Hodim topilmadi", null);
      }
      handleResponse(res, 200, "success", "Hodim malumotlari", admin);
    } catch (error) {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async signUp(req, res) {
    try {
      const { error } = validateAdmin(req.body);
      if (error) {
        return handleResponse(
          res,
          400,
          "warning",
          error.details[0].message,
          null
        );
      }

      const validUsername = await Admins.findOne({
        username: req.body.username,
      });
      if (validUsername) {
        return handleResponse(
          res,
          400,
          "warning",
          `Bu "username" allaqachon mavjud shuning boshqa "username" bering`,
          null
        );
      }
      req.body.password = await bcrypt.hash(req.body.password, 10); // buni gaplawamiz

      const newAdmin = await Admins.create({...req.body, role: "admin"});
      handleResponse(
        res,
        201,
        "success",
        "Hodim muvaffaqiyatli qo'shildi",
        newAdmin
      );
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Serverda xatolik",
        innerData: null,
      });
    }
  }
  async signIn(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admins.findOne({ username: username });
      if(!admin){
        return handleResponse(
          res,
          400,
          "error",
          "username yoki parol noto'g'ri",
          null
        );
      }
      if(!admin.isActive){
        return handleResponse(
          res,
          400,
          "error",
          "Siz tizimga kirolmaysiz",
          null
        );
      }
        bcrypt.compare(password, admin.password, function (err, retults) {
          if (retults) {
            const TOKEN = JWT.sign(
              {
                isActive: admin.isActive,
                _id: admin._id,
                role: admin.role.split("_")[0],
              },
              process.env.PRIVATE_KEY
            );
            admin.password = null
            handleResponse(res, 200, "success", "Xush kelibsiz", {
              user: admin,
              token: TOKEN,
          });
          } else {
            handleResponse(
              res,
              400,
              "error",
              "username yoki parol noto'g'ri",
              null
            );
          }
      })

      // if (admin && admin.password === password) {
      //   const TOKEN = JWT.sign(
      //     {
      //       isActive: admin.isActive,
      //       _id: admin._id,
      //       role: admin.role,
      //     },
      //     process.env.PRIVATE_KEY
      //   );
      //   handleResponse(res, 200, "success", "Xush kelibsiz", {
      //     user: admin,
      //     token: TOKEN,
      //   });
      // } else {
      //   handleResponse(
      //     res,
      //     400,
      //     "error",
      //     "username yoki parol noto'g'ri",
      //     null
      //   );
      // }
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async updateById(req, res) {
    try {
      // const { error } = validateAdmin(req.body);
      // if (error) {
      //   return handleResponse(
      //     res,
      //     400,
      //     "warning",
      //     error.details[0].message,
      //     null
      //   );
      // }
      const { id } = req.params;
      const { username } = req.body;
      const admin = await Admins.findById(id);
      const checkUsername = await Admins.findOne({ username });
      if (checkUsername && admin) {
        if (admin.username !== checkUsername.username) {
          return handleResponse(
            res,
            400,
            "warning",
            `Bu "username" allaqachon mavjud shuning boshqa "username" bering`,
            null
          );
        }
      }
      if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10); // buni gaplawamiz
      }
      let updatedAdmin = await Admins.findByIdAndUpdate(id,  {
        ...req.body,
        updatedAt:  timeZone()
      }, {
        new: true,
      });
      handleResponse(
        res,
        200,
        "success",
        "Ma'lumotlar yangilandi",
        updatedAdmin
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async isActice(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.findById(id);
      if (!admin) {
        return handleResponse(res, 400, "warning", "Hodim topilmadi", null);
      }
      let updatedAdmin = await Admins.findByIdAndUpdate(
        id,
        {
          $set: {
            isActive: !admin.isActive,
          },
        },
        {
          new: true,
        }
      );
      handleResponse(
        res,
        200,
        "success",
        `Hodim arxiv${admin.isActive ? "ga qo'shildi" : "dan chiqarildi"}`,
        updatedAdmin
      );
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.exists({ _id: id });
      if (!admin) {
        return handleResponse(res, 400, "warning", "Hodim topilmadi", null);
      }
      await Admins.findByIdAndDelete(id);
      handleResponse(
        res,
        200,
        "success",
        "Hodim muvaffaqiyatli o'chirildi",
        null
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
}

module.exports = new AdminController();

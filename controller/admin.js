const { Admins, validateAdmin } = require("../model/adminSchema");
// const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { handleResponse } = require("../utils/handleResponse");
require("dotenv").config()

class AdminController {
  async getAll(req, res) {
    try {
      const admins = await Admins.find().sort({
        createdAt: -1,
      });
      const filterOwner = admins.filter( el => el.role !== process.env.OWNER_NAME )
      if (!filterOwner.length) {
        // throw new NotFoundError("Hodimlar topilmadi")
        return handleResponse(res, 404, "warning", "Hodimlar topilmadi", null);
      }
      handleResponse(
        res,
        200,
        "success",
        "Barcha hodimlar",
        filterOwner,
        filterOwner.length
      );
    } catch {
      handleResponse(res, 500, "error", "Serverda xatolik", null);
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.findById(id);
      if (!admin) {
        return handleResponse(res, 404, "warning", "Hodim topilmadi", null);
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
      // req.body.password = await bcrypt.hash(req.body.password, 10); // buni gaplawamiz

      const newAdmin = await Admins.create(req.body);
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
      const checkAdmin = await Admins.findOne({ username: username });
      // const checkPassword = await Admins.findOne({ password: password })
      if (checkAdmin && checkAdmin.password === password) {
        const TOKEN = JWT.sign(
          {
            username,
            _id: checkAdmin._id,
            role: checkAdmin.role,
          },
          process.env.PRIVATE_KEY
        );
        handleResponse(res, 201, "success", "Xush kelibsiz", {
          user: checkAdmin,
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
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  }
  async updateById (req, res) {
    try {
      const { id } = req.params;
      const { username } = req.body;
      const admin = await Admins.findById(id);
      const checkUsername = await Admins.findOne({ username });
      if (checkUsername && admin) {
        if (admin.username !== checkUsername.username) {
          return handleResponse(res, 400, "warning", `Bu "username" allaqachon mavjud shuning boshqa "username" bering`, null);
        }
      }
  
      let updatedAdmin = await Admins.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      // const updatedAdminOne = await Admins.find({ _id: id })
      handleResponse(res, 201, "success", "Ma'lumotlar yangilandi",updatedAdmin);
    } catch {
      handleResponse(res, 500, "error", "serverda xatolik", null);
    }
  };
  async isActice (req, res){
    try {
      const { id } = req.params;
      const admin = await Admins.findById(id);
      if (!admin) {
        return handleResponse(res, 404, "warning", "Hodim topilmadi", null);
      }
      let updatedAdmin = await Admins.findByIdAndUpdate(id, {
        $set: {
          isActive: !admin.isActive,
        },
      });
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
  };
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admins.exists({_id:id});
      if (!admin) {
        return handleResponse(res, 404, "warning", "Hodim topilmadi", null);
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

module.exports = new AdminController()



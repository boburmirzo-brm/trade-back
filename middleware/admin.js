require("dotenv").config()

exports.admin = (req, res, next) => {
    if (req?.admin?.role === "admin" || req?.admin?.role === process.env.OWNER_NAME.split("_")[0]) {
        next()
    }else{
        return res.status(403).json({
            variant: "error",
            msg: "Sizning tokeningiz mos kelmadi!"
        })
    }
}
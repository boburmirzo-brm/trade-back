const JWT = require("jsonwebtoken")
const { config } = require("dotenv")

config()

exports.auth = (req, res, next) => {
    const TOKEN = req.header("Authorization")
    if (!TOKEN) {
        return res.status(401).json({
            variant: "error",
            msg: "token mavjud emas!"
        })
    }
    JWT.verify(TOKEN.split(" ")[1], process.env.PRIVATE_KEY, (err, decode) => {
        if (err) {
            return res.status(403).json({
                variant: "error",
                msg: "token kiritishda hatolik!"
            })
        } else {
            if(decode.isActive){
                req.admin = decode;
                next()
            }else{
                return res.status(401).json({
                    variant: "error",
                    msg: "Kirishga ruhsat yo'q!"
                })
            }
        }
    })
}

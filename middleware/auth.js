const JWT = require("jsonwebtoken")
const { config } = require("dotenv")

config()

export default function auth(req, res, next) {
    const TOKEN = req.header("token")
    if (!TOKEN) {
        return res.status(401).json({
            variant: "error",
            msg: "token mavjud emas!"
        })
    }
    JWT.verify(TOKEN, process.env.PRIVATE_KEY, (err, decode) => {
        if (err) {
            return res.status(403).json({
                variant: "error",
                msg: "token kiritishda hatolik!"
            })
        } else {
            req.admin = decode;
            next()
        }
    })
}
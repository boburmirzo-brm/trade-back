export default function admin(req, res, next) {
    if (!req?.admin?.isAdmin) {
        return res.status(400).json({
            variant: "succes",
            msg: "Sizning tokeningiz mos kelmadi!"
        })
    }
    next()
}
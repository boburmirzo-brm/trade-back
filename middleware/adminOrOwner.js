export default function adminOrOwner(req, res, next) {
    if (req?.admin?.isAdmin || req?.admin?.isOwner) {
        next();
    }
    else {
        return res.status(400).json({
            variant: "succes",
            msg: "Sizning tokeningiz mos kelmadi!"
        })
    }
}
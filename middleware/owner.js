require("dotenv").config()

exports.owner = (req, res, next) => {
    if (req?.admin?.role === process.env.OWNER_NAME.split("_")[0]) {
        next();
    }
    else {
        return res.status(403).json({
            variant: "succes",
            msg: "Sizning tokeningiz mos kelmadi!"
        })
    }
}

// function checkRoles(roles) {
//     return function (req, res, next) {
//         if (roles.includes(req?.admin?.role)) {
//             next();
//         }
//         else {
//             return res.status(403).json({
//                 variant: "succes",
//                 msg: "Sizning tokeningiz mos kelmadi!"
//             })
//         }
//     }
// }
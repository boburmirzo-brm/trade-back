export default function adminOrOwner(req, res, next) {
    if (req?.admin?.isAdmin || req?.admin?.isOwner) {
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
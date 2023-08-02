const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

exports.cryptPassword = ({ username, admin, password }, response) => {
    bcrypt.compare(password, admin.password, function (err, result) {
        if (result) {
            const token = JWT.sign({
                username, _id: admin._id, isOwner: false
            }, process.env.PRIVATE_KEY)
            return response.status(200).json({
                state: true,
                msg: "Succesfully signed in",
                innerData: { admin, token }
            })
        }
        else {
            response.status(400).json({
                state: false,
                msg: "password is incorrect",
                innerData: null
            })
        }
    })
}
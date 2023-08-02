const { Admins } = require("../../model/adminSchema")

exports.checkingAdmin = async (username, response) => {
    const admin = await Admins.findOne({ username })
    if (!admin) {
        return response.status(400).json({
            state: false,
            msg: "Username or Password is incorrect",
            innerData: null
        })
    }

    return admin
}
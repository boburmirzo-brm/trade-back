const { validateAdmin, Admins } = require("../../model/adminSchema")

exports.checkingError = async (req, res) => {
    const { error } = validateAdmin(req.body)
    if (error) {
        return res.status(500).json({
            state: false,
            msg: error.details[0].message,
            innerData: null
        })
    }

    const validUsername = await Admins.findOne({ username: req.body.username })
    if (validUsername) {
        return res.status(400).json({
            state: false,
            msg: "Username was taken",
            innerData: null
        })
    }
}

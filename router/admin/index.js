const express = require("express"),
    router = express.Router(),
    { Admins } = require("../../model/adminSchema"),
    { checkingError } = require("./checkingError"),
    { checkingAdmin } = require("./checkingAdmin"),
    { cryptPassword } = require("./cryptPassword"),
    bcrypt = require("bcrypt")

router.get("/", async (req, res) => {
    const admin = await Admins.find().sort({ _id: -1 })
    try {
        res.status(200).json({
            state: true,
            msg: admin.length > 0 ? "Login data was founded" : "Login server is an empty",
            innerData: admin
        })
    }
    catch {
        res.status(500).json({
            state: false,
            msg: "Something went wrong on login server",
            innerData: null
        })
    }
})



router.post("/sign-up", async (req, res) => {
    try {
        await checkingError(req, res)
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const newAdmin = await Admins.create(req.body)
        res.status(201).json({
            status: true,
            msg: "user is created",
            innerData: newAdmin
        })
    }
    catch {
        res.status(500).json({
            state: false,
            msg: "Something went wrong on server",
            innerData: null
        })
    }
})



router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await checkingAdmin(username, res)
        await cryptPassword({ username, admin, password }, res)
    }
    catch {
        res.status(500).json({
            state: false,
            msg: "Something went wrong on server",
            innerData: null
        })
    }
})

module.exports = router
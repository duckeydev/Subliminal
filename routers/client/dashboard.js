const express = require('express')
const router = express.Router()

const CheckAuth = require('../../utilities/authcheck.js')
const user = require('../../database/mongodb/schema/User.js')


router.get("/", CheckAuth, async (req, res) => {
    const UserData = await user.findOne({ token: req.session.token })
    res.render("../views/dashboard/index.ejs", { data: UserData })
})

router.get("/files", CheckAuth, async (req, res) => {
    const UserData = await user.findOne({ token: req.session.token })
    res.render("../views/dashboard/YourFiles.ejs", { data: UserData })
})

router.get("/files/upload", CheckAuth, async (req, res) => {
    const UserData = await user.findOne({ token: req.session.token })
    res.render("../views/dashboard/Upload.ejs", { data: UserData })
})

router.get("/short", CheckAuth, async (req, res) => {
    const UserData = await user.findOne({ token: req.session.token })
    res.render("../views/dashboard/short.ejs", { data: UserData })
})


router.get("/account", CheckAuth, async (req, res) => {
    const UserData = await user.findOne({ token: req.session.token })
    res.render("../views/dashboard/account.ejs", { data: UserData, encryptKEY: global.config.web.encrypt_key })
})

module.exports = router
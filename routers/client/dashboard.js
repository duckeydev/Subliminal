const express = require('express')
const router = express.Router()

const CheckAuth = require('../../utilities/authcheck.js')

router.get("/", CheckAuth, async (req, res) => {
    res.render("../views/dashboard/index.ejs")
})

module.exports = router
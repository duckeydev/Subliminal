const express = require('express')
const router = express.Router()

router.get("/", async (req, res) => {
    if (req.session) {
        res.redirect('/dashboard')
    }
    res.render("../views/index.ejs", { encryptKEY: global.config.web.encrypt_key })
})

module.exports = router
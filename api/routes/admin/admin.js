const express = require("express")
const router = express.Router()

router.get('/login', (req, res) => {
    res.render("./admin/login")
})

router.get('/signup', (req, res) => {
    res.render("./admin/signup")
})

module.exports = router
const express = require("express")
const router = express.Router()

const Admin = require("../../models/admin");

router.get('/', (req, res) => {
    res.render("./admin/login")
})

router.get('/signup', (req, res) => {
    res.render("./admin/signup")
})


router.get('/forgot-password', (req, res) => {
    res.render("./admin/forgot-password")
})

module.exports = router
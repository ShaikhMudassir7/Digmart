const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

router.get('/home',(req, res) => {
    res.render('./user/home',{user: req.session.userid})
})

module.exports = router
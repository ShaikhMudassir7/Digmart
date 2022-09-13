const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

router.get('/home',(req, res) => {
    console.log(req.session.userid)
    res.render('./user/home',{user: req.session.userid})
})

module.exports = router
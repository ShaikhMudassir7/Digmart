const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

router.get('/',(req, res) => {
    res.render('./user/home',{user: req.session.userid})
})

router.get('/shop-by-category',(req, res) => {
    res.render('./user/shop-by-category',{user: req.session.userid})
})

module.exports = router
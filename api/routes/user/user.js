const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Category = require('../../models/admin/categorySchema');

router.get('/',(req, res) => {
    Category.find().exec()
        .then(docs => {
            res.render('./user/home',{catData: docs, user: req.session.userid})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/shop-by-category',(req, res) => {
    res.render('./user/shop-by-category',{user: req.session.userid})
})

module.exports = router
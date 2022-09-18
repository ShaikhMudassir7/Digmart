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
    Category.findOne({_id: req.query.id}).exec()
    .then(docs => {
        res.render('./user/shop-by-category',{catData: docs, user: req.session.userid})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router
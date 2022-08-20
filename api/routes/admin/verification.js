const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product")

const checkAuth = require("../../middleware/admin/checkAuth")


router.get('/seller',checkAuth, (req, res) => {
    res.render("admin/verification/seller")
})

router.get('/product', (req, res) => {
    Products.find().select("images productName category subcategory sizes colours brand actualPrice discount finalPrice quantity")
        .exec()
        .then(docs => {
            res.render('./admin/verification/products/view-product', { productData: docs })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})





module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product");

// const checkAuth = require("../../middleware/seller/checkAuth")


// Route of product page
router.get('/product/(:id)',(req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                res.render('./user/product', { productData: doc, userType: req.session.type, userName: req.session.name })
            } else {
                res.send('try-again')
            }

        })  
})

module.exports = router
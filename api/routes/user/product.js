const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product");

// Route of product page
router.get('/viewProduct/(:id)', (req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                res.render('./user/product', { productData: doc })
            } else {
                res.send('try-again')
            }

        })
})

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/user/sellerProfile");

// Route of product page
router.get('/viewSeller/(:id)', (req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                res.render('./user/seller-profile', { productData: doc })
            } else {
                res.send('try-again')
            }
        })
})

module.exports = router
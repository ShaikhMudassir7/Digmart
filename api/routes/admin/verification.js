const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product")
const Seller = require('../../models/seller/seller');

const checkAuth = require("../../middleware/admin/checkAuth")


router.get('/product',checkAuth, (req, res) => {
    Products.find().select("sellerID images productName category subcategory sizes colours brand actualPrice discount finalPrice quantity status")
        .exec()
        .then(docs => {
            res.render('./admin/verification/products/products', { productsData: docs, userType: req.session.type })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/viewProduct/(:id)', (req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
        if (!err) {
            res.render('./admin/verification/products/viewProduct', { productData: doc , userType: req.session.type})
        } else {
            res.send('try-again')
        }
        
    })
})



router.get('/seller', (req, res) => {
    Seller.find().select("pFname pLname pMobile pEmail busName busEmail busAddress")
        .exec()
        .then(docs => {
            res.render('./admin/verification/seller', { sellersData: docs, userType: req.session.type })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})



module.exports = router
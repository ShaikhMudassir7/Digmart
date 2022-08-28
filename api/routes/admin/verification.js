const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product")
const Seller = require('../../models/seller/seller');

const checkAuth = require("../../middleware/admin/checkAuth")


router.get('/product',checkAuth, (req, res) => {
    Products.find({
        status : "Pending",
    }).select("sellerID images productName category subcategory sizes colours brand actualPrice discount finalPrice quantity status")
        .exec()
        .then(docs => {
            res.render('./admin/verification/products/products', { productsData: docs, userType: req.session.type , userName : req.session.name })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/viewProduct/(:id)', checkAuth, (req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
        if (!err) {
            res.render('./admin/verification/products/viewProduct', { productData: doc , userType: req.session.type , userName : req.session.name})
        } else {
            res.send('try-again')
        }
        
    })
})

router.get('/seller', checkAuth , (req, res) => {
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

router.get('/accept-product/(:id)', checkAuth, (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Verified",
    }
    Products.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
                    res.redirect('/admin/verification/product')
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

router.post('/reject-product/(:id)', checkAuth , (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Rejected : " +req.body.rejectText
    }
    Products.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
                    res.redirect('/admin/verification/product')
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})


module.exports = router
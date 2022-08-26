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
            res.render('./admin/verification/products/products', { productsData: docs, userType: req.session.type })
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
            res.render('./admin/verification/products/viewProduct', { productData: doc , userType: req.session.type})
        } else {
            res.send('try-again')
        }
        
    })
})

router.get('/accept-product/(:id)', (req, res) => {
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

router.post('/reject-product/(:id)', (req, res) => {
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

router.get('/seller',checkAuth, (req, res) => {
    Seller.find({
        status : "Pending",
    }).select("status pFname pLname pMobile pEmail busName busEmail busAddress")
        .exec()
        .then(docs => {
            res.render('./admin/verification/seller/seller', { sellersData: docs, userType: req.session.type })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.get('/viewSeller/(:id)', checkAuth, (req, res) => {
    Seller.findById(req.params.id,
        (err, doc) => {
        if (!err) {
            res.render('./admin/verification/seller/viewSeller', { sellerData: doc , userType: req.session.type})
        } else {
            res.send('try-again')
        }
        
    })
})

router.get('/accept-seller/(:id)', (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Verified",
    }
    Seller.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
                    res.redirect('/admin/verification/seller')
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

router.post('/reject-seller/(:id)', (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Rejected : " +req.body.rejectText
    }
    Seller.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
                    res.redirect('/admin/verification/seller')
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

module.exports = router
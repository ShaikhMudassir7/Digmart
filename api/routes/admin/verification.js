const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product")
const Seller = require('../../models/seller/seller');
const Variants = require('../../models/seller/variants');
const checkAuth = require("../../middleware/admin/checkAuth")


router.get('/product', checkAuth, (req, res) => {
    Products.find({
        status: "Pending",
    }).select("sellerID images productName category subcategory sizes colours brand actualPrice discount finalPrice quantity status")
        .exec()
        .then(docs => {
            res.render('./admin/verification/products/products', { productsData: docs, userType: req.session.type, userName: req.session.name })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/viewProduct/(:id)/', checkAuth, (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    Products.findById(id,
        (err, element) => {
            if (!err) {
                Variants.find({ 'prodID': id }).exec()
                .then(docs => {
                        if (!err) {
                            res.render('./admin/verification/products/viewProduct', { images: allImages, variantsData: docs, productData: element,  userType: req.session.type, userName: req.session.name});
                        }
                    })
            } else {
                res.send('try-again')
            }

        })
})

router.get('/viewproductStatus/(:id)', checkAuth, (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    Products.findById(id,
        (err, element) => {
            if (!err) {
                Variants.find({ 'prodID': id }).exec()
                .then(docs => {
                        if (!err) {
                            res.render('./admin/verification/products/viewproductStatus', { images: allImages, variantsData: docs, productData: element,  userType: req.session.type, userName: req.session.name});
                        }
                    })
            } else {
                res.send('try-again')
            }

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

router.post('/reject-product/(:id)', (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Rejected : " + req.body.rejectText
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

router.get('/seller', checkAuth, (req, res) => {
    Seller.find({
        status: "Pending",
    }).select("status pFname pLname pMobile pEmail busName busEmail busGstNo busAddress")
        .exec()
        .then(docs => {
            res.render('./admin/verification/seller/seller', { sellersData: docs, userType: req.session.type, userName: req.session.name })
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
                res.render('./admin/verification/seller/viewSeller', { sellerData: doc, userType: req.session.type, userName: req.session.name })
            } else {
                res.send('try-again')
            }

        })
})

router.post('/reject-seller/(:id)', (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Rejected : " + req.body.rejectText
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

router.get('/productStatus', checkAuth, (req, res) => {
    var status = req.query.status
    if (status == "Rejected") {
        Products.find({ $nor: [{ status: "Pending" }, { status: "Verified" } , { status: "Incomplete" }] })
            .exec()
            .then(docs => {
                res.render('./admin/verification/products/productStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else {
        if (!status) {
            Products.find({$nor: [{ status: "Incomplete" }]})
                .exec()
                .then(docs => {
                    res.render('./admin/verification/products/productStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        }
        else {
            Products.find({ status: status, })
                .exec()
                .then(docs => {
                    res.render('./admin/verification/products/productStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        }

    }
})

router.get('/sellerStatus', checkAuth, (req, res) => {
    var status = req.query.status
    if (status == "Rejected") {
        Seller.find({ $nor: [{ status: "Pending" }, { status: "Verified" },  { status: "Authentication" }] })
            .select("status pFname pLname pMobile pEmail busName busEmail busGstNo busAddress")
            .exec()
            .then(docs => {
                res.render('./admin/verification/seller/sellerStatus', { sellersData: docs, userType: req.session.type, userName: req.session.name })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else {
        if (!status) {
            Seller.find()
                .select("status pFname pLname pMobile pEmail busName busEmail busGstNo busAddress")
                .exec()
                .then(docs => {
                    res.render('./admin/verification/seller/sellerStatus', { sellersData: docs, userType: req.session.type, userName: req.session.name })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        }
        else {
            Seller.find({ status: status, })
            .select("status pFname pLname pMobile pEmail busName busEmail busGstNo busAddress")
            .exec()
            .then(docs => {
                res.render('./admin/verification/seller/sellerStatus', { sellersData: docs, userType: req.session.type, userName: req.session.name })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        }

    }
})

router.get('/viewsellerStatus/(:id)', checkAuth, (req, res) => {
    Seller.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                res.render('./admin/verification/seller/viewsellerStatus', { sellerData: doc, userType: req.session.type, userName: req.session.name })
            } else {
                res.send('try-again')
            }

        })
})

module.exports = router
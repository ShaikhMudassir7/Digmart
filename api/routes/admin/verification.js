const express = require("express")
const router = express.Router()

const Products = require("../../models/seller/product")
const Seller = require('../../models/seller/seller');
const Variants = require('../../models/seller/variants');
const checkAuth = require("../../middleware/admin/checkAuth")
const Gallery = require('../../models/seller/gallery');


router.get('/product', checkAuth, async (req, res) => {
    prodID = [];
    await Variants.find({
        status: "Pending",
    }).then(docs => {
        docs.forEach(data => {
            prodID.push(data.prodID);
        })
    })
    await Products.find({
        $or: [{ _id: { $in: prodID } }, { status: "Pending" }]
    }).then(docs => {
        res.render('./admin/verification/products/products', { productsData: docs, userType: req.session.type, userName: req.session.name })
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
                            res.render('./admin/verification/products/viewProduct', { images: allImages, variantsData: docs, productData: element, userType: req.session.type, userName: req.session.name });
                        }
                    })
            } else {
                res.send('try-again')
            }

        })
})

router.get('/viewproductStatus/(:id)/(:status)', checkAuth, (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    var status = req.params.status;
    if (status == "Verified") {
        Products.findById(id,
            (err, element) => {
                if (!err) {
                    Variants.find({ 'prodID': id, status: "Verified" })
                        .then(docs => {
                            if (!err) {
                                res.render('./admin/verification/products/viewproductStatus', { images: allImages, variantsData: docs, productData: element, userType: req.session.type, userName: req.session.name });
                            }
                        })
                } else {
                    res.send('try-again')
                }

            })
    }
    else if (status == "Total") {
        Products.findById(id,
            (err, element) => {
                if (!err) {
                    Variants.find({ 'prodID': id })
                        .then(docs => {
                            if (!err) {
                                res.render('./admin/verification/products/viewproductStatus', { images: allImages, variantsData: docs, productData: element, userType: req.session.type, userName: req.session.name });
                            }
                        })
                } else {
                    res.send('try-again')
                }

            })
    }
    else {
        Products.findById(id,
            (err, element) => {
                if (!err) {
                    Variants.find({ 'prodID': id, $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }] })
                        .then(docs => {
                            if (!err) {
                                res.render('./admin/verification/products/viewproductStatus', { images: allImages, variantsData: docs, productData: element, userType: req.session.type, userName: req.session.name });
                            }
                        })
                } else {
                    res.send('try-again')
                }

            })
    }
})

router.get('/accept-product/(:id)', checkAuth, (req, res) => {
    const id = req.params.id
    var newValues = {
        status: "Verified",
    }
    Products.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
            res.send("Verified")
        })
})

router.post('/reject-product', async (req, res) => {
    const id = req.body.productID
    var newValues = {
        status: req.body.status
    }
    await Variants.updateMany({ 'prodID': id }, { $set: newValues })
    await Products.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
            res.send('Rejected')
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

router.post('/verify-variant', (req, res) => {
    var newValues = {
        status: req.body.status,
    }
    Variants.updateOne({ _id: req.body.variantID }, { $set: newValues })
        .exec()
        .then(result => {
            res.send("Success")
        })
})

router.post('/check-variant', (req, res) => {
    var count = 0
    Variants.find({ 'prodID': req.body.productID }).then(docs => {
        docs.forEach(data => {
            if (data.status == "Pending") {
                count = 1;
            }
        })
        if (count == 0) {
            res.json({ status: true });
        }
        else {
            res.json({ status: false });
        }
    })
})

router.get('/productStatus', checkAuth, async (req, res) => {
    var status = req.query.status
    if (status == "Rejected") {
        rejectprodID = [];
        await Variants.find({
            $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }]
        }).then(docs => {
            docs.forEach(data => {
                rejectprodID.push(data.prodID);
            })
        })
        await Products.find({
            $or: [{ _id: { $in: rejectprodID } }, { $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }] }]
        }).then(docs => {
            res.render('./admin/verification/products/rejectedproductStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
        })
    } else {
        if (!status) {
            Products.find({ $nor: [{ status: "Incomplete" }] })
                .exec()
                .then(docs => {
                    res.render('./admin/verification/products/totalproductStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
                })
        }
        else {
            Products.find({ status: status, })
                .exec()
                .then(docs => {
                    res.render('./admin/verification/products/productStatus', { productsData: docs, userType: req.session.type, userName: req.session.name })
                })
        }
    }
})

router.get('/sellerStatus', checkAuth, (req, res) => {
    var status = req.query.status
    if (status == "Rejected") {
        Seller.find({ $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Authentication" }] })
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

router.get('/gallery', checkAuth, async (req, res) => {
    var galDocs = await Gallery.find({ images: { $elemMatch: { status: 'Pending' } } })
    res.render('./admin/verification/gallery', { galDocs: galDocs, userType: req.session.type, userName: req.session.name })
})

router.post('/gallery-status', checkAuth, async (req, res) => {
    var query = {}
    query['images.' + req.body.index + '.status'] = req.body.val
    await Gallery.findOneAndUpdate({ sellerID: req.body.sellerID }, { $set: query })
    res.json({ status: req.body.val })
})

module.exports = router
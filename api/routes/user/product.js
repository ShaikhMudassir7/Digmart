const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Variants = require('../../models/seller/variants');
const Products = require("../../models/seller/product");

// Route of product page
router.get('/view-product/(:id)', (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    Products.findById(id,
        (err, element) => {
            if (!err) {
                Variants.find({ prodID: id }).exec()
                    .then(docs => {
                        console.log(docs[0])
                        if (!err) {
                            res.render('./user/product', { images: allImages, variantData: docs[0], variantsData: docs, productData: element });
                        }
                    })
            } else {
                res.send('try-again')
            }

        })
})

router.get('/variant/(:id)/(:colours)', (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    var docsize
    var vd;
    Products.findById(id,
        async (err, element) => {
            if (!err) {
                await Variants.find({ prodID: id })
                    .then(docs => {
                        vd = docs;
                    })
                await Variants.findOne({ prodID: id, colours: req.params.colours })
                    .then(doc => {
                        res.render('./user/product', { images: allImages, variantData: doc, variantsData: vd, productData: element });
                    })
            } else {
                res.send('try-again')
            }

        })
})



module.exports = router
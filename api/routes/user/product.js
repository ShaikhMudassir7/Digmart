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
                Variants.find({ 'prodID': id }).exec()
                .then(docs => {
                        if (!err) {
                            res.render('./user/product', { images: allImages, variantsData: docs, productData: element});
                        }
                    })
            } else {
                res.send('try-again')
            }

        })
})


module.exports = router
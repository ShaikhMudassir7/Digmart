const express = require("express")
const router = express.Router()

const Variants = require('../../models/seller/variants');
const Products = require("../../models/seller/product");

// Route of product page
router.get('/view-product/(:id)', async (req, res) => {
    const allImages = await Variants.find().select("images")
    var slugid = req.params.id;
    var element = await Products.findOne({ slugID: slugid })
    var docs = await Variants.find({ prodID: element._id })
    res.render('./user/product', { images: allImages, variantData: docs[0], variantsData: docs, productData: element, user: req.session.userID });
})

router.get('/variant/(:variantslugID)', async (req, res) => {
    var varelement = await Variants.findOne({ slugID: req.params.variantslugID });
    const allImages = await Variants.find().select("images")
    var vd;
    var element = await Products.findOne({ _id: varelement.prodID })
    var vd = await Variants.find({ prodID: varelement.prodID })
    res.render('./user/product', { images: allImages, variantData: varelement, variantsData: vd, productData: element, user: req.session.userID });
})

router.get('/findsize/(:id)/(:size)', async (req, res) => {
    var id = req.params.id;
    var doc = await Variants.findOne({ _id: id })
    for (let i = 0; i < doc.sizes.length; i++) {
        if (doc.sizes[i].sizes == req.params.size) {
            res.send(doc.sizes[i])
        }
    }
})

module.exports = router
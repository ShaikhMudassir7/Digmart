const express = require("express")
const router = express.Router()

const Variants = require('../../models/seller/variants');
const Products = require("../../models/seller/product");

// Route of product page
router.get('/view-product/(:id)', (req, res) => {
    const allImages = Variants.find().select("images")
    var slugid = req.params.id;
    Products.findOne({ slugID: slugid }).then(element => {
        Variants.find({ prodID: element._id }).exec()
            .then(docs => {
                res.render('./user/product', { images: allImages, variantData: docs[0], variantsData: docs, productData: element, user: req.session.userID });
            })
    })
})

router.get('/variant/(:variantslugID)', async (req, res) => {
    var varelement = await Variants.findOne({ slugID: req.params.variantslugID });
    const allImages = Variants.find().select("images")
    var vd;
    await Products.findOne({ _id: varelement.prodID }).then(element => {
        Variants.find({ prodID: varelement.prodID })
            .then(docs => {
                vd = docs;
                res.render('./user/product', { images: allImages, variantData: varelement, variantsData: vd, productData: element, user: req.session.userID });
            })
    })
})

router.get('/findsize/(:id)/(:size)', (req, res) => {
    var id = req.params.id;
    Variants.findOne({ _id: id })
        .then(doc => {
            for (let i = 0; i < doc.sizes.length; i++) {
                if (doc.sizes[i].sizes == req.params.size) {
                    res.send(doc.sizes[i])
                    break;
                }
            }

        })
})

module.exports = router
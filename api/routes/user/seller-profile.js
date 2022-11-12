const express = require("express");
const router = express.Router();
require("firebase/storage");

const Category = require('../../models/admin/categorySchema')
const Seller = require("../../models/seller/seller");
const SellerGall = require("../../models/seller/gallery");
const Products = require('../../models/seller/product')
const Variants = require('../../models/seller/variants')

const SellerProfileViews = require('../../models/user/views/sellerProfileView')

router.get("/(:sellerslugID)", async(req, res, next) => {
    var id = req.params.sellerslugID;
    const seller = await Seller.findOne({ slugID: id }).exec();
    const images = await SellerGall.findOne({ sellerID: seller._id }).select("images");

    if (req.session.userID) {
        const profileView = new SellerProfileViews({
            userID: req.session.userID,
            sellerID: seller._id,
            timestamp: new Date()
        })
        await profileView.save()
    }

    var varDocs = []
    var filteredCatData = []
    var catDocs = await Category.find()
    var proDocs = await Products.find({ sellerID: seller._id, status: 'Verified' })

    const uniqueCatDocs = [...new Set(proDocs.map(item => item.category))];

    catDocs.forEach(function(cat) {
        if (uniqueCatDocs.includes(cat.catName)) {
            filteredCatData.push(cat)
        }
    })

    for (let i = 0; i < proDocs.length; i++) {
        if (proDocs[i].hasVariant) {
            var doc = await Variants.find({ prodID: proDocs[i]._id })
            varDocs.push(doc[0])
        }
    }

    res.render("./user/seller-profile", {
        galleryData: images,
        sellerID: id,
        sellerData: seller,
        catData: filteredCatData,
        user: req.session.userID,
        proDocs: proDocs,
        varDocs: varDocs,
    });
});
module.exports = router;
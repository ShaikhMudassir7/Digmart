const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("firebase/storage");

const Category = require('../../models/admin/categorySchema')
const Seller = require("../../models/seller/seller");
const SellerGall = require("../../models/seller/gallery");
const Products = require('../../models/seller/product')
const Variants = require('../../models/seller/variants')

// Route of product page
router.get("/(:sellerslugID)", async(req, res, next) => {
    var id = req.params.sellerslugID;
    const element = await Seller.findOne({ slugId: id});
    const images = await SellerGall.findOne({ sellerID: element._id }).select("images");
    var varDocs = []
    var catDocs = await Category.find()
    var proDocs = await Products.find({ sellerID: element._id, status: 'Verified' })
    for (let i = 0; i < proDocs.length; i++) {
        if (proDocs[i].hasVariant) {
            var doc = await Variants.find({ prodID: proDocs[i]._id })
            varDocs.push(doc[0])
        }
    }
    SellerGall.find({ sellerID: element._id })
        .select()
        .exec()
        .then((docs) => {
            res.render("./user/seller-profile", {
                galleryData: images,
                sellerID: id,
                sellerData: element,
                catData: catDocs,
                user: req.session.userID,
                proDocs: proDocs,
                varDocs: varDocs
            });
        })
});
module.exports = router;
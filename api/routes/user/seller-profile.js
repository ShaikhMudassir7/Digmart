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
router.get("/(:sellerID)", async(req, res, next) => {
    var id = req.params.sellerID;
    const images = await SellerGall.findOne({ sellerID: id }).select("images");
    var varDocs = []
    var catDocs = await Category.find()
    const element = await Seller.findById(id);
    var proDocs = await Products.find({ sellerID: id, status: 'Verified' })
    for (let i = 0; i < proDocs.length; i++) {
        if (proDocs[i].hasVariant) {
            var doc = await Variants.find({ prodID: proDocs[i]._id })
            varDocs.push(doc[0])
        }
    }
    SellerGall.find({ sellerID: id })
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
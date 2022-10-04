const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("firebase/storage");

const Seller = require("../../models/seller/seller");
const SellerGall = require("../../models/seller/gallery");

// Route of product page
router.get("/(:sellerID)", async (req, res, next) => {
  var id = req.params.sellerID;
  const images = await SellerGall.findOne({sellerID:id}).select("images");
  
  const element = await Seller.findById(id);


  SellerGall.find({sellerID:id})
    .select()
    .exec()
    .then((docs) => {
      res.render("./user/seller-profile", {
        galleryData: images,
        sellerID: id,
        sellerData: element,
        user: req.session.userid,
      });
    })
});
module.exports = router;

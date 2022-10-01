const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("firebase/storage");

const Seller = require("../../models/seller/seller");
const SellerGall = require("../../models/seller/gallery");

// Route of product page
router.get("/(:galleryID)", async (req, res, next) => {
  
  var galleryID = req.params.galleryID;
  const doc = await SellerGall.findById(galleryID);
  var id = doc.sellerID;
  const element = await Seller.findById(id);

  
  SellerGall.find({ sellerID: id })
    .select()
    .exec()
    .then((docs) => {
      console.log("sellerID"+ id);
      res.render("./user/seller-profile", {
        galleryData: doc,
        sellerID: id,
        sellerData: element,
        user: req.session.userid,
      });
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;

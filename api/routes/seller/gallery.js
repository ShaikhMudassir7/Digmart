const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("firebase/storage");

const Gallery = require("../../models/seller/gallery");
const Seller = require("../../models/seller/seller");

const checkAuth = require("../../middleware/seller/checkAuth");
const firebase = require("../../utils/firebase");
const storage = firebase.storage().ref();
const store = multer.memoryStorage();
var upload = multer({ storage: store });

var imgUpload = upload.fields([{ name: "images", maxCount: 10 }]);

router.get("/", checkAuth, async (req, res) => {
  var galDocs = await Gallery.findOne({ sellerID: req.session.sellerID })
  res.render("./seller/gallery/gallery", { galDocs: galDocs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname });
});

router.post("/upload-img", [checkAuth, imgUpload], async (req, res) => {
  var seller = await Seller.findById(req.session.sellerID).select('busName')
  var rawSS = req.files.images;
  var imageArr = [];
  if (rawSS) {
    for (let i = 0; i < rawSS.length; i++) {
      const imageRef = storage.child("/gallery/" + (seller.busName + '-' + Date.now() + '-' + rawSS[i].originalname));
      await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype });
      var url = await imageRef.getDownloadURL();

      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${day}-${month}-${year}`

      imageArr.push({
        url: url,
        date: currentDate
      });
    }
  }
  await Gallery.findOneAndUpdate({ sellerID: req.session.sellerID }, { $push: { "images": imageArr } }, { upsert: true })
  res.redirect("/seller/gallery");
});

router.get("/delete-img/(:index)", checkAuth, async (req, res) => {
  var gallery = await Gallery.findOne({ sellerID: req.session.sellerID });
  var imagePath = gallery.images[req.params.index].url.split("?");
  var fileRef = firebase.storage().refFromURL(imagePath[0]);
  fileRef.delete();
  gallery.images.splice(req.params.index, 1)
  await Gallery.updateOne({ sellerID: req.session.sellerID }, { $set: { images: gallery.images } })
  res.redirect("/seller/gallery");
});

router.get("/delete-gallery", checkAuth, async (req, res) => {
  var gallery =  await Gallery.findOneAndDelete({ sellerID: req.session.sellerID });
  for (let i = 0; i < gallery.images.length; i++) {
    var imagePath = gallery.images[i].url.split("?");
    var fileRef = firebase.storage().refFromURL(imagePath[0]);
    await fileRef.delete();
  }
  res.redirect("/seller/gallery");
});

module.exports = router;
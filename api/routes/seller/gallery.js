const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");
require("firebase/storage");

const SellerGall = require('../../models/seller/gallery');
const Seller = require('../../models/seller/seller');

const checkAuth = require("../../middleware/seller/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();

const store = multer.memoryStorage();
var upload = multer({ storage: store });

var imgUpload = upload.fields([{ name: 'images', maxCount: 5 }])

router.get('/:id', checkAuth, (req, res) => {
    var id = req.params.id;
    Seller.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                SellerGall.find({ 'sellerID': id }).select("images")
                    .exec()
                    .then(docs => {
                        res.render('./seller/gallery/gallery', {galleryData: docs, id: id, sellerData: doc, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
                        // .exec() 
                    })
                    .catch(err => {
                        console.log("Error: "+err)
                        res.status(500).json({
                            error: err
                        })
                    })
            } else {
                res.send('try-again')
            }
        })
});

router.get('/add-gallery/:id', checkAuth, (req, res) => {
    var sellerID = req.params.id;

    Seller.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                SellerGall.find({ 'sellerID': sellerID }).select()
                    .exec()
                    .then(docs => {
                        res.render("./seller/gallery/add-gallery", { sellerData: doc, id: sellerID, galleryData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
                    })
            } else {
                res.send('try-again')
            }
        })
});

router.post('/add-gallery/:id', imgUpload, async (req, res, next) => {
    var sellerID = req.params.id;
    try {
        var rawSS = req.files.images;
        var imageArr = [];
        if (rawSS) {
            for (let i = 0; i < rawSS.length; i++) {
                const imageRef = storage.child("/gallery/" + (rawSS[i].fieldname + '-' + Date.now() + rawSS[i].originalname));
                await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype })
                var url = await imageRef.getDownloadURL()
                imageArr.push(url)
            }
        }
       
        var galleryData = new SellerGall({
            _id: mongoose.Types.ObjectId(),
            sellerID: sellerID,
            images: imageArr,
        })
        await galleryData.save();
        res.redirect('/seller/gallery/' + req.session.sellerID);
    } catch (err) {
        console.log('error'+err);
    }
});

router.get("/edit-gallery/(:id)/(:galleryID)", checkAuth, (req, res) => {
    const allImages = SellerGall.find().select("images")
    var id = req.params.id;
    var galleryID = req.params.galleryID;

    Seller.findById(id,
        (err, element) => {
            if (!err) {
                SellerGall.findById(galleryID,
                    (err, doc) => {
                        if (!err) {
                            SellerGall.find({ 'sellerID': id }).select()
                                .exec()
                                .then(docs => {
                                    res.render('./seller/gallery/edit-gallery', { images: allImages, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname });
                                })
                        }
                    })
            } else {
                res.send('try-again')
            }
        })
});

router.post("/edit-gallery/(:id)/(:galleryID)", imgUpload, async (req, res) => {
    var sellerID = req.params.id;
    var galleryID = req.params.galleryID;


    try {
        var gallery = await SellerGall.findById(galleryID).exec()
        for (let i = 0; i < gallery.images.length; i++) {
            imageArr.push(gallery.images[i])
        }

        var rawSS = req.files.images;
        if (rawSS) {
            for (let i = 0; i < rawSS.length; i++) {
                const imageRef = storage.child("/gallery/" + (rawSS[i].fieldname + '-' + Date.now() + rawSS[i].originalname));
                await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype })
                var url = await imageRef.getDownloadURL()
                imageArr.push(url)
            }
        }

        SellerGall.findByIdAndUpdate({ _id: galleryID }, {
            $set: {
                images: imageArr,
            }
        })
            .exec()
            .then(result => {
                console.log(result)
                res.redirect('/seller/gallery/' + sellerID);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })

    } catch (err) {
        console.log("Error Occurred while Editting gallery" + err);
    }
});

router.get("/delete-gallery/(:id)/(:galleryID)", async (req, res, next) => {
    var sellerID = req.params.id;
    const id = req.params.galleryID;

    var gallery = await SellerGall.findByIdAndRemove(id).exec()

    for (let i = 0; i < gallery.images.length; i++) {

        var imagePath = gallery.images[i].split("?")
        var fileRef = firebase.storage().refFromURL(imagePath[0]);
        var del = await fileRef.delete()

    }
    res.redirect('/seller/gallery/' + sellerID);
Gallery
});

router.get("/delete-image/(:id)/(:galleryID)/(:a)", async (req, res, next) => {
    const index = req.params.a

    var gallery = await SellerGall.findById(req.params.galleryID).exec()

    var imagePath = gallery.images[index].split("?")
    var fileRef = firebase.storage().refFromURL(imagePath[0]);
    var del = fileRef.delete();

    gallery.images.splice(index, 1)

    SellerGall.findByIdAndUpdate({ _id: req.params.galleryID }, {
        $set: {
            images: gallery.images
        }
    })
        .exec()
        .then(result => {
            res.redirect("/seller/gallery/edit-gallery/" + req.params.id + "/" + req.params.galleryID);
        })
});

module.exports = router

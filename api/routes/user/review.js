const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const multer = require("multer");

const ProfileInfo = require("../../models/user/personal_information");
const Review = require('../../models/user/reviews');

const firebase = require("../../utils/firebase");
const storage = firebase.storage().ref();
const store = multer.memoryStorage();
var upload = multer({ storage: store });

var imgUpload = upload.fields([{ name: "images", maxCount: 4 }]);

router.post('/', [imgUpload] , async (req, res) => {
    var rawSS = req.files.images;
    var imageArr = [];
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`
    if (rawSS) {
        for (let i = 0; i < rawSS.length; i++) {
            const imageRef = storage.child("/reviews/" + ("Hatim Mullajiwala" + '-' + Date.now() + '-' + rawSS[i].originalname));
            await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype });
            var url = await imageRef.getDownloadURL();
            imageArr.push(url)
        }
        var reviewdata = new Review({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            images: imageArr,
            rating: req.body.rating,
            date: currentDate,
            reviewText: req.body.reviewText
        })

        await reviewdata.save()
        res.json({ status: true });
    }
    else {
        var reviewdata = new Review({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            rating: req.body.rating,
            date: currentDate,
            reviewText: req.body.reviewText
        })

        await reviewdata.save()
        res.json({ status: true });
    }

})


module.exports = router
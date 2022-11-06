const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const ProfileInfo = require("../../models/user/personal_information");
const Review = require('../../models/user/reviews');

router.post('/', async (req, res) => {
    var reviewdata = new Review({
        _id: mongoose.Types.ObjectId(),
        userID: req.session.userID,
        sellerID: req.body.sellerID,
        productID: req.body.productID,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
    })
    await reviewdata.save()
    res.json({ status: true });
   })


module.exports = router
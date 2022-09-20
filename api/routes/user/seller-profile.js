const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const SellerGall = require('../../models/user/sellerProfile');
const Sellers = require("../../models/seller/seller");

router.get('/view-seller/(:id)', (req, res) => {
    const allImages = SellerGall.find().select("images")
    var id = req.params.id;
    Sellers.findById(id,
        (err, element) => {
            if (!err) {
                SellerGall.find({ sellerID: id }).exec()
                    .then(docs => {
                        console.log(docs[0])
                        if (!err) {
                            res.render('./user/seller-profile', { images: allImages, sellerGallData: docs[0], sellerGallsData: docs, sellerData: element });
                        }
                    })
            } else {
                res.send('try-again')
            }
        })
})

module.exports = router
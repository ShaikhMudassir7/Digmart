const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Cart = require('../../models/user/cart');
const Address = require("../../models/user/address");
const Seller = require("../../models/seller/seller");

router.get('/', async (req, res) => {
    var docs = await Address.find().select().exec()
    res.render('./user/checkout', {addressData : docs})
})

router.post('/checkout', async (req, res, next) => {
    console.log("Posting Data")
    try {
        var addressData = new Address({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName[0],
            lastName: req.body.lastName[0],
            email: req.body.email[0],
            address: req.body.address[0],
            country: req.body.country[0],
            city: req.body.city[0],
            pinCode: req.body.pinCode[0],
            mobileNumber: req.body.mobileNumber[0],
            orderNotes: req.body.orderNotes[0]
        })
        await addressData.save();
        res.redirect('/checkout')
    } catch (err) {
        console.log("Error Occurred while adding address to Database. "+err);
    }
})

router.get("/edit-address/(:addressID)", async (req, res) => {
    var id = req.params.addressID;
    const doc = await Address.findById(id)
    res.send(doc) ;
});

router.post("/edit-address/(:addressID)", async (req, res) => {
    var id = req.params.addressID;

    Address.findByIdAndUpdate({ _id: id }, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            pinCode: req.body.pinCode,
            mobileNumber: req.body.mobileNumber,
            orderNotes: req.body.orderNotes
        }
    })
        .exec()
        .then(result => {
            res.send('True');
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.get("/delete-address/(:addressID)", async (req, res, next) => {
    var id = req.params.addressID;
    var variant = await Address.findByIdAndRemove(id).exec()
    res.redirect('/checkout');
});

module.exports = router
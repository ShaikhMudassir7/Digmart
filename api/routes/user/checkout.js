const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Cart = require('../../models/user/cart');
const Address = require("../../models/user/address");
const Seller = require("../../models/seller/seller");
const Products = require("../../models/seller/product");


router.get('/', async (req, res) => {
    var docs = await Address.find().select().exec()
    var doc = await Cart.find({ userID: req.session.userid }).populate('sellerID productID variantID').exec();
    var i = 0;
    var totalMRP = 0;
    var finalPrice = 0;
    var couponDiscount = 10;
    var deliveryFee = "₹ 99"

    for(i in doc){
        if(doc[i].variantID){
            totalMRP += parseInt(doc[i].variantID.sizes[0]["actualPrice"]) * parseInt(doc[i].quantity)
            finalPrice += parseInt(doc[i].variantID.sizes[0]["finalPrice"]) * parseInt(doc[i].quantity)
        }
        else{
            totalMRP += parseInt(doc[i].productID.actualPrice) * parseInt(doc[i].quantity)
            finalPrice += parseInt(doc[i].productID.finalPrice) * parseInt(doc[i].quantity)
        }
    }
    var discountOnMRP = totalMRP - finalPrice
    finalPrice -= couponDiscount
    if(finalPrice > 499){
        deliveryFee = "FREE"
    }
    if(deliveryFee != "FREE"){
        finalPrice += 99
    }
    res.render('./user/checkout', {addressData: docs, cartData: doc, totalMRP: totalMRP, discountOnMRP: discountOnMRP, couponDiscount: couponDiscount, deliveryFee: deliveryFee, finalPrice: finalPrice, user : req.session.userid })
})

router.post('/checkout', async (req, res, next) => {
    try {
        var addressData = new Address({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName[0],
            lastName: req.body.lastName[0],
            email: req.body.email[0],
            address: req.body.address[0],
            state: req.body.state[0],
            city: req.body.city[0],
            pinCode: req.body.pinCode[0],
            mobileNumber: req.body.mobileNumber[0]
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

router.post("/edit-address/(:addressID)", (req, res) => {
    var id = req.params.addressID;
    Address.findByIdAndUpdate({ _id: id }, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pinCode: req.body.pinCode,
            mobileNumber: req.body.mobileNumber
        }
    })
        .exec()
        .then(result => {
            res.send('Updated Address');
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
    await Address.findByIdAndRemove(id).exec()
    res.redirect('/checkout');
});

module.exports = router
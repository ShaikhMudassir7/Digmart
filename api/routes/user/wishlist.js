const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Wishlist = require('../../models/user/wishlist');
const Seller = require("../../models/seller/seller")

router.get('/view-wishlist/(:userID)',  async (req, res) => {
    var seller;
    var sellerdoc;
    await Wishlist.find({ userID: req.params.userID }).distinct('sellerID').then(doc => {
        sellerdoc = doc
    })

    await Seller.find({ _id: { $in: sellerdoc } }).then(rdoc => {
        seller = rdoc;
        console.log(seller);
    });
     await Wishlist.find({ userID: req.params.userID }).populate('sellerID productID').exec(function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            res.render('user/wishlist', {seller: seller, wishlistData: docs })
        }
    });
})

router.get('/add-to-wishlist/(:id)/(:sellerID)', (req, res) => {
    // var cartdata = new Cart({
    //     _id: mongoose.Types.ObjectId(),
    //     userID: "",
    //     sellerID: req.params.sellerID,
    //     productID: req.params.productID,
    //     colour: req.params.colour,
    //     qauntity: 1
    // })
    var wishlistdata = new Wishlist({
        _id: mongoose.Types.ObjectId(),
        userID: "mudassir",
        sellerID: req.params.sellerID,
        productID: req.params.id,
        colour: "red",
        size: "10",
    })
    
    wishlistdata.save().then(result => {
        res.redirect('/wishlist/view-wishlist/mudassir')
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/delete-wishlist/(:wishlistID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.wishlistID, (err, doc) => {
        if (!err) {
            res.redirect('/wishlist/view-wishlist/hatim')
        }
        else {
            res.status(500).send(err)
        }
    })
})


module.exports = router
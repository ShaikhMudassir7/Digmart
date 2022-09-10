const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Cart = require('../../models/user/cart');

router.get('/view-cart/(:userID)',  async (req, res) => {
    var subtotal = 0;
    var seller;
    await Cart.find({ userID: req.params.userID }).distinct('sellerID').exec(function (err, doc) {
        if (err) {
            console.log(err)
        } else{
            seller=doc;
            console.log(doc);
        }
    });
     await Cart.find({ userID: req.params.userID }).populate('sellerID productID').exec(function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < docs.length; i++) {
                subtotal = subtotal + (Number(docs[i].productID.finalPrice) * (Number(docs[i].quantity)));
            }
            res.render('user/cart', {seller: seller, cartData: docs, subTotal: subtotal.toFixed(2), Total: (subtotal).toFixed(2) })
        }
    });
})

router.get('/add-to-cart/(:id)/(:sellerID)', (req, res) => {
    // var cartdata = new Cart({
    //     _id: mongoose.Types.ObjectId(),
    //     userID: "",
    //     sellerID: req.params.sellerID,
    //     productID: req.params.productID,
    //     colour: req.params.colour,
    //     qauntity: 1
    // })
    var cartdata = new Cart({
        _id: mongoose.Types.ObjectId(),
        userID: "mudassir",
        sellerID: req.params.sellerID,
        productID: req.params.id,
        colour: "red",
        size: "10",
        quantity: "1"
    })
    
    cartdata.save().then(result => {
        res.redirect('/cart/view-cart/mudassir')
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/delete-cart/(:cartID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.cartID, (err, doc) => {
        if (!err) {
            res.redirect('/cart/view-cart/hatim')
        }
        else {
            res.status(500).send(err)
        }
    })
})

router.get('/edit-cart/(:id)/(:qty)', (req, res) => {
    Cart.find({
        _id: req.params.id
    })
        .exec()
        .then(docs => {
            var cartdata = new Cart({
                quantity: req.params.qty,
            })
            Cart.updateOne({ _id: req.params.id }, { $set: cartdata })
                .exec()
                .then(result => {
                    res.redirect('/cart/view-cart/hatim')
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router
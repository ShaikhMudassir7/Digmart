const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Cart = require('../../models/user/cart');
const Seller = require("../../models/seller/seller");

router.get('/(:userID)', async (req, res) => {
    var subtotal = 0;
    var seller;
    var sellerdoc;
    var size = [];
    await Cart.find({ userID: req.params.userID }).distinct('sellerID').then(doc => {
        sellerdoc = doc
    })

    await Seller.find({ _id: { $in: sellerdoc } }).then(rdoc => {
        seller = rdoc;
    });

    await Cart.find({ userID: req.params.userID }).populate('sellerID productID variantID').exec(function (err, docs) {
        if (err) {
        } else {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].variantID) {
                    for (let j = 0; j < docs[i].variantID.sizes.length; j++) {
                        if (docs[i].variantID.sizes[j].sizes == docs[i].size) {
                            subtotal = subtotal + (Number(docs[i].variantID.sizes[j].finalPrice) * (Number(docs[i].quantity)));
                            size.push(j);
                        }
                    }
                }
                else{
                    subtotal = subtotal + (Number(docs[i].productID.finalPrice) * (Number(docs[i].quantity)));
                            size.push(0);
                }
            }
            res.render('user/cart', { seller: seller, cartData: docs, subTotal: subtotal.toFixed(2), Total: (subtotal).toFixed(2), size: size, user: req.session.userid })
        }
    });
})

router.get('/add-to-cart/(:id)/(:sellerID)/(:variantID)/(:colours)/(:sizes)', (req, res) => {
    var cartdata = new Cart({
        _id: mongoose.Types.ObjectId(),
        userID: req.session.userid,
        sellerID: req.params.sellerID,
        variantID: req.params.variantID,
        productID: req.params.id,
        colour: req.params.colours,
        size: req.params.sizes,
        quantity: "1"
    })

    cartdata.save().then(result => {
        res.redirect('/cart/' + req.session.userid)
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/add-to-cart/(:id)/(:sellerID)', (req, res) => {
    var cartdata = new Cart({
        _id: mongoose.Types.ObjectId(),
        userID: req.session.userid,
        sellerID: req.params.sellerID,
        productID: req.params.id,
        quantity: "1"
    })

    cartdata.save().then(result => {
        res.redirect('/cart/' + req.session.userid)
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/delete-cart/(:cartID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.cartID, (err, doc) => {
        if (!err) {
            res.redirect('/cart/' + req.session.userid)
        }
        else {
            res.status(500).send(err)
        }
    })
})

router.get('/edit-cart/(:id)/(:qty)', (req, res) => {
    console.log(req.params.qty)
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
                    res.redirect('/cart/' + req.session.userid)
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
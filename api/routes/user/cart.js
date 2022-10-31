const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Cart = require('../../models/user/cart');
const Seller = require("../../models/seller/seller");

const checkAuth = require("../../middleware/user/checkAuth")

router.get('/', checkAuth, async(req, res) => {
    var subtotal = 0;
    var size = [];
    var sellerdoc = await Cart.find({ userID: req.session.userID }).distinct('sellerID')
    var seller = await Seller.find({ _id: { $in: sellerdoc } })

    await Cart.find({ userID: req.session.userID }).populate('sellerID productID variantID').exec(function(err, docs) {
        if (err) {} else {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].variantID) {
                    for (let j = 0; j < docs[i].variantID.sizes.length; j++) {
                        if (docs[i].variantID.sizes[j].sizes == docs[i].size) {
                            subtotal = subtotal + (Number(docs[i].variantID.sizes[j].finalPrice) * (Number(docs[i].quantity)));
                            size.push(j);
                        }
                    }
                } else {
                    subtotal = subtotal + (Number(docs[i].productID.finalPrice) * (Number(docs[i].quantity)));
                    size.push(0);
                }
            }
            res.render('user/cart', { seller: seller, cartData: docs, subTotal: subtotal.toFixed(2), Total: (subtotal).toFixed(2), size: size, user: req.session.userID })
        }
    });
})

router.post('/add-to-cart', async(req, res) => {
    var status = true;
    if (req.body.variantID) {
        var cartdata = new Cart({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            variantID: req.body.variantID,
            productID: req.body.productID,
            colour: req.body.colour,
            size: req.body.size,
            quantity: "1"
        })

        await Cart.find({ variantID: req.body.variantID, userID: req.session.userID, size: req.body.size }).then(doc => {
            if (doc.length != 0) {
                status = false;
                res.json({ status: status });
            }
        })
    } else {
        var cartdata = new Cart({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            quantity: "1"
        })
        await Cart.find({ productID: req.body.productID, userID: req.session.userID }).then(doc => {
            if (doc.length != 0) {
                status = false;
                res.json({ status: status });
            }
        })
    }
    if (status) {
        await cartdata.save().then(result => {
            res.json({ status: true });
        })
    }

})

router.get('/delete-cart/(:cartID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.cartID, (err, doc) => {
        if (!err) {
            res.redirect('/cart')
        } else {
            res.status(500).send(err)
        }
    })
})

router.post('/edit-cart', (req, res) => {
    Cart.find({
        _id: req.body.id
    }).then(docs => {
        var cartdata = new Cart({
            quantity: req.body.qty,
        })
        Cart.updateOne({ _id: req.body.id }, { $set: cartdata })
            .then(result => {
                res.send("Done");
            })
    })
})

module.exports = router
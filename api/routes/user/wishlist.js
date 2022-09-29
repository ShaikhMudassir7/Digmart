const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Wishlist = require('../../models/user/wishlist');
const Seller = require("../../models/seller/seller")
const Products = require("../../models/seller/product")
const Variants = require('../../models/seller/variants');

router.get('/(:userID)', async (req, res) => {
    var seller;
    var sellerdoc;
    var size = [];
    await Wishlist.find({ userID: req.params.userID }).distinct('sellerID').then(doc => {
        sellerdoc = doc
    })

    await Seller.find({ _id: { $in: sellerdoc } }).then(rdoc => {
        seller = rdoc;
    });
    await Wishlist.find({ userID: req.params.userID }).populate('sellerID productID variantID').exec(function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].variantID) {
                    for (let j = 0; j < docs[i].variantID.sizes.length; j++) {
                        if (docs[i].variantID.sizes[j].sizes == docs[i].size) {
                            size.push(j);
                        }
                    }
                }
                else {
                    size.push(0);
                }
            }
            res.render('user/wishlist', { seller: seller, wishlistData: docs, size: size, user: req.session.userid })
        }
    });
})

router.post('/add-to-wishlist', async (req, res) => {
    const newValues = {
        wishlisted: true,
    }
    if (req.body.variantID) {
        var wishlistdata = new Wishlist({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userid,
            sellerID: req.body.sellerID,
            variantID: req.body.variantID,
            productID: req.body.productID,
            size: req.body.size,
        })
        await Variants.updateOne(
            { _id: req.body.variantID, "sizes.sizes": req.body.size },
            { $set: { "sizes.$.wishlisted": true } }
        )
    }
    else {
        var wishlistdata = new Wishlist({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userid,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
        })
        await Products.updateOne({ _id: req.body.productID }, { $set: newValues })
    }

    await wishlistdata.save().then(result => {
        res.json({ status: true });
    })
})

router.post('/add-product', async (req, res) => {
    if (req.body.variantID)
        var wishDocs = await Wishlist.find({
            userID: req.body.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            variantID: req.body.variantID,
            size: req.body.size
        })
    else
        var wishDocs = await Wishlist.find({
            userID: req.body.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
        })
    if (wishDocs.length == 0) {
        if (req.body.variantID)
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.body.userID,
                sellerID: req.body.sellerID,
                productID: req.body.productID,
                variantID: req.body.variantID,
                size: req.body.size,
            })
        else
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.body.userID,
                sellerID: req.body.sellerID,
                productID: req.body.productID,
            })
        await wishlistdata.save()
    }
    res.json({ status: true });
})

router.post('/remove-product', async (req, res) => {
    if (req.body.variantID) {
        await Wishlist.deleteOne({
            userID: req.body.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            variantID: req.body.variantID,
            size: req.body.size,
        })
    } else {
        await Wishlist.deleteOne({ userID: req.body.userID, sellerID: req.body.sellerID, productID: req.body.productID })
    }
    res.json({ status: true });
})

router.get('/delete-wishlist/(:wishlistID)/(:variantID)', async (req, res) => {
    const newValues = {
        wishlisted: false,
    }
    await Wishlist.findByIdAndRemove(req.params.wishlistID)
    if (req.params.variantID) {
        await Variants.updateOne(
            { _id: req.body.variantID, "sizes.sizes": req.body.size },
            { $set: { "sizes.$.wishlisted": false } }
        )
    }
    else {
        await Products.updateOne({ _id: req.body.productID }, { $set: newValues })
    }
})

module.exports = router
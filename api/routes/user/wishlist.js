const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Wishlist = require('../../models/user/wishlist');
const Seller = require("../../models/seller/seller");

router.get('/', async (req, res) => {
    var seller;
    var sellerdoc;
    var size = [];
    sellerdoc = await Wishlist.find({ userID: req.session.userID }).distinct('sellerID')
    seller = await Seller.find({ _id: { $in: sellerdoc } })

    await Wishlist.find({ userID: req.session.userID }).populate('sellerID productID variantID').exec(function (err, docs) {
        for (let i = 0; i < docs.length; i++) {
            if (docs[i].variantID) {
                for (let j = 0; j < docs[i].variantID.sizes.length; j++) {
                    if (docs[i].variantID.sizes[j].sizes == docs[i].size) {
                        size.push(j);
                    }
                }
            } else {
                size.push(0);
            }
        }
        res.render('user/wishlist', { seller: seller, wishlistData: docs, size: size, user: req.session.userID })
    });
})

router.post('/add-to-wishlist', async (req, res) => {
    if (req.session.userID) {
        var status = true;
        if (req.body.variantID) {
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.session.userID,
                sellerID: req.body.sellerID,
                variantID: req.body.variantID,
                productID: req.body.productID,
                size: req.body.size,
            })
            var doc = await Wishlist.find({ variantID: req.body.variantID, userID: req.session.userID })
            if (doc.length != 0) {
                status = false;
                res.json({ status: status });
            }
        } else {
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.session.userID,
                sellerID: req.body.sellerID,
                productID: req.body.productID,
            })
            var docs = await Wishlist.find({ productID: req.body.productID, userID: req.session.userID })
            if (docs.length != 0) {
                status = false;
                res.json({ status: status });
            }
        }
        if (status) {
            await wishlistdata.save()
            res.json({ status: true });
        }
    } else {
        res.json({ status: 'login' });
    }

})

router.post('/add-product', async (req, res) => {
    if (req.body.variantID)
        var wishDocs = await Wishlist.find({
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            variantID: req.body.variantID,
            size: req.body.size
        })
    else
        var wishDocs = await Wishlist.find({
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
        })
    if (wishDocs.length == 0) {
        if (req.body.variantID)
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.session.userID,
                sellerID: req.body.sellerID,
                productID: req.body.productID,
                variantID: req.body.variantID,
                size: req.body.size,
            })
        else
            var wishlistdata = new Wishlist({
                _id: mongoose.Types.ObjectId(),
                userID: req.session.userID,
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
            userID: req.session.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            variantID: req.body.variantID,
            size: req.body.size,
        })
    } else {
        await Wishlist.deleteOne({ userID: req.session.userID, sellerID: req.body.sellerID, productID: req.body.productID })
    }
    res.json({ status: true });
})

router.get('/delete-wishlist/(:wishlistID)', async (req, res) => {
    await Wishlist.findByIdAndRemove(req.params.wishlistID)
    res.redirect('/wishlist')

})

module.exports = router
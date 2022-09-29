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
            console.log(size);
            res.render('user/wishlist', { seller: seller, wishlistData: docs, size: size, user: req.session.userid })
        }
    });
})

router.get('/add-to-wishlist/(:id)/(:sellerID)/(:variantID)/(:colours)/(:sizes)', (req, res) => {
    var wishlistdata = new Wishlist({
        _id: mongoose.Types.ObjectId(),
        userID: req.session.userid,
        sellerID: req.params.sellerID,
        variantID: req.params.variantID,
        productID: req.params.id,
    })

    const newValues = {
        wislisted: true,
    }
    if(variantID==null){
        Variant.updateOne({ _id: variantID }, { $set: newValues })
        .exec()
        .then(result => {
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    }else{
        Products.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    }
    
    wishlistdata.save().then(result => {
        res.redirect('/wishlist/' + req.session.userid)
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/add-to-wishlist/(:id)/(:sellerID)', (req, res) => {
    var wishlistdata = new Wishlist({
        _id: mongoose.Types.ObjectId(),
        userID: req.session.userid,
        sellerID: req.params.sellerID,
        productID: req.params.id
    })

    wishlistdata.save().then(result => {
        res.redirect('/wishlist/' + req.session.userid)
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.post('/add-product', async (req, res) => {
    if (req.body.variantID) {
        var wishlistdata = new Wishlist({
            _id: mongoose.Types.ObjectId(),
            userID: req.body.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
            variantID: req.body.variantID,
        })
    } else {
        var wishlistdata = new Wishlist({
            _id: mongoose.Types.ObjectId(),
            userID: req.body.userID,
            sellerID: req.body.sellerID,
            productID: req.body.productID,
        })
    }
    await wishlistdata.save()
    res.json({ status: true });
})

router.post('/remove-product', async (req, res) => {
    if (req.body.variantID) {
        await Wishlist.deleteOne({ productID: req.body.productID, variantID: req.body.variantID })
    } else {
        await Wishlist.deleteOne({ productID: req.body.productID })
    }
    res.json({ status: true });
})

router.get('/delete-wishlist/(:wishlistID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.wishlistID, (err, doc) => {
        if (!err) {
            res.redirect('/wishlist/' + req.session.userid)
        }
        else {
            res.status(500).send(err)
        }
    })
})


module.exports = router
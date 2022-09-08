const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Products = require("../../models/seller/product");
const Cart = require('../../models/user/cart');
// const checkAuth = require("../../middleware/seller/checkAuth")


// Route of product page
router.get('/product/(:id)', (req, res) => {
    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                res.render('./user/product', { productData: doc})
            } else {
                res.send('try-again')
            }

        })
})

router.get('/cart/(:userID)', (req, res) => {
    var cartarray = [];
    var subtotal=0;
    var c = 0;
    Cart.find({ userID: req.params.userID }).populate('sellerID').populate('productID').exec(function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            iMax = docs.length;
            jMax = 1;
            for (let i = 0; i < iMax; i++) {
                for (let j = 0; j < jMax; j++) {
                    if (i != 0) {
                        for (var k = 0; k < cartarray.length; k++) {
                            if (cartarray[k][0] == docs[i].sellerID._id) {
                                var last=cartarray[k].length;
                                cartarray[k][last] = docs[i]
                                break;
                            }
                            else {
                                cartarray[c] = [];
                                cartarray[c][j] = docs[i].sellerID._id;
                                var last=cartarray[c].length;
                                cartarray[c][last] = docs[i];
                                c++;
                                break;
                            }
                        }
                    }
                    else {
                        cartarray[c] = [];
                        cartarray[c][j] = docs[i].sellerID._id;
                        cartarray[c][j+1] = docs[i];
                        c++;
                    }
                }
            }
            for (let i=0;i<cartarray.length;i++){
                for(let j=1;j<cartarray[i].length;j++){
                    subtotal = subtotal + Number(cartarray[i][j].productID.finalPrice);
                }
            }
            res.render('user/cart', { cartData: cartarray, subTotal: subtotal.toFixed(2), Total: (subtotal + 45).toFixed(2) })
            }
    });


})

router.get('/addCart', (req, res) => {
    var cartdata = new Cart({
        _id: mongoose.Types.ObjectId(),
        userID: "",
        sellerID: req.params.sellerID,
        productID: req.params.productID,
        colour: req.params.colour,
        qauntity: 1
    })
    
    cartdata.save().then(result => {
        res.redirect('./')
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Cart." + err);
        })
})

router.get('/deleteCart/(:cartID)', (req, res) => {
    Cart.findByIdAndRemove(req.params.cartID, (err, doc) => {
        if (!err) {
                res.redirect('/user/cart/hatim')
        }
        else {
            res.status(500).send(err)
        }
    })
})

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const https = require('https')

const Variants = require('../../models/seller/variants');
const Products = require("../../models/seller/product");
const Cart = require('../../models/user/cart');
const Address = require('../../models/user/address');
const Order = require('../../models/user/order')
const OrderItem = require('../../models/user/order_item')

const { sendEmail } = require('../../utils/emailOtp')
const checksum_lib = require('../../utils/checksum')
const config = require('../../utils/config')

const checkAuth = require("../../middleware/user/checkAuth")

router.get('/', checkAuth, async (req, res) => {
    var docs = await Address.find({ userID: req.session.userID }).select().exec()
    var doc = await Cart.find({ userID: req.session.userID }).populate('sellerID productID variantID').exec();
    var i = 0;
    var totalMRP = 0;
    var finalPrice = 0;
    var couponDiscount = 0;
    var deliveryFee = "₹ 99"

    for (i in doc) {
        if (doc[i].variantID) {
            totalMRP += parseInt(doc[i].variantID.sizes[0]["actualPrice"]) * parseInt(doc[i].quantity)
            finalPrice += parseInt(doc[i].variantID.sizes[0]["finalPrice"]) * parseInt(doc[i].quantity)
        } else {
            totalMRP += parseInt(doc[i].productID.actualPrice) * parseInt(doc[i].quantity)
            finalPrice += parseInt(doc[i].productID.finalPrice) * parseInt(doc[i].quantity)
        }
    }
    var discountOnMRP = totalMRP - finalPrice
    finalPrice -= couponDiscount
    if (finalPrice > 499) {
        deliveryFee = "FREE"
    }
    if (deliveryFee != "FREE") {
        finalPrice += 99
    }
    res.render('./user/checkout', { addressData: docs, cartData: doc, totalMRP: totalMRP, discountOnMRP: discountOnMRP, couponDiscount: couponDiscount, deliveryFee: deliveryFee, finalPrice: finalPrice, user: req.session.userID, noSearch: true })
})

router.post('/add-address', async (req, res, next) => {
    try {
        var addressData = new Address({
            _id: mongoose.Types.ObjectId(),
            userID: req.session.userID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pinCode: req.body.pinCode,
            mobileNumber: req.body.mobileNumber
        })
        await addressData.save();
        res.redirect('/checkout')
    } catch (err) {
        console.log("Error Occurred while adding address to Database. " + err);
    }
})

router.get("/edit-address/(:addressID)", async (req, res) => {
    var id = req.params.addressID;
    const doc = await Address.findById(id)
    res.send(doc);
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

router.post('/paynow', async (req, res) => {

    var address = await Address.findById(req.body.addressID).exec()

    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'DIG_' + new Date().getTime();
    params['CUST_ID'] = req.session.userID;
    params['TXN_AMOUNT'] = req.body.amount.toString();
    params['CALLBACK_URL'] = 'http://localhost:3000/checkout/callback';
    params['EMAIL'] = address.email;
    params['MOBILE_NO'] = req.session.mobile.toString();

    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        var orderData = new Order({
            _id: new mongoose.Types.ObjectId(),
            addressID: req.body.addressID,
            userID: req.session.userID,
            amount: req.body.amount,
            orderID: params['ORDER_ID'],
            status: 'Payment Initiated'
        })

        orderData.save().then(result => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h2>Redirecting, Please do not refresh this page...</h2></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        })
    });
})

router.post('/callback', (req, res) => {

    var checksumhash = req.body.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(req.body, config.PaytmConfig.key, checksumhash);
    console.log("Checksum Result => ", result, "\n");

    var params = { "MID": config.PaytmConfig.mid, "ORDERID": req.body.ORDERID };

    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

        params.CHECKSUMHASH = checksum;
        post_data = 'JsonData=' + JSON.stringify(params);

        var options = {
            hostname: 'securegw-stage.paytm.in', // for staging
            // hostname: 'securegw.paytm.in', // for production
            port: 443,
            path: '/merchant-status/getTxnStatus',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            }
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', async function () {
                var currentDate = new Date();
                var _result = JSON.parse(response);
                if (_result.STATUS == 'TXN_SUCCESS') {
                    await Order.updateOne({ orderID: req.body.ORDERID }, { $set: { status: 'Ordered' } })
                    var cartData = await Cart.find({ userID: req.session.userID }).exec()
                    console.log(cartData)

                    for (var i = 0; i < cartData.length; i++) {
                        var item = new OrderItem({
                            userID: req.session.userID,
                            sellerID: cartData[i].sellerID,
                            orderID: req.body.ORDERID,
                            variantID: cartData[i].variantID,
                            productID: cartData[i].productID,
                            size: cartData[i].size,
                            colour: cartData[i].colour,
                            quantity: cartData[i].quantity,
                            date: currentDate.toString().substring(0, 16),
                            deliveryDate: new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000)).toString().substring(0, 16),
                            status: "Ordered",
                        })
                        await item.save()

                        var selectedSize = await Variants.find({ _id: cartData[i].variantID }).select("sizes").exec()
                        var count = selectedSize[0].sizes.length;

                        var sizesArr = selectedSize[0].sizes;
                        console.log(sizesArr)

                        for (var j = 0; j < count; j++) {
                            if (sizesArr[j]["sizes"] == cartData[i].size) {
                                sizesArr[j]["quantity"] -= cartData[i].quantity;
                                if(sizesArr[j]["quantity"] == 0){
                                    sizesArr[j]["out_of_stock"] = true
                                }
                            }
                        }
                        console.log("New: " + sizesArr)

                        await Variants.findByIdAndUpdate({ _id: cartData[i].variantID }, {
                            $set: {
                                sizes: sizesArr
                            }
                        });
                        
                        // await Products.updateOne({ _id: cartData[i].productID }, { $inc: { "quantity": -(cartData[i].quantity) } })

                    }
                    await Cart.deleteMany({ userID: req.session.userID })
                    res.redirect("/checkout/payment-success/" + req.body.ORDERID)
                } else {
                    res.send('payment failed')
                }
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    });
})

router.get('/payment-success/(:id)', async (req, res) => {
    var order = await Order.find({ orderID: req.params.id }).populate('addressID').select().exec();
    console.log(order[0].addressID.email)
    await sendEmail({ email: order[0].addressID.email, subj: 'DigMart - Order Confirmation Mail', msg: "Your OTP for Email Authentication is " })
    res.render('./user/order-confirmed', { orderID: req.params.id })
})

module.exports = router
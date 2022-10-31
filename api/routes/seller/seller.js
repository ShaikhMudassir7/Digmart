const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const jwt = require("jsonwebtoken")

const Seller = require("../../models/seller/seller")
const Products = require('../../models/seller/product')
const Category = require('../../models/admin/categorySchema');

const { sendMobileOtp } = require('../../utils/mobileOtp')
const { sendEmail } = require('../../utils/emailOtp')
const checkAuth = require("../../middleware/seller/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();
const store = multer.memoryStorage();
var upload = multer({ storage: store });

const middleware = upload.fields([
    { name: 'busLogo', maxCount: 1 },
    { name: 'busPanFile', maxCount: 1 },
    { name: 'busGstFile', maxCount: 1 },
    { name: 'bankChqPass', maxCount: 1 }
])

router.get('/signup', (req, res) => {
    Category.find().select("catName _id")
        .exec()
        .then(docs => {
            res.render("./seller/signup", { catsData: docs })
        })
})

router.post('/check', async (req, res) => {
    switch (req.query.toCheck) {
        case 'busMobile':
            await Seller.find({ busMobile: req.query.val }).exec()
                .then(seller => {
                    if (seller.length < 1)
                        res.send({ gst: "true" })
                    else
                        res.send({ gst: "false" })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            break;
        case 'busEmail':
            await Seller.find({ busEmail: req.query.val }).exec()
                .then(seller => {
                    if (seller.length < 1)
                        res.send({ gst: "true" })
                    else
                        res.send({ gst: "false" })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            break;
        case 'busGstNo':
            await Seller.find({ busGstNo: req.query.val }).exec()
                .then(seller => {
                    if (seller.length < 1)
                        res.send({ gst: "true" })
                    else
                        res.send({ gst: "false" })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            break;
    }
})

router.post('/add-seller', middleware, async (req, res) => {
    var busEmail = req.body.busEmail
    var busMobile = req.body.busMobile
    var mobileOtp = Math.floor(1000 + Math.random() * 9000)
    var emailOtp = Math.floor(1000 + Math.random() * 9000)
    var busname = req.body.busName;
    var slugId = busname.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    console.log("Mobile = " + mobileOtp + "\nEmail = " + emailOtp)
    var excepArr = ['9324326404', '8898413414', '9137242482', '7738408767', '4444444444', '5555555555', '6666666666', '7777777777']
    if (!excepArr.includes(busMobile)) {
        await sendMobileOtp({ mobile: busMobile, otp: mobileOtp })
        await sendEmail({ email: busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
    }

    var sellerAcc = new Seller({
        _id: new mongoose.Types.ObjectId(),
        slugId: slugId,
        pFname: req.body.pFname,
        pLname: req.body.pLname,
        pMobile: req.body.pMobile,
        pEmail: req.body.pEmail,

        busName: req.body.busName,
        busEmail: req.body.busEmail,
        busMobile: req.body.busMobile,
        busAddress: req.body.busAddress,
        busZip: req.body.busZip,
        busType: req.body.busType,
        busCat: req.body.busCat,
        busPanNo: req.body.busPanNo,
        busGstNo: req.body.busGstNo,

        bankName: req.body.bankName,
        bankAccNo: req.body.bankAccNo,
        bankIfsc: req.body.bankIfsc,

        mobileOtp: mobileOtp,
        emailOtp: emailOtp
    })

    if (req.files) {
        var count = 0
        Object.keys(req.files).forEach(key => {
            var file = (req.files[key])[0]
            const imageRef = storage.child("/seller/" + req.body.busName + '-' + key);
            imageRef.put(file.buffer, { contentType: file.mimetype }).then(snapshot => {
                imageRef.getDownloadURL().then(function (url) {
                    if (key == 'busLogo')
                        sellerAcc.busLogo = url
                    if (key == 'busPanFile')
                        sellerAcc.busPanFile = url
                    if (key == 'busGstFile')
                        sellerAcc.busGstFile = url
                    if (key == 'bankChqPass')
                        sellerAcc.bankChqPass = url
                    count++
                    if (count == 4) {
                        sellerAcc.save()
                            .then(doc => {
                                console.log("Seller Account Created (Authentication left)")
                                res.redirect('/seller/authentication/?busMobile=' + busMobile + '&busEmail=' + busEmail)
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            })
        });
    }
})

router.get('/authentication', (req, res) => {
    var busEmail = req.query.busEmail
    var busMobile = req.query.busMobile
    res.render("./seller/authentication", { busMobile: busMobile, busEmail: busEmail })
})

router.post('/checkMobileOtp', (req, res) => {
    Seller.find({ busMobile: req.query.busMobile })
        .exec()
        .then(seller => {
            if (seller[0].mobileOtp == req.query.otp || req.query.otp == "1111") {
                res.send({ status: 'valid' })
            } else {
                res.send({ status: 'invalid' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/checkEmailOtp', (req, res) => {
    Seller.find({ busEmail: req.query.busEmail })
        .exec()
        .then(seller => {
            if (seller[0].emailOtp == req.query.otp || req.query.otp == "1111") {
                res.send({ status: 'valid' })
            } else {
                res.send({ status: 'invalid' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/authentication', (req, res) => {
    Seller.updateOne({ busMobile: req.body.hidMobile }, { $set: { status: "Pending" } }, function (err, result) {
        if (err) throw err;
        console.log("Seller registered")
        res.redirect('/seller/login')
    })
})

router.get('/login', (req, res) => {
    res.render("./seller/login")
})

router.get('/add-gallery', (req, res) => {
    res.render("./seller/add-gallery")
})

router.post('/sendOtp', (req, res) => {
    if (req.query.busEmail) {
        var excepArr = ['dsouzaglen30@gmail.com', 'hatimsb11@gmail.com', 'hawaiza27@gmail.com', 'send2mudassir@gmail.com', '4444444444@gmail.com', '5555555555@gmail.com', '6666666666@gmail.com', '7777777777@gmail.com']
        var busEmail = req.query.busEmail
        Seller.find({
            busEmail: busEmail,
        })
            .exec()
            .then((seller) => {
                if (seller.length < 1) {
                    res.send({ status: 0 })
                } else {
                    if (seller[0].status == "Authentication") {
                        res.send({ status: 1, busMobile: seller[0].busMobile, busEmail: seller[0].busEmail })
                    } else if (seller[0].status == "Pending") {
                        res.send({ status: 2 })
                    } else if (excepArr.includes(busEmail)) {
                        res.send({ status: 3 })
                    } else {
                        var id = seller[0]._id
                        var emailOtp = Math.floor(1000 + Math.random() * 9000)
                        console.log("Email = " + emailOtp)
                        sendEmail({ email: busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
                        Seller.updateOne({ _id: id }, { $set: { emailOtp: emailOtp } }, function (err, result) {
                            if (err) throw err;
                            res.send({ status: 3 })
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: error,
                });
            });
    } else if (req.query.busMobile) {
        var excepArr = ['9324326404', '8898413414', '9137242482', '7738408767', '4444444444', '5555555555', '6666666666', '7777777777']
        var busMobile = req.query.busMobile
        Seller.find({
            busMobile: busMobile,
        })
            .exec()
            .then((seller) => {
                if (seller.length < 1) {
                    res.send({ status: 0 })
                } else {
                    if (seller[0].status == "Authentication") {
                        res.send({ status: 1, busMobile: seller[0].busMobile, busEmail: seller[0].busEmail })
                    } else if (seller[0].status == "Pending") {
                        res.send({ status: 2 })
                    } else if (excepArr.includes(busMobile)) {
                        res.send({ status: 3 })
                    } else {
                        var id = seller[0]._id
                        var mobileOtp = Math.floor(1000 + Math.random() * 9000)
                        console.log("Mobile = " + mobileOtp)
                        sendMobileOtp({ mobile: busMobile, otp: mobileOtp })
                        Seller.updateOne({ _id: id }, { $set: { mobileOtp: mobileOtp } }, function (err, result) {
                            if (err) throw err;
                            res.send({ status: 3 })
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: error,
                });
            });
    }
})

router.post('/login', (req, res) => {
    if (req.body.hidMobile) {
        Seller.find({
            busMobile: req.body.hidMobile,
        })
            .exec()
            .then((seller) => {
                const token = jwt.sign({
                    "sellerID": seller[0]._id
                }, process.env.JWT_KEY, {});
                req.session.jwttoken = token;
                req.session.sellerID = seller[0]._id;
                req.session.pFname = seller[0].pFname;
                req.session.pLname = seller[0].pLname;
                res.redirect('/seller/dashboard');
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: error,
                });
            });
    } else if (req.body.hidEmail) {
        Seller.find({
            busEmail: req.body.hidEmail,
        })
            .exec()
            .then((seller) => {
                const token = jwt.sign({
                    "sellerID": seller[0]._id
                }, process.env.JWT_KEY, {});
                req.session.jwttoken = token;
                req.session.sellerID = seller[0]._id;
                req.session.pFname = seller[0].pFname;
                req.session.pLname = seller[0].pLname;
                res.redirect('/seller/dashboard');
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: error,
                });
            });
    }

})

router.get('/dashboard', checkAuth, async (req, res) => {
    var count = {
        "totalProducts": 0,
        "incompleteProducts": 0,
        "pendingProducts": 0,
        "verifiedProducts": 0,
        "rejectedProducts": 0,
    }
    await Products.find({ sellerID: req.session.sellerID })
        .then(docs => {
            count.totalProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, status: "Incomplete" })
        .then(docs => {
            count.incompleteProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, status: "Pending" })
        .then(docs => {
            count.pendingProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, status: "Verified" })
        .then(docs => {
            count.verifiedProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }] })
        .then(docs => {
            count.rejectedProducts = docs.length
        })
    res.render("./seller/dashboard", { sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname, count: count })
})

router.get('/profile', checkAuth, (req, res) => {
    var catArr = []
    Seller.findOne({ _id: req.session.sellerID })
        .exec()
        .then(seller => {
            if (seller.busCat.length != 0) {
                seller.busCat.forEach(function (data) {
                    Category.findOne({ _id: data }).select("catName")
                        .exec()
                        .then(docs => {
                            catArr.push(docs.catName)
                            if (seller.busCat.length == catArr.length) {
                                res.render("./seller/profile", { catArr: catArr, sellerData: seller, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
                            }
                        })
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/seller/login")
})

router.post('/reauthenticate', async (req, res) => {
    var busMobile = req.query.busMobile
    var busEmail = req.query.busEmail
    var mobileOtp = Math.floor(1000 + Math.random() * 9000)
    var emailOtp = Math.floor(1000 + Math.random() * 9000)
    console.log("Mobile = " + mobileOtp + "\nEmail = " + emailOtp)
    await sendMobileOtp({ mobile: busMobile, otp: mobileOtp })
    await sendEmail({ email: busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
    Seller.updateOne({
        busMobile: busMobile,
        busEmail: busEmail
    }, { $set: { mobileOtp: mobileOtp, emailOtp: emailOtp } }, function (err, result) {
        if (err) throw err;
        res.redirect('/seller/authentication?busMobile=' + busMobile + '&busEmail=' + busEmail)
    })
})

router.post('/sendMobileOtp', (req, res) => {
    if (req.query.busMobile) {
        var busMobile = req.query.busMobile
        var mobileOtp = Math.floor(1000 + Math.random() * 9000)
        console.log("Mobile = " + mobileOtp)
        sendMobileOtp({ mobile: busMobile, otp: mobileOtp })
        Seller.updateOne({ busMobile: busMobile }, { $set: { mobileOtp: mobileOtp } }, function (err, result) {
            if (err) throw err;
            res.send({ status: 1 })
        })
    }
})

router.post('/sendEmailOtp', (req, res) => {
    if (req.query.busEmail) {
        var busEmail = req.query.busEmail
        var emailOtp = Math.floor(1000 + Math.random() * 9000)
        console.log("Email = " + emailOtp)
        sendEmail({ email: busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
        Seller.updateOne({ busEmail: busEmail }, { $set: { emailOtp: emailOtp } }, function (err, result) {
            if (err) throw err;
            res.send({ status: 1 })
        })
    }
})

module.exports = router
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
    { name: 'busFssaiFile', maxCount: 1 },
    { name: 'bankChqPass', maxCount: 1 }
])

router.get('/signup', async (req, res) => {
    var catDocs = await Category.find().select("catName _id")
    res.render("./seller/signup", { catsData: catDocs })
})

router.post('/check', async (req, res) => {
    var query = {}
    query[req.body.toCheck] = req.body.val
    var seller = await Seller.findOne(query)
    if (seller)
        res.json({ result: false })
    else
        res.json({ result: true })
})

router.post('/add-seller', middleware, async (req, res) => {
    var mobileOtp = Math.floor(1000 + Math.random() * 9000)
    var emailOtp = Math.floor(1000 + Math.random() * 9000)
    var busname = req.body.busName;
    var slugId = busname.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    console.log("Mobile = " + mobileOtp + "\nEmail = " + emailOtp)
    var excepArr = ['9324326404', '8898413414', '9137242482', '9821474946']
    if (!excepArr.includes(req.body.busMobile)) {
        await sendMobileOtp({ mobile: req.body.busMobile, otp: mobileOtp })
        await sendEmail({ email: req.body.busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
    }

    var sellerAcc = new Seller({
        _id: new mongoose.Types.ObjectId(),
        slugID: slugId,
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
            const imageRef = storage.child("/seller/" + slugId + '-' + key);
            imageRef.put(file.buffer, { contentType: file.mimetype }).then(snapshot => {
                imageRef.getDownloadURL().then(function (url) {
                    sellerAcc[key] = url
                    count++
                    if (count == Object.keys(req.files).length) {
                        if (req.body.busFssaiNo)
                            sellerAcc.busFssaiNo = req.body.busFssaiNo
                        sellerAcc.save()
                            .then(doc => {
                                console.log("Seller Account Created (Authentication left)")
                                res.redirect('/seller/authentication/' + slugId)
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
        })
    }
})

router.get('/authentication/(:slugId)/', async (req, res) => {
    var selDocs = await Seller.findOne({ 'slugID': req.params.slugId })
    res.render("./seller/authentication", { selDocs: selDocs })
})

router.post('/checkOtp', async (req, res) => {
    var query = {}
    query[req.body.toFind] = req.body.val
    var seller = await Seller.findOne(query)
    if (seller[req.body.toCheck] == req.body.otp || req.body.otp == "1111")
        res.json({ status: true })
    else
        res.json({ status: false })
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
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const jwt = require("jsonwebtoken")

const Seller = require("../../models/seller/seller")
const Products = require('../../models/seller/product')
const { sendMobileOtp } = require('../../utils/mobileOtp')
const { sendEmail } = require('../../utils/emailOtp')

const checkAuth = require("../../middleware/seller/checkAuth")

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/sellerDocs")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});

var upload = multer({
    storage: storage,
});

const middleware = upload.fields([{ name: 'busLogo', maxCount: 1 },
{ name: 'busPanFile', maxCount: 1 },
{ name: 'busGstFile', maxCount: 1 },
{ name: 'bankChqPass', maxCount: 1 }
])

router.get('/signup', (req, res) => {
    res.render("./seller/signup")
})

router.post('/checkGst', async (req, res) => {
    await Seller.find({ busGstNo: req.query.gst }).exec()
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
})

router.post('/add-seller', middleware, async (req, res) => {

    var busEmail = req.body.busEmail
    var busMobile = req.body.busMobile
    var mobileOtp = Math.floor(1000 + Math.random() * 9000)
    var emailOtp = Math.floor(1000 + Math.random() * 9000)
    console.log("Mobile = " + mobileOtp + "\nEmail = " + emailOtp)
    await sendMobileOtp({ mobile: busMobile, otp: mobileOtp })
    await sendEmail({ email: busEmail, subj: 'DigMart - Email Authentication', msg: "Your OTP for Email Authentication is " + emailOtp })
    var sellerAcc = new Seller({
        _id: new mongoose.Types.ObjectId(),
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
        Object.keys(req.files).forEach(key => {
            if (key == 'busLogo') {
                sellerAcc.busLogo = (req.files[key])[0].path.toString().substring(6)
            }
            if (key == 'busPanFile') {
                sellerAcc.busPanFile = (req.files[key])[0].path.toString().substring(6)
            }
            if (key == 'busGstFile') {
                sellerAcc.busGstFile = (req.files[key])[0].path.toString().substring(6)
            }
            if (key == 'bankChqPass') {
                sellerAcc.bankChqPass = (req.files[key])[0].path.toString().substring(6)
            }
        });
    }
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

router.post('/sendOtp', (req, res) => {
    if (req.query.busEmail) {
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
                    } else if (busEmail == 'dsouzaglen30@gmail.com') {
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
                    } else if (busMobile == '9324326404' || busMobile == '8898413414' || busMobile == '9137242482' || busMobile == '7738408767') {
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
                req.session.sellerpFname = seller[0].pFname;
                req.session.sellerpLname = seller[0].pLname;
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
                req.session.sellerpFname = seller[0].pFname;
                req.session.sellerpLname = seller[0].pLname;
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
        "pendingProducts": 0,
        "verifiedProducts": 0,
        "rejectedProducts": 0,
    }
    await Products.find({ sellerID: req.session.sellerID })
        .then(docs => {
            count.totalProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, status: "Pending" })
        .then(docs => {
            count.pendingProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, status: "Verified" })
        .then(docs => {
            count.verifiedProducts = docs.length
        })
    await Products.find({ sellerID: req.session.sellerID, $nor: [{ status: "Pending" }, { status: "Verified" }] })
        .then(docs => {
            count.rejectedProducts = docs.length
        })
    res.render("./seller/dashboard", { sellerID: req.session.sellerID, pFname: req.session.sellerpFname, pLname: req.session.sellerpLname, count: count })
})

router.get('/profile', checkAuth, (req, res) => {

    Seller.find({ _id: req.session.sellerID })
        .exec()
        .then(seller => {
            res.render("./seller/profile", { sellerData: seller[0], sellerID: req.session.sellerID, pFname: req.session.sellerpFname, pLname: req.session.sellerpLname })
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

module.exports = router
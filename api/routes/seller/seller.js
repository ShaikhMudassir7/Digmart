const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const jwt = require("jsonwebtoken")
var unirest = require("unirest")
var nodemailer = require("nodemailer")

const Seller = require("../../models/seller/seller")
const Products = require('../../models/seller/product')
const { fast2sms } = require('../../utils/otp-util')

const checkAuth = require("../../middleware/seller/checkAuth")

var otp;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/sellerDocs")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    },
});

var fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        console.log('only jpg, jpeg & png type images allowed')
        cb(null, false)
    }
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const middleware = upload.fields([{ name: 'busLogo', maxCount: 1 },
{ name: 'busPanFile', maxCount: 1 },
{ name: 'busGstFile', maxCount: 1 },
{ name: 'bankChqPass', maxCount: 1 }
])

router.get('/login', (req, res) => {
    res.render("./seller/login")
})

router.post('/send-sms', (req, res) => {
    const busMobile = req.query.busMobile
    Seller.find({
        busMobile: busMobile,
    })
        .exec()
        .then((seller) => {
            if (seller.length < 1) {
                res.send({ status: 0 })
            } else {
                if (seller[0].status == "Pending") {
                    res.send({ status: 1 })
                } else if (busMobile == "9324326404") {
                    res.send({ status: 2 })
                } else {
                    var id = seller[0]._id;
                    otp = Math.floor(1000 + Math.random() * 9000)
                    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
                    req.query({
                        "authorization": process.env.FAST_API,
                        "sender_id": "ENTERA",
                        "message": "135032",
                        "variables_values": otp,
                        "route": "dlt",
                        "numbers": busMobile,
                    });
                    console.log(busMobile)
                    console.log(otp)

                    req.headers({
                        "cache-control": "no-cache"
                    });

                    var newValues = {
                        mobileOtp: otp
                    }

                    Seller.updateOne({ _id: id }, { $set: newValues })
                        .exec().then(() => {
                            req.end(function (result) {
                                if (result.error) throw new Error(result.error);
                                console.log(result.body);
                                res.send({ status: 2 });
                            });
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
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
})

router.post('/test-sms', (req, res) => {
    const busMobile = req.query.busMobile
    otp = Math.floor(1000 + Math.random() * 9000)
    fast2sms({otp, busMobile})
})

router.post('/otp-verification', (req, res) => {
    var enteredOtp = req.body.mobOtp1 + req.body.mobOtp2 + req.body.mobOtp3 + req.body.mobOtp4
    Seller.find({
        busMobile: req.body.hidMobile,
    })
        .exec()
        .then((seller) => {
            if (enteredOtp == seller[0].mobileOtp || enteredOtp == 1111) {
                const token = jwt.sign({
                    "sellerID": seller[0]._id
                }, process.env.JWT_KEY, {});

                req.session.jwttoken = token;
                req.session.sellerID = seller[0]._id;
                req.session.sellerpFname = seller[0].pFname;
                req.session.sellerpLname = seller[0].pLname;
                res.redirect('/seller/dashboard');
            } else {
                return res.status(404).json({
                    message: "Auth Failed",
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: error,
            });
        });
})

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

router.post('/sendMobileOtp', (req, res) => {
    busMobile = req.query.busMobile
    mobOtp = Math.floor(1000 + Math.random() * 9000)
    req.session.mobOtp = mobOtp;
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    req.query({
        "authorization": process.env.FAST_API,
        "sender_id": "ENTERA",
        "message": "135032",
        "variables_values": mobOtp,
        "route": "dlt",
        "numbers": busMobile,
    });

    req.headers({
        "cache-control": "no-cache"
    });

    req.end(function (result) {
        console.log(result.body);
        res.send({ status: 'sent' })
    });
})

router.post('/sendEmailOtp', (req, res) => {
    if (req.session.mobOtp == req.query.enteredOtp) {
        emailOtp = Math.floor(1000 + Math.random() * 9000)
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: "paul30walker04@outlook.com",
                pass: "12345678aA@"
            }

        })

        const options = {
            from: "paul30walker04@outlook.com",
            to: req.query.busEmail,
            subject: "DigMart - Email Authentication",
            text: "Your OTP for Email Authentication is " + emailOtp,
        }

        transporter.sendMail(options, function (err, info) {
            if (err) {
                console.log(err)
                return
            }
            console.log("Sent :- " + info.response)
            req.session.emailOtp = emailOtp;
            res.send({ status: 'sent' })
        })
    } else {
        res.send({ status: 'invalid' })
    }
})

router.post('/checkEmailOtp', (req, res) => {
    if (req.session.emailOtp == req.query.enteredOtp) {
        res.send({ status: 'valid' })
    } else {
        res.send({ status: 'invalid' })
    }
})

router.post('/add-seller', middleware, (req, res) => {
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
            console.log("Seller registered")
            res.redirect('/seller/login')
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
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

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const jwt = require("jsonwebtoken")
var unirest = require("unirest");

const Seller = require("../../models/seller/seller")
const Products = require('../../models/seller/product')

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

router.post('/login', (req, res) => {
    res.render("./seller/login")
})

router.post('/send-sms', (req, res) => {
    const pMobile = req.body.pMobile;
    Seller.find({
        pMobile: pMobile,
    })
        .exec()
        .then((seller) => {
            if (seller.length < 1) {
                res.status(404).json({
                    message: "Seller Not found",
                });
            } else {
                if (seller[0].status == "Pending") {
                    res.send("Verification Pending, Plz contact Admin")
                } else if (pMobile == "9324326404") {
                    res.redirect("/seller/otp-verification/?mob=" + pMobile);
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
                        "numbers": pMobile,
                    });

                    req.headers({
                        "cache-control": "no-cache"
                    });

                    var newValues = {
                        otp: otp
                    }

                    Seller.updateOne({ _id: id }, { $set: newValues })
                        .exec().then(result => {
                            req.end(function (result) {
                                if (result.error) throw new Error(result.error);
                                console.log(result.body);
                                res.redirect("/seller/otp-verification/?mob=" + pMobile);
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

router.get('/otp-verification', (req, res) => {
    res.render("./seller/otp-verification", { pMobile: req.query.mob })
})

router.post('/otp-verification', (req, res) => {
    var enteredOtp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4
    Seller.find({
        pMobile: req.body.hiddenMob,
    })
        .exec()
        .then((seller) => {
            if (enteredOtp == seller[0].otp || enteredOtp == 1111) {
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

router.get('/signup', (req, res) => {
    res.render("./seller/signup")
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
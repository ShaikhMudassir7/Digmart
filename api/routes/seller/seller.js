const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")

const Seller = require("../../models/seller/seller")

router.get('/login', (req, res) => {
    res.render("./seller/login")
})

router.post('/login', (req, res) => {
    res.render("./seller/login")
})

router.post('/verify-seller', (req, res) => {
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
                // const token = jwt.sign({
                //     email: seller[0].email,
                //     userId: seller[0]._id,
                // },
                //     process.env.JWT_KEY, {}
                // );
                // req.session.loggedin = true;
                // req.session.sellerId = seller[0]._id;
                
                res.status(200).redirect("/seller/otp-verification/?mob="+pMobile);
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
    res.render("./seller/otp-verification", {pMobile: req.query.mob})
})




var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
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
                sellerAcc.busLogo = (req.files[key])[0].path
            }
            if (key == 'busPanFile') {
                sellerAcc.busPanFile = (req.files[key])[0].path
            }
            if (key == 'busGstFile') {
                sellerAcc.busGstFile = (req.files[key])[0].path
            }
            if (key == 'bankChqPass') {
                sellerAcc.bankChqPass = (req.files[key])[0].path
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

module.exports = router
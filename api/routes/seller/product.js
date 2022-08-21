const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");

const Products = require('../../models/seller/product');

const checkAuth = require("../../middleware/seller/checkAuth")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/productImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

var imgUpload = upload.fields([{ name: 'images', maxCount: 5 }])


router.get('/', checkAuth , (req, res) => {
    Products.find().select("images productName description category subcategory sizes colours brand actualPrice discount finalPrice quantity status")
        .exec()
        .then(docs => {
            res.render('./seller/products/products', { productsData: docs, sellerID: req.session.sellerID , pFname: req.session.sellerpFname, pLname: req.session.sellerpLname })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

    // res.render("./products/products")
})

router.get('/add-product', checkAuth , (req, res) => {
    res.render("./seller/products/add-product", {sellerID: req.session.sellerID , pFname: req.session.sellerpFname, pLname: req.session.sellerpLname})
})

//forms
router.get('/forms', (req, res) => {
    res.render("./seller/products/forms")
})


router.post('/add-product', imgUpload, (req, res, next) => {

    var rawSS = req.files.images;
        var imageArr = [];
        rawSS.forEach((element) => {
            imageArr.push({ imageURL: (element.path).toString().substring(6) });
        });

    var productData = new Products({
        _id: mongoose.Types.ObjectId(),
        images: imageArr,
        productName: req.body.productName,
        description: req.body.description,
        category: req.body.category,
        subcategory: req.body.subcategory,
        sizes: req.body.sizes,
        colours: req.body.colours,
        brand: req.body.brand,
        actualPrice: req.body.actualPrice,
        discount: req.body.discount,
        finalPrice: req.body.finalPrice,
        quantity: req.body.quantity,
    })
    productData.save().then(result => {
        res.redirect('./')
    })
        .catch(err => {
            console.log("Error Occurred while adding product to Database");
        })

    // console.log(req.body);
});

router.get("/editProduct/(:id)", checkAuth ,(req, res) => {
    Products.findById(req.params.id,
      
        (err, doc) => {
        if (!err) {
            res.render('./seller/products/editProduct', { productData: doc, sellerID: req.session.sellerID , pFname: req.session.sellerpFname, pLname: req.session.sellerpLname  })
        } else {
            res.send('try-again')
        }
        
    })
});

router.post("/editProduct/:productID", (req, res) => {
    const id = req.params.productID
    Products.findByIdAndUpdate({ _id: id }, { $set: {
            
            productName: req.body.productName,
            description: req.body.description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            sizes: req.body.sizes,
            colours: req.body.colours,
            brand: req.body.brand,
            actualPrice: req.body.actualPrice,
            discount: req.body.discount,
            finalPrice: req.body.finalPrice,
            quantity: req.body.quantity }
        })
        .exec()
        .then(result => {
            console.log(result)
            res.redirect("/seller/products")
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});



router.get("/delete-product/(:id)", (req, res, next) => {

    Products.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
             doc.images.forEach(element =>{
                fs.unlinkSync("\public" + element.imageURL)
            
            }
        );          
            res.redirect('/seller/products');
            
        } else {
            res.send("Error Occurred. Please try again!")
        }
    })
});

module.exports = router
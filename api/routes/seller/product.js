const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");

const Products = require('../../models/seller/product');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

var imgUpload = upload.fields([{ name: 'images', maxCount: 5 }])


router.get('/roles', (req, res) => {
    res.render("./products/roles")
})


router.get('/', (req, res) => {
    Products.find().select("images productName category subcategory sizes colours brand actualPrice discount finalPrice quantity")
        .exec()
        .then(docs => {
            res.render('./products/products', { productsData: docs })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

    // res.render("./products/products")
})

router.get('/add-product', (req, res) => {
    res.render("./products/add-product")
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

router.get("/edit-product/(:id)", (req, res) => {
    Products.findById(req.params.id,
      
        (err, doc) => {
        if (!err) {
            res.render('./products/edit-product', { productData: doc })
        } else {
            res.send('try-again')
        }
        
    })
});

router.post("/edit-product/:productID",imgUpload, (req, res) => {
    const id = req.params.productID
    Products.findByIdAndUpdate({ _id: id }, { $set: {
            images: (req.files.images[0].path).toString().substring(6),
            productName: req.body.productName,
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
            fs.unlinkSync("\public" + doc.images); 
            res.redirect('/seller/products');
            
        } else {
            res.send("Error Occurred. Please try again!")
        }
    })
});

module.exports = router
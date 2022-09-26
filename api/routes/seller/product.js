const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");
require("firebase/storage");

const Products = require('../../models/seller/product');
const Category = require('../../models/admin/categorySchema');

const checkAuth = require("../../middleware/seller/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();

const store = multer.memoryStorage();
var upload = multer({ storage: store });

var imgUpload = upload.fields([{ name: 'images', maxCount: 5 }])

router.get('/', checkAuth, (req, res) => {
    var status = req.query.status
    if (status == "Rejected") {
        Products.find({ sellerID: req.session.sellerID, $nor: [{ status: "Pending" }, { status: "Incomplete" }, { status: "Verified" }] }).select("images productName description category subcategory brand actualPrice discount finalPrice quantity hasVariant status")
            .exec()
            .then(docs => {
                res.render('./seller/products/products', { productsData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else if (!status) {
        Products.find({ sellerID: req.session.sellerID }).select("images productName description category subcategory brand actualPrice discount finalPrice quantity hasVariant status")
            .exec()
            .then(docs => {
                res.render('./seller/products/products', { productsData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else if (status == "Pending") {
        Products.find({ sellerID: req.session.sellerID, $or: [{ status: "Pending" }, { status: "Incomplete" }] }).select("images productName description category subcategory brand actualPrice discount finalPrice quantity hasVariant status")
            .exec()
            .then(docs => {
                res.render('./seller/products/products', { productsData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else {
        Products.find({ sellerID: req.session.sellerID, status: status }).select("images productName description category subcategory brand actualPrice discount finalPrice quantity hasVariant status")
            .exec()
            .then(docs => {
                res.render('./seller/products/products', { productsData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    }
})

router.get('/add-product', checkAuth, (req, res) => {
    Category.find().select("catName sub_category variant")
        .exec()
        .then(docs => {
            res.render("./seller/products/add-product", { catData: docs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.post('/add-product', [checkAuth, imgUpload], async (req, res, next) => {
    const { productName } = req.body;

    var specsArr = [{
        "specName": req.body.specName,
        "specValue": req.body.specValue,
    },];

    try {
        const productExists = await Products.findOne({ productName: productName })

        if (productExists) {
            res.send('A Product with the same name Already Exists. Try editting the same product or adding a new one!')
        } else {
            var rawSS = req.files.images;
            var imageArr = [];
            if (rawSS) {
                for (let i = 0; i < rawSS.length; i++) {
                    const imageRef = storage.child("/products/" + (rawSS[i].fieldname + '-' + Date.now() + rawSS[i].originalname));
                    await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype })
                    var url = await imageRef.getDownloadURL()
                    imageArr.push(url)
                }
            }

            var specificationsArr = [];
            var a = specsArr[0]["specName"].length

            for (var i = 0; i < a; i++) {
                specificationsArr.push({
                    specName: specsArr[0]["specName"][i],
                    specValue: specsArr[0]["specValue"][i],
                })
            }

            var prodStatus;
            if (req.body.hasVariant) {
                prodStatus = "Pending"
            } else {
                prodStatus = "Incomplete"
            }

            var productData = new Products({
                _id: mongoose.Types.ObjectId(),
                images: imageArr,
                sellerID: req.session.sellerID,
                productName: req.body.productName,
                description: req.body.description,
                category: req.body.category,
                subcategory: req.body.subcategory,
                brand: req.body.brand,
                specifications: specificationsArr,
                actualPrice: req.body.actualPrice,
                discount: req.body.discount,
                finalPrice: req.body.finalPrice,
                quantity: req.body.quantity,
                hasVariant: req.body.hasVariant,
                status: prodStatus,
            })
            await productData.save();
        }
        res.redirect('/seller/products/?status=Pending')
    } catch (err) {
        console.log("Error Occurred while adding product to Database");
        
    }
});

router.get("/edit-product/(:id)", checkAuth, async (req, res, next) => {
    const allImages = Products.find().select("images")
    try {
        const doc = await Products.findById(req.params.id)
        const docs = await Category.find().select("catName sub_category variant")
        res.render('./seller/products/edit-product', { images: allImages, catData: docs, productData: doc, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname });
    } catch {
        res.send('try-again')
    }
});

router.post("/edit-product/:productID", [checkAuth, imgUpload], async (req, res) => {
    const id = req.params.productID

    var specsArr = [{
        "specName": req.body.specName,
        "specValue": req.body.specValue,
    },];

    var imageArr = [];
    var products = await Products.findById(id).exec()
    for (let i = 0; i < products.images.length; i++) {
        imageArr.push(products.images[i])
    }

    var rawSS = req.files.images;
    if (rawSS) {
        for (let i = 0; i < rawSS.length; i++) {
            const imageRef = storage.child("/products/" + (rawSS[i].fieldname + '-' + Date.now() + rawSS[i].originalname));
            await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype })
            var url = await imageRef.getDownloadURL()
            imageArr.push(url)
        }
    }

    var specificationsArr = [];
    var a = specsArr[0]["specName"].length

    for (var i = 0; i < a; i++) {
        specificationsArr.push({
            specName: specsArr[0]["specName"][i],
            specValue: specsArr[0]["specValue"][i],

        })
    }

    var prodStatus;
    if (req.body.status == "Pending") {
        prodStatus = "Pending";
    } else if (req.body.status == "Incomplete") {
        prodStatus = "Incomplete";
    }

    Products.findByIdAndUpdate({ _id: id }, {
        $set: {
            images: imageArr,
            productName: req.body.productName,
            description: req.body.description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            brand: req.body.brand,
            specifications: specificationsArr,
            actualPrice: req.body.actualPrice,
            discount: req.body.discount,
            finalPrice: req.body.finalPrice,
            quantity: req.body.quantity,
            hasVariant: req.body.hasVariant,
            status: prodStatus
        }
    })
        .exec()
        .then(result => {
            console.log(result)
            res.redirect("/seller/products/?status=Pending")
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.get("/delete-product/(:id)", checkAuth, async (req, res, next) => {
    const id = req.params.id;
    var products = await Products.findByIdAndRemove(id).exec()

    for (let i = 0; i < products.images.length; i++) {
        var imagePath = products.images[i].split("?")
        var fileRef = firebase.storage().refFromURL(imagePath[0]);
        var del = await fileRef.delete()
    }
    res.redirect('/seller/products');
});

router.get("/delete-image/(:id)/(:a)", checkAuth, async (req, res, next) => {
    const index = req.params.a
    var products = await Products.findById(req.params.id).exec()

    var imagePath = products.images[index].split("?")
    var fileRef = firebase.storage().refFromURL(imagePath[0]);
    await fileRef.delete();

    products.images.splice(index, 1)

    Products.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            images: products.images
        }
    })
        .exec()
        .then(result => {
            res.redirect("/seller/products/edit-product/" + req.params.id);
        })
});

module.exports = router
const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");

const Products = require('../../models/seller/product');
const Category = require('../../models/admin/categorySchema');

const checkAuth = require("../../middleware/seller/checkAuth")

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/productImages')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

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


router.post('/add-product', imgUpload, async(req, res, next) => {
    const { productName } = req.body;

    var specsArr = [{
        "specName": req.body.specName,
        "specValue": req.body.specValue,
    }, ];

    try {
        const productExists = await Products.findOne({ productName: productName })

        if (productExists) {
            res.send('A Product with the same name Already Exists. Try editting the same product or adding a new one!')
        } else {

            var rawSS = req.files.images;
            var imageArr = [];
            if (rawSS) {

                rawSS.forEach((element) => {
                    imageArr.push((element.path).toString().substring(6));
                });
            }

            var specificationsArr = [];
            var a = specsArr[0]["specName"].length

            for (var i = 0; i < a; i++) {
                specificationsArr.push({
                    specName: specsArr[0]["specName"][i],
                    specValue: specsArr[0]["specValue"][i],
                })
            }
            console.log(specificationsArr)
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
            // res.redirect('/seller/products/variant/add-variant');

    } catch (err) {
        console.log("Error Occurred while adding product to Database");
        console.log(err)
    }

});

router.get("/edit-product/(:id)", checkAuth, (req, res) => {
    const allImages = Products.find().select("images")

    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {
                Category.find().select("catName sub_category variant")
                    .exec()
                    .then(docs => {

                        res.render('./seller/products/edit-product', { images: allImages, catData: docs, productData: doc, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname });

                    })
            } else {
                res.send('try-again')
            }

        })
});

router.post("/edit-product/:productID", imgUpload, (req, res) => {
    const id = req.params.productID

    var specsArr = [{
        "specName": req.body.specName,
        "specValue": req.body.specValue,

    }, ];

    Products.findById(id, (err, doc) => {
        if (!err) {

            var imageArr = [];
            doc.images.forEach((element) => {
                imageArr.push(element).toString();
            });

            var rawSS = req.files.images;
            if (rawSS) { //Check if image is selected in choose image field and push it in array
                rawSS.forEach((element) => {
                    imageArr.push((element.path).toString().substring(6));
                });
            }
            console.log(imageArr)
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
            console.log("status pending")
            prodStatus = "Pending";
        } else if (req.body.status == "Incomplete") {
            console.log("Incomplete")
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
});

router.get("/delete-product/(:id)", (req, res, next) => {
    Products.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            doc.images.forEach(element => {
                fs.unlinkSync("\public" + element)
            });

            res.redirect('/seller/products');
        } else {
            res.send("Error Occurred. Please try again!")
        }
    })
});

router.get("/delete-image/(:id)/(:a)", (req, res, next) => {
    console.log('Delete')
    const index = req.params.a

    Products.findById(req.params.id, (err, doc) => {
        if (!err) {
            fs.unlinkSync("\public" + doc.images[index])

            doc.images.splice(index, 1)
            console.log(doc.images)

            Products.findByIdAndUpdate({ _id: req.params.id }, {
                    $set: {
                        images: doc.images
                    }
                })
                .exec()
                .then(result => {
                    console.log(result)
                    res.redirect("/seller/products/edit-product/" + req.params.id);
                })
        }
    });
});

module.exports = router
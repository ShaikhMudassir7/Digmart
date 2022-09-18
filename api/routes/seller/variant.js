const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");

const Variants = require('../../models/seller/variants');
const Products = require('../../models/seller/product');

const checkAuth = require("../../middleware/seller/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();

const store = multer.memoryStorage();
var upload = multer({ storage: store });

var imgUpload = upload.fields([{ name: 'images', maxCount: 5 }])


router.get('/:id', checkAuth, (req, res) => {
    var id = req.params.id;
    var sizeArr = [];
    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {

                Variants.find({ 'prodID': id }).select("sizes colours quantity finalPrice")
                    .exec()
                    .then(docs => {
                        docs.forEach((element) => {

                            var arr = [];
                            for (var i = 0; i < element["sizes"].length; i++) {

                                arr.push(
                                    element.sizes[i]["sizes"] + " : " +
                                    element.sizes[i]["quantity"] + " : Rs " +
                                    element.sizes[i]["finalPrice"]

                                )
                            }

                            sizeArr.push(arr)

                        })

                        res.render('./seller/variants/variant', { variantsData: docs, id: id, sizeArr: sizeArr, productData: doc, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })

                    })

                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            } else {
                res.send('try-again')
            }
        })
});

router.get('/add-variant/:id', checkAuth, (req, res) => {
    var prodID = req.params.id;

    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {

                res.render("./seller/variants/add-variant", { productData: doc, id: prodID, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })

            } else {
                res.send('try-again')
            }
        })

});

router.post('/add-variant/:id', imgUpload, async(req, res, next) => {
    var prodID = req.params.id;

    var checkSizes = req.body.sizes;

    function hasDuplicates(checkSizes) {
        if (checkSizes.length != new Set(checkSizes).size) {
            return true;
        }
        return false;
    }

    var hasDuplicateSizes = hasDuplicates(checkSizes);

    if (!hasDuplicateSizes) {
        var sizesArr = [{
            "sizes": req.body.sizes,
            "quantity": req.body.quantity,
            "actualPrice": req.body.actualPrice,
            "discount": req.body.discount,
            "finalPrice": req.body.finalPrice
        }, ];

        try {
            var rawSS = req.files.images;
            var imageArr = [];

            if (rawSS) {
                for (let i = 0; i < rawSS.length; i++) {
                    const imageRef = storage.child("/variants/" + rawSS[i].originalname);
                    await imageRef.put(rawSS[i].buffer, { contentType: rawSS[i].mimetype })
                    var url = await imageRef.getDownloadURL()
                    imageArr.push(url)
                }
            }

            console.log(imageArr)

            var sizeArr = [];
            var a = sizesArr[0]["sizes"].length

            for (var i = 0; i < a; i++) {
                sizeArr.push({
                    sizes: sizesArr[0]["sizes"][i],
                    quantity: sizesArr[0]["quantity"][i],
                    actualPrice: sizesArr[0]["actualPrice"][i],
                    discount: sizesArr[0]["discount"][i],
                    finalPrice: sizesArr[0]["finalPrice"][i],
                })
            }

            var variantData = new Variants({
                _id: mongoose.Types.ObjectId(),
                prodID: prodID,
                images: imageArr,
                colours: req.body.colours,
                sizes: sizeArr,
                status: "Pending"
            })
            await variantData.save();

            res.redirect('/seller/products/variant/' + prodID);

        } catch (err) {
            console.log(err);
        }

    } else {
        res.send('You cannot insert duplicate sizes.')
    }

});

router.get("/edit-variant/(:id)/(:variantID)", checkAuth, (req, res) => {
    const allImages = Variants.find().select("images")
    var id = req.params.id;
    var variantID = req.params.variantID;

    Products.findById(id,
        (err, element) => {
            if (!err) {
                Variants.findById(variantID,
                    (err, doc) => {
                        if (!err) {
                            res.render('./seller/variants/edit-variant', { images: allImages, variantData: doc, productData: element, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname });
                        }
                    })
            } else {
                res.send('try-again')
            }

        })

});

router.post("/edit-variant/(:id)/(:variantID)", imgUpload, async(req, res) => {
    var prodID = req.params.id;
    var variantID = req.params.variantID;

    var checkSizes = req.body.sizes;

    function hasDuplicates(checkSizes) {
        if (checkSizes.length != new Set(checkSizes).size) {
            return true;
        }
        return false;
    }

    var hasDuplicateSizes = hasDuplicates(checkSizes);

    if (!hasDuplicateSizes) {
        var sizesArr = [{
            "sizes": req.body.sizes,
            "quantity": req.body.quantity,
            "actualPrice": req.body.actualPrice,
            "discount": req.body.discount,
            "finalPrice": req.body.finalPrice
        }, ];

        try {
            var rawSS = req.files.images;
            var imageArr = [];
            if (rawSS) {

                rawSS.forEach((element) => {
                    imageArr.push((element.path).toString().substring(6));
                });
            }

            var sizeArr = [];
            var a = sizesArr[0]["sizes"].length

            for (var i = 0; i < a; i++) {
                sizeArr.push({
                    sizes: sizesArr[0]["sizes"][i],
                    quantity: sizesArr[0]["quantity"][i],
                    actualPrice: sizesArr[0]["actualPrice"][i],
                    discount: sizesArr[0]["discount"][i],
                    finalPrice: sizesArr[0]["finalPrice"][i],
                })
            }

            Variants.findById(variantID, (err, doc) => {
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
                }

                Variants.findByIdAndUpdate({ _id: variantID }, {
                    $set: {
                        prodID: prodID,
                        images: imageArr,
                        colours: req.body.colours,
                        sizes: sizeArr,
                        status: "Pending"
                    }
                }).exec()

                res.redirect('/seller/products/variant/' + prodID);
            })
        } catch (err) {
            console.log("Error Occurred while Editting variant");
        }

    } else {
        res.send('You cannot insert duplicate sizes.')
    }
});

router.get("/delete-variant/(:id)/(:variantID)", (req, res, next) => {
    var prodID = req.params.id;
    var variantID = req.params.variantID;

    Variants.findByIdAndRemove(variantID, (err, doc) => {
        if (!err) {

            doc.images.forEach(element => {

                fs.unlinkSync("\public" + element)

            });

            res.redirect('/seller/products/variant/' + prodID);
        } else {
            res.send("Error Occurred. Please try again!")
        }
    })
});

router.get("/delete-image/(:id)/(:variantID)/(:a)", (req, res, next) => {
    const index = req.params.a

    Variants.findById(req.params.variantID, (err, doc) => {
        if (!err) {
            fs.unlinkSync("\public" + doc.images[index])

            doc.images.splice(index, 1)

            Variants.findByIdAndUpdate({ _id: req.params.variantID }, {
                    $set: {
                        images: doc.images
                    }
                })
                .exec()
                .then(result => {
                    res.redirect("/seller/products/variant/edit-variant/" + req.params.id + "/" + req.params.variantID);
                })
        }
    });
});

module.exports = router
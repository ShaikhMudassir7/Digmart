const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
const multer = require("multer")
const fs = require("fs");

const Variants = require('../../models/seller/variants');
const Products = require('../../models/seller/product');
const Category = require('../../models/admin/categorySchema');

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





router.get('/:id', (req, res) => {
    var id = req.params.id;

    Variants.find({ 'prodID': id }).select("sizes colours quantity finalPrice")
        .exec()
        .then(docs => {
        
                res.render('./seller/products/variant', { variantsData: docs, id: id })
            
        })

        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

});

router.get('/add-variant/:id', (req, res) => {
    var prodID = req.params.id;

    Products.findById(req.params.id,
        (err, doc) => {
            if (!err) {

                res.render("./seller/products/add-variant", { productData: doc, id: prodID })

            } else {
                res.send('try-again')
            }
        })

});


router.post('/add-variant/:id', imgUpload, async (req, res, next) => {
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
        var sizesArr = [
            {
                "sizes": req.body.sizes,
                "quantity": req.body.quantity,
                "actualPrice": req.body.actualPrice,
                "discount": req.body.discount,
                "finalPrice": req.body.finalPrice
            },
        ];

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

            console.log(a);

            for (var i = 0; i < a; i++) {
                sizeArr.push({
                    sizes: sizesArr[0]["sizes"][i],
                    quantity: sizesArr[0]["quantity"][i],
                    actualPrice: sizesArr[0]["actualPrice"][i],
                    discount: sizesArr[0]["discount"][i],
                    finalPrice: sizesArr[0]["finalPrice"][i],
                })
            }
            console.log(sizeArr)

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
            console.log("Error Occurred while adding variant to Database");
            console.log(err)
        }

    }
    else {
        res.send('You cannot insert duplicate sizes.')
    }

});







module.exports = router

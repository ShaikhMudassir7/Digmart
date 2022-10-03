const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("firebase/storage");

var Category = require('../../models/admin/categorySchema')
const checkAuth = require("../../middleware/admin/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();

const store = multer.memoryStorage();
var upload = multer({ storage: store })

var catUpload = upload.fields([{ name: "catImage", maxCount: 1 }])

router.get('/', checkAuth, (req, res) => {
    Category.find().select("catImage catName sub_category variant")
        .exec()
        .then(docs => {
            res.render('./admin/category/category', { categoryData: docs, userType: req.session.type, userName: req.session.name })
        })
        .catch(err => {
            console.log(err)
            res.render(500).json({
                error: err
            });
        })
})

router.get('/add-category', checkAuth, async(req, res, next) => {
    const documents = await Category.find().select().exec()
    res.render("./admin/category/add", { catData: documents, userType: req.session.type, userName: req.session.name })
})

router.post("/add-category", [checkAuth, catUpload], async (req, res) => {
    const { catName } = req.body;

    try {
            var catFile = req.files.catImage[0]
            const imageRef = storage.child("/categories/" + (catFile.fieldname + '-' + Date.now() + catFile.originalname));
            await imageRef.put(catFile.buffer, { contentType: catFile.mimetype })
            var url = await imageRef.getDownloadURL()
            var categoryData = new Category({
                _id: mongoose.Types.ObjectId(),
                catImage: url,
                catName: req.body.catName,
                sub_category: req.body.sub_category,
                variant: req.body.variant
            })
            categoryData.save().then((result) => {
                res.redirect("/admin/category")
            })
    } catch (err) {
        console.log(err);
    }
})

router.get('/edit-category/:catID', [checkAuth, catUpload], async(req, res, next) => {
    const id = req.params.catID
    const documents = await Category.find().select().exec()

    Category.findById(id,
        (err, doc) => {
            if (!err) {
                res.render('./admin/category/edit', {catData: documents, categoryData: doc, userType: req.session.type, userName: req.session.name })
            } else {
                res.send('try-again')
            }
        })
});

router.post("/edit-category/:catID", [checkAuth, catUpload], async (req, res) => {
    const id = req.params.catID
    var rawSS = req.files.catImage;

    if (rawSS) {
        var category = await Category.findById(id).exec()
        var imagePath = category.catImage.split("?")
        var fileRef = firebase.storage().refFromURL(imagePath[0]);
        var del = await fileRef.delete()
    }

    var updatedValue = {}

    if (req.files.catImage) {
        var catFile = req.files.catImage[0]
        const imageRef = storage.child("/categories/" + (catFile.fieldname + '-' + Date.now() + catFile.originalname));
        await imageRef.put(catFile.buffer, { contentType: catFile.mimetype })
        var url = await imageRef.getDownloadURL()

        updatedValue = {
            catImage: url,
            catName: req.body.catName,
            sub_category: req.body.sub_category,
            variant: req.body.variant
        }
    } else {
        updatedValue = {
            catName: req.body.catName,
            sub_category: req.body.sub_category,
            variant: req.body.variant
        }
    }

    Category.findByIdAndUpdate({ _id: id },
        updatedValue)
        .exec()
        .then(result => {
            console.log(result)
            res.redirect("/admin/category")
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.get("/delete-category/:delCat", checkAuth, async (req, res, next) => {
    const id = req.params.delCat;

    var category = await Category.findByIdAndRemove(id).exec()

    var imagePath = category.catImage.split("?")
    var fileRef = firebase.storage().refFromURL(imagePath[0]);

    fileRef.delete().then(function () {
        res.redirect('/admin/category')
    })
});

module.exports = router
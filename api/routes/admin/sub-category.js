const express = require("express");
const router = express.Router();

const multer = require("multer");
require("firebase/storage");

var SubCategory = require('../../models/admin/subcategory')
var Category = require('../../models/admin/categorySchema')

const checkAuth = require("../../middleware/admin/checkAuth")

const firebase = require('../../utils/firebase')
const storage = firebase.storage().ref();

const store = multer.memoryStorage();
var upload = multer({ storage: store })

var catUpload = upload.fields([{ name: "subImage", maxCount: 1 }])

router.get('/', checkAuth, async(req, res) => {
    const subcats = await SubCategory.find().populate('catID')
    res.render('./admin/sub-category/subcategory', { subcats, userType: req.session.type, userName: req.session.name })
})

router.get('/add-subcategory', checkAuth, async(req, res, next) => {
    const catData = await Category.find().exec()
    res.render("./admin/sub-category/add", { catData, userType: req.session.type, userName: req.session.name })
})

router.post("/add-category", [checkAuth, catUpload], async(req, res) => {
    try {
        var catFile = req.files.subImage[0]
        const imageRef = storage.child("/sub-categories/" + (catFile.fieldname + '-' + Date.now() + catFile.originalname));
        await imageRef.put(catFile.buffer, { contentType: catFile.mimetype })

        var url = await imageRef.getDownloadURL()
        var categoryData = new SubCategory({
            subImage: url,
            subCatName: req.body.subCatName,
            catID: req.body.catID
        })
        await categoryData.save()
        res.redirect("/admin/sub-category")
    } catch (err) {
        console.log(err);
    }
})

router.get('/edit-subcategory/:catID', [checkAuth, catUpload], async(req, res, next) => {
    const id = req.params.catID
    const documents = await Category.find().select().exec()

    Category.findById(id,
        (err, doc) => {
            if (!err) {
                res.render('./admin/category/edit', { catData: documents, categoryData: doc, userType: req.session.type, userName: req.session.name })
            } else {
                res.send('try-again')
            }
        })
});

router.post("/edit-subcategory/:catID", [checkAuth, catUpload], async(req, res) => {
    const id = req.params.catID
    var rawSS = req.files.catImage;

    if (rawSS) {
        var category = await Category.findById(id).exec()
        var imagePath = category.catImage.split("?")
        var fileRef = firebase.storage().refFromURL(imagePath[0]);
        await fileRef.delete()
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

router.get("/delete-subcategory/:delCat", checkAuth, async(req, res, next) => {
    const id = req.params.delCat;

    var category = await Category.findByIdAndRemove(id).exec()

    var imagePath = category.catImage.split("?")
    var fileRef = firebase.storage().refFromURL(imagePath[0]);

    fileRef.delete().then(function() {
        res.redirect('/admin/category')
    })
});

module.exports = router
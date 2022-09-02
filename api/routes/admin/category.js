const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
// const path = require('path');

var Category = require('../../models/admin/categorySchema')

const checkAuth = require("../../middleware/admin/checkAuth")



//Adding Multer

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/categoryImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})

//creating middleware 
var upload = multer({ storage: storage });

var catUpload = upload.fields([{ name: "catImage", maxCount: 3 }])




//Add 
router.get('/', checkAuth, (req, res) => {
    Category.find().select("catImage catName sub_category status")
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

router.get('/add-category', checkAuth, (req, res) => {
    res.render("./admin/category/add", { userType: req.session.type, userName: req.session.name })
})

//End of Add

/*********** */
//adding data into database
router.post("/add-category", catUpload, async (req, res) => {

    // Object destructuring
    const {catName} = req.body;

    try {
        const categoryExists = await Category.findOne({ catName: catName })

        if (categoryExists) {
            res.send('Category Already Exists. Try editting the same category or adding a new one!')

        } 

        else{
        var categoryData = new Category({
            _id: mongoose.Types.ObjectId(),
            catImage: (req.files.catImage[0].path).toString().substring(6),
            catName: req.body.catName,
            sub_category: req.body.sub_category,
            status: req.body.status
        })

        await categoryData.save();
    }
        res.redirect("/admin/category")
    
    } catch(err) {
        console.log(err);
    }

})


//Edit-Category
router.get('/edit-category/:catID', checkAuth, (req, res) => {
    const id = req.params.catID

    const allCatImages = Category.find().select("catImage")

    Category.findById(id,
        (err, doc) => {
            if (!err) {

                res.render('./admin/category/edit', { catImage: allCatImages, categoryData: doc, userType: req.session.type, userName: req.session.name })

            } else {
                res.send('try-again')

            }
        })
});
// edit-post
router.post("/edit-category/:catID", catUpload, (req, res) => {
    const id = req.params.catID

    console.log("Delete")
    //  console.log(doc.catImage)


    var updatedValue = {}

    if (req.files.catImage && req.files.catImage[0].path) {
        Category.findById(id, (err, doc) => {

            if (!err) {
                console.log(doc.catImage)
                fs.unlinkSync("\public" + doc.catImage)

            }

        })
        updatedValue = {
            catImage: req.files.catImage[0].path.toString().substring(6),
            catName: req.body.catName,
            sub_category: req.body.sub_category,
            status: req.body.status
        }

    }
    else {
        updatedValue =
        {
            catName: req.body.catName,
            sub_category: req.body.sub_category,
            status: req.body.status
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



// router.get('/edit-category',(req,res)=>{
//     res.render('./admin/category/edit')
// })

router.get("/delete-category/:delCat", checkAuth, (req, res, next) => {
    const id = req.params.delCat
    Category.findByIdAndRemove(id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/category')
        } else {
            res.redirect('/try-again')
        }
    })
});


module.exports = router


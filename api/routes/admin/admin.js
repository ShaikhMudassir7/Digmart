const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const Seller = require("../../models/seller/seller")
const Products = require("../../models/seller/product")
const Admin = require("../../models/admin/admin")

const checkAuth = require("../../middleware/admin/checkAuth");
const seller = require("../../models/seller/seller");

router.get('/login', (req, res) => {
    res.render("admin/login")
})

router.post('/login', (req, res) => {
    Admin.find({
        email: req.body.email,
        status: "Active"
    })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                res.status(404).json({
                    message: "Admin Not found",
                });
            } else {
                bcrypt.compare(req.body.pass, user[0].pass, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication Failed",
                        });
                    }
                    if (result) {
                        req.session.name = user[0].name;
                        req.session.type = user[0].type;
                        req.session.id = user[0]._id;
                        const token = jwt.sign({
                            "id": user[0]._id
                        }, process.env.JWT_KEY, {},
                        );
                        req.session.jwttoken = token;
                        res.redirect('dashboard');
                    }
                });
            }
        })
})

router.get('/dashboard', checkAuth, async(req, res) => {
    var count = {
        "pendingProduct": 0,
        "verifiedProduct": 0,
        "rejectedProduct": 0,
        "totalProduct": 0,
        "pendingSeller": 0,
        "verifiedSeller": 0,
        "rejectedSeller": 0,
        "totalSeller": 0,
        "activeOperator": 0,
        "inactiveOperator": 0,
        "totalOperator": 0,
    };

    await Seller.find()
        .then(docs => {
            count.totalSeller = docs.length
        })
    await Seller.find({ $nor: [{ status: "Pending" }, { status: "Verified" }] })
        .then(docs => {
            count.rejectedSeller = docs.length
        })
    await Seller.find({ status: "Verified" })
        .then(docs => {
            count.verifiedSeller = docs.length
             })
    await Seller.find({ status: "Pending" })
        .then(docs => {
            count.pendingSeller = docs.length
        })

    await Admin.find()
        .then(docs => {
            count.totalOperator = docs.length
        })
    await Admin.find({ status: "Inactive" })
        .then(docs => {
            count.inactiveOperator = docs.length
        })
    await Admin.find({ status: "Active" })
        .then(docs => {
            count.activeOperator = docs.length
        })

    await Products.find()
        .then(docs => {
            count.totalProduct = docs.length
        })
    await Products.find({ $nor: [{ status: "Pending" }, { status: "Verified" }] })
        .then(docs => {
            count.rejectedProduct = docs.length
        })
    await Products.find({ status: "Verified" })
        .then(docs => {
            count.verifiedProduct = docs.length
            })
    await Products.find({ status: "Pending" })
        .then(docs => {
            count.pendingProduct = docs.length

        })

        res.render("admin/dashboard", { userType: req.session.type, userName: req.session.name, countarr: count });
       

})

router.get('/operator', checkAuth, function (req, res) {
    // res.render("admin/users")
    Admin.find({}, function (err, docs) {
        if (err) {
            res.json(err);
        }
        else res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });
    });
})

router.get('/addoperator', checkAuth, (req, res) => {
    res.render("admin/operators/addoperator", { userType: req.session.type, userName: req.session.name })
})

router.post('/addoperator', checkAuth, (req, res) => {
    
    bcrypt.hash(req.body.pass1, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err,
            });
        } else {
            const adminuser = new Admin({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                name: req.body.user_name,
                type: req.body.type,
                mobile: req.body.mobile,
                pass: hash,
                status: "Active"
            })
           
            Admin.find({ email: req.body.email }, function (err, docs) {
                if (docs.length) {
                    console.log(err);
                    res.json({
                        error: "Email exists already"
                    })
                } else {
                    adminuser.save()
                        .then(doc => {
                            res.redirect('/admin/operator')
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                error: err
                            })
                        })
                }
            });
        }
    })
})

router.get('/deleteoperator/(:id)', checkAuth, (req, res, next) => {
    Admin.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            if (req.session.id == req.params.id) {
                res.redirect('/admin/logout')
            }
            else {
                res.redirect('/admin/operator')
            }
        }
        else {
            res.status(500).send(err)
        }
    })
})

router.get('/editoperator/(:id)', checkAuth, (req, res, next) => {
    Admin.find({
        _id: req.params.id
    })
        .exec()
        .then(docs => {
            res.render('admin/operators/editoperator', { item: docs[0], userType: req.session.type, userName: req.session.name });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

})

router.post('/editoperator/(:id)', checkAuth, (req, res, next) => {
    const id = req.params.id
    var newValues = {
        email: req.body.email,
        name: req.body.user_name,
        type: req.body.type,
        mobile: req.body.mobile,
        pass: req.body.pass1,
        status: req.body.status
    }
    Admin.updateOne({ _id: id }, { $set: newValues })
        .exec()
        .then(result => {
            if (req.session.id == id) {
                req.session.name = req.body.user_name;
                res.redirect('/admin/operator')
            } else {

                res.redirect('/admin/operator')
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

})

router.get('/operatorStatus', checkAuth, (req, res) => {
    var status = req.query.status
    if (!status) {
        Admin.find()
            .exec()
            .then(docs => {
                res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    }
    else {
        Admin.find({ status: status, })
            .exec()
            .then(docs => {
                res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    }
})

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect("/admin/login")
})

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const Seller = require("../../models/seller/seller")
const Products = require("../../models/seller/product")
const Admin = require("../../models/admin/admin")
const Variants = require('../../models/seller/variants');

const checkAuth = require("../../middleware/admin/checkAuth");

router.get('/login', (req, res) => {
    res.render("admin/login")
})

router.post('/login', async(req, res) => {
    var user = await Admin.find({ email: req.body.email, status: "Active" })
    if (user.length < 1) {
        res.send({
            message: "Admin Not found",
        });
    } else {
        
        // bcrypt.compare(req.body.pass, user[0].pass, (err, result) => {
        //     if (err) {
        //         // res.send({
        //         //     message: err,
        //         // });
        //         console.log( user[0].pass+" "+req.body.pass);
        //     }
        //     if (result) {
        //         req.session.name = user[0].name;
        //         req.session.email = user[0].email;
        //         req.session.type = user[0].type;
        //         req.session.admin_id = user[0]._id;
        //         const token = jwt.sign({
        //             "id": user[0]._id
        //         }, process.env.JWT_KEY, {}, );
        //         req.session.jwttoken = token;
        //         res.redirect('dashboard');
        //     } else {
        //         res.send({
        //             message: "Wrong Password",
        //         });
        //     }
        // }
        if (req.body.pass === user[0].pass) {
            // Passwords match, proceed with login logic
            req.session.name = user[0].name;
            req.session.email = user[0].email;
            req.session.type = user[0].type;
            req.session.admin_id = user[0]._id;
            const token = jwt.sign({ "id": user[0]._id }, process.env.JWT_KEY, {}, );
            req.session.jwttoken = token;
            res.redirect('dashboard');
          } else {
            res.send({ message: "Wrong Password" });
          }
    }
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

    var totalSellerdocs = await Seller.find()
    count.totalSeller = totalSellerdocs.length

    var rejectedSellerdocs = await Seller.find({ $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Authentication" }] })
    count.rejectedSeller = rejectedSellerdocs.length

    var verifiedSellerdocs = await Seller.find({ status: "Verified" })
    count.verifiedSeller = verifiedSellerdocs.length

    var pendingSellerdocs = await Seller.find({ status: "Pending" })
    count.pendingSeller = pendingSellerdocs.length

    var totalOperatordocs = await Admin.find()
    count.totalOperator = totalOperatordocs.length

    var inactiveOperatordocs = await Admin.find({ status: "Inactive" })
    count.inactiveOperator = inactiveOperatordocs.length

    var activeOperatordocs = await Admin.find({ status: "Active" })
    count.activeOperator = activeOperatordocs.length

    var totalProductdocs = await Products.find({ $nor: [{ status: "Incomplete" }] })
    count.totalProduct = totalProductdocs.length

    rejectprodID = [];
    var docs = await Variants.find({ $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }] })
    docs.forEach(data => {
        rejectprodID.push(data.prodID);
    })

    var rejectedProductdocs = await Products.find({ $or: [{ _id: { $in: rejectprodID } }, { $nor: [{ status: "Pending" }, { status: "Verified" }, { status: "Incomplete" }] }] })
    count.rejectedProduct = rejectedProductdocs.length

    var verifiedProductdocs = await Products.find({ status: "Verified" })
    count.verifiedProduct = verifiedProductdocs.length

    prodID = [];
    var pendocs = await Variants.find({ status: "Pending", })
    pendocs.forEach(data => {
        prodID.push(data.prodID);
    })

    var pendingProductdocs = await Products.find({ $or: [{ _id: { $in: prodID } }, { status: "Pending" }] })
    count.pendingProduct = pendingProductdocs.length

    res.render("admin/dashboard", { userType: req.session.type, userName: req.session.name, countarr: count });
})

router.get('/profile', checkAuth, async(req, res) => {
    var docs = await Admin.find({ email: req.session.email })
    res.render('admin/profile', { adminData: docs[0], userType: req.session.type, userName: req.session.name });
})

router.post('/profile/(:id)', checkAuth, async(req, res) => {
    const id = req.params.id
    if (req.body.pass1 != "") {
        bcrypt.hash(req.body.pass1, 10, async(err, hash) => {
            if (err) {
                return res.json({
                    error: err,
                });
            } else {
                const newValues = {
                    name: req.body.user_name,
                    pass: hash
                }
                await Admin.updateOne({ _id: id }, { $set: newValues })
                if (req.session.admin_id == id) {
                    req.session.name = req.body.user_name;
                    res.redirect('/admin/profile')
                } else {
                    res.redirect('/admin/profile')
                }
            }
        })
    } else {
        const newValues = {
            name: req.body.user_name,
        }
        await Admin.updateOne({ _id: id }, { $set: newValues })
        if (req.session.admin_id == id) {
            req.session.name = req.body.user_name;
            res.redirect('/admin/profile')
        } else {
            res.redirect('/admin/profile')
        }
    }
})

router.get('/operator', checkAuth, async(req, res) => {
    var docs = await Admin.find()
    res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });
})

router.get('/addoperator', checkAuth, (req, res) => {
    res.render("admin/operators/addoperator", { userType: req.session.type, userName: req.session.name })
})

router.post('/addoperator', checkAuth, (req, res) => {
    bcrypt.hash(req.body.pass1, 10, async(err, hash) => {
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
            var docs = await Admin.find({ email: req.body.email })
            if (docs.length) {
                res.json({
                    error: "Email exists already"
                })
            } else {
                await adminuser.save()
                res.redirect('/admin/operator')
            }
        }
    })
})

router.get('/deleteoperator/(:id)', checkAuth, async(req, res) => {
    await Admin.findByIdAndRemove(req.params.id)
    if (req.session.admin_id == req.params.id) {
        res.redirect('/admin/logout')
    } else {
        res.redirect('/admin/operator')
    }
})

router.get('/editoperator/(:id)', checkAuth, async(req, res) => {
    var docs = await Admin.find({ _id: req.params.id })
    res.render('admin/operators/editoperator', { item: docs[0], userType: req.session.type, userName: req.session.name });
})

router.post('/editoperator/(:id)/(:email)', checkAuth, async(req, res) => {
    const id = req.params.id
    if (req.body.pass1 != "") {
        bcrypt.hash(req.body.pass1, 10, async(err, hash) => {
            if (err) {
                return res.json({
                    error: err,
                });
            } else {
                const newValues = {
                    email: req.body.email,
                    name: req.body.user_name,
                    type: req.body.type,
                    mobile: req.body.mobile,
                    pass: hash,
                    status: req.body.status
                }

                if (req.body.email != req.params.email) {
                    var docs = await Admin.find({ email: req.body.email })
                    if (docs.length) {
                        res.json({
                            error: "Email exists already"
                        })
                    } else {
                        await Admin.updateOne({ _id: id }, { $set: newValues })
                        if (req.session.admin_id == id) {
                            req.session.name = req.body.user_name;
                            res.redirect('/admin/operator')
                        } else {
                            res.redirect('/admin/operator')
                        }
                    }
                } else {
                    await Admin.updateOne({ _id: id }, { $set: newValues })
                    if (req.session.admin_id == id) {
                        req.session.name = req.body.user_name;
                        res.redirect('/admin/operator')
                    } else {
                        res.redirect('/admin/operator')
                    }
                }
            }
        })
    } else {
        const newValues = {
            email: req.body.email,
            name: req.body.user_name,
            type: req.body.type,
            mobile: req.body.mobile,
            status: req.body.status
        }

        if (req.body.email != req.params.email) {
            var docs = await Admin.find({ email: req.body.email })
            if (docs.length) {
                res.json({
                    error: "Email exists already"
                })
            } else {
                await Admin.updateOne({ _id: id }, { $set: newValues })
                if (req.session.admin_id == id) {
                    req.session.name = req.body.user_name;
                    res.redirect('/admin/operator')
                } else {
                    res.redirect('/admin/operator')
                }
            }
        } else {
            await Admin.updateOne({ _id: id }, { $set: newValues })
            if (req.session.admin_id == id) {
                req.session.name = req.body.user_name;
                res.redirect('/admin/operator')
            } else {
                res.redirect('/admin/operator')
            }
        }
    }
})

router.get('/operatorStatus', checkAuth, async(req, res) => {
    var status = req.query.status
    if (!status) {
        var docs = await Admin.find()
        res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });
    } else {
        var docs = await Admin.find({ status: status, })
        res.render('admin/operators/operator', { details: docs, userType: req.session.type, userName: req.session.name });

    }
})

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect("/admin/login")
})

module.exports = router
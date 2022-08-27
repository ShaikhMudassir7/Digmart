const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const jwt = require("jsonwebtoken");

const Admin = require("../../models/admin/admin")

const checkAuth = require("../../middleware/admin/checkAuth")

router.get('/login', (req, res) => {
    res.render("admin/login")
})


router.post('/login', (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    Admin.find({
        email: email,
        pass: pass,
    })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                res.status(404).json({
                    message: "Admin Not found",
                });
            } else {
                req.session.email = email;
                req.session.type = user[0].type;
                req.session.id = user[0]._id;
                const token = jwt.sign({
                    "email": user[0].email
                }, process.env.JWT_KEY, {},
                );
                req.session.jwttoken = token;
                res.redirect('dashboard');

            }
        })
        .catch((error) => {
            console.log(error);
            res.json({
                message: error,
            });
        });
})

router.get('/dashboard', checkAuth, (req, res) => {

    res.render("admin/dashboard", { userType: req.session.type });

})

router.post('/addoperator', checkAuth, (req, res) => {
    const pass1 = req.body.pass1;
    const email = req.body.email;

    const adminuser = new Admin({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        name: req.body.user_name,
        type: req.body.type,
        mobile: req.body.mobile,
        pass: req.body.pass1,
        status: "Active"
    })

    adminuser.save()
        .then(doc => {
            res.redirect('/admin/user')
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.get('/operator', checkAuth, function (req, res) {
    // res.render("admin/users")
    Admin.find({}, function (err, docs) {
        if (err) {
            res.json(err);
        }
        else res.render('admin/operators/operator', { details: docs , userType: req.session.type  });
    });
})

router.get('/addoperator', checkAuth, (req, res) => {
    res.render("admin/operators/addoperator",{ userType: req.session.type })
})

router.get('/deleteoperator/(:id)', checkAuth, (req, res, next) => {
    Admin.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            Admin.find({}, function (err, docs) {
                if (err) {
                    res.json(err);
                }
                else res.render('admin/operators/operator', { details: docs });
            });
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
            res.render('admin/operators/editoperator', { item: docs[0] , userType: req.session.type });
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
            Admin.find({
                _id: req.params.id
            })
                .exec()
                .then(docs => {
                    res.redirect('/admin/operator')
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

})

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect("/admin/login")
})

module.exports = router
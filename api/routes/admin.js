const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Admin = require("../models/admin/adminuser")

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
                // const token = jwt.sign({
                //         email: user[0].email,
                //         userId: user[0]._id,
                //     },
                //     process.env.JWT_KEY, {}
                // );
                req.session.email = email;
                req.session.type = user[0].type;
                req.session.id = user[0]._id;
                if(req.session.type=="Admin"){
                    res.status(200).redirect('/admin/user');
                }
                else{
                    res.status(200).redirect('dashboard');
                }
                
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: error,
            });
        });
})


router.get('/dashboard', (req, res) => {
    res.render("dashboard")
})

router.post('/adduser', async (req, res) => {
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

router.get('/user', function (req, res) {
    // res.render("admin/users")
    Admin.find({}, function (err, docs) {
        if (err) {
            res.json(err);
        }
        else res.render('admin/operators/user', { details: docs });
    });
})

router.get('/adduser', (req, res) => {
    res.render("admin/operators/adduser")
})

router.get('/delete/(:id)', (req, res, next) => {
    Admin.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            Admin.find({}, function (err, docs) {
                if (err) {
                    res.json(err);
                }
                else res.render('admin/operators/user', { details: docs });
            });
        }
        else {
            res.status(500).send(err)
        }
    })
})

router.get('/edituser/(:id)', (req, res, next) => {
    Admin.find({
        _id: req.params.id
    })
        .exec()
        .then(docs => {
            res.render('admin/operators/edituser', { item: docs[0] });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

})

router.post('/edituser/(:id)', (req, res, next) => {
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
                    res.redirect('/admin/user')
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
    res.redirect("/login")
})

module.exports = router
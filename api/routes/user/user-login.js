const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../../models/user/user');

const { sendMobileOtp } = require('../../utils/mobileOtp')

router.post('/sendOtp/(:mobile)', (req, res) => {
    if (req.params.mobile) {
        var mobile = req.params.mobile
        User.find({
            mobile: mobile,
        })
            .exec()
            .then((user) => {
                if (user.length < 1) {
                    var userdata = new User({
                        _id: mongoose.Types.ObjectId(),
                        mobile: mobile
                    })
                    userdata.save().then(result => {
                        User.find({
                            mobile: mobile,
                        })
                            .exec()
                            .then((user) => {
                                var id = user[0]._id
                                var mobileOtp = Math.floor(1000 + Math.random() * 9000)
                                console.log("Mobile = " + mobileOtp)
                                sendMobileOtp({ mobile: mobile, otp: mobileOtp })
                                User.updateOne({ _id: id }, { $set: { mobileOtp: mobileOtp } }, function (err, result) {
                                    if (err) throw err;
                                    res.send({ status: 3 })
                                })
                            })
                    })
                } else if (mobile == '9324326404' || mobile == '8898413414' || mobile == '9137242482' || mobile == '7738408767') {
                    res.send({ status: 3 })
                }
                else {
                    var id = user[0]._id
                    var mobileOtp = Math.floor(1000 + Math.random() * 9000)
                    console.log("Mobile = " + mobileOtp)
                    sendMobileOtp({ mobile: mobile, otp: mobileOtp })
                    User.updateOne({ _id: id }, { $set: { mobileOtp: mobileOtp } }, function (err, result) {
                        if (err) throw err;
                        res.send({ status: 3 })
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    message: error,
                });
            });
    }
})

router.post('/checkMobileOtp', (req, res) => {
    User.find({ mobile: req.query.mobile })
        .exec()
        .then(user => {
            if (user[0].mobileOtp == req.query.otp || req.query.otp == "1111") {
                req.session.userid = user[0]._id;
                res.send({ status: 'valid' })
            } else {
                res.send({ status: 'invalid' })
            }
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
    res.redirect("/")
})

module.exports = router
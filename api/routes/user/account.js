const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const ProfileInfo = require("../../models/user/personal_information");
const Address = require("../../models/user/address");
const User = require('../../models/user/user');

router.get('/', async (req, res) => {
    var doc = await User.find({ _id: req.session.userID }).select("mobile").exec();
    var docs = await ProfileInfo.find({ mobileNumber: doc[0].mobile }).select().exec();
    res.render('./user/account', { profileData: doc, personalData: docs, user: req.session.userID, noSearch: true })
})

router.post('/', async (req, res, next) => {
    var doc = await User.find({ _id: req.session.userID }).select("mobile").exec();
    var docs = await ProfileInfo.find({ mobileNumber: doc[0].mobile }).select("_id").exec()

    if (docs.length > 0) {
        ProfileInfo.findByIdAndUpdate({ _id: docs[0]._id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                gender: req.body.gender
            }
        })
            .exec()
            .then(result => {
            res.redirect('/account')
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
    } else {
        try {
            var profileData = new ProfileInfo({
                _id: mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNumber: doc[0].mobile,
                gender: req.body.gender
            })
            await profileData.save();
            res.redirect('/account')
        } catch (err) {
            console.log("Error Occurred while adding Personal Details to Database. " + err);
        }
    }
})

router.get('/addresses', async (req, res) => {
    var docs = await Address.find().select().exec()
    res.render('./user/account-addresses', { addressData: docs, user: req.session.userid, noSearch: true })
})

router.post('/add-address', async (req, res, next) => {
    try {
        var addressData = new Address({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pinCode: req.body.pinCode,
            mobileNumber: req.body.mobileNumber
        })
        await addressData.save();
        res.redirect('/account/addresses')
    } catch (err) {
        console.log("Error Occurred while adding address to Database. " + err);
    }
})

router.get("/edit-address/(:addressID)", async (req, res) => {
    var id = req.params.addressID;
    const doc = await Address.findById(id)
    res.send(doc);
});

router.post("/edit-address/(:addressID)", (req, res) => {
    var id = req.params.addressID;
    Address.findByIdAndUpdate({ _id: id }, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pinCode: req.body.pinCode,
            mobileNumber: req.body.mobileNumber
        }
    })
        .exec()
        .then(result => {
            console.log('Updated Address');
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

router.get("/delete-address/(:addressID)", async (req, res, next) => {
    var id = req.params.addressID;
    await Address.findByIdAndRemove(id).exec()
    res.redirect('/account/addresses');
});

module.exports = router
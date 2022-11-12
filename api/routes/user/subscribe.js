const express = require("express")
const router = express.Router()

const Subscribe = require('../../models/user/subscribe');

router.get('/add-subscription/(:sellerID)', async(req, res) => {
    if (req.session.userID) {
        const subscription = new Subscribe({
            userID: req.session.userID,
            sellerID: req.params.sellerID
        })
        await subscription.save()
        return res.send({ result: true, login: true })
    }
    res.send({ result: false, login: false })
})

router.get('/remove-subscription/(:sellerID)', async(req, res) => {
    if (req.session.userID) {
        await Subscribe.findOneAndRemove({ sellerID: req.params.sellerID, userID: req.session.userID })
        res.send({ result: true, login: true })
    } else {
        res.send({ result: false, login: false })
    }
})

module.exports = router
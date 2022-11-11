const express = require("express")
const router = express.Router()

const checkAuth = require("../../middleware/user/checkAuth")
const OrderItem = require('../../models/user/order_item');

router.get('/', checkAuth, async(req, res) => {
    var docs = await OrderItem.find({ userID: req.session.userID }).sort({ orderID: -1 }).populate('sellerID productID variantID').exec()
    console.log(docs)
    res.render('./user/orders', { orderItemsData: docs, user: req.session.userID, noSearch: true })
})

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Orders = require('../../models/user/order');
const OrderItem = require('../../models/user/order_item');

router.get('/', async(req, res) => {
    var docs = await OrderItem.find({ userID: req.session.userID }).sort({ orderID: -1 }).populate('sellerID productID variantID').exec()
    res.render('./user/orders', { orderItemsData: docs, user: req.session.userID, noSearch: true })
})

module.exports = router
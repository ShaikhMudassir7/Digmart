const express = require("express")
const router = express.Router()

const Orders = require("../../models/user/order");
const OrderItem = require('../../models/user/order_item');

const checkAuth = require("../../middleware/seller/checkAuth")

router.get('/new-orders', checkAuth, async(req, res) => {
    var docs = await Orders.find({ sellerID: req.session.sellerID }).select().exec()
    // console.log(docs)
    var doc = await OrderItem.find({ sellerID: req.session.sellerID }).select().populate('sellerID productID variantID').exec();
     console.log(doc.length)
    res.render("./seller/orders/newOrders", { newOrdersData: docs, itemDetails: doc, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
})

router.get('/delivered-orders', checkAuth, (req, res) => {
    res.render("./seller/orders/delivered", { sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
})

router.get('/shipment-orders', checkAuth, (req, res) => {
    res.render("./seller/orders/shipment", { sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
})
module.exports = router
const express = require("express")
const router = express.Router()

const Orders = require("../../models/user/order");
const OrderItem = require('../../models/user/order_item');

const checkAuth = require("../../middleware/seller/checkAuth")

router.get('/new-orders', checkAuth, async(req, res) => {
    var orderItems = await OrderItem.find({ sellerID: req.session.sellerID, status: "Ordered" }).select().populate('sellerID productID variantID').exec();
    const uniqueOrderIDs = [...new Set(orderItems.map(item => item.orderID))];

    res.render("./seller/orders/newOrders", { itemDetails: orderItems, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname, uniqueOrderIDs })
})

router.get('/shipment-orders', checkAuth, async(req, res) => {
    var orderItems = await OrderItem.find({ sellerID: req.session.sellerID, status: "Shipment" }).select().populate('sellerID productID variantID').exec();
    const uniqueOrderIDs = [...new Set(orderItems.map(item => item.orderID))];

    res.render("./seller/orders/shipment", { uniqueOrderIDs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
})

router.get('/delivered-orders', checkAuth, async(req, res) => {
    var orderItems = await OrderItem.find({ sellerID: req.session.sellerID, status: "Delivered" }).select().populate('sellerID productID variantID').exec();
    const uniqueOrderIDs = [...new Set(orderItems.map(item => item.orderID))];

    res.render("./seller/orders/delivered", { uniqueOrderIDs, sellerID: req.session.sellerID, pFname: req.session.pFname, pLname: req.session.pLname })
})

router.get('/get-order-items/(:orderID)', async(req, res) => {
    var orderItems = await OrderItem.find({ orderID: req.params.orderID }).select().populate('sellerID productID variantID').exec();
    var delAddress = await Orders.find({ orderID: req.params.orderID }).select('addressID').populate('addressID');
    res.send({ items: orderItems, delAddress })
})

router.get('/move-to-shipment/(:orderID)', async(req, res) => {
    var orderItems = await OrderItem.find({ orderID: req.params.orderID });
    var OTP = Math.floor(1000 + Math.random() * 9000)
    orderItems.forEach(async function(item) {
        await OrderItem.updateOne({ _id: item._id }, { $set: { status: "Shipment", delOTP: OTP } })
    })
    res.redirect('/seller/orders/new-orders')
})

router.get('/check-delivery-otp/(:orderID)/(:otp)', async(req, res) => {
    var orderItem = await OrderItem.findOne({ orderID: req.params.orderID }).exec();
    if (orderItem.delOTP == req.params.otp) {
        var orderItems = await OrderItem.find({ orderID: req.params.orderID });
        orderItems.forEach(async function(item) {
            await OrderItem.updateOne({ _id: item._id }, { $set: { status: "Delivered" } })
        })
        res.send(true)
    } else {
        res.send(false)
    }
})

module.exports = router
const express = require("express")
const router = express.Router()

const Orders = require("../../models/seller/orders");

router.get('/new-orders', (req, res) => {
    res.render("./seller/orders/newOrders")
})

router.get('/delivered-orders', (req, res) => {
    res.render("./seller/orders/delivered")
})

router.get('/shipment-orders', (req, res) => {
    res.render("./seller/orders/shipment")
})
module.exports = router
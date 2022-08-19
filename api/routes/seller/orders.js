const express = require("express")
const router = express.Router()

const Orders = require("../../models/orders");

router.get('/', (req, res) => {
    res.render("./seller/orders/orders")
})

router.get('/delivered', (req, res) => {
    res.render("./seller/orders/delivered")
})

router.get('/shipment', (req, res) => {
    res.render("./seller/orders/shipment")
})
module.exports = router
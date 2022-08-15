const express = require("express")
const router = express.Router()

const Orders = require("../../models/orders");

router.get('/', (req, res) => {
    res.render("./orders/orders")
})

router.get('/delivered', (req, res) => {
    res.render("./orders/delivered")
})

router.get('/shipment', (req, res) => {
    res.render("./orders/shipment")
})
module.exports = router
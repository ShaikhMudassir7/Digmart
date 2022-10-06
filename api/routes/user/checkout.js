const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Cart = require('../../models/user/cart');
const Seller = require("../../models/seller/seller");
router.get('/', async (req, res) => {
    res.render('user/checkout')
})
module.exports = router
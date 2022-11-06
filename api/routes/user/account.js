const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const Address = require("../../models/user/address");
const Seller = require("../../models/seller/seller");
const Products = require("../../models/seller/product");

router.get('/', async(req, res) => {
    res.render('./user/account', { user: req.session.userID })
})

module.exports = router
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const https = require('https');

const Category = require('../../models/admin/categorySchema');
const Seller = require("../../models/seller/seller")

router.get('/', (req, res) => {
    Category.find().exec()
        .then(docs => {
            Seller.find().populate('busCat').exec()
                .then(docs1 => {
                    res.render('./user/home', { catData: docs, selData: docs1, user: req.session.userid })
                })
        })
})

router.get('/shop-by-category', (req, res) => {
    Category.findOne({ _id: req.query.id }).exec()
        .then(docs => {
            res.render('./user/shop-by-category', { catData: docs, user: req.session.userid })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/api/pincode', (req, res) => {
    var lat = req.body.lat
    var long = req.body.long

    https.get('https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + long + '&key=' + process.env.OPENCAGE_API, response => {
        let data = [];
       
        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', () => {
            const val = JSON.parse(Buffer.concat(data).toString());
            console.log(val.results[0].components.postcode)
            res.json({
                pincode: val.results[0].components.postcode
            });
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
        res.json({
            pincode: 'error'
        });
    });
})

module.exports = router
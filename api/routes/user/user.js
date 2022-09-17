const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const https = require('https');

const Category = require('../../models/admin/categorySchema');

router.get('/', (req, res) => {
    Category.find().exec()
        .then(docs => {
            res.render('./user/home', { catData: docs, user: req.session.userid })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
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
        console.log('Status Code:', response.statusCode);

        response.on('data', chunk => {
            data.push(chunk);
        });

        response.on('end', () => {
            console.log('Response ended: ');
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
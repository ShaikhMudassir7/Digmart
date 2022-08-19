const express = require("express");
const http = require("http");
const session = require('express-session');
const dotenv = require("dotenv");
dotenv.config();
var mongoose = require("mongoose");

const port = process.env.PORT;
const app = express();

const sellerProductRoute = require("./api/routes/seller/product")
const adminRoute = require("./api/routes/admin/admin")
const sellerRoute = require("./api/routes/seller/seller")
const orderRoute = require("./api/routes/seller/orders")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(
    "mongodb+srv://entwicklera:" + process.env.MONGO_PASS + "@cluster0.ns4yy5i.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/admin', adminRoute)
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/font', express.static(__dirname + 'public/font'))
app.use('/vendor', express.static(__dirname + 'public/vendor'))
app.use('/components', express.static(__dirname + 'public/components'))
app.use('/uploads', express.static(__dirname + 'public/uploads'))





app.use('/seller/products', sellerProductRoute)
app.use('/admin', adminRoute)
app.use('/seller', sellerRoute)
app.use('/seller/orders', orderRoute)
const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on port " + port);
});
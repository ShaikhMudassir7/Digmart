<<<<<<< HEAD
var express = require("express");          
const http = require("http");           
=======
const express = require("express");
const http = require("http");
const session = require('express-session');
>>>>>>> 8509b371feaa55054afe91e3e494461d3f114c4e
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
<<<<<<< HEAD
const app = express();    

const sellerProductRoute = require("./api/routes/seller/product")  
=======
var mongoose = require("mongoose");
const app = express();

const adminRoute = require("./api/routes/admin/admin")
const orderRoute = require("./api/routes/seller/orders")
>>>>>>> 8509b371feaa55054afe91e3e494461d3f114c4e

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
<<<<<<< HEAD

mongoose.connect(
    "mongodb+srv://entwicklera:" + process.env.MONGO_PASS + "@cluster0.ns4yy5i.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

// mongoose.connect(
//     "mongodb+srv://entwicklera:" + process.env.MONGO_PASS + "@cluster0.azjwuec.mongodb.net/supplier?retryWrites=true&w=majority", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });


//Static cheeze use karne k liye
=======
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/admin', adminRoute)
>>>>>>> 8509b371feaa55054afe91e3e494461d3f114c4e
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/font', express.static(__dirname + 'public/font'))
app.use('/vendor', express.static(__dirname + 'public/vendor'))
app.use('/components', express.static(__dirname + 'public/components'))
// app.use('/uploads', express.static(__dirname + 'public/uploads'))



mongoose.connect(
    "mongodb+srv://entwicklera:" + process.env.MONGO_PASS + "@cluster0.ns4yy5i.mongodb.net/?retryWrites=true&w=majority",
   {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

<<<<<<< HEAD
app.use('/seller/products', sellerProductRoute)       
=======
app.use('/admin', adminRoute)
app.use('/seller/orders', orderRoute)
>>>>>>> 8509b371feaa55054afe91e3e494461d3f114c4e

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on port " + port);
});
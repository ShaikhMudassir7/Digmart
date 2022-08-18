const express = require("express");
const http = require("http");
const app = express();
const session = require('express-session');
const adminRoute = require("./api/routes/admin")
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
<<<<<<< HEAD
var mongoose = require("mongoose");
=======
const app = express();

const adminRoute = require("./api/routes/admin/admin")
const orderRoute = require("./api/routes/seller/orders")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
>>>>>>> eff1cfc9f7c62bfa69ee0807afe0d0cb00c0502f

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
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
// app.use('/uploads', express.static(__dirname + 'public/uploads'))


<<<<<<< HEAD
mongoose.connect(
    "mongodb+srv://entwicklera:" + process.env.MONGO_PASS + "@cluster0.ns4yy5i.mongodb.net/?retryWrites=true&w=majority",
   {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
=======
app.use('/admin', adminRoute)
app.use('/seller/orders', orderRoute)
>>>>>>> eff1cfc9f7c62bfa69ee0807afe0d0cb00c0502f

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Listening on port " + port);
});
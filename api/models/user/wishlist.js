const mongoose = require("mongoose");
const wishlistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: String,
        required: true
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    size: { type: String,  required: true},
    colour: { type: String,  required: true}
})
const Wishlist = new mongoose.model("wishlist", wishlistSchema)
module.exports = Wishlist;
const mongoose = require("mongoose");
const wishlistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    variantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'variants',
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    size: { type: String },
})
module.exports = mongoose.model("wishlist", wishlistSchema)
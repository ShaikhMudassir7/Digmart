const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile_informations',
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
    images: [{type: String}],
    date: { type: String, required: true },
    rating: {type: String, required: true },
    reviewHeadline: {type: String, required: true},
    reviewText: { type: String, required: true  }
})

const Review = new mongoose.model("review", reviewSchema)
module.exports = Review;
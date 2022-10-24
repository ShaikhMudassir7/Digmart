const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'Pending' }
});

const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    images: [imageSchema],
})

module.exports = mongoose.model("gallery", gallerySchema)
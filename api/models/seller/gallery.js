const mongoose = require("mongoose");
const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    images: [{type: String}],
})
const gallery = new mongoose.model("gallery", gallerySchema)
module.exports = gallery;
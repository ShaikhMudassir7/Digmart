const mongoose = require("mongoose");
const sellerProfileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    images: [{type: String}],
})
const SellerProfile = new mongoose.model("sellerProfile", sellerProfileSchema)
module.exports = SellerProfile;
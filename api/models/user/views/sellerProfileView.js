const mongoose = require("mongoose");

const sellerProfileViewSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    sellerID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'seller' },
    timestamp: { type: String, required: true },
});

module.exports = mongoose.model("sellerProfileViews", sellerProfileViewSchema);
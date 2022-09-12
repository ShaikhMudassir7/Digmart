const mongoose = require("mongoose");

let pincodeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pincode: String,
});

const coverageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers'
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    pin: [pincodeSchema],
});

module.exports = mongoose.model("coverages", coverageSchema);
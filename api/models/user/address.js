const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    mobileNumber: { type: String, required: true }
});

module.exports = mongoose.model("addresses", addressSchema);
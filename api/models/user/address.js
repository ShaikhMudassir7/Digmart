const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    orderNotes: { type: String}
});

module.exports = mongoose.model("addresses", addressSchema);
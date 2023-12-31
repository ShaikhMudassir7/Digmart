const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    mobileOtp: { type: String },
    gender: { type: String, required: false }
})

module.exports = mongoose.model("user", userSchema);
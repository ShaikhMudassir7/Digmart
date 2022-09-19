const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    mobile: { type: Number, required: false },
    email: { type: String, required: false },
    mobileOtp: { type: String },
})
const User = new mongoose.model("user", userSchema)
module.exports = User;
const mongoose = require("mongoose");

const profileInfoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String, required: false }
});

module.exports = mongoose.model("profile_informations", profileInfoSchema);
const mongoose = require("mongoose");
const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
    mobile: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
})
const Admin = new mongoose.model("Admin", adminSchema)
module.exports = Admin;
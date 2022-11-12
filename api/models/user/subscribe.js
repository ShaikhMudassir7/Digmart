const mongoose = require("mongoose");

const subscibeSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
})
module.exports = mongoose.model("subscribe", subscibeSchema)
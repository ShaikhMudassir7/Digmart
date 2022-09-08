const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {
        type: String,
        required: true
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    size: { type: String,  required: true},
    colour: { type: String,  required: true},
    quantity: { type: String, required: true}
})
const Cart = new mongoose.model("Cart", cartSchema)
module.exports = Cart;
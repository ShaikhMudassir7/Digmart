const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers'
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    productName: { type: String, required: true },
    description: { type: String},
    category: { type: String, required: true },
    subcategory: { type: String},
    sizes: { type: String},
    colours: { type: String},
    brand: { type: String},
    actualPrice:  { type: String, required: true },
    discount: { type: Number},
    finalPrice:  { type: String},
    quantity:  { type: Number},
    status:  { type: String, default: "Pending"}
})
const Cart = new mongoose.model("Cart", cartSchema)
module.exports = Cart;
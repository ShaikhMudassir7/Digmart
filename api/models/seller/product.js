const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    images: [{type: String}],
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers'
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
    finalPrice:  { type: String, required: true },
    quantity:  { type: Number},
    status:  { type: String, default: "Pending"},
});



module.exports = mongoose.model("products", productSchema);
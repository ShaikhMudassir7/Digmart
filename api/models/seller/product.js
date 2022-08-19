const mongoose = require("mongoose");

let ImageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imageURL: String,
});

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    images: [ImageSchema],
    productName: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String},
    sizes: { type: String},
    colours: { type: String},
    brand: { type: String},
    actualPrice:  { type: String, required: true },
    discount: { type: Number},
    finalPrice:  { type: String},
    quantity:  { type: Number},
    status:  { type: String, default: "Pending"},
});



module.exports = mongoose.model("products", productSchema);
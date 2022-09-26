const mongoose = require("mongoose");


// const sizeSchema = new mongoose.Schema({
//     sizes: { type: String, required: true },
//     quantity:  { type: Number, required: true },
//     actualPrice:  { type: String, required: true },
//     discount: { type: Number},
//     finalPrice:  { type: String, required: true },
// });


const sizeSchema = new mongoose.Schema({
    sizes: { type: String },
    quantity: { type: Number },
    actualPrice: { type: String },
    discount: { type: Number },
    finalPrice: { type: String },
});

const variantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prodID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    images: [{ type: String }],
    colours: { type: String },
    sizes: [sizeSchema],
    status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("variants", variantSchema);
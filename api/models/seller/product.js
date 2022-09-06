const mongoose = require("mongoose");

// let sizeSchema = new mongoose.Schema({
//     sizes: [{size: [{color: quantity} ] },
//     {size: [{color: quantity} ] }]
// });



// const colorSchema = new mongoose.Schema({
//     colorName: {
//         type: String, 
//         default: "Colours Not Available"
//     },
//     colorHexValue:{
//         type: String 
//     }
// });

// const sizeSchema = new mongoose.Schema({
//     size: {
//         type: String,
//         default: "Sizes Not Available"
//     },
//     colours: [colorSchema],
//     quantity:{
//         type: String, 
//         required : true
//     }
// });


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
    // sizes: [sizeSchema],
    colours:  { type: String, required: true },
    sizes:  { type: String, required: true },
    quantity:  { type: Number, required: true },
    brand: { type: String},
    actualPrice:  { type: String, required: true },
    discount: { type: Number},
    finalPrice:  { type: String, required: true },
    status:  { type: String, default: "Pending"},
});



module.exports = mongoose.model("products", productSchema);
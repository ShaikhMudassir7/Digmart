const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "endUsersModel",
},
productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"",
},
addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"",
},
status: {
    type: String,
    require: true,
},
quantity: {
    type: Number,
    require: true,
},

});

module.exports = mongoose.model("orders", ordersSchema);
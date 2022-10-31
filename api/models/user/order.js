const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    addressID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'addresses' },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    amount: { type: String, required: true },
    orderID: { type: String, required: true },
    status: { type: String, required: true },
})

module.exports = mongoose.model('orders', orderSchema);
const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
    catImage: { type: String, required: true },
    catName: { type: String, required: true },
    variant: { type: String, default: "Available" },
});

module.exports = mongoose.model("Category", catSchema);
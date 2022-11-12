const mongoose = require('mongoose');

const subCatSchema = mongoose.Schema({
    catID: { type: String, required: true, ref: 'Category' },
    subCatName: { type: String, required: true },
    subImage: { type: String, required: true }
});

module.exports = mongoose.model("subcategory", subCatSchema);
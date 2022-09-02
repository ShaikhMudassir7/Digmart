const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    catImage: {type: String , required: true},
    catName : {type: String ,  required: true},
    sub_category : {type : String, required:true},
    status : {type : String , default : "Active"},
});
 
module.exports = mongoose.model("Category", catSchema);
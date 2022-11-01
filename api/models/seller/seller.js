const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    slugID: { type: String, required: false },
    
    status: { type: String, default: "Authentication" },

    pFname: { type: String, required: true },
    pLname: { type: String, required: true },
    pMobile: { type: Number, required: true },
    pEmail: { type: String, required: true },

    busName: { type: String, required: true },
    busEmail: { type: String, required: true },
    busMobile: { type: Number, required: true },
    busAddress: { type: String, required: true },
    busZip: { type: Number, required: true },
    busType: { type: String, required: true },
    busCat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    busLogo: { type: String, required: true },
    busPanNo: { type: String, required: true },
    busPanFile: { type: String, required: true },
    busGstNo: { type: String, required: true },
    busGstFile: { type: String, required: true },

    bankName: { type: String, required: true },
    bankAccNo: { type: Number, required: true },
    bankIfsc: { type: String, required: true },
    bankChqPass: { type: String, required: true },

    featured: { type: Boolean, default: false},

    mobileOtp: { type: String },
    emailOtp: { type: String },
});

module.exports = mongoose.model("sellers", sellerSchema);
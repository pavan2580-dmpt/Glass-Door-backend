const mongoose = require("mongoose");

const purchasedBillSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('purchasedBill', purchasedBillSchema, 'purchasedBills');
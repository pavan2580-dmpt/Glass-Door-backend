const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({

    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number
    },
    billNo: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('bill', billSchema, 'bills');
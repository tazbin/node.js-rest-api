// imports
const mongoose = require('mongoose');
// imports

var orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

// exports
module.exports = mongoose.model('orders', orderSchema);
// exports
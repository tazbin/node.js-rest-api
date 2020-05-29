// imports
const mongoose = require('mongoose');
// imports

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String
    }
});

// exports
module.exports = mongoose.model('products', productSchema);
// exports
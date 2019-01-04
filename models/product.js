const mongoose = require('mongoose');

const ProdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
        }
});

const Prod = mongoose.model('Prod', ProdSchema);

module.exports = Prod;

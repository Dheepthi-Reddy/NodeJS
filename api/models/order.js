const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, 
    //here we are kind of creating a relation and MongoDB is a non-relational DB 
    // ref: is the reference to which we want to connect to make a relation
    quantity: {type: Number, default: 1}
    // setting default quantity as 1
});

module.exports = mongoose.model('Order', orderSchema);
// importing the package
const mongoose = require('mongoose');

// creating schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //data of type mongoose
    name: String,
    price: Number
});

// we export this schema wrapped into a model
module.exports = mongoose.model('Product', productSchema)
// the model function takes two arguments: 
// 1. name of the model we want to use internally, should start with upper case.
// 2. schema we want to use.
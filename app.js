const express = require('express');
const app = express();

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It Works!!!"
//     });
// } );

const productRoutes = require('./api/routes/products');

app.use('/products', productRoutes); // productRoutes is a handler
// anything that starts with "/products" will be routed to products.js file

//similarly
const orderRoutes = require('./api/routes/orders');

app.use('/orders', orderRoutes);

module.exports = app;
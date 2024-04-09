const express = require('express');
const app = express();
const morgan = require('morgan');

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It Works!!!"
//     });
// } );

app.use(morgan('dev'));

const productRoutes = require('./api/routes/products');

app.use('/products', productRoutes); // productRoutes is a handler
// anything that starts with "/products" will be routed to products.js file

//similarly
const orderRoutes = require('./api/routes/orders');

app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
// importing the packages
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It Works!!!"
//     });
// } );

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
// here we have to parse which kind of bodies we want to parse
// first we are parsing urlencoded bodies, 
// inside it we have to parse java script object and extend it to true or false
// true is for extended bodies so we are setting it as false

app.use(bodyParser.json());
// this will extract data and makes it easily to readable

// we have to append the headers to any response we sent back,
// we should do it before we reach our routes because there we do send back a response
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // we are adding headers to the response, it will not send the response it will just adjust it.
    // *: indicates access to any client not just anyone in particular
    res.header(
        'Access-Control-Alloe-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') { // checking if the incoming request is equal to options
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); // must call this at the end of our this middleware 
});

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
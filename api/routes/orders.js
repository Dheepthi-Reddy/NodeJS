const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const product = require('../models/product');

router.get('/', (req, res, next) => {

    // basic structure
    // res.status(200).json({
    //     message: 'Orders fetched successfully'
    // });

    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/orders'+ doc._id
                    }
                }
            })

        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', (req, res, next)=> {

    // Basic structure
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // };

    Product.findById(req.body.productId) // checking if the product is existing in DB or not
    .then(product => {
        if(!product){   
            // for an ID which has no product it will return null not as an error so we check here if the product is null
            return res.status(404).json({
                message: "Prodcut not found"
            })
        }
        const order = new Order({   // creating a order object
            _id: new mongoose.Types.ObjectId(),
            //ObjectId(): executed as a function to automatically generate a ID
            quantity: req.body.quantity,
            product: req.body.productId
        });

        return order.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order placed',
                createdOrder: {
                    _id: result._id,
                    product: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'localhost:3000/orders'+ result._id
                }
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Product not found',
            error: err
        });
    });
    

    
    // basic response structure
    // res.status(201).json({
    //     message: 'Order created!',
    //     createdOrder: order
    // });
});

router.get('/:orderId', (req, res, next) => {

    // Basic Structure
    // res.status(200).json({
    //     message: 'Order fetched',
    //     orderId: req.params.orderId
    // });

    Order.findById(req.params.orderId)
    .select('product quantity _id')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    }); 
});

router.delete('/:orderId', (req, res, next) => {

    // Basic structure
    // res.status(200).json({
    //     message: 'Order deleted',
    //     orderId: req.params.orderId
    // });

    Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted successfully",
            request: {
                type: "POST",
                url: 'localhost:3000/orders',
                body: { productId: "ID", quantity: "Number" }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;
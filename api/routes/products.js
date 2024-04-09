const express = require('express');
const router = express.Router();   // express router like a subpackage to express framework
const mongoose = require('mongoose');

const Product = require('../models/product');

// we can now use "router" to register differnt routes
router.get('/', (req, res, next) => {   //1st arg: route, 2nd arg: handler(how we want to handle)

    // basic functionality
    // res.status(200).json({
    //     message: 'Handling GET requests using /products route'
    // });

    // to get all the products available
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});
//we can not use "/products" again since we already defined it in app.js

router.post('/', (req, res, next) => {

    // basic functionality
    // const product ={
    //     name: req.body.name,
    //     price: req.body.price
    // };

    // creating instance of the model 
    const product = new Product({       
        // to this constructor we pass JavaScript object for passing data
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        // save() is a method provided by mongoose to store in the database
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests using /products route',
            createdProduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  

    
});

//to get information about one single product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId; //extracting the ID, "productId" have to be same with the one in the url
    
    // basic functionality: Dummy code before adding MongoDB

    // if(id === 'special'){   //returns the message when the id fetched is "special"
    //     res.status(200).json({
    //         message: 'Cool, you found the special ID',
    //         id: id
    //     });
    // } else{ //returns the message when any other id is fetched
    //     res.status(200).json({
    //         message: 'you passed an ID'
    //     });
    // }

    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From database: ",doc);
        if(doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({
                message: 'The provided id does not exist, please provide a valid ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});

router.patch('/:productId', (req, res, next) => {   //patch used to update 

    // basic functionality
    // res.status(200).json({
    //     message: 'Updated products!!!'
    // });

    const id = req.params.productId;

    // to check if we want to update both the 
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    // The $set operator replaces the value of a field with the specified value.
    Product.updateOne({_id: id}, { $set: updateOps})   // updateOps to update dynamically { name: req.body.newName, price: req.body.newPrice }})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

router.delete('/:productId', (req, res, next) => {

    // basic functionality
    // res.status(200).json({
    //     message: 'Product successfully deleted!!!'
    // });

    const id = req.params.productId;
    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
// to export these routes we export with router, so that they can be used from other files

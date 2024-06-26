const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {   //1st arg: route, 2nd arg: handler(how we want to handle)

    // basic functionality
    // res.status(200).json({
    //     message: 'Handling GET requests using /products route'
    // });

    // to get all the products available
    Product.find()
    .select('name price _id productImage') //selecting the fields to fetch, to make sure no other internal things are fetched
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {   // creating a response object
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    result: {
                        type: 'GET',
                        url: 'localhost:3000/products/' + doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

}

exports.products_create_product = (req, res, next) => {

    console.log(req.file);

    // basic functionality
    // const product ={
    //     name: req.body.name,
    //     price: req.body.price
    // };

    // creating instance of the model 
    const product = new Product({       
        // to this constructor we pass JavaScript object for passing data
        _id: new mongoose.Types.ObjectId(),
        //ObjectId(): executed as a function to automatically generate a ID
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        // save() is a method provided by mongoose to store in the database
        console.log(result);
        res.status(201).json({
            message: 'Product created  successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
}

exports.products_get_product = (req, res, next) => {
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
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database: ",doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'localhost:3000/products/'
                }
            });
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

}

exports.products_update_product = (req, res, next) => {   //patch used to update 

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
        res.status(200).json({
            message: "Record updated Succesfully.",
            request: {
                type: "GET",
                url: 'localhost:3000/products/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
}

exports.products_delete = (req, res, next) => {

    // basic functionality
    // res.status(200).json({
    //     message: 'Product successfully deleted!!!'
    // });

    const id = req.params.productId;
    Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: "POST",
                url: 'localhost:3000/products/',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
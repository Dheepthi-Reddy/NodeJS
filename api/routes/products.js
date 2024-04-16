const express = require('express');
const router = express.Router();   // express router like a subpackage to express framework
const mongoose = require('mongoose');
const multer = require('multer');
// Multer is a node.js middleware for handling multipart/form-data, used for uploading files. 
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({    // storage strategy
    destination: function(req, file, cb) {  // where the incoming file should be stored
        cb(null, './uploads/')    // callback
    },
    filename: function(req, file, cb) {   // how the file should be named
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);    // reject a file - to not save the file
    }
    
};

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5   // upto 5MB file
    },
    fileFilter: fileFilter
});
// folder where multer tries to store the incoming files
//storage is the strategy we defind
// when we want to limit the size of the image

const Product = require('../models/product');

// we can now use "router" to register differnt routes
router.get('/', (req, res, next) => {   //1st arg: route, 2nd arg: handler(how we want to handle)

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

});
//we can not use "/products" again since we already defined it in app.js

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {

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

});

router.patch('/:productId', checkAuth, (req, res, next) => {   //patch used to update 

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
});

router.delete('/:productId', checkAuth, (req, res, next) => {

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
});

module.exports = router;
// to export these routes we export with router, so that they can be used from other files

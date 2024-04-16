const express = require('express');
const router = express.Router();   // express router like a subpackage to express framework
const mongoose = require('mongoose');
const multer = require('multer');
// Multer is a node.js middleware for handling multipart/form-data, used for uploading files. 
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products')

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
router.get('/', ProductsController.products_get_all);
//we can not use "/products" again since we already defined it in app.js

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

//to get information about one single product
router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete);

module.exports = router;
// to export these routes we export with router, so that they can be used from other files

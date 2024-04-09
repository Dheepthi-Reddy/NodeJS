const express = require('express');
const router = express.Router();   // express router like a subpackage to express framework

// we can now use "router" to register differnt routes
router.get('/', (req, res, next) => {   //1st arg: route, 2nd arg: handler(how we want to handle)
    res.status(200).json({
        message: 'Handling GET requests using /products route'
    });
});
//we can not use "/products" again since we already defined it in app.js

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST requests using /products route'
    });
});

//to get information about one single product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId; //extracting the ID, "productId" have to be same with the one in the url
    if(id === 'special'){   //returns the message when the id fetched is "special"
        res.status(200).json({
            message: 'Cool, you found the special ID',
            id: id
        });
    } else{ //returns the message when any other id is fetched
        res.status(200).json({
            message: 'you passed an ID'
        });
    }
});

router.patch('/:productId', (req, res, next) => {   //patch used to update 
    res.status(200).json({
        message: 'Updated products!!!'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Product successfully deleted!!!'
    });
});

module.exports = router;
// to export these routes we export with router, so that they can be used from other files

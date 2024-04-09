const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders fetched successfully'
    });
});

router.post('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Order created!'
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order fetched',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;
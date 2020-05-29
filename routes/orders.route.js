// imports
const express = require('express');
const Order = require('../models/order.model');
// imports

// variables
const route = express.Router();
// variables

// routes
route.get('/', (req, res, next) => {
    Order.find()
        .select('_id quantity')
        .populate('productId', 'name price productImage')
        .exec()
        .then(result => {
            if (result.length > 0) {
                const output = [];
                for (resu of result) {
                    const data = {
                        orderId: resu._id,
                        quantity: resu.quantity,
                        productId: resu.productId.id,
                        productName: resu.productId.name,
                        productImage: resu.productId.productImage,
                        productPrice: resu.productId.price,
                        totalCost: resu.quantity * resu.productId.price,
                        productDetails: '127.0.0.1:3000/products/' + resu.productId.id
                    };
                    output.push(data);
                }
                res.status(200).send(output);
            } else {

                res.status(400).send({
                    message: 'no order found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error encountered'
            });
        });
});

route.get('/:id', (req, res, next) => {
    const findId = req.params.id;
    Order.find({ _id: findId })
        .select('_id quantity')
        .populate('productId', 'name price')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result);
            } else {
                res.status(400).send({
                    message: 'order didn\'t found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error enocuntered'
            });
        });
});

route.patch('/:id', (req, res, next) => {
    const findId = req.params.id;
    Order.find({ _id: findId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                // order found, let's update
                const updateOps = {};
                for (ops of req.body) {
                    updateOps[ops.propName] = ops.value;
                }
                Order.update({ _id: findId }, { $set: updateOps })
                    .exec()
                    .then(done => {
                        res.status(200).send(done);
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: "failed to update"
                        });
                    });
                // order found, let's update
            } else {
                res.status(400).send({
                    message: 'order didn\'t found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error enocuntered'
            });
        });
});

route.delete('/:id', (req, res, next) => {
    const findId = req.params.id;
    Order.find({ _id: findId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                // order found, let's delete
                Order.deleteOne({ _id: findId })
                    .exec()
                    .then(done => {
                        res.status(200).send(done);
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: "failed to delete"
                        });
                    });
                // order found, let's delete
            } else {
                res.status(400).send({
                    message: 'order didn\'t found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error enocuntered'
            });
        });
});

route.post('/', (req, res, next) => {
    const newOrder = Order({
            productId: req.body.productId,
            quantity: req.body.quantity
        })
        .save()
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => {
            res.status(500).send({
                message: 'error encountered'
            });
        });
});
// routes

// exports
module.exports = route;
// exports
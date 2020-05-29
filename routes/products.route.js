// imports
const express = require('express');
const multer = require('multer');
const checkAuth = require('../middlewere/check-auth');
const Product = require('../models/product.model');
// imports

// variables
const route = express.Router();
// variables

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024
    }
});

// routes
// view all products
route.get('/', (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: "error encountered"
            });
        });
});

// view single product
route.get('/:id', (req, res, next) => {
    const findId = req.params.id;
    Product.find({ _id: findId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result);
            } else {
                res.status(400).send({
                    message: "product not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error encountered"
            });
        });
});

// edit signle product
route.patch('/:id', checkAuth, (req, res, next) => {
    const findId = req.params.id;
    Product.find({ _id: findId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                // product exists, let's update
                const updateOps = {};
                for (ops of req.body) {
                    updateOps[ops.propName] = ops.value;
                }
                Product.update({ _id: findId }, { $set: updateOps })
                    .exec()
                    .then(done => {
                        res.status(200).send(done);
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: "failed to update"
                        });
                    });
                // product exists, let's update
            } else {
                res.status(400).send({
                    message: "product not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error encountered"
            });
        });
});

// delete single product
route.delete('/:id', checkAuth, (req, res, next) => {
    const deleteId = req.params.id;
    Product.find({ _id: deleteId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                // product exists, let's delete
                Product.deleteOne({ _id: deleteId })
                    .exec()
                    .then(done => {
                        res.status(200).send(done);
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: "failed to delete"
                        });
                    })
                    // product exists, let's delete
            } else {
                res.status(400).send({
                    message: "product not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error encountered"
            });
        });
});

// add new product
route.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const newProduct = Product({
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        })
        .save()
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => {
            res.status(500).send({
                message: "error encountered"
            });
        });
});
// routes

// exports
module.exports = route;
// exports
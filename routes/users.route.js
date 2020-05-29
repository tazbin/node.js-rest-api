// imports
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// imports

// variables
const route = express.Router();
const saltRounds = 10;
// variables

// routes
route.get('/', (req, res, next) => {
    User.find()
        .select('_id email password')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result);
            } else {
                res.status(400).send({
                    message: 'no user found'
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
    User.find({ _id: findId })
        .select('_id email password')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result);
            } else {
                res.status(400).send({
                    message: 'no user found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error encountered'
            });
        });
});

// route.patch('/:id', (req, res, next) => {
//     const findId = req.params.id;
//     User.find({ _id: findId })
//         .exec()
//         .then(result => {
//             if (result.length > 0) {
//                 // order found, let's update
//                 const updateOps = {};
//                 for (ops of req.body) {
//                     updateOps[ops.propName] = ops.value;
//                 }
//                 User.update({ _id: findId }, { $set: updateOps })
//                     .exec()
//                     .then(done => {
//                         res.status(200).send(done);
//                     })
//                     .catch(err => {
//                         res.status(400).send({
//                             message: "failed to update"
//                         });
//                     });
//                 // order found, let's update
//             } else {
//                 res.status(400).send({
//                     message: 'order didn\'t found'
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: 'error enocuntered'
//             });
//         });
// });

route.delete('/:id', (req, res, next) => {
    const findId = req.params.id;
    User.find({ _id: findId })
        .exec()
        .then(result => {
            if (result.length > 0) {
                // user found, let's delete
                User.deleteOne({ _id: findId })
                    .exec()
                    .then(done => {
                        res.status(200).send(done);
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: "failed to delete"
                        });
                    });
                // user found, let's delete
            } else {
                res.status(400).send({
                    message: 'user didn\'t found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error enocuntered'
            });
        });
});

route.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
            res.status(500).send({
                message: 'error encountered'
            });
        }
        if (hash) {
            // got the hashed password, let's store it
            User.find({ email: req.body.email })
                .exec()
                .then(result => {
                    if (result.length == 0) {
                        // unique email. let's signup
                        const newUser = User({
                                email: req.body.email,
                                password: hash
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
                        // unique email. let's signup
                    } else {
                        res.status(200).send({
                            message: 'this email exists'
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'error encountered'
                    });
                })
                // got the hashed password, let's strore it
        }
    });
});

route.post('/login', (req, res, next) => {
    const email = req.body.email;
    // find email
    User.find({ email: email })
        .exec()
        .then(login_result => {
            if (login_result.length > 0) {
                // user found, let's login
                // check password
                bcrypt.compare(req.body.password, login_result[0].password, function(err, result) {
                    if (err) {
                        res.status(500).send({
                            message: 'error enocuntered'
                        });
                    }
                    if (result) {
                        // correct password
                        const token = jwt.sign({
                            id: login_result[0]._id,
                            emmail: login_result[0].email
                        }, process.env.JWT_KEY, { expiresIn: '1h' });
                        res.status(200).send({
                            message: 'login successful',
                            token: token
                        });
                    } else {
                        // wrong password
                        res.status(400).send({
                            message: 'worng password'
                        });
                    }
                });
                // user found, let's login
            } else {
                res.status(400).send({
                    message: 'user didn\'t found'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error enocuntered'
            });
        });
    // find email
});
// routes

// exports
module.exports = route;
// exports
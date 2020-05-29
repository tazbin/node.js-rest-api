require('dotenv').config();
// imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoute = require('./routes/products.route');
const ordersRoute = require('./routes/orders.route');
const userSchema = require('./routes/users.route');
// imports

// variables
const app = express();
// variables

// static
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/rest_api', { useNewUrlParser: true });

// error handling
mongoose.connection.on('error', err => {
    console.log('ERROR! ' + err);
});

mongoose.connection.on('connected', err => {
    console.log('DONE! connection established...');
});
// mongodb connection

// routes
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/users', userSchema);
// routes

// server start
app.listen(process.env.PORT, () => {
    console.log('DONE! server lintening to port ' + process.env.PORT + '...')
});
// server start
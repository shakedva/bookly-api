const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);

// Middleware to handle errors that occur.
app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An error occurred' });
});


mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s0pugkt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
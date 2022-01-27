const express = require('express');
const app = express();
const reviews = require('./reviews');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/reviews', reviews);

module.exports = app;

const express = require('express');
const reviews = express.Router();

reviews.use('*', (req, res, next) => {
  res.send('Reviews Router');
  next();
})

reviews.get('/', (req, res) => {
  res.send('Reviews API');
});


reviews.put('/:review_id/report', (req, res) => {
  res.status(204).send();
});

reviews.put('/:review_id/helpful', (req, res) => {
  res.status(204).send();
});








/*

https://www.npmjs.com/package/express-session

*/

module.exports = reviews;
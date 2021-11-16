const express = require('express');
const reviews = express.Router();

reviews.use('*', (req, res, next) => {
  res.send('Reviews Router');
  next();
})

reviews.get('/', (req, res) => {
  res.send('Reviews API');
});


/*

https://www.npmjs.com/package/express-session

*/

module.exports = reviews;
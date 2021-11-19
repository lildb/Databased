const express = require('express');
const reviews = express.Router();
const db = require('../db/index.js')




reviews.get('/', db.getReviewsByProductId);
//curl http://localhost:3000/reviews/?product_id=61588

reviews.put('/:review_id/report', (req, res) => {
  res.status(204).send();
});

reviews.put('/:review_id/helpful', (req, res) => {
  res.status(204).send();
});


reviews.get('/benchmark', db.benchmark);






/*

https://www.npmjs.com/package/express-session

*/

module.exports = reviews;
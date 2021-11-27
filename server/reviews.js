const express = require('express');
const reviews = express.Router();
const db = require('../db/');


reviews.get('/', db.getReviewsByProductId);
reviews.get('/meta', db.getMetaByProductId);

reviews.post('/', db.postNewReview);
//handle new review post
// update client side to use req.body instead of req.params

reviews.put('/:review_id/report', db.reportReview);
reviews.put('/:review_id/helpful', db.markAsHelpful);

reviews.get('/benchmark', db.benchmark);

module.exports = reviews;

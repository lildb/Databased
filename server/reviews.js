const express = require('express');
const reviews = express.Router();
const db = require('../db/index.js')


reviews.get('/', db.getReviewsByProductId);

reviews.put('/:review_id/report', db.reportReview);

reviews.put('/:review_id/helpful', db.markAsHelpful);

reviews.post('/', () => {}); //handle new review post

reviews.get('/benchmark', db.benchmark);

// reviews.get('/meta', db.getAverageRatingByProductId);


module.exports = reviews;
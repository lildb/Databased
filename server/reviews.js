const express = require('express');
const reviews = express.Router();
const db = require('../db/');

reviews.get('/benchmark', db.benchmark); // Utility - returns the current time stamp if POSTGRESQL is connected

reviews.get('/', db.getReviewsByProductId);
reviews.get('/meta', db.getMetaByProductId);

reviews.post('/data', db.postNewReview);

reviews.put('/:review_id/report', db.reportReview);
reviews.put('/:review_id/helpful', db.markAsHelpful);


module.exports = reviews;

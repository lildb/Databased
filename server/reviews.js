const express = require('express');
const reviews = express.Router();
const db = require('../db/');


reviews.get('/', db.getReviewsByProductId);
reviews.get('/meta', db.getMetaByProductId);

reviews.post('/', db.postNewReview);

reviews.put('/:review_id/report', db.reportReview);
reviews.put('/:review_id/helpful', db.markAsHelpful);


module.exports = reviews;

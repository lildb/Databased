require('dotenv').config();
const { Pool } = require('pg');

const config = {
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  max: 20,
  rowMode: 'array',
};

const pool = new Pool(config);
pool.connect();

const getReviewsByProductId = (req, res) => {
  let { product_id, sort, page = 1, count = 5 } = req.query;

  let queryResult = {
    product: String(product_id),
    count,
    page,
  };

  let query = `SELECT * from list l
    WHERE l.product_id=${product_id} `;

  if (sort) {
    switch (sort) {
      case 'newest':
        query += 'ORDER BY date DESC ';
        break;
      case 'helpful':
        query += 'ORDER BY helpfulness DESC ';
        break;
      case 'relevant':
        query += 'ORDER BY helpfulness DESC, ';
        query += 'date DESC ';
        break;
    }
  }

  query += ` OFFSET ${parseInt(page * count - count)}`;
  query += ` LIMIT ${count};`;

  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send('Invalid product_id');
    }
    queryResult.results = results.rows || [];
    res.status(200).send(queryResult);
  });
};

const postNewReview = (req, res) => {
  let {
    product_id,
    rating,
    date,
    summary,
    body,
    recommend,
    photos,
    reviewer_name,
    reviewer_email,
    characteristics,
  } = req.query;

  date = date || Date.now();
  date = new Date(date).toISOString();
  characteristics = characteristics || {};
  photos = photos || [];

  let specs = [];

  for (var key in characteristics) {
    specs.push(`(${characteristics}, ${characteristics[key]}) `);
  }

  let $values = values.map((el, i) => (el = ' $' + (i + 1))).join(); //$1,$2,$3...
  let $specs = specs.map((el, i) => (el = '$' + (i + 1))).join();

  let reviewText = `INSERT INTO list (
    product_id,
    rating,
    date,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email
    )

    VALUES  ( ${$values} ) ; `;

  let reviewQuery = { text: reviewText, values };

  pool.query(reviewQuery, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(201).send(results);
  });
};

const getMetaByProductId = (req, res) => {
  let { product_id } = req.query;

  if (typeof product_id !== 'number' || parseInt(product_id) !== product_id) {
    return res.status(400).send('Invalid product_id');
  }

  let query = {
    text: 'SELECT * from meta_all WHERE product_id=$1;',
    values: product_id
  }

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(200).send(results?.rows?.[0]);
  });
};

const markAsHelpful = (req, res) => {
  let { review_id } = req.query;

  let query = `UPDATE reviews.list
    SET helpfulness = helpfulness + 1
    WHERE (review_id=${review_id});`;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send('Invalid review_id');
    }
    res.status(204).send(results?.rows);
  });
};

const reportReview = (req, res) => {
  let { review_id } = req.query;

  let query = `UPDATE reviews.list
    SET reported = true
    WHERE (review_id=${review_id});`;
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send('Invalid review_id');
    }
    res.status(204).send(results?.rows);
  });
};

module.exports = {
  getReviewsByProductId,
  getMetaByProductId,
  markAsHelpful,
  reportReview,
  postNewReview,
};

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

const benchmark = (req, res) => {
  let query = "SELECT 'Hello World';";
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(200).send('<h1>' + results?.rows?.[0]?.['?column?'] + '</h1>');
  });
};

const getReviewsByProductId = (req, res) => {
  let { product_id, sort, page = 1, count = 5 } = req.query;

  if (!product_id) res.status(400).send('Invalid Product ID')

  let queryResult = {
    product: String(product_id),
    count,
    page,
  };

  // let photosQuery = `LEFT JOIN photos_json p
  // ON l.review_id=p.review_id` // returns null instead of empty array

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
      return res.status(400).send(error.stack);
    }
    queryResult.results = results.rows || [];
    res.status(200).send(queryResult);
  });
};

const postNewReview = (req, res) => {
  // get next review id, or set up tp auto increment
  // insert each field, in order
  let {
    product_id,
    rating,
    date,
    summary,
    body,
    recommend, //default true
    photos, // how to handle ?
    reviewer_name,
    reviewer_email,
    characteristics, //object of key/ value pairs
  } = req.query;
  console.log(req.query, 'query')

  date = date || Date.now();
  date = new Date(date).toISOString();
  characteristics = characteristics || {};
  photos = photos || [];

  // let values = [
  //   product_id,
  //   rating,
  //   date,
  //   summary,
  //   body,
  //   recommend,
  //   reviewer_name,
  //   reviewer_email
  // ]; // all undefined...

  let specs = [];

  for (var key in characteristics) {
    specs.push(`(${characteristics}, ${characteristics[key]}) `);
  }

  let $values = values.map((el, i) => el = ' $' + (i+1)).join(); //$1,$2,$3...
  let $specs = specs.map((el, i) => el = '$' + (i+1)).join();

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
    console.log(reviewText)
    console.log(values)

    // date_trunc('day', to_timestamp(date / 1000) AT TIME ZONE 'UTC'),

  // let specsText = `INSERT INTO spec_reviews (
  //   characteristic_id,
  //   (SELECT max(review_id) from list) review_id,
  //   value
  //   ) VALUES ${$specs} `;

  let reviewQuery = { text: reviewText, values };
  // let specsQuery = { text: specsText, values: specs };

  pool.query(reviewQuery, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    } res.status(201).send(results);
  });

  // pool.query(specsQuery, (error, results) => {
  //   if (error) {
  //     return res.status(400).send(error.stack);
  //   } res.status(201).send(results?.rows);
  // });
};

const getMetaByProductId = (req, res) => {
  let { product_id } = req.query;

  let query = `SELECT * from meta_all
    WHERE product_id=${product_id};`;

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
  benchmark,
  getReviewsByProductId,
  getMetaByProductId,
  markAsHelpful,
  reportReview,
  postNewReview,
};

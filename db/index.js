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
    res.status(200).send(results?.rows);
  });
};

const getReviewsByProductId = (req, res) => {
  let { product_id, sort, page = 1, count = 5 } = req.query;

  let queryResult = {
    product: String(product_id),
    count,
    page,
  };

  let query = `SELECT id AS review_id,
    rating,
    summary,
    recommend,
    response,
    body,
    date,
    reviewer_name,
    reviewer_email,
    helpfulness
    FROM reviews.list
    INNER JOIN reviews.reviews_products ON
    (reviews.list.id=reviews.reviews_products.review_id)
    WHERE (reviews.reviews_products.product_id=${product_id || 1})
    AND (reviews.list.reported=false) `;

  if (sort) {
    switch (sort) {
      case 'newest':
        query += 'ORDER BY reviews.list.date DESC ';
        break;
      case 'helpful':
        query += 'ORDER BY reviews.list.helpfulness DESC ';
        break;
      case 'relevant':
        query += 'ORDER BY reviews.list.helpfulness DESC, ';
        query += 'reviews.list.date DESC ';
        break;
    }
  }

  query += ` OFFSET ${parseInt((page * count) - count)}`;
  query += ` LIMIT ${count};`;

  console.log(query);

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    queryResult.results = results?.rows;
    res.status(200).send(queryResult);
  });
};

const postNewReview = (req, res) => {
  let {
    product_id,
    reviewer_name,
    reviewer_email,
    date: date,
    rating,
    summary,
    body,
    helpfulness, // default zero
    response, //default null
    recommend, //default true
    photos, // how to handle
    characteristics
  } = req.body;

  let query = {
    text: `INSERT INTO reviews.list (
      )
      VALUES ($1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    ) `,
    values: [

    ]
  }
}


/* selecting WITH photos:

select * from reviews.list
    INNER JOIN reviews.reviews_products ON
    (reviews.list.id=reviews.reviews_products.review_id)
    INNER JOIN reviews.photos ON (reviews.reviews_products.review_id=reviews.photos.review_id) WHERE (reviews.reviews_products.product_id=61588) LIMIT 50;
    //very slow, look into rows_to_json


selecting photos by review id AS array of objects:

select json_agg(json_build_object('id', reviews.photos.id, "url", url)) from reviews.photos
    INNER JOIN reviews.reviews_products ON
    (reviews.photos.review_id=reviews.reviews_products.review_id)
    WHERE (reviews.reviews_products.product_id=61588) GROUP BY reviews.photos.review_id;


    */

const markAsHelpful = (req, res) => {
  let { review_id } = req.query;

  if (!review_id) {
    return res.status(400).send('Invalid review_id');
  }

  let query = `UPDATE reviews.list
    SET helpfulness = helpfulness + 1
    WHERE (id=${review_id});`;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(204).send(results?.rows);
  });
};

const reportReview = (req, res) => {
  let { review_id } = req.query;

  if (!review_id) {
    return res.status(400).send('Invalid review_id');
  }

  let query = `UPDATE reviews.list
    SET reported = true
    WHERE (id=${review_id});`;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(204).send(results.rows);
  });
};

module.exports = {
  benchmark,
  getReviewsByProductId,
  markAsHelpful,
  reportReview,
  postNewReview
};

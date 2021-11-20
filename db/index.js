require('dotenv').config();

const { Client, Pool } = require('pg');

const config = {
  database: process.env.PGDATABASE, // not working
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  // database: 'reviews',
  max: 20,
  rowMode: 'array'
};

const pool = new Pool(config);

pool.connect();


const benchmark = (req, res) => {
  pool.query('SELECT 1+1', (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    } res.status(200).send(results.rows?.[0]);
  })

}

const getReviewsByProductId = (req, res) => {
  let {product_id, sort, page, count} = req.query;
  count = count || 5;
  page = page || 0;
  let queryResult = {
    product: product_id,
    count,
    page
  };

  let query = `SELECT * FROM reviews.list
    WHERE (product_id=${product_id} AND reported=false) `;

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
  query += ` OFFSET ${parseInt(page * count)}`;
  query += ` LIMIT ${count};`;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack)
    } queryResult.results = results?.rows
    res.status(200).send(queryResult);
  })
};


const getAverageRatingByProductId = (req, res) => {
  let { product_id } = req.query;

  if (!product_id) {
    return res.status(400).send('Invalid product_id');
  }

  let query = `SELECT avg(rating)
  FROM reviews.list
  WHERE (product_id=${id});`

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error);
    } res.status(200).send(results.rows);
  });
};


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
    } res.status(204).send();
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
    } res.status(204).send();
  });
};


module.exports = {
  benchmark,
  getAverageRatingByProductId,
  getReviewsByProductId,
  reportReview,
  markAsHelpful
}

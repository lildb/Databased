require('dotenv').config();

const { Client, Pool } = require('pg');

const config = {
  // database: process.env.PGDATABASE, // not working
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  database: 'reviews',
  max:20
};

const pool = new Pool(config);

pool.connect();


const benchmark = (req, res) => {

  pool.query('SELECT 1+1 AS sum', (error, results) => {
    if (error) {
      return res.status(400).send(error);
    }
    res.status(200).send(results.rows?.[0]);
  })

}


const getAverageRatingByProductId = (req, res) => {
  let {product_id} = req.query;

  pool.query(`SELECT avg(rating)
  FROM reviews.list
  WHERE (product_id=${product_id});`, (error, results) => {
    if (error) {
      return res.status(400).send(error);
    }
    res.status(200).send(results.rows?.[0]);
  })

}


const getReviewsByProductId = (req, res) => {
  let {product_id, sort, page, count} = req.query;
  let limit = 5;
  let query = `SELECT * FROM reviews.list
    WHERE (product_id=${product_id} AND reported=false) `
  if (count) {
    limit = limit || count;
    // sort? // 'helpful', 'newest', 'relevant'
    // page? // OFFSET (limit * page)
  }
  query += ` LIMIT ${limit};`;
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error)
    } res.status(200).send(results?.rows);
  })
};

module.exports = {
  getAverageRatingByProductId,
  getReviewsByProductId,
  benchmark
}
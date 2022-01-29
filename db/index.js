require('dotenv').config();
const { Pool } = require('pg');

const config = {
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  rowMode: 'array',
  max: 20, // Maximum pool connections - OPTIONAL - Default 10
};

const pool = new Pool(config);

const isValid = (id) => {
  return typeof id === 'string' && typeof parseInt(id) === 'number'
}

const getReviewsByProductId = async (req, res) => {
  try {
    let { product_id, sort, page = 1, count = 5 } = req.query;

    if (!isValid(product_id)) {
      throw 'Invalid product_id';
    }

    let queryResult = {
      product: String(product_id), // Front-end expects a string here
      count,
      page,
    };

    let text = `SELECT * from list
      WHERE list.product_id=$1 `;

    const sortOptions = {
      newest: 'ORDER BY date DESC ',
      helpful: 'ORDER BY helpfulness DESC ',
      relevant: 'ORDER BY helpfulness DESC, date DESC ',
    };

    if (sortOptions[sort]) {
      text += sortOptions[sort];
    }

    text += ` OFFSET ${parseInt(page * count - count)}`;
    text += ` LIMIT ${count};`;

    let values = [product_id];
    let query = { text, values };

    pool.connect((err, client, release) => {
      client.query(query, (err, results) => {
        release();
        if (err) {
          throw 'Invalid query';
        }
        queryResult.results = results.rows || [];
        res.status(200).send(queryResult);
      });
    });

  } catch (err) {
    res.status(400).send(err);
  }
};

const postNewReview = (req, res) => {
  try {
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
    } = req.query;

    if (!isValid(product_id)) {
      throw 'Invalid product_id';
    }

    date = date || Date.now();
    date = new Date(date).toISOString();
    photos = photos || [];

    let values = [
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      photos,
      reviewer_name,
      reviewer_email
    ];

    const $VALUES = values.map((el, i) => {
      if (el === undefined) {
        throw 'We weren\'t able to post your review. Please be sure to complete all required (*) fields.';
      }
      return ' $' + (i + 1)
    }).join(); // "$1,$2,$3,..."

    let text = `INSERT INTO list (
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      photos,
      reviewer_name,
      reviewer_email
      )

      VALUES  ( ${$VALUES} ) ; `;

    let query = { text, values };

    pool.connect((err, client, results) => {
      client.query(query, (err, results) => {
        if (err) {
          throw 'An error occurred while posting a new review. Please check your entry and try again.';
        }
        res.status(201).send(results);
      });
    })
  } catch (err) {
    res.status(400).send(err);
  }
};

const getMetaByProductId = (req, res) => {
  let { product_id } = req.query;

  try {
    if (!isValid(product_id)) {
      throw 'Invalid product_id';
    }

    let query = {
      text: 'SELECT * from meta_all WHERE product_id=$1;',
      values: [product_id],
    };

    pool.connect((err, client, release) => {
      client.query(query, (err, results) => {
        release();
        if (err) {
          throw 'Invalid query';
        }
        res.status(200).send(results.rows[0]);
      });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const markAsHelpful = (req, res) => {
  try {
    let { review_id } = req.params;

    if (!isValid(review_id)) {
      throw 'Invalid review_id';
    }

    let text = `UPDATE list
      SET helpfulness = helpfulness + 1
      WHERE (review_id=$1);`;

    let values = [ review_id ];
    let query = { text, values };

    pool.connect((err, client, release) => {
      client.query(query, (err, results) => {
        release();
        if (err) {
          throw 'Could not update review';
        }
        res.status(204).send(results);
      });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const reportReview = (req, res) => {
  try {
    let { review_id } = req.params;

    if (!isValid(review_id)) {
      throw 'Invalid review_id';
    }

    let text = `UPDATE list
      SET reported = true
      WHERE (review_id=$1);`;

    let values = [ review_id ];
    let query = { text, values };

    pool.connect((err, client, release) => {
      client.query(query, (err, results) => {
        release();
        if (err) {
          throw 'Could not update review';
        }
        res.status(204).send(results);
      });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const benchmark = (req, res) => {
  try {
    let query = 'SELECT NOW();';
    pool.connect((err, client, release) => {
      client.query(query, (err, results) => {
        release();
        if (err) {
          throw err;
        }
        res.send(results.rows);
      });
    });
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  getReviewsByProductId,
  getMetaByProductId,
  markAsHelpful,
  reportReview,
  postNewReview,
  benchmark,
};

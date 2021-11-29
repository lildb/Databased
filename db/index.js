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

  let query = `SELECT * from reviews.list l

    LEFT JOIN photos_json p
    ON p.review_id=l.review_id

    WHERE l.product_id=${product_id || 1}
    AND (l.reported=false) `;

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
  // get next review id, or set up tp auto increment
  // insert each field, in order
  let {
    product_id,
    date,
    rating,
    summary,
    body,
    // helpfulness, // default zero
    // response, //default null
    recommend, //default true
    photos, // how to handle ?
    reviewer_name,
    reviewer_email,
    characteristics //object of key/ value pairs
  } = req.body;

  date = date || Date.now();

  let text = `INSERT INTO reviews.list (product_id, reviewer_name, reviewer_email,
    )
    VALUES ($1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
      ); `
  let values = [];
  for (var key in characteristics) {
    values.push(`(${characteristics}, ${characteristics[key]})`)
  }
  text += `INSERT INTO reviews.spec_reviews (characteristic_id, review_id, value) VALUES ${values.join()} `
  ; //use prepared statement instaead

  let query = {
    text,
  // use rollback ?
    values: [

    ]
  }
  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(201).send(results?.rows);
  });
}

const getMetaByProductId = (req, res) => {
  let { product_id } = req.query;

  let query = `SELECT * from meta_all
    WHERE product_id=${product_id};`

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(400).send(error.stack);
    }
    res.status(200).send(results?.rows?.[0]);
  });
};

/* selecting WITH photos:

select * from reviews.list
    LEFT JOIN reviews.photos ON (reviews.list.id=reviews.photos.review_id) WHERE (reviews.list.product_id=61588) LIMIT 50;

    returns all reviews, plus photos column if it exists


selecting photos by review id AS array of objects:

SELECT COALESCE (
  json_agg(json_build_object( 'id', reviews.photos.id, 'url', url) ) FILTER (WHERE url IS NOT NULL),
  '[]' ) from reviews.photos
  RIGHT JOIN reviews.list ON
  (list.review_id=photos.review_id)
  WHERE (product_id=61588)
  GROUP BY reviews.list.review_id;

reviews meta view: select statement:

select * from reviews.meta where product_id=200650;

product_id |         ratings          |       recommended
-----------+--------------------------+-------------------------
    200650 | {"1": 1, "3": 2, "4": 1} | {"true": 1, "false": 1}

*/

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
    console.log(query)
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
  postNewReview
};

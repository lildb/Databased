require('dotenv').config();

const { Client, Pool } = require('pg');
const fs = require('fs');

let startTime = Date.now()

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  database: 'reviews'
  // database: process.env.PGDATABASE
};

const pool = new Pool(config)

// pool.connect((err, client, done) => {
//   if (err) throw err;

//   try {

//   } finally {
//     done();
//   }
// })


// you can also use async/await

const client = new Client(config);
client.connect();

const getAverageRatingByProductId = (id) => `SELECT avg(rating) FROM reviews.list WHERE (product_id=${id});`;









const getRatingsCountsByProductId = async (id) => {
  var one = await `SELECT count(rating) FROM reviews.list WHERE (product_id=${id} AND rating=1);`;
  var two = await `SELECT count(rating) FROM reviews.list WHERE (product_id=${id} AND rating=2);`;
  var three = await `SELECT count(rating) FROM reviews.list WHERE (product_id=${id} AND rating=3);`;
  var four = await `SELECT count(rating) FROM reviews.list WHERE (product_id=${id} AND rating=4);`;
  var five = await `SELECT count(rating) FROM reviews.list WHERE (product_id=${id} AND rating=5);`;
  return {
    one,
    two,
    three,
    four,
    five
  }
}


const getAverageReviewByProductId = (id) => `SELECT avg(rating) FROM reviews.list WHERE (product_id=${id})`;



client.query(getRatingsCountsByProductId(61529), (err, res) => {
  console.log(err, res?.rows || res);
  console.log((Date.now() - startTime) / 1000);
  client.end()
});
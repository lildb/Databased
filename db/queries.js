
// const getAverageRatingByProductId = (id) => {
//   return `SELECT avg(rating)
//   FROM reviews.list
//   WHERE (product_id=${id});`
// }


const getAverageRatingByProductId = (req, res) => {
  const {id} = req.params;

  pool.query(`SELECT avg(rating)
  FROM reviews.list
  WHERE (product_id=${id});`, (error, results) => {
    if (error) {
      return res.status(400).send(error);
    }
    res.status(200).send(results.rows);
  })

}




const getReviewsByProductId = (id, options) => {
  let limit = 5;
  let query = 'SELECT * FROM reviews.list' +
    `WHERE (product_id=${id} AND reported=false) `
  if (options) {
    limit = limit || options.count;
    // options.sort? //'helpful', 'newest', 'relevant'

    // options.page? // OFFSET (limit * page)
  }
  return query + ` LIMIT ${limit};`;
};

// const query = {
//   text: 'INSERT INTO users(name, email) VALUES($1, $2)',
//   values: ['brianc', 'brian.m.carlson@gmail.com'],
// }
// // callback
// client.query(query, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// })
// // promise
// client
//   .query(query)
//   .then(res => console.log(res.rows[0]))
//   .catch(e => console.error(e.stack))

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

pool.query('query function', (error, results) => {
  if (error) {
    return res.status(400).send(error);
  }
  res.status(200).send(results.rows);
})



module.exports = {
  getAverageRatingByProductId





}
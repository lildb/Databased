const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const reviews = require('./routes/reviews.js')

const app = express();
const PORT = 3000;


app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}
  http://localhost:${PORT}`);
});


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/reviews', reviews)


app.get('/', (req, res) => {
  res.send('Hello World');
});

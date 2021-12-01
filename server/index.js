require('dotenv').config();

const express = require('express');
const reviews = require('./reviews');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/reviews', reviews);

app.get('/', (req, res) => {
  res.redirect('/reviews')
});

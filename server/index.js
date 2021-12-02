require('dotenv').config();

const express = require('express');
const reviews = require('./reviews');

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/reviews', reviews);
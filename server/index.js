const express = require('express');
const reviews = require('./reviews');

const app = express();
const PORT = 3000;

app.listen(PORT, (req, res) => {
  console.log(`http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/reviews', reviews);
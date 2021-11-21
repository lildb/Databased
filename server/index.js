const express = require('express');
const reviews = require('./reviews');

const app = express();
const PORT = 3000;


app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}
  http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/reviews', reviews);


app.get('/', (req, res) => {
  res.send('Hello World');
});

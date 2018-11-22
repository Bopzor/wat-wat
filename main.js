const express = require('express');
const app = express();

const movies = require('./api/movies');

const cors = require('cors');
app.use(cors());

app.use('/movies', movies);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).end(err.toString());
});

app.listen(4269, () => console.log('API listening on port 4269'));

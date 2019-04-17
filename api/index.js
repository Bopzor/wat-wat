const express = require('express');
const api = express.Router();

const bodyParser = require('body-parser');
const movies = require('./movies');

api.use(bodyParser.json());
api.use('/movies', movies);

api.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).end(err.toString());
});


module.exports = api;
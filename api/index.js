global.Promise = require('bluebird');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const movies = require('./movies');
const pkg = require('../package');

const PORT = process.env['PORT'] || 4269;

const api = express.Router();

const { sequelize } = require('../models');
const {
  movie: Movie,
  comment: Comment,
} = sequelize.models;

api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.use((req, res, next) => {
  req.sequelize = sequelize;
  next();
});

api.use('/movies', movies);
api.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).end(err.toString());
});

module.exports = api;

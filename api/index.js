global.Promise = require('bluebird');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const movies = require('./movies');
const pkg = require('../package');

const PORT = process.env['PORT'] || 4269;

const api = express.Router();
const sequelize = new Sequelize('sqlite:db.sqlite');

const Movie = sequelize.define('movie', {
  title: Sequelize.STRING,
  plot: Sequelize.STRING,
  released: Sequelize.STRING,
  runtime: Sequelize.INTEGER,
  director: Sequelize.STRING,
  writer: Sequelize.STRING,
  actors: Sequelize.STRING,
  poster: Sequelize.STRING,
  place: { type: Sequelize.INTEGER, allowNull: false, unique: true },
  seen: Sequelize.BOOLEAN,
});

const Comment = sequelize.define('comment', {
  comment: Sequelize.STRING,
  author: Sequelize.STRING,
});

Movie.hasMany(Comment);
Comment.belongsTo(Movie);

api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

Promise.all([
    Movie.sync(),
    Comment.sync(),
  ])
  .then(() => {
    api.use((req, res, next) => {
      req.sequelize = sequelize;
      req.models = { Movie, Comment };
      next();
    });

    api.use('/movies', movies);
    api.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).end(err.toString());
    });
  })
  .catch(err => console.error(err));

module.exports = api;

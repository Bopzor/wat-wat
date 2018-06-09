global.Promise = require('bluebird');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const movies = require('./movies');
const pkg = require('../package');

const PORT = process.env['PORT'] || 4269;

const api = express.Router();

const createMovie = require('../models/movie');
const createComment = require('../models/comment');

const sequelize = new Sequelize('sqlite:/home/vio/Projects/movies-list/db/db.sqlite');

const Movie = createMovie(sequelize, Sequelize.DataTypes);
const Comment = createComment(sequelize, Sequelize.DataTypes);

const models = {
  Movie,
  Comment,
};

Movie.associate(models);
Comment.associate(models);

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

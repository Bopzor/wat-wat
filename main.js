'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const { Sequelize, movie: Movie, sequelize} = require('./models');
const Op = Sequelize.Op;

const listMovies = (req, res, next) => {
  Movie.findAll({order: [sequelize.literal('place DESC')]})
    .then(movies => res.json(movies))
    .catch(next);
};

const getMovieById = (req, res, next, id) => {
  Movie.findById(id)
    .then(movie => {
      req.movie = movie;
      next();
    })
    .catch(next);
};

const getMovie = (req, res, next) => {
  res.json(req.movie);
};

const createMovie = (req, res, next) => {
  const body = {
    title: 'Unknown',
    plot: 'Unknown',
    released: 'Unknown',
    runtime: 'Unknown',
    director: 'Unknown',
    writer: 'Unknown',
    actors: 'Unknown',
    poster: 'Unknown',
    seen: false,
    imdbId: null,
  };

  Movie.max('place')
    .then(place => {
      body.place = place + 1;
      Movie.create(body)
        .then(movie => res.json(movie))
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  req.movie.destroy()
    .then(() => res.end())
    .catch(next);
};

const updateMovie = (req, res, next) => {
  req.movie.update({title: 'Toto'})
    .then(movie => res.json(movie))
    .catch(next);
};

app.param('movieId', getMovieById);

app.get('/', listMovies);
app.post('/', createMovie);

app.get('/movies/:movieId', getMovie);
app.put('/movies/:movieId', updateMovie);
app.delete('/movies/:movieId', deleteMovie);

app.listen(4269, () => console.log('API listening on port 4269'));

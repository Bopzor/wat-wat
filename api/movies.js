const express = require('express');

const router = express.Router();

const { Sequelize, movie: Movie, sequelize, comment: Comment } = require('../models');
const Op = Sequelize.Op;

const getMoviesList = (req, res, next) => {
  Movie.findAll({ order: [['place', 'DESC']], include: [{ model: Comment }] })
    .then(movies => res.json(movies))
    .catch(next);
};

const getMovieById = (req, res, next, id) => {
  Movie.findById(id, { include: [{ model: Comment }] })
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
    title: req.body.title || 'Unknown',
    plot: req.body.plot || 'Unknown',
    released: req.body.released || 'Unknown',
    runtime: req.body.runtime || 'Unknown',
    director: req.body.director || 'Unknown',
    writer: req.body.writer || 'Unknown',
    actors: req.body.actors || 'Unknown',
    poster: req.body.poster || 'Unknown',
    seen: false,
    imdbId: req.body.imdbId || null,
  };

  Movie.max('place', { paranoid: false })
    .then(place => {
      body.place = (place || 0) + 1;
      return Movie.create(body)
    })
    .then(movie => Movie.findById(movie.id, { include: [{ model: Comment }] }))
    .then(movie => res.json(movie))
    .catch(next);
};

const sortMovies = (req, res, next) => {
  const Movie = sequelize.models.movie;
  let order = req.body.order;
  const { prev, nxt } = order;

  if (!order)
    return res.status(400).end('missing field order');
  else if (prev === nxt)
    return Movie.findAll({
      order: [['place', 'DESC']],
      include: [{ all: true }],
    })
      .then(movies => res.json(movies))
      .catch(next);


  return sequelize.transaction(function (t) {
    return Promise.resolve()
      .then(() => Movie.update({ place: -nxt }, {
        where: {
          place: prev,
        },
        transaction: t,
      }))
      .then(() => Movie.update({ place: sequelize.literal(`-(place + ${prev < nxt ? -1 : 1})`) }, {
        where: {
          place: {
            [Op.between]: [Math.min(prev, nxt), Math.max(prev, nxt)],
          },
        },
        paranoid: false,
        transaction: t,
      }))
      .then(() => Movie.update({ place: sequelize.literal('-place') }, {
        where: {
          place: {
            [Op.lt]: 0,
          },
        },
        paranoid: false,
        transaction: t,
      }))
      .then(() => Movie.findAll({
        order: [['place', 'DESC']],
        include: [{ all: true }],
        transaction: t,
      }))
      .then(movies => res.json(movies))
      .catch(next);
  });
};

const deleteMovie = (req, res, next) => {
  req.movie.destroy()
    .then(() => res.status(204).end())
    .catch(next);
};

const updateMovie = (req, res, next) => {
  req.movie.update(req.body)
    .then(movie => res.json(movie))
    .catch(next);
};

const getCommentById = (req, res, next, id) => {
  req.movie.getComments({ where: { id: id } })
    .then(comments => {
      req.comment = comments[0];
      next();
    })
    .catch(next);
};

const createComment = (req, res, next) => {
  const body = {
    comment: req.body.comment || '',
    author: req.body.author || 'Anonymous',
  };

  return req.movie.createComment(body)
    .then(() => Movie.findById(req.params.movieId, { include: [{ model: Comment }] }))
    .then(movie => res.json(movie))
    .catch(next);
};

const updateComment = (req, res, next) => {
  req.comment.update(req.body)
    .then(comment => comment.getMovie({ include: [{ model: Comment }] }))
    .then(movie => res.json(movie))
    .catch(next);
};

const deleteComment = (req, res, next) => {
  req.comment.destroy()
    .then(() => res.end())
    .catch(next);
};

router.param('movieId', getMovieById);
router.param('commentId', getCommentById);

router.get('/', getMoviesList);
router.post('/', createMovie);

router.get('/:movieId', getMovie);
router.post('/sort', sortMovies)
router.put('/:movieId', updateMovie);
router.delete('/:movieId', deleteMovie);

router.post('/:movieId/comments', createComment);
router.put('/:movieId/comments/:commentId', updateComment);
router.delete('/:movieId/comments/:commentId', deleteComment);

module.exports = router;

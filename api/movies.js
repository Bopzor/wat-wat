const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const Op = Sequelize.Op;

const getMovie = (req, res, next, id) => {
  const Movie = req.models.Movie;

  Movie.findById(id, { include: [{ all: true }] })
    .then(movie => {
      if (!movie)
        res.status(404).end('Movie not found');
      else {
        req.movie = movie;
        next();
      }
    })
    .catch(next);
};

const list = (req, res, next) => {
  const Movie = req.models.Movie;

  Movie.findAll({
    order: ['place'],
    include: [{ all: true }],
  })
    .then(movies => res.json(movies))
    .catch(next);
};

const get = (req, res, next) => {
  res.json(req.movie);
};

const create = (req, res, next) => {
  const Movie = req.models.Movie;

  const body = {
    title: req.body.title || 'Unknown',
    plot: req.body.plot || 'Unknown',
    released: req.body.released || 'Unknown',
    runtime: req.body.runtime || 'Unknown',
    director: req.body.director || 'Unknown',
    writer: req.body.writer || 'Unknown',
    actors: req.body.actors || 'Unknown',
    poster: req.body.poster || 'Unknown',
    seen: req.body.seen || false,
    imdbId: req.body.imdbId || null,
  };

  Movie.max('place')
    .then(place => Movie.create({ ...body, place: (place || 0) + 1 }))
    .then(movie => Movie.findById(movie.id, { include: [{ all: true }] }))
    .then(movie => res.status(201).json(movie))
    .catch(next);
};

const update = (req, res, next) => {
  req.movie.update(req.body)
    .then(movie => res.json(movie))
    .catch(next);
};

const remove = (req, res, next) => {
  req.movie.destroy()
    .then(() => res.end())
    .catch(next);
};

const sort = (req, res, next) => {
  // order = { id: place }
  // ex: { 5: 1, 2: 2, 6: 3, 1: 4 }

  const Movie = req.models.Movie;
  let order = req.body.order;

  if (!order)
    return res.status(400).end('missing field order');

  const updateMovies = movies => req.sequelize.transaction(function(t) {
    const updateMovie = movie => movie.update({ place: -order[movie.id] }, { transaction: t });

    return Promise.resolve()
      .then(() => Promise.all(movies.map(updateMovie)))
      .then(() => Promise.all(movies.map(m => m.update({ place: -m.previous('place') }, { transaction: t }))));
  });

  return Movie.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(order),
        },
      },
    })
    .then(updateMovies)
    .then(() => Movie.findAll({
      order: ['place'],
      include: [{ all: true }],
    }))
    .then(movies => res.json(movies))
    .catch(next);
};

const comment = (req, res, next) => {
  const Movie = req.models.Movie;

  const body = {
    comment: req.body.comment || '',
    author: req.body.author || 'Anonymous',
  };

  req.movie.createComment(body)
    .then(() => Movie.findById(req.params.id, { include: [{ all: true }] }))
    .then(movie => res.json(movie))
    .catch(next);
};

const getComment = (req, res, next, commentId) => {
  req.movie.getComments({ where: { id: commentId } })
    .then(comments => {
      if (!comments.length)
        res.status(404).json('Comment not found');
      else {
        req.comment = comments[0];
        next();
      }
    })
    .catch(next);
};

const updateComment = (req, res, next) => {
  req.comment.update(req.body)
    .then(comment => comment.getMovie({ include: [{ all: true }] }))
    .then(movie => res.json(movie))
    .catch(next);
}

const removeComment = (req, res, next) => {
  req.comment.destroy()
    .then(() => res.status(204).end())
    .catch(next);
}

router.param('id', getMovie);
router.param('commentId', getComment);

router.get('/', list);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/sort', sort);

router.post('/:id/comments', comment);
router.put('/:id/comments/:commentId', updateComment);
router.delete('/:id/comments/:commentId', removeComment);

module.exports = router;

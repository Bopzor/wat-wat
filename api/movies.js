const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const Op = Sequelize.Op;

const getMovie = (req, res, next, id) => {
  const Movie = req.sequelize.models.movie;

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
  const Movie = req.sequelize.models.movie;

  Movie.findAll({
    order: [['place', 'DESC']],
    include: [{ all: true }],
  })
    .then(movies => res.json(movies))
    .catch(next);
};

const get = (req, res, next) => {
  res.json(req.movie);
};

const create = (req, res, next) => {
  const Movie = req.sequelize.models.movie;

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

  Movie.max('place', {paranoid: false})
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
  // order = { prev: int, nxt: int }
  // ex: { prev: 3, nxt: 1 }

  const Movie = req.sequelize.models.movie;
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


  return req.sequelize.transaction(function(t) {
    return Promise.resolve()
      .then(() => Movie.update({ place: -nxt }, {
        where: {
          place: prev,
        },
        transaction: t,
      }))
      .then(() => Movie.update({ place: req.sequelize.literal(`-(place + ${prev < nxt ? -1 : 1})`) }, {
        where: {
          place: {
            [Op.between]: [Math.min(prev, nxt), Math.max(prev, nxt)],
          },
        },
        paranoid: false,
        transaction: t,
      }))
      .then(() => Movie.update({ place: req.sequelize.literal('-place') }, {
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

const comment = (req, res, next) => {
  const Movie = req.sequelize.models.movie;

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

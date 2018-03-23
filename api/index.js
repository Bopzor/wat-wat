global.Promise = require('bluebird');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const movies = require('./movies');
const pkg = require('../package');

const PORT = process.env['PORT'] || 4269;

const api = express.Router();
const moviesRouter = express.Router();

const db = new sqlite3.Database('./db.sqlite', err => {
  if (err)
    throw err;

  Promise.promisifyAll(db);

  const provideDb = (req, res, next) => {
    req.db = db;
    next();
  };

  const createMoviesQuery = [
    'CREATE TABLE IF NOT EXISTS movies (',
      'id INTEGER PRIMARY KEY AUTOINCREMENT,',
      'title TEXT,',
      'plot TEXT,',
      'released DATE,',
      'runtime INTEGER,',
      'director TEXT,',
      'writer TEXT,',
      'actors TEXT,',
      'poster TEXT,',
      'place INTEGER NOT NULL',
    ')',
  ].join(' ');

  const createCommentsQuery = [
    'CREATE TABLE IF NOT EXISTS comments (',
      'id INTEGER PRIMARY KEY AUTOINCREMENT,',
      'comment TEXT,',
      'movieid INTEGER',
      'created DATETIME DEFAULTS CURRENT_TIMESTAMP,',
      'FOREIGN KEY(movieid) REFERENCES movies(id)',
    ')',
  ].join(' ');

  Promise.all([
      db.runAsync(createMoviesQuery),
      db.runAsync(createCommentsQuery),
    ])
    .then(() => {
      api.use(provideDb);
      api.use(moviesRouter);
    });
});

moviesRouter.get('/movies', movies.list);
moviesRouter.get('/movie/:id', movies.get);
moviesRouter.post('/movie', movies.create);
moviesRouter.put('/movie/:id', movies.update);
moviesRouter.delete('/movie/:id', movies.remove);
moviesRouter.post('/movies/sort', movies.sort);
moviesRouter.post('/movie/:id/comment', movies.comment);

api.use(cors());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.get('/version', (req, res) => res.end(pkg.version));

module.exports = api;

global.Promise = require('bluebird');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const movies = require('./movies');

const PORT = process.env['PORT'] || 4269;

const app = express();
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

  const query = [
    'CREATE TABLE IF NOT EXISTS movies (',
      'id INTEGER PRIMARY KEY AUTOINCREMENT,',
      'title TEXT,',
      'plot TEXT,',
      'released DATE,',
      'runtime INTEGER,',
      'director TEXT,',
      'writer TEXT,',
      'actors TEXT,',
      'poster TEXT',
    ')'
  ].join(' ');

  db.runAsync(query)
    .then(() => {
      app.use(provideDb);
      app.use(api);
    });
});

moviesRouter.get('/movies', movies.list);
moviesRouter.get('/movie/:id', movies.get);
moviesRouter.post('/movie', movies.create);
moviesRouter.put('/movie/:id', movies.update);
moviesRouter.delete('/movie/:id', movies.remove);
moviesRouter.post('/movie/sort', movies.sort);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
api.use('/api', moviesRouter);

console.log('Starting server on port ' + PORT);
app.listen(PORT);

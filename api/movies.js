const list = (req, res, next) => {
  req.db.allAsync('SELECT * FROM movies')
    .then(rows => res.json(rows))
    .catch(err => res.status(500).send(err.toString));
};

const get = (req, res, next) => {
  req.db.getAsync('SELECT * FROM movies WHERE id = ?', req.params.id)
    .then(row => res.status(row ? 200 : 404).json(row))
    .catch(err => res.status(500).send(err.toString));
};

const create = (req, res, next) => {
  req.db.run('INSERT INTO movies VALUES (NULL, ?)', req.body.title, function(err) {
    if (err)
      return res.status(500).send(err.toString());

    req.db.getAsync('SELECT * FROM movies WHERE id = ?', this.lastID)
      .then(row => res.json(row))
      .catch(err => res.status(500).send(err.toString));
  });
};

const update = (req, res, next) => {
  req.db.run('UPDATE movies SET title = ? WHERE id = ?', req.body.title, req.params.id, function(err) {
    if (err)
      return res.status(500).send(err.toString());

    req.db.getAsync('SELECT * FROM movies WHERE id = ?', req.params.id)
      .then(row => res.json(row))
      .catch(err => res.status(500).send(err.toString));
    });
};

const remove = (req, res, next) => {
  req.db.runAsync('DELETE FROM movies WHERE id = ?', req.params.id)
    .then(() => res.end())
    .catch(err => res.status(500).send(err.toString));
};

const sort = (req, res, next) => {
  res.end('Not implemented');
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  sort,
};
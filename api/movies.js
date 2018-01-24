const fields = [
  'title',
  'plot',
  'released',
  'runtime',
  'director',
  'writer',
  'actors',
  'poster',
];

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
  const query = 'INSERT INTO movies VALUES (NULL, ' + fields.map(field => '$' + field).join(', ') + ')';
  const params = {};

  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i];

    if (!req.body[field])
      return res.status(400).send('missing field "' + field + '"');

    params['$' + field] = req.body[field];
  }

  req.db.run(query, params, function(err) {
    if (err)
      return res.status(500).send(err.toString());

    req.db.getAsync('SELECT * FROM movies WHERE id = ?', this.lastID)
      .then(row => res.json(row))
      .catch(err => res.status(500).send(err.toString));
  });
};

const update = (req, res, next) => {
  const fieldsToUpdate = [];
  const params = {
    $id: req.params.id,
  };

  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i];

    if (!req.body[field])
      continue;

    fieldsToUpdate.push(field);
    params['$' + field] = req.body[field];
  }

  if (fieldsToUpdate.length === 0)
    return res.status(400).send('No values to update');

  const query = 'UPDATE movies SET ' + fieldsToUpdate.map(field => field + ' = $' + field).join(', ') + ' WHERE id = $id';

  req.db.run(query, params, function(err) {
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

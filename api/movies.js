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

const handleError = (res, err) => {
  console.error(err.toString(), err.stack);
  res.status(500).end(err.toString());
}

const list = (req, res, next) => {
  req.db.allAsync('SELECT * FROM movies ORDER BY place')
    .then(rows => res.json(rows))
    .catch(err => handleError(res, err));
};

const get = (req, res, next) => {
  req.db.getAsync('SELECT * FROM movies WHERE id = ?', req.params.id)
    .then(row => res.status(row ? 200 : 404).json(row))
    .catch(err => handleError(res, err));
};

const create = (req, res, next) => {
  req.db.getAsync('SELECT COUNT(*) FROM movies')
    .then(count => {
      const query = 'INSERT INTO movies VALUES (NULL, ' + fields.map(field => '$' + field).join(', ') + ', $place)';
      const params = { $place: count['COUNT(*)'] + 1 };

      for (let i = 0; i < fields.length; ++i) {
        const field = fields[i];

        if (!req.body[field])
          // return res.status(400).send('missing field "' + field + '"');
          req.body[field] = 'no ' + field;

        params['$' + field] = req.body[field];
      }

      req.db.run(query, params, function(err) {
        if (err)
          return handleError(res, err);

        req.db.getAsync('SELECT * FROM movies WHERE id = ?', this.lastID)
        .then(row => res.json(row))
        .catch(err => handleError(res, err));
      });
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
      return handleError(res, err);

    req.db.getAsync('SELECT * FROM movies WHERE id = ?', req.params.id)
      .then(row => res.json(row))
      .catch(err => handleError(res, err));
    });
};

const remove = (req, res, next) => {
  req.db.runAsync('DELETE FROM movies WHERE id = ?', req.params.id)
    .then(() => res.end())
    .catch(err => handleError(res, err));
};

const sort = (req, res, next) => {
  // order = { id: place }
  // ex: { 5: 1, 2: 2, 6: 3, 1: 4 }

  let order = req.body.order;

  if (!order)
    return res.status(400).end('missing field order');

  const query = 'UPDATE movies SET place = $place WHERE id = $id';
  const params = id => ({
    $id: id,
    $place: order[id],
  });

  Promise.all(Object.keys(order).map(id => req.db.runAsync(query, params(id))))
    .then(() => req.db.allAsync('SELECT * FROM movies ORDER BY place'))
    .then((rows) => res.json(rows))
    .catch(err => handleError(res, err));
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  sort,
};

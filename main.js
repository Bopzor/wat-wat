const path = require('path');
const express = require('express');
const api = require('./api');

const PORT = process.env['PORT'] || 4269;
const app = express();

app.use(express.static(path.resolve('web', 'build')));
app.use('/api', api);

console.log('Starting server on port ' + PORT);
app.listen(PORT);

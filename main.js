const express = require('express');
const app = express();

const api = require('./api/index');

const cors = require('cors');
app.use(cors());

app.use('/api', api);

app.listen(4269, () => console.log('API listening on port 4269'));

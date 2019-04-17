const express = require('express');
const app = express();

const api = require('./api/index');

const PORT = process.env.PORT || 4269;

const cors = require('cors');
app.use(cors());

app.use('/api', api);

app.listen(PORT, () => console.log('API listening on port', PORT));

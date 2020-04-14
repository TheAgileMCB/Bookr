'use strict';

// required middleware and modules
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bookHandler = require('./modules/books');

// set up apps and EJS
app.use(cors());

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (request, response) => {
  response.render('pages/index');
});

//renders book search form
app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new');
});

//renders response of bookHandler
app.post('/searches', bookHandler);

// establish server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
console.log(`heard on ${PORT}`));
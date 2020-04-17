'use strict';

// required middleware and modules
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bookModule = require('./modules/books');
const {detailHandler, getBooksFromApi, getBooksFromDb, favoriteBookHandler} = bookModule;
const client = require('./utility/database');

const PORT = process.env.PORT || 3000;

// set up apps and EJS
app.use(cors());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.get('/', getBooksFromDb);


//renders book search form
app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new');
});

//renders response of getBooksFromApi
app.post('/searches/show', getBooksFromApi);

// establish server
client.connect()
  .then(() => {
    console.log('PG is listening!');
  })
  .catch((err) => {
    console.error(err);
  });
app.get('/details/:id', detailHandler);
app.post('/books', favoriteBookHandler);


app.get('*', (request, response) => response.status(404).render('./pages/error-view', {error:'(404) Page not found'}));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));





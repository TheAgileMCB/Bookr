'use strict';

// required middleware and modules
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bookHandler = require('./modules/books');

const PORT = process.env.PORT || 3000;

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
client.connect()
  .then(() => {
    console.log('PG is listening!');
  })
  .catch(err => {
    next(err)
  });

app.get('/', getTasks);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));


function getTasks(request, response) {
  const SQL = 'SELECT * FROM Tasks;';

  client.query(SQL)
  .then(results => {
    const { rowcount, row } = results;
      console.log(rows);

      // response.send('rows')
      response.render('index', {
        tasks: rows
      });
  })
  .catch(err => {
    handleError(err, response) {
      let viewModel = {
        error: err,

      };
      response.render('pages/error-view', viewModel);
    }
  })
}